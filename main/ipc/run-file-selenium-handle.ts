import { Key, WebDriver } from 'selenium-webdriver';
import { CommandInterface } from 'shared';
import { log } from '../helpers';
import { findElementByCss } from '../selenium';

/** [Selenium] xử lý click dom */
export async function handleClick(
	driver: WebDriver,
	command: CommandInterface
): Promise<{
	success: boolean;
	message: string;
}> {
	try {
		if (command.type === 'click') {
			const element = await findElementByCss(driver, command.selector || '');
			if (!element)
				return {
					success: false,
					message: `Không tìm thấy phần tử ${command.selector}`
				};
			await element?.click();
		}
		return {
			success: true,
			message: `Đã click vào ${command.selector}`
		};
	} catch (e) {
		const error = e as Error;
		return {
			success: false,
			message: error.message
		};
	}
}

/** [Selenium] xử lý insert text */
export async function handleInsertText(
	driver: WebDriver,
	command: CommandInterface
): Promise<{
	success: boolean;
	message: string;
}> {
	try {
		if (command.type === 'insert-text') {
			const element = await findElementByCss(driver, command.selector || '');
			if (!element)
				return {
					success: false,
					message: `Không tìm thấy phần tử '${command.selector || 'null'}'`
				};
			await element?.sendKeys(command.data.text);
		}
		return {
			success: true,
			message: `Đã nhập text vào ${command.selector}`
		};
	} catch (error) {
		log.info('Error [run-file][insert-text]', error);
		return {
			success: false,
			message: `Error [run-file][insert-text]`
		};
	}
}

/** [Selenium] xử lý window (resize, maximun)*/
export async function handleWindow(driver: WebDriver, command: CommandInterface): Promise<boolean> {
	try {
		if (command.type === 'window') {
			if (command.data.rezize.width && command.data.rezize.height)
				await driver.manage().window().setSize(command.data.rezize.width, command.data.rezize.height);
			if (command.data.rezize.maximun) await driver.manage().window().maximize();
		}
		return true;
	} catch (error) {
		log.info('Error [run-file][window]', error);
		return false;
	}
}

/** [Selenium] xử lý keyboard */
export async function handleKeyboard(driver: WebDriver, command: CommandInterface) {
	try {
		if (command.type === 'keyboard') {
			const keys = command.data.keys;
			for (const key of keys) {
				const keyConvert = convertKey(key);
				await driver.actions().keyDown(keyConvert).perform();
				await driver.actions().keyUp(keyConvert).perform();
				await delay(100);
			}
		}
		return true;
	} catch (error) {
		log.info('Error [run-file][keyboard]', error);
		return false;
	}
}

/** [Selenium] delay */
export function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Chuyển tên phím string sang Selenium Key enum hoặc ký tự
 */
function convertKey(key: string): string {
	switch (key) {
		// Điều hướng
		case 'ArrowUp':
			return Key.ARROW_UP;
		case 'ArrowDown':
			return Key.ARROW_DOWN;
		case 'ArrowLeft':
			return Key.ARROW_LEFT;
		case 'ArrowRight':
			return Key.ARROW_RIGHT;

		// Điều khiển
		case 'Control':
		case 'Ctrl':
			return Key.CONTROL;
		case 'Shift':
			return Key.SHIFT;
		case 'Alt':
			return Key.ALT;
		case 'Meta':
		case 'Command':
		case 'Cmd':
			return Key.META;

		// Đặc biệt
		case 'Enter':
			return Key.ENTER;
		case 'Tab':
			return Key.TAB;
		case 'Escape':
		case 'Esc':
			return Key.ESCAPE;
		case 'Backspace':
			return Key.BACK_SPACE;
		case 'Delete':
			return Key.DELETE;
		case 'Space':
		case ' ':
			return Key.SPACE;

		// Điều hướng nhanh
		case 'Home':
			return Key.HOME;
		case 'End':
			return Key.END;
		case 'PageUp':
			return Key.PAGE_UP;
		case 'PageDown':
			return Key.PAGE_DOWN;
		case 'Insert':
			return Key.INSERT;

		// Phím chức năng F1–F12
		case 'F1':
			return Key.F1;
		case 'F2':
			return Key.F2;
		case 'F3':
			return Key.F3;
		case 'F4':
			return Key.F4;
		case 'F5':
			return Key.F5;
		case 'F6':
			return Key.F6;
		case 'F7':
			return Key.F7;
		case 'F8':
			return Key.F8;
		case 'F9':
			return Key.F9;
		case 'F10':
			return Key.F10;
		case 'F11':
			return Key.F11;
		case 'F12':
			return Key.F12;

		// Default: ký tự thường
		default:
			// Nếu là 1 ký tự → dùng trực tiếp
			if (key.length === 1) return key;
			throw new Error(`Không hỗ trợ phím: ${key}`);
	}
}
