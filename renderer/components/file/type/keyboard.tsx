import { useEffect, useRef, useState } from 'react';
import { randomID } from '../../../helpers';

interface KeyboardProps {
	keys?: string[];
	onChange?: (keys: string[]) => void;
}

export function Keyboard({ keys = [], onChange }: KeyboardProps) {
	const [onRecord, setOnRecord] = useState<boolean>(false);
	const [localKeys, setLocalKeys] = useState<
		{
			id: string;
			key: string;
		}[]
	>(keys.map(key => ({ id: randomID(), key })));
	const pressedKeysRef = useRef<Set<string>>(new Set());

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			e.preventDefault();

			if (!pressedKeysRef.current.has(e.key)) {
				setLocalKeys(prev => {
					const updated = [
						...prev,
						{
							id: randomID(),
							key: e.key
						}
					];
					onChange?.(updated.map(k => k.key));
					return updated;
				});
			}
		}

		function handleKeyUp(e: KeyboardEvent) {
			pressedKeysRef.current.delete(e.key);
		}

		if (!onRecord) return;

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [onRecord, onChange]);

	const handleClear = () => {
		setLocalKeys([]);
		onChange?.([]);
	};

	return (
		<div className="relative flex w-full gap-1 p-3">
			<div className="absolute left-5 top-1/2 z-0 -translate-y-1/2 opacity-50">
				{onRecord && localKeys.length === 0 ? 'Hãy bấm phím...' : ''}
				{!onRecord && localKeys.length === 0 ? 'Bấm bắt đầu để ghi phím' : ''}
			</div>
			<div className="flex h-28 flex-1 flex-wrap items-start gap-1 overflow-y-auto p-2">
				{localKeys.reverse().map(k => (
					<div className="rounded-md border border-gray-200 p-1" key={k.id}>
						{k.key === ' ' ? 'Space' : k.key}
					</div>
				))}
			</div>
			<div className="flex flex-col justify-center gap-2">
				<button
					className="min-w-16 rounded-lg border border-cyan-400 p-2 text-xs text-cyan-500"
					onClick={() => setOnRecord(prev => !prev)}
				>
					{onRecord ? 'Dừng' : 'Bắt đầu'}
				</button>
				<button
					className="min-w-16 rounded-lg border border-red-500 p-2 text-xs text-red-600"
					onClick={handleClear}
				>
					Clear
				</button>
			</div>
		</div>
	);
}
