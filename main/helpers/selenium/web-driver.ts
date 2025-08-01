import { Browser, Builder, WebDriver } from 'selenium-webdriver';
import { log } from '../dev-log';

/**
 * Tạo WebDriver cho một trình duyệt cụ thể.
 *
 * @param {( 'firefox' | 'edge' | 'chrome')} browser - Trình duyệt mà bạn muốn kiểm thử.
 * @returns {Promise<WebDriver>} - Trả về một đối tượng WebDriver cho trình duyệt được chỉ định.
 */
export const createDriver = async (): Promise<WebDriver | null> => {
	try {
		let driver = await new Builder().forBrowser(Browser.CHROME).build();
		return driver;
	} catch (error) {
		log.error(error);
		return null;
	}
};

/**
 * Kiểm tra trạng thái của DOM.
 * Trả về một trong các trạng thái: 'loading', 'interactive', hoặc 'complete'.
 * @param driver - WebDriver instance
 * @returns Promise<'loading' | 'interactive' | 'complete'>
 */
export const checkDomStatus = async (driver: WebDriver): Promise<'loading' | 'interactive' | 'complete'> =>
	driver.executeScript('return document.readyState') as Promise<'loading' | 'interactive' | 'complete'>;

export const redirectURL = async (driver: WebDriver, url: string): Promise<void> => {
	try {
		await driver.get(url);
	} catch (error) {
		log.error(error);
	}
};

/**
 * Đóng WebDriver hiện tại.
 *
 * @param {WebDriver} driver - Đối tượng WebDriver cần đóng.
 * @returns {Promise<void>} - Trả về một Promise khi hoàn tất.
 */
export const closeDriver = async (driver: WebDriver): Promise<void> => {
	await driver.quit();
};

/**
 * Thay đổi kích thước của cửa sổ WebDriver.
 *
 * @param {WebDriver} driver - Đối tượng WebDriver cần thay đổi kích thước.
 * @param {Object} options - Các tùy chọn thay đổi kích thước.
 * @param {number} options.width - Chiều rộng cửa sổ (mặc định 1280).
 * @param {number} options.height - Chiều cao cửa sổ (mặc định 720).
 * @param {boolean} options.maximun - Cờ để phóng to cửa sổ (mặc định true).
 * @returns {Promise<void>} - Trả về một Promise khi hoàn tất.
 */
export const resizeDriver = async (
	driver: WebDriver,
	options = {
		width: 1280,
		height: 720,
		maximun: true
	}
): Promise<void> => {
	await driver.manage().window().setRect({ width: options.width, height: options.height });
	if (options.maximun) await driver.manage().window().maximize();
};
