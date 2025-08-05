import { IpcKey } from 'shared';
import { sendWebContents } from './web-contents';

export const initApp = async (mainWindow: Electron.BrowserWindow) => {
	mainWindow.on('resize', () =>
		sendWebContents(mainWindow, IpcKey.Window_Maximized, {
			maximized: mainWindow.isMaximized(),
			status: 'success'
		})
	);
};
