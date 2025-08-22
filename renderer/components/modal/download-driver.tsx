import { IPCResponseInterface } from 'shared';

interface DownloadDriverProps {
	open: boolean;
	data?: IPCResponseInterface['Download_Driver']['data'];
}
const DownloadDriver = ({
	open,
	data = {
		downloaded_size: 0,
		total_size: 0,
		process: 0,
		driver: {
			browser: '',
			version: ''
		}
	}
}: Readonly<DownloadDriverProps>) => {
	const { downloaded_size, total_size, process } = data;
	const value = process || 0;
	const passed = value < 0 ? 0 : value > 100 ? 100 : value;
	return (
		<>
			{open && (
				<div className="fixed left-0 top-0 z-[99999] flex h-screen w-screen items-center justify-center bg-black/40">
					<div className="flex h-[160px] w-[500px] flex-col rounded-xl bg-white">
						<h1 className="mb-2 mt-6 text-center text-2xl font-semibold">Đang tải driver</h1>
						<div className="w-full px-4 text-center text-gray-500">
							Driver [{data?.driver?.browser} v{data?.driver?.version}] không có sẵn vui lòng chờ tải xuống
						</div>
						<div className="mx-4 mt-4 h-2 w-[calc(100%-32px)] overflow-hidden rounded bg-gray-200">
							<div className="h-2 bg-cyan-600" style={{ width: passed + '%' }}></div>
						</div>
						<div className="mt-1 flex w-full justify-between px-4">
							<div className="text-sm text-gray-600">
								{kbToMb(downloaded_size || 0)}/{kbToMb(total_size || 0)}
							</div>
							<div>{passed}%</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
function kbToMb(kb: number): string {
	if (kb < 1024) return `${kb}kb`;
	const mb = Math.floor(kb / 1024);
	return `${mb.toLocaleString('vi-VN')}mb`;
}
export default DownloadDriver;
