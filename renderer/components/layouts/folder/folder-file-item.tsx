'use client';

import { useEffect, useRef, useState } from 'react';
import { CiFileOn } from 'react-icons/ci';
import { useDispatch, useSelector } from 'react-redux';
import { useClickAway } from 'react-use';
import { FileInterface } from 'shared';
import { clsx } from '../../../helpers/clsx';
import { renameFile, setActiveFile, setCloneItem } from '../../../lib/features';
import { RootState } from '../../../lib/store';
import emitter from '../../../utils/event-bus';
import { FolderFileMenu } from './folder-file-menu';

export interface FolderFileItemProps {
	data: FileInterface;
	folderId: string;
	level?: number;
}
export const FolderFileItem = ({ data, folderId, level = 1 }: Readonly<FolderFileItemProps>) => {
	const dispatch = useDispatch();
	const newFileId = useSelector((state: RootState) => state.files.newFileId);
	const fileClone = useSelector((state: RootState) => state.files.cloneFile);
	const [isRename, setIsRename] = useState<boolean>(false);
	const [fileName, setFileName] = useState<string>(data.name);
	const [isFocus, setIsFocus] = useState<boolean>(false);
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
		const onRenameFolder = (file: FileInterface) => {
			if (file.id !== data.id) return;
			setIsRename(true);
		};

		emitter.on('renameFile', onRenameFolder);

		return () => {
			emitter.off('renameFile', onRenameFolder);
		};
	}, []);

	useEffect(() => {
		if (isRename) {
			if (!inputNameRef.current) return;
			inputNameRef.current?.select();
			inputNameRef.current?.focus();
			emitter.emit('focusFile', data);
		}
	}, [isRename]);

	useEffect(() => {
		setIsRename(newFileId === data.id);
	}, [newFileId]);

	function handleSaveRename() {
		inputNameRef.current?.setSelectionRange(0, 0);

		if (!fileName) {
			setFileName(data.name);
		}

		dispatch(
			renameFile({
				id: data.id,
				name: fileName
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

	const handleFocusFile = () => {
		setIsFocus(true);
		emitter.emit('focusFile', data);
		dispatch(setActiveFile({ file: data }));
	};

	return (
		<div
			draggable
			ref={rootRef}
			className="relative w-full cursor-pointer"
			onClick={e => {
				e.stopPropagation();
				handleFocusFile();
			}}
			onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
				e.dataTransfer.effectAllowed = 'move';
				dispatch(
					setCloneItem({
						fromFolderId: folderId,
						item: data,
						type: 'move'
					})
				);
			}}
		>
			<div
				className={clsx(
					'flex h-8 w-full cursor-pointer items-center gap-1 border pl-5 pr-3 hover:bg-black/5',
					isFocus && !isRename ? 'border-cyan-500' : 'border-transparent',
					fileClone?.item?.id === data.id && fileClone.type === 'cut' ? 'opacity-60' : '',
					level > 0 ? 'pl-5' : 'pl-3'
				)}
				onClick={() => {
					if (isRename) return;
				}}
				onContextMenu={e => {
					e.preventDefault();
					handleFocusFile();
					setMenuOpen({
						open: true,
						x: e.clientX,
						y: e.clientY
					});
				}}
			>
				<div className="flex w-[18px] justify-start">
					<CiFileOn size={16} />
				</div>
				<input
					className={clsx(
						'line-clamp-1 w-full select-none break-all rounded border border-transparent bg-transparent p-1 text-sm focus-within:outline-none',
						!fileName ? 'border border-red-500' : '',
						isRename
							? 'cursor-text border !border-gray-400'
							: 'cursor-pointer select-none focus-within:border-transparent'
					)}
					readOnly={!isRename}
					spellCheck={false}
					ref={inputNameRef}
					onChange={e => setFileName(e.target.value)}
					onKeyDown={e => {
						if (e.key === 'Enter') {
							e.preventDefault();
							handleSaveRename();
							return;
						}
					}}
					value={fileName}
				></input>
			</div>

			{menuOpen.open && (
				<FolderFileMenu
					folderId={folderId}
					file={data}
					x={menuOpen.x}
					y={menuOpen.y}
					onClose={() => setMenuOpen({ open: false, x: 0, y: 0 })}
				/>
			)}
		</div>
	);
};
