import { IoIosClose } from 'react-icons/io';

interface FileItemProps {
	active?: boolean;
	item?: unknown;
	onClick?: () => void;
	onClose?: () => void;
}
export const FileItem = ({ active, item, onClick, onClose }: Readonly<FileItemProps>) => {
	return (
		<div
			className={`electron-no-drag flex h-10 min-w-28 max-w-48 items-center border-r border-gray-200 px-1 ${active ? 'bg-white' : 'bg-transparent'}`}
			onClick={onClick}
		>
			<div className="line-clamp-1 flex-1 cursor-pointer select-none break-all ps-1 text-xs">
				Đây là tên tài liệy siêu siêu dài
			</div>
			<button
				className="flex aspect-square size-5 items-center justify-center rounded-full hover:bg-black/5"
				onClick={e => {
					e.stopPropagation();
					onClose?.();
				}}
			>
				<IoIosClose size={16} />
			</button>
		</div>
	);
};
