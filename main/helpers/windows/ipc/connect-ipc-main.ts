import { ipcMain } from 'electron';
import { IpcKey } from '../../../types';
import { log } from '../../dev-log';
import { ipcHandle } from './handle-ipc';

export function connectIpcMain(mainWindow: Electron.BrowserWindow) {
	log.info('Connecting IPC main handlers...');
	// Upload Video
	ipcMain.on(IpcKey.open, () => {
		ipcHandle.handleOpenWeb(mainWindow);
	});

	ipcMain.on(IpcKey.search, () => {
		ipcHandle.handleSearch(mainWindow);
	});

	ipcMain.handle(IpcKey.open, ipcHandle.handleOpenWeb(mainWindow));
	ipcMain.handle(IpcKey.login, ipcHandle.handleLogin(mainWindow));
	ipcMain.handle(IpcKey.search, ipcHandle.handleSearch(mainWindow));
	ipcMain.handle(IpcKey.findImage, ipcHandle.handleFindImage(mainWindow));
}
