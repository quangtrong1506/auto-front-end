import mitt from 'mitt';
import { FileInterface, FolderInterface, IpcBodyInterface, IpcKey } from 'shared';

/** Danh sách sự kiện và kiểu dữ liệu truyền kèm */
type Events = {
	createFile: {
		folderId: string;
	};
	deleteFile: FileInterface;
	focusFile: FileInterface;
	pasteFile: FileInterface;
	renameFile: FileInterface;
	copyFile: FileInterface;
	openFile: FileInterface;

	createFolder: FolderInterface;
	deleteFolder: FolderInterface;
	focusFolder: FolderInterface;
	newFolder: null;
	renameFolder: FolderInterface;

	sendNewTask: IpcBodyInterface[IpcKey.RunFile];
};

const emitter = mitt<Events>();

export default emitter;
