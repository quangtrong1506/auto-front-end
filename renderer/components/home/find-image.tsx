'use client';

import { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';
import { sendIpcInvike, useIPCKey } from '../../hooks';
import { IPCResponseInterface } from '../../shared';
import { GridImage } from '../grid-image';
import { WorksInterface } from './step';

interface OpenWebProps {
	data?: WorksInterface;
	onLogin?: ({ email, password }: { email: string; password: string }) => void;
	onCancel?: () => void;
}
export const FindImage = ({ data, onLogin, onCancel }: OpenWebProps) => {
	const { width } = useWindowSize();
	const [q, setQ] = useState<string>('');
	const [isAutoScroll, setIsAutoScroll] = useState<boolean>(false);
	const [images, setImages] = useState<string[] | null>(null);
	function onSearch() {
		if (q) {
			sendIpcInvike('search', { query: q })
				.then(res => {
					console.log(res);
				})
				.catch(e => {
					console.log(e);
				});
		}
	}
	const ipcAutoImages = useIPCKey<IPCResponseInterface['findImageAuto']>('findImageAuto');

	useEffect(() => {
		if (!ipcAutoImages) return;
		setImages(ipcAutoImages.data);
	}, [ipcAutoImages]);

	function findImage() {
		sendIpcInvike('findImage', {
			autoSroll: isAutoScroll
		})
			.then(res => {
				console.log(res);
				if (res.status === 'success') {
					setImages(res.data);
				}
			})
			.catch(e => {
				console.log(e);
			});
	}

	return (
		<div className="h-full flex justify-center items-center flex-col gap-2">
			<div className="flex gap-3">
				<div className="flex gap-1">
					<input
						type="text"
						placeholder="Tìm kiếm"
						className="px-2 py-1 border focus-within:outline-none rounded-lg"
						value={q}
						onChange={e => setQ(e.target.value)}
						onKeyDown={e => e.key === 'Enter' && onSearch()}
					/>
					<button
						className="px-2 py-1 border focus-within:outline-none rounded-lg text-sm bg-cyan-500 text-white"
						onClick={onSearch}
					>
						Tìm kiếm
					</button>
				</div>
				<div className="flex gap-1">
					<select className="border rounded-lg px-2 cursor-pointer">
						<option value="236">Size 236px</option>
						<option value="736">Size 736px</option>
						<option value="1200">Size 1200px</option>
					</select>
					<select
						name="auto-scroll"
						id="auto-scroll"
						value={isAutoScroll ? 'true' : 'false'}
						className="border rounded-lg px-2 cursor-pointer"
						onChange={e => setIsAutoScroll(e.target.value === 'true')}
					>
						<option value="false">Chỉ 1 màn hình</option>
						<option value="true">Auto scroll</option>
					</select>
					<button
						className="px-2 py-1 border focus-within:outline-none rounded-lg text-sm bg-cyan-500 text-white"
						onClick={findImage}
					>
						Quét hình ảnh
					</button>
				</div>
			</div>
			{images && (
				<div className="w-full flex flex-wrap gap-2 px-3">
					<GridImage viewMode="list" list={images} cols={width / 170} />
				</div>
			)}
		</div>
	);
};
