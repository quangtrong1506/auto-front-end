interface InsertTextProps {
	value?: string;
	onChange?: (value: string) => void;
}

export const InsertText = ({ value, onChange }: InsertTextProps) => {
	return (
		<div className="relative flex w-full gap-1 p-3">
			<div className="absolute bottom-3 right-5 z-0 opacity-50">{value?.length}</div>
			<textarea
				value={value || ''}
				onChange={e => onChange?.(e.target.value)}
				className="relative z-10 max-h-28 min-h-28 flex-1 rounded-lg border border-gray-200 bg-transparent p-2 focus-within:outline-none"
				placeholder="Text...."
			></textarea>
		</div>
	);
};
