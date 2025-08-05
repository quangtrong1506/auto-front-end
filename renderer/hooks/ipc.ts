import { useEffect, useState } from 'react';
import { IpcBodyInterface, IpcKeyInterface, IPCResponseInterface } from 'shared';

/**
 * Hook lắng nghe dữ liệu IPC gửi từ main về renderer
 */
export function useIPCKey<K extends IpcKeyInterface>(key: K) {
	const [value, setValue] = useState<IPCResponseInterface[K]>();

	useEffect(() => {
		if (!window.ipc?.on) return;

		const unsubscribe = window.ipc.on('main', (data: Record<string, unknown>) => {
			if (!(key in data)) return;

			const newValue = data[key] as IPCResponseInterface[K];
			setValue(prev => (JSON.stringify(prev) === JSON.stringify(newValue) ? prev : newValue));
		});

		return () => {
			if (typeof unsubscribe === 'function') unsubscribe();
		};
	}, [key]);

	return value;
}

/**
 * Gửi IPC một chiều từ renderer sang main
 */
export function sendIPC<K extends IpcKeyInterface>(key: K, value: IpcBodyInterface[K]) {
	if (!window.ipc?.send) return;
	window.ipc.send(key, value);
}

/**
 * Gửi IPC invoke từ renderer sang main và nhận dữ liệu trả về
 */
export function sendIpcInvoke<K extends IpcKeyInterface>(
	key: K,
	value: IpcBodyInterface[K]
): Promise<IPCResponseInterface[K]> {
	if (!window.ipc?.invoke) throw new Error('IPC invoke not available');
	return window.ipc.invoke(key, value);
}
