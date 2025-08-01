export const IpcKey = {
	open: 'OPEN',
	login: 'LOGIN',
	search: 'SEARCH',
	findImage: 'FIND_IMAGE',
	findImageAuto: 'FIND_IMAGE_AUTO'
};

export interface IPCResponseInterface {
	open: {
		data: boolean;
		status: 'success' | 'error';
		message?: string;
	};
	login: {
		data: boolean;
		status: 'success' | 'error';
		message?: string;
	};
	search: {
		data: boolean;
		status: 'success' | 'error';
		message?: string;
	};
	findImage: {
		data: string[] | null;
		status: 'success' | 'error';
		message?: string;
	};
	findImageAuto: {
		data: string[] | null;
		status: 'success' | 'error';
		message?: string;
		page: number;
		pages: number;
	};
}

export interface IpcBodyInterface {
	open: null;
	data: null;
	login: {
		email: string;
		password: string;
	};
	search: {
		query: string;
	};
	findImage: {
		autoSroll: boolean;
	};
	findImageAuto: null;
}

export type IpcKeyInterface = (typeof IpcKey)[keyof typeof IpcKey];
