export const IpcKey = {
	open: 'OPEN'
};

export interface IPCResponseInterface {
	open: null;
}

export interface IpcBodyInterface {
	open: null;
}

export type IpcKeyInterface = (typeof IpcKey)[keyof typeof IpcKey];
