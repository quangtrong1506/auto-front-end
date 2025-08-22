import { ipcMain } from 'electron';
import { IpcKey } from 'shared';
import { log } from '../helpers/dev-log';
import { ipcHandle } from './handle-ipc';

export function connectIpcMain(mainWindow: Electron.BrowserWindow) {
	log.info('Connecting IPC main handlers...');
	// Upload Video
	ipcMain.on(IpcKey.Window_Close, ipcHandle.closeWindow(mainWindow));
	ipcMain.on(IpcKey.Window_Minimized, ipcHandle.minimizedWindow(mainWindow));
	ipcMain.on(IpcKey.Window_Maximized, ipcHandle.restoreWindow(mainWindow));
	ipcMain.on(IpcKey.RunFile, ipcHandle.RunFile(mainWindow));

	// ipcMain.handle(IpcKey.open, ipcHandle.handleOpenWeb(mainWindow));
}
