import { useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import { FileInterface } from 'shared';
import { HeaderFileMenu } from './header-file-menu';

interface FileItemProps {
	active?: boolean;
	item?: FileInterface;
}
export const FileItem = ({ active, item }: Readonly<FileItemProps>) => {
	const [menuOpen, setMenuOpen] = useState<{
		open: boolean;
		x: number;
		y: number;
	}>({
		open: false,
		x: 0,
		y: 0
	});
	return (
		<div
			id={'tab-' + item?.id}
			onContextMenu={e => {
				e.preventDefault();
				setMenuOpen({
					open: true,
					x: e.clientX,
					y: e.clientY
				});
			}}
			className={`electron-no-drag flex h-10 min-w-[150px] max-w-[220px] items-center border-r border-gray-200 px-1 ${active ? 'bg-white' : 'border-b bg-gray-100'}`}
		>
			<div className="line-clamp-1 flex-1 cursor-pointer select-none break-all ps-1 text-xs">
				{item?.name || 'Lỗi'}
			</div>
			<button
				data-close={item?.id}
				className="flex aspect-square size-5 items-center justify-center rounded-full hover:bg-black/5"
				onClick={e => {
					e.stopPropagation();
				}}
			>
				<IoIosClose onClick={e => e.stopPropagation()} data-close={item?.id} size={16} />
			</button>
			<HeaderFileMenu
				x={menuOpen.x}
				y={menuOpen.y}
				open={menuOpen.open}
				onClose={() => setMenuOpen({ open: false, x: 0, y: 0 })}
			/>
		</div>
	);
};
