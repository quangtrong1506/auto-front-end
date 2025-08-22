import { FileInterface } from './file';

export enum IpcKey {
	/** Đóng cửa sổ */
	Window_Close = 'Window_Close',
	/** Thu nhỏ cửa số xuống taskbar */
	Window_Minimized = 'Window_Minimized',
	/** Thu nhỏ hoặc maximize cửa sổ */
	Window_Maximized = 'Window_Maximized',
	/** Chạy file */
	RunFile = 'Run_File',
	/** Tải driver */
	Download_Driver = 'Download_Driver'
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
		job_id: string;
		status: 'success' | 'error' | 'running';
		message?: string;
		data?: {
			time: string;
			desscription?: string;
			command: string;
			line: number;
		};
		fileName: string;
		url: string;
	};
	[IpcKey.Download_Driver]: {
		status: 'success' | 'error' | 'downloading';
		message?: string;
		data?: {
			process?: number;
			total_size?: number;
			downloaded_size?: number;
			driver?: {
				browser: string;
				version: string;
			};
		};
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
		job_id: string;
		file: FileInterface;
		browser: 'chrome' | 'firefox' | 'edge' | 'ie' | 'opera' | 'safari';
	};
	[IpcKey.Download_Driver]: null;
}
