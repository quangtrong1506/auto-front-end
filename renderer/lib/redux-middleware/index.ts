import { Middleware } from '@reduxjs/toolkit';
import { FolderInterface } from 'shared';

function saveFolders(folders: FolderInterface[]) {
	localStorage.setItem('folders', JSON.stringify(folders));
}

let saveCommandsTimeout: ReturnType<typeof setTimeout>;

export const foldersMiddleware: Middleware = store => next => action => {
	const result = next(action);

	const type = (action as { type: string }).type;

	const actionsToSave = [
		'files/createFolder',
		'files/createNewFile',
		'files/deleteFile',
		'files/deleteFolder',
		'files/pasteFile',
		'files/renameFile',
		'files/renameFolder',
		'files/setActiveItems',
		'files/setActiveFile',
		'files/closeActiveFile'
	];

	const actionsToSaveCommands = ['files/saveCommands'];

	if (actionsToSave.includes(type)) {
		// Lưu ngay (real-time)
		const folders = store.getState().files;
		saveFolders(folders);
	}

	if (actionsToSaveCommands.includes(type)) {
		// Debounce cho saveCommands
		clearTimeout(saveCommandsTimeout);
		saveCommandsTimeout = setTimeout(() => {
			const folders = store.getState().files;
			saveFolders(folders);
		}, 300); // 300ms debounce
	}

	return result;
};
