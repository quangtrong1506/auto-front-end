'use client';

import { useEffect, useRef, useState } from 'react';
import { FaRegFolder, FaRegFolderOpen } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { useClickAway } from 'react-use';
import { FileInterface, FolderInterface } from 'shared';
import Swal from 'sweetalert2';
import { clsx } from '../../../helpers/clsx';
import { renameFolder, setCloneItem } from '../../../lib/features';
import { pasteFile } from '../../../lib/features/file';
import { RootState } from '../../../lib/store';
import emitter from '../../../utils/event-bus';
import { FolderFileItem } from './folder-file-item';
import { FolderMenu } from './folder-menu';

export interface FolderProps {
	data: FolderInterface;
}
export const FolderItem = ({ data }: Readonly<FolderProps>) => {
	const newFolderId = useSelector((state: RootState) => state.files.newFolderId);
	const fileClone = useSelector((state: RootState) => state.files.cloneFile);
	const dispatch = useDispatch();
	const [open, setOpen] = useState<boolean>(false);
	const [isRename, setIsRename] = useState<boolean>(false);
	const [folderName, setFolderName] = useState<string>(data.name);
	const [isFocus, setIsFocus] = useState<boolean>(false);
	const [fileFocus, setFileFocus] = useState<FileInterface>();
	const [menuOpen, setMenuOpen] = useState<{
		open: boolean;
		x: number;
		y: number;
	}>({
		open: false,
		x: 0,
		y: 0
	});

	const inputNameRef = useRef<HTMLInputElement>(null);
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onRenameFolder = (folder: FolderInterface) => {
			if (folder.id !== data.id) return;
			setIsRename(true);
		};

		const onNewFile = ({ folderId }: { folderId: string }) => {
			if (folderId !== data.id) return;
			setOpen(true);
		};

		const onCopyFile = (file: FileInterface) => {
			dispatch(
				setCloneItem({
					fromFolderId: data.id,
					item: file,
					type: 'copy'
				})
			);
		};

		const onFocusFile = (file: FileInterface) => {
			setFileFocus(file);
		};

		emitter.on('renameFolder', onRenameFolder);
		emitter.on('createFile', onNewFile);
		emitter.on('focusFile', onFocusFile);
		emitter.on('copyFile', onCopyFile);

		return () => {
			emitter.off('renameFolder', onRenameFolder);
			emitter.off('createFile', onNewFile);
			emitter.off('focusFile', onFocusFile);
			emitter.off('copyFile', onCopyFile);
		};
	}, []);

	useEffect(() => {
		if (isRename) {
			if (!inputNameRef.current) return;
			inputNameRef.current?.select();
			inputNameRef.current?.focus();
		}
	}, [isRename]);

	useEffect(() => {
		setIsRename(newFolderId === data.id);
	}, [newFolderId]);

	// useEffect(() => {
	// 	if (data.files.length === 0) setOpen(false);
	// 	else setOpen(true);
	// }, [data.files.length]);

	function handleSaveRename() {
		// inputNameRef.current?.setSelectionRange(0, 0);
		if (!folderName) setFolderName(data.name);
		dispatch(
			renameFolder({
				id: data.id,
				name: folderName
			})
		);
		setIsRename(false);
	}

	useClickAway(inputNameRef, () => {
		if (!isRename) return;
		handleSaveRename();
	});

	useClickAway(rootRef, () => {
		setIsFocus(false);
	});

	const handlePasteFile = () => {
		console.log('fileClone', fileClone?.fromFolderId, data.id);

		if (!fileClone) return;
		if (data.id === fileClone?.fromFolderId) {
			console.log('cùng folder');

			dispatch(setCloneItem(undefined));
			return;
		}
		Swal.fire({
			title: `Xác nhận chuyển file?`,
			text: `Di chuyển file '${fileClone?.item.name}' sang folder ${data.name}`,
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
						toFolderId: data.id
					})
				);
			} else {
				dispatch(setCloneItem(undefined));
			}
		});
	};

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
			onClick={() => setIsFocus(true)}
		>
			<div
				className={clsx(
					'flex h-8 w-full cursor-pointer items-center gap-1 border px-3 hover:bg-black/5',
					isFocus && !isRename && data.files.filter(f => f.id === fileFocus?.id).length === 0
						? 'border-cyan-500'
						: 'border-transparent'
				)}
				onClick={() => {
					if (isRename) return;
					setOpen(prev => !prev);
					setFileFocus(undefined);
				}}
				onContextMenu={e => {
					e.preventDefault();
					if (isRename) return;
					setIsFocus(true);
					setMenuOpen({
						open: true,
						x: e.clientX,
						y: e.clientY
					});
				}}
			>
				<div className="flex w-[18px] justify-start">
					{open ? <FaRegFolderOpen size={16} /> : <FaRegFolder size={14} />}
				</div>
				<input
					className={clsx(
						'line-clamp-1 w-full break-all rounded border border-transparent bg-transparent p-1 text-sm focus-within:outline-none',
						!folderName ? 'border border-red-500' : '',
						isRename
							? 'cursor-text select-auto !border-gray-400'
							: 'cursor-pointer select-none focus-within:border-transparent'
					)}
					readOnly={!isRename}
					spellCheck={false}
					ref={inputNameRef}
					onChange={e => setFolderName(e.target.value)}
					onMouseDown={e => e.preventDefault()}
					onKeyDown={e => {
						if (e.key === 'Enter') {
							e.preventDefault();
							handleSaveRename();
							return;
						}
					}}
					value={folderName}
				></input>
			</div>
			<div
				className="overflow-hidden transition-all duration-75 ease-in-out"
				style={{
					height: open ? data.files.length * 32 : 0
				}}
			>
				{data.files.map(f => (
					<FolderFileItem data={f} key={f.id} folderId={data.id} />
				))}
			</div>
			{menuOpen.open && (
				<FolderMenu
					folder={data}
					x={menuOpen.x}
					y={menuOpen.y}
					onClose={() => setMenuOpen({ open: false, x: 0, y: 0 })}
				/>
			)}
		</div>
	);
};
