export interface FileInterface {
	id: string;
	name: string;
	created_at: string;
	updated_at: string;
	commands: CommandInterface[];
	saved?: boolean;
}

export interface FolderInterface {
	id: string;
	name: string;
	created_at: string;
	updated_at: string;
	files: FileInterface[];
}
interface BaseCommandInterface {
	id: string;
	description?: string;
	delay?: number;
	retry?: number;
}

interface CommandMap {
	'redirect-url': { url: string };
	'insert-text': { text: string };
	'upload-file': { filePath: string };
	window: {
		rezize: { width?: number; height?: number; maximun?: boolean };
	};
	click: { selector: string };
	scroll: { selector: string; top?: number; left?: number; bottom?: number; right?: number };
	keyboard: {
		keys: string[];
	};
	if: {
		text?: {
			selector: string;
			contains?: string;
			equals?: string;
			notContains?: string;
			notEquals?: string;
			length?: number;
			isEmpty?: boolean;
			isNotEmpty?: boolean;
			regex?: string;
			isExit?: boolean;
			_break_to?: string;
		};
		element?: {
			selector: string;
			countChildren?: number;
			isExit?: boolean;
			_break_to?: string;
		};
		number?: {
			lessThanOrEqual?: number;
			greaterThanOrEqual?: number;
			equal?: number;
			lessThan?: number;
			greaterThan?: number;
			notEqual?: number;
			isExit?: boolean;
			_break_to?: string;
		};
	};
	// 'save-data-to-variable': {
	// 	key: string;
	// 	value: string;
	// };
	'open-web': {
		url: string;
		delay?: number;
	};
}
export type CommandInterface = {
	[K in keyof CommandMap]: BaseCommandInterface & {
		type: K;
		data: CommandMap[K];
	};
}[keyof CommandMap];
