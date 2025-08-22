import { WebDriver } from 'selenium-webdriver';
import {} from 'selenium-webdriver/remote';
import { CommandInterface } from 'shared';
import { openWeb } from '../selenium';
import { delay, handleClick, handleInsertText, handleKeyboard, handleWindow } from './run-file-selenium-handle';

/**
 * Hàm chạy command với số lần retry
 */
async function runCommandWithRetry(
	driver: WebDriver,
	command: CommandInterface,
	maxRetry: number = 1
): Promise<{
	success: boolean;
	message: string;
}> {
	let attempt = 0;
	while (attempt < maxRetry) {
		try {
			switch (command.type) {
				case 'open-web':
					return await openWeb(driver, command.data.url);

				case 'click':
					return await handleClick(driver, command);

				case 'insert-text':
					return await handleInsertText(driver, command);

				case 'window':
					return await handleWindow(driver, command);

				case 'keyboard':
					return await handleKeyboard(driver, command);

				default:
					return {
						success: false,
						message: `Unknown command type: ${command.type}`
					};
			}
		} catch (e) {
			console.error(`Lỗi command ${command.type} lần ${attempt + 1}:`, e);
		}
		attempt++;
		await delay(1000); // đợi 1s rồi thử lại
	}
	return {
		success: false,
		message: `Command ${command.type} failed after ${maxRetry} attempts`
	};
}
