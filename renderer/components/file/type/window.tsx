interface WindowProps {
	value?: {
		width?: number;
		height?: number;
		maximun: boolean;
	};
	onChange?: (value: { width?: number; height?: number; maximun: boolean }) => void;
	onFocus?: () => void;
}

export const Window = ({ value, onChange, onFocus }: WindowProps) => {
	return (
		<div className="relative flex w-full gap-1 p-3">
			<div className="flex w-full flex-col">
				<div className="flex w-full flex-1 justify-between">
					<div className="flex flex-1 items-center gap-3">
						<div className="min-w-10">Width</div>
						<input
							value={value?.width || ''}
							min={400}
							max={1920}
							type="number"
							step={50}
							className="w-24 rounded-lg border border-gray-200 p-1"
							placeholder="500"
							onChange={e =>
								onChange?.({
									width: Number(e.target.value),
									height: value?.height,
									maximun: value?.maximun || false
								})
							}
							onFocus={onFocus}
						/>
					</div>
					<div className="flex flex-1 items-center gap-3">
						<div className="min-w-10">Height</div>
						<input
							value={value?.height || ''}
							min={300}
							max={1080}
							type="number"
							step={50}
							className="w-24 rounded-lg border border-gray-200 p-1"
							placeholder="300"
							onChange={e =>
								onChange?.({
									width: value?.width,
									height: Number(e.target.value),
									maximun: value?.maximun || false
								})
							}
							onFocus={onFocus}
						/>
					</div>
					<div className="flex flex-1 items-center gap-3">
						<label htmlFor="checkbox" className="min-w-10">
							Maxsimize
						</label>
						<input
							id="checkbox"
							type="checkbox"
							name=""
							checked={value?.maximun || false}
							onChange={e =>
								onChange?.({ width: value?.width, height: value?.height, maximun: e.target.checked })
							}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
