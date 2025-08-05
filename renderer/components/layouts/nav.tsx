'use client';

import { useEffect, useRef, useState } from 'react';
import { FaBars } from 'react-icons/fa6';
import { VscNewFile, VscNewFolder } from 'react-icons/vsc';
import { useClickAway } from 'react-use';

export const Nav = () => {
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

	useClickAway(navRef, () => setOpenNav(false));

	useEffect(() => {
		openNavRef.current = openNav;
	}, [openNav]);

	useEffect(() => {
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

	return (
		<div ref={navRef} className="h-dvh border-r border-gray-200 relative" style={{ width: openNav ? width : 48 }}>
			<div className="w-full flex items-center">
				{openNav && (
					<div className="flex-1 flex">
						<button
							title="New file"
							className="size-8 hover:border-gray-200 border rounded-full border-transparent justify-center items-center flex"
						>
							<VscNewFile />
						</button>
						<button
							title="New folder"
							className="size-8 hover:border-gray-200 border rounded-full border-transparent justify-center items-center flex"
						>
							<VscNewFolder />
						</button>
					</div>
				)}
				<div className="electron-no-drag relative h-10 w-12">
					<button
						className="flex h-10 w-12 items-center justify-center focus-within:outline-none"
						onClick={handleOpenNav}
					>
						<FaBars />
					</button>
				</div>
			</div>
			<div
				ref={resizeRef}
				className={`absolute z-[99] h-dvh w-[5px] top-0 right-[-2px] cursor-e-resize select-none ${
					isResizing ? 'bg-blue-200' : 'bg-transparent'
				}`}
			/>
		</div>
	);
};
