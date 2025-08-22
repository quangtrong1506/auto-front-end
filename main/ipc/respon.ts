export interface IpcResponseBaseInterface<T> {
	data: T | null;
	status: 'success' | 'error';
	message?: string;
}
