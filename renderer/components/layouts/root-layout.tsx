import { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setInitFolders } from '../../lib/features';
import { LayoutHeader } from './header';
import { Nav } from './nav';

export const RootLayout = ({ children }: { children: ReactNode }) => {
	const ditpatch = useDispatch();
	useEffect(() => {
		const foldersLocal = localStorage.getItem('folders');
		if (foldersLocal) {
			ditpatch(setInitFolders(JSON.parse(foldersLocal)));
		}
	}, []);

	return (
		<div className="flex h-dvh w-full overflow-hidden">
			<Nav />
			<div className="grid flex-1 grid-rows-[auto_1fr_auto]">
				<LayoutHeader />
				<div className="w-full overflow-y-auto">{children}</div>
				<div className="h-10">Footer</div>
			</div>
		</div>
	);
};
