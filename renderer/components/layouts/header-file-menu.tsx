import { useRef } from 'react';
import { useClickAway } from 'react-use';

interface HeaderFileMenuProps {
	x: number;
	y: number;
	open?: boolean;
	onClose?: () => void;
}

export const HeaderFileMenu = ({ x, y, open, onClose }: Readonly<HeaderFileMenuProps>) => {
	const rootRef = useRef<HTMLDivElement>(null);

	useClickAway(rootRef, () => {
		onClose?.();
	});
	if (!open) return null;
	return (
		<div
			ref={rootRef}
			style={{
				left: x,
				top: y
			}}
			onClick={e => e.stopPropagation()}
			className="fixed z-[9999] w-40 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-xl"
		>
			<div className="flex flex-col">
				<div className="cursor-pointer rounded-lg px-2 py-1 hover:bg-black/5">Chạy</div>
				<div className="cursor-pointer rounded-lg px-2 py-1 hover:bg-black/5">Đóng</div>
				<div className="cursor-pointer rounded-lg px-2 py-1 hover:bg-black/5">Đóng tất cả</div>
				<div className="cursor-pointer rounded-lg px-2 py-1 hover:bg-black/5">Đóng thẻ khác</div>
			</div>
		</div>
	);
};
