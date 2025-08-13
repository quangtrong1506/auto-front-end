import { useEffect, useState } from 'react';
import { FaCopy } from 'react-icons/fa6';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { VscClose } from 'react-icons/vsc';
import { CommandInterface } from 'shared';
import { InsertText, Keyboard } from './type';

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
	defaultValue: CommandInterface;
	onClose?: () => void;
	onCopy?: () => void;
	onChange?: (data: CommandInterface) => void;
}

export const FileCommands = ({
	defaultValue = {
		type: 'click',
		id: '0',
		data: {
			selector: ''
		}
	},
	onClose,
	onCopy,
	onChange
}: FileCommandsProps) => {
	const [type, setType] = useState<CommandInterface['type']>(defaultValue?.type || 'click');
	const [focusCSSSelector, setFocusCSSSelector] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [data, setData] = useState<{
		delay?: number;
		description?: string;
		keys?: string[];
		retry?: number;
		selector?: string;
		text?: string;
	}>({
		description: defaultValue?.description || '',
		keys: defaultValue?.type === 'keyboard' ? defaultValue?.data?.keys || [] : [],
		selector: defaultValue?.type === 'click' ? defaultValue?.data?.selector || '' : '',
		text: defaultValue?.type === 'insert-text' ? defaultValue?.data?.text || '' : '',
		delay: defaultValue?.delay,
		retry: defaultValue?.retry
	});

	useEffect(() => {
		const command = { ...defaultValue };
		switch (type) {
			case 'click':
				command.data = { selector: data.selector || '' };
				break;

			case 'insert-text':
				command.data = { text: data.text || '' };
				break;

			case 'keyboard':
				command.data = { keys: data.keys || [] };
				break;

			default:
				break;
		}
		command.delay = data.delay || 0;
		command.description = data.description || '';
		command.retry = data.retry || 0;
		onChange?.(command);
		return () => {};
	}, [data, type]);

	return (
		<div
			className={`flex min-h-10 w-full flex-col items-center overflow-hidden rounded-xl border transition-all duration-200 ease-in-out ${open ? 'h-44' : 'h-10'} ${isError ? 'border-red-500' : ''}`}
		>
			<div className="flex h-10 w-full items-center ">
				<button
					className="flex size-6 items-center justify-center rounded-full"
					onClick={() => {
						if (type === 'click') return;
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
					value={type}
					onChange={e => {
						const arrayOpen = ['insert-text', 'keyboard'] as CommandInterface['type'][];
						const arrayClose = ['click'] as CommandInterface['type'][];
						const currentType = e.target.value as CommandInterface['type'];
						if (arrayClose.includes(currentType)) setOpen(false);
						if (arrayOpen.includes(currentType)) setOpen(true);
						setIsError(false);
						setType(currentType);
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
							className="min-h-8 w-full rounded-lg border border-transparent px-1 focus-within:border-gray-300 focus-within:outline-none"
							placeholder="CSS selector"
							onFocus={() => setFocusCSSSelector(true)}
							onBlur={() => setFocusCSSSelector(false)}
							value={data.selector || ''}
							onChange={e => {
								setData(prev => ({ ...prev, selector: e.target.value }));
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
								value={data.description || ''}
								onChange={e => setData(prev => ({ ...prev, description: e.target.value }))}
							></input>
						</div>
						<input
							type="number"
							step={100}
							min={0}
							value={data.delay === 0 ? '' : data.delay}
							className="min-h-8 w-[80px] rounded-lg border border-transparent px-1 focus-within:border-gray-300 focus-within:outline-none"
							placeholder="Delay"
							onBlur={e => {
								const rawValue = Number.parseInt(e.target.value);
								const value = Number.isNaN(rawValue) ? 0 : rawValue;

								setData(prev => ({
									...prev,
									delay: value < 0 ? 100 : Math.ceil(value / 100) * 100
								}));
							}}
							onChange={e => {
								const value = Number.parseInt(e.target.value);
								setData(prev => ({
									...prev,
									delay: Number.isNaN(value) ? 0 : value
								}));
							}}
						></input>
						<input
							type="number"
							step={1}
							min={0}
							className="min-h-8 w-[80px] rounded-lg border border-transparent px-1 focus-within:border-gray-300 focus-within:outline-none"
							placeholder="Retry"
							value={data.retry === 0 ? '' : data.retry}
							onChange={e => setData(prev => ({ ...prev, retry: Number.parseInt(e.target.value) }))}
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
					{type === 'insert-text' && (
						<InsertText
							value={data.text}
							onChange={text => {
								if (!text) setIsError(true);
								else setIsError(false);
								setData(prev => ({ ...prev, text }));
							}}
						/>
					)}
					{type === 'keyboard' && (
						<Keyboard
							keys={data.keys}
							onChange={keys => {
								if (!keys) setIsError(true);
								else setIsError(false);
								setData(prev => ({ ...prev, keys }));
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
