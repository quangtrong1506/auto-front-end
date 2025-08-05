import { IoIosClose } from 'react-icons/io';
import { VscChromeMaximize, VscChromeMinimize, VscChromeRestore } from 'react-icons/vsc';
import { IpcKey } from 'shared';
import { sendIPC, useIPCKey } from '../../hooks';
import { FileItem } from './file-item';
const demofile = [
	{
		active: false,
		item: null
	},
	{
		active: true,
		item: null
	},
	{
		active: false,
		item: null
	}
];
export const LayoutHeader = () => {


	const ipcFullscreen = useIPCKey(IpcKey.Window_Maximized);

	
	const handleMinimizeClick = () => {
		sendIPC(IpcKey.Window_Minimized, { minimized: true });
	};

	const handleMaximizeClick = () => {
		sendIPC(IpcKey.Window_Maximized, { maximized: !ipcFullscreen?.maximized });
	};

	const handleCloseClick = () => {
		sendIPC(IpcKey.Window_Close, null);
	};

	return (
		<div className="flex h-10 w-full border-b border-gray-200 bg-gray-100">
			
			<div className="electron-drag flex flex-1 items-end">
				{demofile.map((item, index) => (
					<FileItem active={item.active} item={item.item} key={index} />
				))}
			</div>
			<div className="flex">
				<button
					onClick={handleMinimizeClick}
					className="flex aspect-square size-10 items-center justify-center hover:bg-black/5"
				>
					<VscChromeMinimize />
				</button>
				<button
					onClick={handleMaximizeClick}
					className="flex aspect-square size-10 items-center justify-center hover:bg-black/5"
				>
					{ipcFullscreen?.maximized ? <VscChromeRestore /> : <VscChromeMaximize />}
				</button>
				<button
					onClick={handleCloseClick}
					className="flex aspect-square size-10 items-center justify-center hover:bg-red-500 hover:text-white"
				>
					<IoIosClose size={24} />
				</button>
			</div>
		</div>
	);
};
