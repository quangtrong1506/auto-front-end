import { useEffect, useState } from 'react';

const FileIndex = () => {
	const [open, setOpen] = useState<boolean>(false);

	useEffect(() => {
		setOpen(true);
	}, []);

	return (
		<>
			{open && (
				<div className="fixed left-0 top-0 z-[99999] flex h-screen w-screen items-center justify-center bg-black/40">
					<div className="flex h-[160px] w-[500px] flex-col rounded-xl bg-white">
						<h1 className="mb-2 mt-6 text-center text-2xl font-semibold">Đang tải driver</h1>
						<div className="w-full px-4 text-center text-gray-500">
							Driver mới không có sẵn vui lòng chờ tải xuống
						</div>
						<div className="mx-4 mt-4 h-2 w-[calc(100%-32px)] overflow-hidden rounded bg-gray-200">
							<div className="h-2 bg-cyan-600" style={{ width: '46%' }}></div>
						</div>
						<div className="mt-1 flex w-full justify-between px-4">
							<div className="text-sm text-gray-600">Đang tải</div>
							<div>46%</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default FileIndex;
