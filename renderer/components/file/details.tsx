'use client';

import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CommandInterface, FileInterface, IpcKey } from 'shared';
import { randomID } from '../../helpers';
import { sendIPC } from '../../hooks';
import { saveCommands } from '../../lib/features';
import { FileCommands } from './commands';

export const FileDetails = ({ file }: { file?: FileInterface }) => {
	const dispatch = useDispatch();
	const [commands, setCommands] = useState<CommandInterface[]>((file?.commands || []).slice(1));
	const [start, setStart] = useState<CommandInterface>((file?.commands || [])[0]);
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const oldIndex = commands.findIndex(f => f.id === active.id);
		const newIndex = commands.findIndex(f => f.id === over.id);
		setCommands(arrayMove(commands, oldIndex, newIndex));
	};
	useEffect(() => {
		if (!file) return;
		setCommands(file.commands.slice(1));
		setStart(file.commands[0]);
	}, [file]);

	useEffect(() => {
		dispatch(saveCommands({ id: file!.id, commands: [start, ...commands] }));
	}, [start, commands]);

	const sensors = useSensors(useSensor(PointerSensor));

	function handleRunFile() {
		if (!file) return;
		sendIPC(IpcKey.RunFile, {
			file: {
				...file,
				commands: [start, ...commands]
			}
		});
	}

	return (
		<div className="h-full overflow-y-auto py-3 pl-1 pr-3">
			<div className="mb-3 flex min-h-10 w-full items-center overflow-hidden rounded-xl border">
				<input
					value={start?.type === 'open-web' ? start?.data?.url : ''}
					type="text"
					placeholder="URL"
					className="flex-1 border-none px-3 text-blue-600 outline-none"
					onChange={e => {
						setStart({
							...start,
							type: 'open-web',
							data: {
								...start?.data,
								url: e.target.value
							}
						});
					}}
				/>
				<input
					type="number"
					step={100}
					min={0}
					value={start?.delay === 0 ? '' : start?.delay}
					className="min-h-8 w-[80px] rounded-lg border border-transparent px-1 focus-within:border-gray-300 focus-within:outline-none"
					placeholder="Delay"
					onBlur={e => {
						const rawValue = Number.parseInt(e.target.value);
						const value = Number.isNaN(rawValue) ? 0 : rawValue;

						setStart(prev => ({
							...prev,
							delay: value < 0 ? 100 : Math.ceil(value / 100) * 100
						}));
					}}
					onChange={e => {
						const value = Number.parseInt(e.target.value);
						setStart(prev => ({
							...prev,
							delay: Number.isNaN(value) ? 0 : value
						}));
					}}
				></input>
				<div className="px-2">
					<button className="text-sm text-cyan-600" onClick={handleRunFile}>
						Chạy
					</button>
				</div>
			</div>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
				modifiers={[restrictToVerticalAxis, restrictToParentElement]}
			>
				<SortableContext items={commands.map(f => f.id)} strategy={verticalListSortingStrategy}>
					<div className="flex w-full flex-col gap-2">
						{commands.map((item, index) => {
							return (
								<SortableCommandItem
									key={item.id}
									item={item}
									index={index + 1}
									onCopy={() => {
										setCommands(prev => {
											const newArr = [...prev];
											const f = prev.find(f => f.id === item.id);
											if (!f) return newArr;
											newArr.splice(index + 1, 0, { ...f, id: randomID() });
											return newArr;
										});
									}}
									onClose={() => {
										setCommands(prev => prev.filter(f => f.id !== item.id));
									}}
									onChange={item => {
										setCommands(prev =>
											prev.map(f => {
												if (f.id === item.id) return item;
												return f;
											})
										);
									}}
								/>
							);
						})}
					</div>
				</SortableContext>
			</DndContext>
			<div className="mt-3 flex justify-center gap-3">
				<button
					className="rounded-xl border border-cyan-600 p-1 text-sm text-cyan-500"
					onClick={() => {
						setCommands(prev => [
							...prev,
							{
								id: (prev.length + 1).toString(),
								type: 'click',
								data: {
									selector: ''
								}
							}
						]);
					}}
				>
					Thêm Commands
				</button>
				{/* <button className="rounded-xl border border-cyan-600 p-1 text-sm text-cyan-500">Chạy thử</button> */}
			</div>
		</div>
	);
};

function SortableCommandItem({
	active,
	index,
	item,
	onClose,
	onChange,
	onCopy
}: {
	active?: boolean;
	index?: number;
	item: CommandInterface;
	onClose?: () => void;
	onCopy?: () => void;
	onChange?: (data: CommandInterface) => void;
}) {
	const { setNodeRef, transform, transition, attributes, listeners } = useSortable({ id: item.id });

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	return (
		<div
			className={`relative flex items-center bg-white ${active ? 'z-[990]' : ''}`}
			ref={setNodeRef}
			style={style}
			{...attributes}
		>
			<div className="min-w-7 cursor-n-resize p-1 text-right" {...listeners}>
				{index}
			</div>
			{/* <div className="cursor-n-resize p-1" {...listeners}>
				⠿
			</div> */}
			<FileCommands onClose={onClose} onCopy={onCopy} defaultValue={item} onChange={onChange} />
		</div>
	);
}
