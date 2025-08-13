'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FileInterface } from 'shared';
import { FileDetails } from '../components';
import { RootState } from '../lib/store';

export default function HomePage(): JSX.Element | null {
	const loading = useSelector((state: RootState) => state.files.loading);
	const active = useSelector((state: RootState) => state.files.activeTabs);
	const [file, setFile] = useState<FileInterface>();

	useEffect(() => {
		if (active.length > 0) {
			const f = active.find(f => f.active)?.file;
			setFile(prev => (prev?.id === f?.id ? prev : f));
		}
	}, [active]);

	if (loading || !file) return null;

	return (
		<div className="w-full overflow-y-auto">
			<FileDetails file={file} />
		</div>
	);
}
