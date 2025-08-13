import { FileInterface } from './file';

export enum IpcKey {
	/** Đóng cửa sổ */
	Window_Close = 'Window_Close',
	/** Thu nhỏ cửa số xuống taskbar */
	Window_Minimized = 'Window_Minimized',
	/** Thu nhỏ hoặc maximize cửa sổ */
	Window_Maximized = 'Window_Maximized',

	RunFile = 'Run_File'
}
export type IpcKeyInterface = (typeof IpcKey)[keyof typeof IpcKey];

export type IPCResponseInterface = {
	[IpcKey.Window_Close]: {
		data: boolean;
		status: 'success' | 'error';
		message?: string;
	};
	[IpcKey.Window_Minimized]: {
		minimized: boolean;
		status: 'success' | 'error';
		message?: string;
	};
	[IpcKey.Window_Maximized]: {
		maximized: boolean;
		status: 'success' | 'error';
		message?: string;
	};
	[IpcKey.RunFile]: {
		status: 'success' | 'error';
		message?: string;
	};
};

export interface IpcBodyInterface {
	[IpcKey.Window_Close]: null;
	[IpcKey.Window_Minimized]: {
		minimized: boolean;
	};
	[IpcKey.Window_Maximized]: {
		maximized: boolean;
	};
	[IpcKey.RunFile]: {
		file: FileInterface;
	};
}
