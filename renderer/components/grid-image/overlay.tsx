'use client';

import { memo, useEffect, useState } from 'react';
import { BiX } from 'react-icons/bi';
import { FaCode } from 'react-icons/fa6';
import { HiDownload } from 'react-icons/hi';
import { OverlayRenderProps } from 'react-photo-view/dist/types';
import { downloadFile } from './toolbar-helpers';

type MediaOverlayProps = {
	media?: string[];
} & OverlayRenderProps;

/**
 * Cá nút bấm: zoom, fullscreen, download ...
 */

export const MediaOverlay: React.FC<MediaOverlayProps> = memo(({ media, index, onClose }) => {
	const [loaded, setLoaded] = useState<boolean>(false);
	const [showTool, setShowTool] = useState<boolean>(false);
	useEffect(() => {
		const getOpacityFromBackground: () => void = () => {
			const backdrop = document.querySelector<HTMLElement>('.PhotoView-Slider__Backdrop');
			if (!backdrop) {
				setShowTool(false);
				return;
			}
			const computedStyle = getComputedStyle(backdrop);
			const background = computedStyle.backgroundColor;
			const rgbaMatch = /rgba?\((\d+), (\d+), (\d+), ?([\d.]+)?\)/.exec(background);
			if (rgbaMatch) {
				const extractedOpacity = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;
				setShowTool(extractedOpacity > 0.75);
			} else setShowTool(true);
		};
		getOpacityFromBackground();
		const observer = new MutationObserver(getOpacityFromBackground);
		const backdrop = document.querySelector('.PhotoView-Slider__Backdrop');
		if (backdrop) observer.observe(backdrop, { attributes: true, attributeFilter: ['style'] });
		return () => {
			observer.disconnect();
		};
	}, [loaded]);

	useEffect(() => {
		setLoaded(true);
		setShowTool(true);
	}, []);

	const imageSelected = media?.[index];

	return (
		<>
			<div
				onClick={() => onClose?.()}
				className={`absolute left-4 top-4 z-50 cursor-pointer rounded-full bg-white/20 p-3 text-2xl text-white hover:bg-white/40 ${showTool ? 'opacity-100' : 'opacity-0'}`}
			>
				<BiX size={32} />
			</div>
			<div
				className={`absolute right-0 top-0 z-50 flex h-14 select-none bg-white/20 ${showTool ? 'opacity-100' : 'opacity-0'}`}
			>
				<div
					onClick={() => {
						downloadFile(imageSelected || '');
					}}
					className="flex size-14 cursor-pointer items-center justify-center text-2xl text-white hover:bg-white/40"
				>
					<HiDownload />
				</div>
				<div className="flex size-14 cursor-pointer items-center justify-center text-2xl text-white hover:bg-white/40">
					<FaCode />
				</div>
			</div>
			<div className="absolute bottom-0 left-1/2 z-50 -translate-x-1/2 bg-white/10 px-3 py-1 ">{imageSelected}</div>
		</>
	);
});
MediaOverlay.displayName = 'MediaOverlay';
