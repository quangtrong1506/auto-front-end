import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommandInterface, FileInterface, FolderInterface } from 'shared';
import { randomID } from '../../helpers';

interface FilesStateInterface {
	loading: boolean;
	folders: FolderInterface[];
	activeTabs: {
		index: number;
		file: FileInterface;
		active: boolean;
	}[];
	cloneFile?: {
		type: 'copy' | 'cut' | 'move';
		fromFolderId: string;
		item: FileInterface;
	};
	newFileId?: string;
	newFolderId?: string;
}

const initialState: FilesStateInterface = {
	folders: [
		{
			files: [],
			id: 'root',
			name: 'Default',
			created_at: '-',
			updated_at: '-'
		}
	],
	loading: true,
	activeTabs: []
};

const filesSlice = createSlice({
	name: 'files',
	initialState,
	reducers: {
		setInitFolders: (state: FilesStateInterface, action: PayloadAction<FilesStateInterface[]>) => {
			return {
				...state,
				...action.payload,
				loading: false,
				cloneFile: undefined,
				newFileId: undefined,
				newFolderId: undefined
			};
		},
		createFolder: (state: FilesStateInterface) => {
			const newFolder: FolderInterface = {
				id: randomID(),
				name: 'New folder',
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				files: []
			};
			const newFolders = [...state.folders, newFolder];
			newFolders.sort((a, b) => a.name.localeCompare(b.name));

			return {
				...state,
				folders: newFolders,
				newFolderId: newFolder.id
			};
		},
		setNewFolderId: (state: FilesStateInterface, action: PayloadAction<string>) => {
			return {
				...state,
				newFolderId: action.payload
			};
		},
		renameFolder: (state: FilesStateInterface, action: PayloadAction<{ id: string; name: string }>) => {
			const folder = state.folders.find(folder => folder.id === action.payload.id);
			if (!folder) return state;
			folder.name = action.payload.name;
			return state;
		},
		deleteFolder: (state: FilesStateInterface, action: PayloadAction<{ folderId: string }>) => {
			const { folderId } = action.payload;
			const cloneFolder = state.folders.find(folder => folder.id === folderId);
			if (!cloneFolder) return state;

			// Xoá các tab thuộc folder này
			state.activeTabs = state.activeTabs.filter(tab => !cloneFolder.files.some(file => file.id === tab.file.id));

			// Nếu không còn tab nào active thì set tab đầu tiên active
			if (!state.activeTabs.some(tab => tab.active) && state.activeTabs.length > 0) {
				state.activeTabs[0] = { ...state.activeTabs[0], active: true };
			}

			// Xoá folder
			state.folders = state.folders.filter(folder => folder.id !== folderId);

			return state;
		},
		pasteFile: (state: FilesStateInterface, action: PayloadAction<{ toFolderId: string }>) => {
			console.log(state.cloneFile, action.payload);
			if (!state.cloneFile) return;
			const { toFolderId } = action.payload;
			const { fromFolderId, item: filePaste, type } = state.cloneFile;

			if (fromFolderId === toFolderId && type === 'cut') {
				state.cloneFile = undefined;
				return state;
			}

			const folderFrom = state.folders.find(f => f.id === fromFolderId);
			const folderTo = state.folders.find(f => f.id === toFolderId);

			if (!folderFrom || !folderTo || !filePaste) {
				console.error('Lỗi dán file');
				return;
			}

			// Tìm tất cả file cùng tên hoặc bản sao của file đó trong folder đích
			const baseName = filePaste.name;
			const existingFiles = folderTo.files.filter(f => f.name.startsWith(baseName));

			let fileName = baseName;
			if (existingFiles.length === 1) {
				fileName = `${baseName} (copy)`;
			} else if (existingFiles.length > 1) {
				const nextIndex = existingFiles.length - 1;
				fileName = `${baseName} (copy) (${nextIndex})`;
			}

			const fileClone: FileInterface = {
				...filePaste,
				id: type === 'cut' || type === 'move' ? filePaste.id : randomID(),
				name: fileName
			};

			// Dán file
			folderTo.files.push(fileClone);

			// Nếu là cut thì xoá file khỏi folder gốc
			if (type === 'cut' || type === 'move') {
				folderFrom.files = folderFrom.files.filter(file => file.id !== filePaste.id);
				state.cloneFile = undefined;
			}

			// Sắp xếp lại file trong folder
			folderTo.files.sort((a, b) => a.name.localeCompare(b.name));
			folderFrom.files.sort((a, b) => a.name.localeCompare(b.name));
			state.folders.sort((a, b) => a.name.localeCompare(b.name));
		},
		/** [Action] Tạo file */
		createNewFile: (state: FilesStateInterface, action: PayloadAction<{ toFolderId: string }>) => {
			const { toFolderId } = action.payload;

			const folder = state.folders.find(folder => folder.id === toFolderId);
			if (!folder && toFolderId !== 'root') {
				console.error('Lỗi tạo file');
				return;
			}

			const baseName = 'New File';

			// Lấy danh sách các file có tên gốc hoặc copy
			const existingFiles = folder?.files.filter(f => f.name.startsWith(baseName)) || [];
			let fileName = baseName;
			if (existingFiles.length === 1) {
				fileName = `${baseName} (copy)`;
			} else if (existingFiles.length > 1) {
				const nextIndex = existingFiles.length - 1; // hoặc length cũng được
				fileName = `${baseName} (copy) (${nextIndex})`;
			}

			const newFile: FileInterface = {
				id: randomID(),
				name: fileName,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				commands: [],
				saved: true
			};
			state.newFileId = newFile.id;
			folder?.files.push(newFile);
			folder?.files.sort((a, b) => a.name.localeCompare(b.name));
			state.folders.sort((a, b) => a.name.localeCompare(b.name));
			state.activeTabs = [
				...state.activeTabs.map(tab => ({ ...tab, active: false })),
				{ index: state.activeTabs.length, file: newFile, active: true }
			];
		},
		renameFile: (state: FilesStateInterface, action: PayloadAction<{ id: string; name: string }>) => {
			const { id, name } = action.payload;

			const folder = state.folders.find(folder => folder.files.some(file => file.id === id));
			const file = folder?.files.find(file => file.id === id);
			if (!file) return;
			// active
			const active = state.activeTabs.find(tab => tab.file.id === id);
			if (active) {
				active.file.name = name;
			}

			if (file) file.name = name;
		},
		deleteFile: (state: FilesStateInterface, action: PayloadAction<{ fileId: string; folderId: string }>) => {
			const { fileId, folderId } = action.payload;

			const folder = state.folders.find(folder => folder.id === folderId);
			if (!folder) return;
			folder.files = folder.files.filter(file => file.id !== fileId);

			// clone
			if (state.cloneFile?.item.id === fileId) state.cloneFile = undefined;
			// active
			const active = state.activeTabs.find(tab => tab.file.id === fileId);
			if (active) {
				state.activeTabs = state.activeTabs
					.filter(tab => tab.file.id !== fileId)
					.map((tab, index) => ({
						...tab,
						active: index === 0
					}));
			}
		},
		setCloneItem: (state: FilesStateInterface, action: PayloadAction<FilesStateInterface['cloneFile']>) => {
			state.cloneFile = action.payload;
			return state;
		},

		setActiveItems: (state: FilesStateInterface, action: PayloadAction<FilesStateInterface['activeTabs']>) => {
			state.activeTabs = action.payload;
		},

		setActiveFile: (state: FilesStateInterface, action: PayloadAction<{ file: FileInterface }>) => {
			const { file } = action.payload;
			if (state.activeTabs.find(tab => tab.file.id === file.id)) {
				state.activeTabs = state.activeTabs.map(tab => ({
					...tab,
					active: tab.file.id === file.id
				}));
				return;
			}

			state.activeTabs = [...state.activeTabs, { index: state.activeTabs.length, file, active: true }].map(tab => ({
				...tab,
				active: tab.file.id === file.id
			}));
		},

		closeActiveFile: (state: FilesStateInterface, action: PayloadAction<{ file: FileInterface }>) => {
			const { file } = action.payload;

			// Tìm index của tab cần đóng
			const closingIndex = state.activeTabs.findIndex(tab => tab.file.id === file.id);

			// Nếu không tìm thấy thì thoát
			if (closingIndex === -1) return;

			// Xóa tab
			const remainingTabs = state.activeTabs.filter((_, i) => i !== closingIndex);

			// Nếu không còn tab nào → gán luôn
			if (remainingTabs.length === 0) {
				state.activeTabs = [];
				return;
			}

			// Nếu còn 1 tab → tab đó active
			if (remainingTabs.length === 1) {
				state.activeTabs = [{ ...remainingTabs[0], active: true }];
				return;
			}

			// Xác định tab sẽ active mới
			let newActiveIndex = closingIndex - 1;
			if (closingIndex === 0) {
				newActiveIndex = 0; // Nếu đóng tab đầu thì chọn tab mới đầu tiên
			}

			state.activeTabs = remainingTabs.map((tab, index) => ({
				...tab,
				active: index === newActiveIndex
			}));
		},

		saveCommands: (
			state: FilesStateInterface,
			action: PayloadAction<{ id: string; commands: CommandInterface[] }>
		) => {
			const { id, commands } = action.payload;
			const folder = state.folders.find(folder => folder.files.some(file => file.id === id));
			const file = folder?.files.find(file => file.id === id);
			const active = state.activeTabs.find(tab => tab.file.id === id);
			if (!file) return;
			if (active) active.file.commands = commands;
			file.commands = commands;
		}
	}
});

export const {
	closeActiveFile,
	createFolder,
	createNewFile,
	deleteFile,
	deleteFolder,
	pasteFile,
	renameFile,
	renameFolder,
	saveCommands,
	setActiveFile,
	setActiveItems,
	setCloneItem,
	setInitFolders,
	setNewFolderId
} = filesSlice.actions;
export default filesSlice.reducer;
