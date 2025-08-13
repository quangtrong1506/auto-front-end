'use client';

import { closestCenter, DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { restrictToHorizontalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IoIosClose } from 'react-icons/io';
import { VscChromeMaximize, VscChromeMinimize, VscChromeRestore } from 'react-icons/vsc';
import { useDispatch, useSelector } from 'react-redux';
import { FileInterface, IpcKey } from 'shared';
import { sendIPC, useIPCKey } from '../../hooks';
import { closeActiveFile, setActiveFile, setActiveItems } from '../../lib/features';
import { RootState } from '../../lib/store';
import { FileItem } from './header-file-item';

/** Tab có thể kéo */
function SortableFileItem({ item, active }: { item: FileInterface; active: boolean }) {
	const { setNodeRef, transform, transition, attributes, listeners } = useSortable({ id: item.id });

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	return (
		<div
			className={`relative ${active ? 'z-[990]' : ''}`}
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
		>
			<FileItem item={item} active={active} />
		</div>
	);
}

/** Header có tab file kéo thả */
export function LayoutHeader() {
	const dispatch = useDispatch();
	const files = useSelector((state: RootState) => state.files.activeTabs);
	const fileMove = useSelector((state: RootState) => state.files.cloneFile);
	const ipcFullscreen = useIPCKey(IpcKey.Window_Maximized);
	const handleDragEnd = (event: DragEndEvent) => {
		const target = event.activatorEvent.target as HTMLElement;

		if ((target.dataset && target.dataset.close) || target.closest('[data-close]')) {
			dispatch(
				closeActiveFile({
					file: files.find(f => f.file.id === event.active.id)!.file
				})
			);
			return;
		}
		const acive = files.find(f => f.file.id === event.active.id);
		if (acive)
			dispatch(
				setActiveFile({
					file: acive.file
				})
			);
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const oldIndex = files.findIndex(f => f.file.id === active.id);
		const newIndex = files.findIndex(f => f.file.id === over.id);
		dispatch(setActiveItems(arrayMove(files, oldIndex, newIndex)));
	};

	const handleMinimizeClick = () => sendIPC(IpcKey.Window_Minimized, { minimized: true });

	const handleMaximizeClick = () => sendIPC(IpcKey.Window_Maximized, { maximized: !ipcFullscreen?.maximized });

	const handleCloseClick = () => sendIPC(IpcKey.Window_Close, null);

	const sensors = useSensors(useSensor(PointerSensor));

	return (
		<div className="grid h-10 grid-cols-[1fr_auto] border-b border-gray-200 bg-gray-100">
			<div
				className="electron-drag scrollbar-hidden flex-1 overflow-x-auto overflow-y-hidden"
				onDragOver={e => {
					e.preventDefault();
					e.dataTransfer.effectAllowed = 'move';
				}}
				onDrop={e => {
					e.preventDefault();
					e.dataTransfer.effectAllowed = 'move';
					if (fileMove?.type === 'move') {
						dispatch(
							setActiveFile({
								file: fileMove.item
							})
						);
					}
				}}
			>
				<div style={{ minWidth: files.length * 150 }}>
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
						modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
						onDragStart={event => {
							const target = event.activatorEvent.target as HTMLElement;
							if ((target.dataset && target.dataset.close) || target.closest('[data-close]')) return;
							const acive = files.find(f => f.file.id === event.active.id);
							if (acive)
								dispatch(
									setActiveFile({
										file: acive.file
									})
								);
						}}
					>
						<SortableContext items={files.map(f => f.file.id)} strategy={horizontalListSortingStrategy}>
							<div className="flex w-full flex-1 items-end">
								{files.map(item => {
									const file = item.file;
									return <SortableFileItem key={file.id} item={file} active={item.active} />;
								})}
							</div>
						</SortableContext>
					</DndContext>
				</div>
			</div>
			<div className="flex">
				<button
					onClick={handleMinimizeClick}
					className="flex aspect-square size-10 items-center justify-center hover:bg-black/5"
				>
					<VscChromeMinimize />
				</button>
				<button
					onClick={handleMaximizeClick}
					className="flex aspect-square size-10 items-center justify-center hover:bg-black/5"
				>
					{ipcFullscreen?.maximized ? <VscChromeRestore /> : <VscChromeMaximize />}
				</button>
				<button
					onClick={handleCloseClick}
					className="flex aspect-square size-10 items-center justify-center hover:bg-red-500 hover:text-white"
				>
					<IoIosClose size={24} />
				</button>
			</div>
		</div>
	);
}
