'use client';

import { useCallback, useEffect, useState } from 'react';
import { PhotoSlider } from 'react-photo-view';
import { OverlayRenderProps } from 'react-photo-view/dist/types';
import { LoadingSpin } from '../loading-spin';
import { CustomImage } from './image';
import { MediaOverlay } from './overlay';

import 'react-photo-view/dist/react-photo-view.css';
import { Pagination } from '../pagination';

interface GridImageProps {
	className?: string;
	cols?: number;
	list?: string[];
	loading?: boolean;
	page?: number;
	pages?: number;
	type?: 'auto' | 'page';
	viewMode?: 'list' | 'grid';
	onChangePage?: (page: number) => void;
}

export function GridImage({
	className = '',
	cols = 7,
	list = [],
	loading = false,
	page = 1,
	pages = 1,
	type = 'auto',
	viewMode = 'grid',
	onChangePage
}: Readonly<GridImageProps>) {
	const [grid, setGrid] = useState<string[][]>([]);
	const [open, setOpen] = useState<boolean>(false);
	const [index, setIndex] = useState<number>(0);
	useEffect(() => {
		if (!list || !Array.isArray(list) || list.length === 0 || cols < 1) return;

		const actualCols = Math.min(Math.max(1, Math.floor(cols)), list.length);

		const tempGrid: string[][] = [];
		for (let i = 0; i < actualCols; i++) tempGrid[i] = [];

		for (let i = 0; i < list.length; i++) {
			const colIndex = i % actualCols;
			tempGrid[colIndex].push(list[i]);
		}
		setGrid(tempGrid);
	}, [list, cols]);

	const renderMediaOverLay = useCallback(
		(props: OverlayRenderProps) => {
			return <MediaOverlay {...props} media={list} />;
		},
		[list]
	);

	if (loading && list.length === 0)
		return (
			<div className="relative h-[300px] w-full">
				<LoadingSpin />
			</div>
		);
	if (list.length === 0)
		return (
			<div className="flex h-[300px] w-full items-center justify-center">
				<h1 className="text-center text-2xl font-bold">No images</h1>
			</div>
		);

	return (
		<>
			<div className={`w-full ${className}`}>
				<div className="flex size-full gap-1 overflow-y-auto">
					{viewMode === 'grid' &&
						grid.map(row => (
							<div
								key={'row-' + row[0]}
								className="flex flex-col gap-1"
								style={{
									width: `${100 / Math.floor(cols)}%`
								}}
							>
								{row.map(image => (
									<div
										onClick={() => {
											setOpen(true);
											setIndex(list.indexOf(image));
										}}
										className="h-fit"
										key={image}
									>
										<CustomImage src={image} />
									</div>
								))}
							</div>
						))}

					{viewMode === 'list' && (
						<div className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400 flex flex-col">
							{list?.map(image => (
								<div
									key={image}
									className="w-full flex border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
								>
									<div className="p-1">
										{image && (
											<div className="flex w-full items-center justify-center">
												<div
													className="w-12"
													onClick={() => {
														setOpen(true);
														setIndex(list.indexOf(image));
													}}
												>
													<CustomImage src={image} />
												</div>
											</div>
										)}
									</div>
									<div className="p-1 text-center text-sm flex-1">
										<input className="w-full" value={image} readOnly />
									</div>
									<div className="p-1 text-center text-sm">
										<div className="flex gap-2">
											<span
												onClick={() => {
													console.log(image);
												}}
												className="cursor-pointer font-medium text-blue-600 hover:underline dark:text-blue-500"
											>
												Tải xuống
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					<PhotoSlider
						bannerVisible={false}
						className="media-fullscreen-selector z-[9999999] select-none"
						loop={false}
						maskClosable={false}
						overlayRender={renderMediaOverLay}
						photoClassName="photo-view__content"
						speed={() => 400}
						images={list.map(item => ({
							key: item,
							src: item
						}))}
						visible={open}
						onClose={() => {
							setOpen(false);
							setIndex(0);
						}}
						onIndexChange={i => {
							setIndex(i);
						}}
						index={index}
					/>
				</div>
				{type === 'page' && (
					<Pagination
						currentPage={page}
						totalPage={pages}
						onChangePage={currentPage => {
							onChangePage?.(currentPage);
						}}
					/>
				)}
			</div>
		</>
	);
}

export { CustomImage } from './image';
