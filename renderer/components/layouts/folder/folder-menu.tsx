'use client';

import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useClickAway } from 'react-use';
import { FolderInterface } from 'shared';
import { createNewFile, deleteFolder, pasteFile } from '../../../lib/features';
import { RootState } from '../../../lib/store';
import emitter from '../../../utils/event-bus';

import Swal from 'sweetalert2';

interface FolderMenuProps {
	folder: FolderInterface;
	x: number;
	y: number;
	onClose?: () => void;
}

export const FolderMenu = ({ x, y, folder, onClose }: Readonly<FolderMenuProps>) => {
	const rootRef = useRef<HTMLDivElement>(null);
	const dispatch = useDispatch();
	const fileCopy = useSelector((state: RootState) => state.files.cloneFile);

	useClickAway(rootRef, () => {
		onClose?.();
	});

	const handleRename = () => {
		onClose?.();
		emitter.emit('renameFolder', folder);
	};
	const handleNewFile = () => {
		onClose?.();
		dispatch(
			createNewFile({
				toFolderId: folder.id
			})
		);
		emitter.emit('createFile', { folderId: folder.id });
	};

	const handlePaste = () => {
		onClose?.();
		if (!fileCopy) return;
		dispatch(
			pasteFile({
				toFolderId: folder.id
			})
		);
	};

	const handleDelete = () => {
		onClose?.();
		Swal.fire({
			title: 'Xác nhận?',
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
					deleteFolder({
						folderId: folder.id
					})
				);
				Swal.fire('Thành công', 'Bạn đã xoá cả folder thành công', 'success');
			}
		});
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
				<div className="cursor-pointer rounded-lg px-2 py-1 hover:bg-black/5" onClick={handleNewFile}>
					New File
				</div>
				<div
					className={`cursor-pointer rounded-lg px-2 py-1 hover:bg-black/5 ${!fileCopy ? 'opacity-50' : ''}`}
					onClick={handlePaste}
				>
					Paste
				</div>
				<div className="cursor-pointer rounded-lg px-2 py-1 hover:bg-black/5">Export</div>
				<div className="cursor-pointer rounded-lg px-2 py-1 hover:bg-black/5" onClick={handleRename}>
					Rename
				</div>
				<div className="cursor-pointer rounded-lg px-2 py-1 hover:bg-black/5" onClick={handleDelete}>
					Delete
				</div>
			</div>
		</div>
	);
};
