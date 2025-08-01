import { ipcMain } from 'electron';
import { IpcKey } from '../../../types';
import { log } from '../../dev-log';
import { createDriver } from '../../selenium';

export function connectIpcMain(mainWindow: Electron.BrowserWindow) {
	log.info('Connecting IPC main handlers...');
	// Upload Video
	ipcMain.on(IpcKey.open, async () => {
		try {
			log.info('Open driver...');
			createDriver('chrome');
		} catch (error) {
			log.error(error);
		} finally {
		}
	});
}
