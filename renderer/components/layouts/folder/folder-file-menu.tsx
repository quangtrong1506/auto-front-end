import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useClickAway } from 'react-use';
import { FileInterface } from 'shared';
import Swal from 'sweetalert2';
import { deleteFile, setActiveFile, setCloneItem } from '../../../lib/features';
import emitter from '../../../utils/event-bus';

interface FolderFileMenuProps {
	file: FileInterface;
	folderId: string;
	x: number;
	y: number;
	onClose?: () => void;
}

export const FolderFileMenu = ({ x, y, file, folderId, onClose }: Readonly<FolderFileMenuProps>) => {
	const rootRef = useRef<HTMLDivElement>(null);
	const dispatch = useDispatch();

	useClickAway(rootRef, () => {
		onClose?.();
	});

	function handleRename() {
		onClose?.();
		emitter.emit('renameFile', file);
	}
	const handleCloneFile = (type: 'copy' | 'cut') => {
		onClose?.();
		dispatch(
			setCloneItem({
				fromFolderId: folderId,
				item: file,
				type
			})
		);
	};
	const handleDeleteFile = () => {
		onClose?.();
		Swal.fire({
			title: `Xác nhận xoá file ${file.name}?`,
			text: 'Không có thùng rác đâu xác nhận xoá nha!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			cancelButtonText: 'Huỷ',
			confirmButtonText: 'OK, Xoá luôn!'
		}).then(result => {
			if (result.isConfirmed) {
				dispatch(
					deleteFile({
						fileId: file.id,
						folderId
					})
				);
				Swal.fire('Thành công', 'Bạn đã xoá file thành công', 'success');
			}
		});
	};

	const handleOpenFile = () => {
		onClose?.();
		dispatch(setActiveFile({ file }));
	};

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
				<div className="cursor-pointer rounded-lg px-2 py-1 hover:bg-black/5" onClick={handleOpenFile}>
					Open
				</div>
				<div
					className="cursor-pointer rounded-lg px-2 py-1 hover:bg-black/5"
					onClick={() => {
						handleCloneFile('copy');
					}}
				>
					Copy
				</div>
				<div
					className="cursor-pointer rounded-lg px-2 py-1 hover:bg-black/5"
					onClick={() => {
						handleCloneFile('cut');
					}}
				>
					Cut
				</div>
				<div className="cursor-pointer rounded-lg px-2 py-1 hover:bg-black/5">Paste</div>
				<div className="cursor-pointer rounded-lg px-2 py-1 hover:bg-black/5" onClick={handleRename}>
					Rename
				</div>
				<div className="cursor-pointer rounded-lg px-2 py-1 hover:bg-black/5" onClick={handleDeleteFile}>
					Delete
				</div>
			</div>
		</div>
	);
};
