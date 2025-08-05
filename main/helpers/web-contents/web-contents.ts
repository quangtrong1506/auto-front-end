import { IpcKeyInterface, IPCResponseInterface } from 'shared';

/**
 * Gửi dữ liệu từ main process về renderer thông qua webContents
 */
function sendWebContents<K extends IpcKeyInterface>(
	mainWindow: Electron.BrowserWindow,
	key: K,
	data: IPCResponseInterface[K]
) {
	mainWindow.webContents.send('main', {
		[key]: data
	});
}

export { sendWebContents };
