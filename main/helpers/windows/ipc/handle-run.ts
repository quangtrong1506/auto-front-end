import { IpcBodyInterface, IPCResponseInterface } from 'shared';
import { log } from '../../dev-log';
import { createDriver } from '../../selenium';

export function RunFile(_mainWindow: Electron.BrowserWindow) {
	return async (
		_event: Electron.IpcMainInvokeEvent,
		data: IpcBodyInterface['Run_File']
	): Promise<IPCResponseInterface['Run_File']> => {
		try {
			log.info('Run file');
			log.info(data);
			const file = data.file;
			const start = file.commands[0];
			// khởi tạo driver
			const driver = await createDriver();
			if (!driver) return { status: 'error', message: 'Error [run-file]' };
			if (start.type === 'open-web') await driver.get(start.data.url);
			return {
				status: 'success',
				message: 'Success'
			};
		} catch (error: unknown) {
			log.info('Error [run-file]', error);
			return {
				status: 'error',
				message: 'Error [close-window]'
			};
		}
	};
}
