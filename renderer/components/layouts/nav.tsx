'use client';

import { useEffect, useRef, useState } from 'react';
import { AiOutlineDoubleLeft } from 'react-icons/ai';
import { FaBars } from 'react-icons/fa6';
import { GoFileSymlinkFile } from 'react-icons/go';
import { VscNewFile, VscNewFolder } from 'react-icons/vsc';
import { useDispatch } from 'react-redux';
import { createFolder, createNewFile } from '../../lib/features';
import { Folder } from './folder/folder';

export const Nav = () => {
	const dispatch = useDispatch();
	const [openNav, setOpenNav] = useState<boolean>(false);
	const [width, setWidth] = useState<number>(500);
	const [isResizing, setIsResizing] = useState<boolean>(false);

	const navRef = useRef<HTMLDivElement>(null);
	const resizeRef = useRef<HTMLDivElement>(null);
	const openNavRef = useRef<boolean>(openNav);

	const handleOpenNav = () => {
		setOpenNav(prev => !prev);
		if (!openNav) setWidth(300);
	};

	useEffect(() => {
		openNavRef.current = openNav;
	}, [openNav]);

	useEffect(() => {
		const navLocal = localStorage.getItem('nav-info');
		if (navLocal) {
			const { open, width } = JSON.parse(navLocal);
			setOpenNav(open);
			setWidth(width);
		}

		function handleMouseMove(e: MouseEvent) {
			const newWidth = e.clientX;

			if (newWidth < 100 && openNavRef.current) {
				setOpenNav(false);
				setWidth(200);
				return;
			}

			if (newWidth > 100 && !openNavRef.current) {
				setOpenNav(true);
				setWidth(200);
				return;
			}

			if (newWidth >= 200 && newWidth <= 600) setWidth(newWidth);
		}

		function handleMouseUp() {
			setIsResizing(false);
			document.body.style.cursor = '';
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		}

		function handleMouseDown() {
			setIsResizing(true);
			document.body.style.cursor = 'e-resize';
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
		}

		const resizer = resizeRef.current;
		if (resizer) resizer.addEventListener('mousedown', handleMouseDown);

		return () => {
			if (resizer) resizer.removeEventListener('mousedown', handleMouseDown);
		};
	}, []);

	useEffect(() => {
		localStorage.setItem('nav-info', JSON.stringify({ open: openNav, width }));
	}, [openNav, width]);

	return (
		<div
			ref={navRef}
			className="electron-no-drag relative h-dvh border-r border-gray-200"
			style={{ width: openNav ? width : 48 }}
		>
			<div className="flex w-full items-center">
				{openNav && (
					<div className="flex flex-1 pl-1">
						<button
							title="New file"
							className="flex size-8 items-center justify-center rounded-full border border-transparent hover:border-gray-200"
							onClick={() => {
								dispatch(
									createNewFile({
										toFolderId: 'root'
									})
								);
							}}
						>
							<VscNewFile />
						</button>
						<button
							onClick={() => {
								dispatch(createFolder());
							}}
							title="New folder"
							className="flex size-8 items-center justify-center rounded-full border border-transparent hover:border-gray-200"
						>
							<VscNewFolder />
						</button>
						<button
							title="Import"
							className="flex size-8 items-center justify-center rounded-full border border-transparent hover:border-gray-200"
						>
							<GoFileSymlinkFile />
						</button>
					</div>
				)}
				<div className="electron-no-drag relative h-10 w-12">
					<button
						className="flex h-10 w-12 items-center justify-center focus-within:outline-none"
						onClick={handleOpenNav}
					>
						{openNav ? <AiOutlineDoubleLeft /> : <FaBars />}
					</button>
				</div>
			</div>
			<div className={`w-full ${openNav ? '' : 'hidden'}`}>
				<Folder />
			</div>
			<div
				ref={resizeRef}
				className={`absolute  right-[-2px] top-0 z-[99] h-dvh w-[5px] cursor-e-resize select-none ${
					isResizing ? 'bg-blue-200' : 'bg-transparent'
				}`}
			/>
		</div>
	);
};
