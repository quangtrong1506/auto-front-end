import { useState } from 'react';
import { FaCopy } from 'react-icons/fa6';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { VscClose } from 'react-icons/vsc';
import { CommandInterface } from 'shared';
import { InsertText, Keyboard } from './type';
import { Window } from './type/window';

const selectOptions: {
	value: CommandInterface['type'];
	label: string;
}[] = [
	{ value: 'click', label: 'Click' },
	{ value: 'if', label: 'If' },
	{ value: 'insert-text', label: 'Insert text' },
	{ value: 'keyboard', label: 'Keyboard' },
	// { value: 'redirect-url', label: 'Redirect URL' },
	{ value: 'scroll', label: 'Scroll' },
	{ value: 'upload-file', label: 'Upload file' },
	{ value: 'window', label: 'Window' },
	{ value: 'redirect-url', label: 'Redirect URL' }
];

interface FileCommandsProps {
	value: CommandInterface;
	onClose?: () => void;
	onCopy?: () => void;
	onChange?: (data: CommandInterface) => void;
}

export const FileCommands = ({ value, onClose, onCopy, onChange }: FileCommandsProps) => {
	const [focusCSSSelector, setFocusCSSSelector] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);

	return (
		<div
			className={`flex min-h-10 w-full flex-col items-center overflow-hidden rounded-xl border transition-all duration-200 ease-in-out ${open ? 'h-44' : 'h-10'} ${isError ? 'border-red-500' : ''}`}
		>
			<div className="flex h-10 w-full items-center ">
				<button
					className="flex size-6 items-center justify-center rounded-full"
					onClick={() => {
						if (value.type === 'click') return;
						setOpen(prev => !prev);
					}}
				>
					<RiArrowDropDownLine
						className={` text-cyan-600 transition-all duration-200 ease-in-out ${open ? '' : '-rotate-90'}`}
						size={26}
					/>
				</button>
				<select
					className="rounded-xl p-2 focus-within:outline-none"
					value={value.type}
					onChange={e => {
						const arrayOpen = ['insert-text', 'keyboard', 'window'] as CommandInterface['type'][];
						const arrayClose = ['click'] as CommandInterface['type'][];
						const currentType = e.target.value as CommandInterface['type'];
						if (arrayClose.includes(currentType)) setOpen(false);
						if (arrayOpen.includes(currentType)) setOpen(true);
						setIsError(false);
						onChange?.({ ...value, type: currentType } as CommandInterface);
					}}
				>
					{selectOptions.map(option => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				<div className="flex flex-1 gap-[2px]">
					<div className={`min-h-8 flex-1 ${focusCSSSelector ? 'flex-1' : ''}`}>
						<input
							disabled={['window'].includes(value.type)}
							className="min-h-8 w-full rounded-lg border border-transparent px-1 focus-within:border-gray-300 focus-within:outline-none disabled:cursor-not-allowed disabled:bg-transparent"
							placeholder="CSS selector"
							onFocus={() => setFocusCSSSelector(true)}
							onBlur={() => setFocusCSSSelector(false)}
							value={value.selector || ''}
							onChange={e => {
								onChange?.({ ...value, selector: e.target.value });
								if (!e.target.value) setIsError(true);
								else setIsError(false);
							}}
						></input>
					</div>
					<div className={`flex min-h-8 ${focusCSSSelector ? 'hidden' : ''}`}>
						<div>
							<input
								className="min-h-8 w-full rounded-lg border border-transparent px-1 focus-within:border-gray-300 focus-within:outline-none"
								placeholder="Desription"
								value={value.description || ''}
								onChange={e => {
									onChange?.({ ...value, description: e.target.value });
								}}
							></input>
						</div>
						<input
							type="number"
							step={100}
							min={0}
							value={value.delay === 0 ? '' : value.delay || ''}
							className="min-h-8 w-[80px] rounded-lg border border-transparent px-1 focus-within:border-gray-300 focus-within:outline-none"
							placeholder="Delay"
							onBlur={e => {
								const rawValue = Number.parseInt(e.target.value);
								const numValue = Number.isNaN(rawValue) ? 0 : rawValue;

								onChange?.({ ...value, delay: numValue < 0 ? 100 : Math.ceil(numValue / 100) * 100 });
							}}
							onChange={e => {
								const number = Number.parseInt(e.target.value);
								onChange?.({ ...value, delay: number });
							}}
						></input>
						<input
							type="number"
							step={1}
							min={0}
							className="min-h-8 w-[80px] rounded-lg border border-transparent px-1 focus-within:border-gray-300 focus-within:outline-none"
							placeholder="Retry"
							value={value.retry === 0 ? '' : value.retry || ''}
							onChange={e => onChange?.({ ...value, retry: Number.parseInt(e.target.value) })}
						></input>
					</div>
				</div>
				<div className="flex gap-[2px]">
					<button className="flex size-6 items-center justify-center rounded-full" onClick={onCopy}>
						<FaCopy className="text-cyan-600" size={12} />
					</button>
					<button className="flex size-6 items-center justify-center rounded-full" onClick={onClose}>
						<VscClose className="text-red-600" />
					</button>
				</div>
			</div>
			<div className="flex h-36 w-full flex-col items-center">
				<div className="w-[calc(100%-24px)] border-t border-gray-200"></div>
				<div className="w-full">
					{value.type === 'insert-text' && (
						<InsertText
							value={value.data.text}
							onChange={text => {
								if (!text) setIsError(true);
								else setIsError(false);
								onChange?.({ ...value, data: { ...value.data, text } });
							}}
							onFocus={() => setOpen(true)}
						/>
					)}
					{value.type === 'keyboard' && (
						<Keyboard
							keys={value.data.keys}
							onChange={keys => {
								if (!keys) setIsError(true);
								else setIsError(false);
								onChange?.({ ...value, data: { ...value.data, keys } });
							}}
						/>
					)}
					{value.type === 'window' && (
						<Window
							value={{
								width: value.data.rezize?.width,
								height: value.data.rezize?.height,
								maximun: value.data.rezize?.maximun || false
							}}
							onChange={val => {
								console.log('val', val);
								onChange?.({
									...value,
									data: {
										rezize: {
											width: val.width,
											height: val.height,
											maximun: val.maximun
										}
									}
								});
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
