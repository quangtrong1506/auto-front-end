import React from 'react';
import { LayoutHeader } from './header';
import { Nav } from './nav';

export const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="h-dvh w-full overflow-hidden flex">
			<Nav />
			<div className="grid grid-rows-[auto_1fr_auto] flex-1">
				<LayoutHeader />
				<div>{children}</div>
				<div>Footer</div>
			</div>
		</div>
	);
};
