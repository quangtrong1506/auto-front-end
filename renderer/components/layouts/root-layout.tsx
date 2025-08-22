import { ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IpcKey } from 'shared';
import Swal from 'sweetalert2';
import { useIPCKey } from '../../hooks';
import { setInitFolders } from '../../lib/features';
import DownloadDriver from '../modal/download-driver';
import { Footer } from './footer';
import { LayoutHeader } from './header';
import { Nav } from './nav';

export const RootLayout = ({ children }: { children: ReactNode }) => {
	const ditpatch = useDispatch();
	const [open, setOpen] = useState<boolean>(false);
	const process = useIPCKey<IpcKey.Download_Driver>(IpcKey.Download_Driver);
	useEffect(() => {
		const foldersLocal = localStorage.getItem('folders');
		if (foldersLocal) {
			ditpatch(setInitFolders(JSON.parse(foldersLocal)));
		}
	}, []);

	useEffect(() => {
		if (process) {
			if (process.status === 'success') {
				setOpen(false);
				Swal.fire({
					title: 'Thành công',
					text: 'Tải driver thành công, đang khởi chạy',
					icon: 'success',
					showConfirmButton: true,
					confirmButtonText: 'OK',
					timer: 3000
				});
				return;
			}
			if (process.status === 'error') {
				setOpen(false);
				Swal.fire({
					title: 'Lỗi',
					text: process.message,
					icon: 'error',
					showConfirmButton: true,
					confirmButtonText: 'OK'
				});
				return;
			}
			setOpen(true);
		}
	}, [process]);

	return (
		<div className="flex h-dvh w-full overflow-hidden">
			<Nav />
			<div className="grid flex-1 grid-rows-[auto_1fr_auto]">
				<LayoutHeader />
				<div className="w-full overflow-y-auto">{children}</div>
				<Footer />
			</div>
			{open && <DownloadDriver data={process?.data} open={open} />}
		</div>
	);
};
