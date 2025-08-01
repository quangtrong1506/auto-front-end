'use client';

import { sendIPC } from '../hooks';

export default function ShortcutGrid(): JSX.Element {
	return (
		<div className="w-screen h-screen justify-center items-center flex">
			<div
				className=""
				onClick={() => {
					sendIPC('open', null);
				}}
			>
				Open
			</div>
		</div>
	);
}
