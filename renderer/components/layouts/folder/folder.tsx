import { useSelector } from 'react-redux';
import { RootState } from '../../../lib/store';
import { FolderItem } from './folder-item';
import { FolderOnlyItem } from './folder-only-item';

export const Folder = () => {
	const folders = useSelector((state: RootState) => state.files);

	const folderNotDefault = folders.folders.filter(folder => folder.id !== 'root');
	return (
		<div className="flex w-full flex-col">
			{folderNotDefault.map(folder => (
				<FolderItem data={folder} key={folder.id} />
			))}
			<FolderOnlyItem />
		</div>
	);
};
