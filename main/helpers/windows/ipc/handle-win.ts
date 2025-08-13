import { IpcBodyInterface, IPCResponseInterface } from 'shared';
import { log } from '../../dev-log';

export function closeWindow(mainWindow: Electron.BrowserWindow) {
	return async (
		_event: Electron.IpcMainInvokeEvent,
		_data: IpcBodyInterface['Window_Close']
	): Promise<IPCResponseInterface['Window_Close']> => {
		try {
			log.info('Close window');
			mainWindow.close();
			return {
				data: true,
				status: 'success'
			};
		} catch (error: unknown) {
			log.info('Error [close-window]', error);
			return {
				data: false,
				status: 'error',
				message: 'Error [close-window]'
			};
		}
	};
}
export function minimizedWindow(mainWindow: Electron.BrowserWindow) {
	return async (
		_event: Electron.IpcMainInvokeEvent,
		_data: IpcBodyInterface['Window_Minimized']
	): Promise<IPCResponseInterface['Window_Minimized']> => {
		try {
			log.info('Minimized window');
			mainWindow.minimize();
			return {
				minimized: true,
				status: 'success'
			};
		} catch (error: unknown) {
			log.info('Error [minimized-window]', error);
			return {
				minimized: false,
				status: 'error',
				message: 'Error [minimized-window]'
			};
		}
	};
}

export function restoreWindow(mainWindow: Electron.BrowserWindow) {
	return async (
		_event: Electron.IpcMainInvokeEvent,
		data: IpcBodyInterface['Window_Maximized']
	): Promise<IPCResponseInterface['Window_Maximized']> => {
		try {
			log.info('Restore window');
			if (data.maximized) mainWindow.maximize();
			else mainWindow.restore();

			return {
				maximized: true,
				status: 'success'
			};
		} catch (error: unknown) {
			log.info('Error [restore-window]', error);
			return {
				maximized: false,
				status: 'error',
				message: 'Error [restore-window]'
			};
		}
	};
}
