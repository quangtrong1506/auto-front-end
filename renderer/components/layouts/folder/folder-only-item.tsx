'use client';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileInterface, FolderInterface } from 'shared';
import Swal from 'sweetalert2';
import { setCloneItem } from '../../../lib/features';
import { pasteFile } from '../../../lib/features/file';
import { RootState } from '../../../lib/store';
import emitter from '../../../utils/event-bus';
import { FolderFileItem } from './folder-file-item';
import { FolderMenu } from './folder-menu';

const initData: FolderInterface = {
	id: 'root',
	name: 'Default',
	files: [],
	created_at: '-',
	updated_at: '-'
};

export const FolderOnlyItem = () => {
	const folders = useSelector((state: RootState) => state.files.folders);
	const fileClone = useSelector((state: RootState) => state.files.cloneFile);
	const dispatch = useDispatch();
	const [menuOpen, setMenuOpen] = useState<{
		open: boolean;
		x: number;
		y: number;
	}>({
		open: false,
		x: 0,
		y: 0
	});

	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onNewFile = ({ folderId }: { folderId: string }) => {
			if (folderId !== initData.id) return;
		};

		const onCopyFile = (file: FileInterface) => {
			dispatch(
				setCloneItem({
					fromFolderId: initData.id,
					item: file,
					type: 'copy'
				})
			);
		};

		emitter.on('createFile', onNewFile);
		emitter.on('copyFile', onCopyFile);

		return () => {
			emitter.off('createFile', onNewFile);
			emitter.off('copyFile', onCopyFile);
		};
	}, []);

	const handlePasteFile = () => {
		if (!fileClone) return;
		if (initData.id === fileClone?.fromFolderId) {
			console.log('1122', fileClone?.fromFolderId, initData.id);

			dispatch(setCloneItem(undefined));
			return;
		}
		Swal.fire({
			title: `Xác nhận chuyển file?`,
			text: `Di chuyển file '${fileClone?.item.name}' sang folder ${initData.name}`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			cancelButtonText: 'Huỷ',
			confirmButtonText: 'OK, Chuyển!'
		}).then(result => {
			if (result.isConfirmed) {
				dispatch(
					pasteFile({
						toFolderId: initData.id
					})
				);
			} else {
				dispatch(setCloneItem(undefined));
			}
		});
	};
	const folderDefault = folders.find(f => f.id === initData.id);
	return (
		<div
			onDragOver={e => {
				e.preventDefault();
				e.dataTransfer.dropEffect = 'move';
			}}
			onDrop={e => {
				e.preventDefault();
				handlePasteFile();
			}}
			ref={rootRef}
			className="relative w-full"
		>
			<div className="overflow-hidden transition-all duration-75 ease-in-out">
				{folderDefault?.files.map(f => (
					<FolderFileItem data={f} key={f.id} folderId={initData.id} level={0} />
				))}
			</div>
			{menuOpen.open && (
				<FolderMenu
					folder={initData}
					x={menuOpen.x}
					y={menuOpen.y}
					onClose={() => setMenuOpen({ open: false, x: 0, y: 0 })}
				/>
			)}
		</div>
	);
};
