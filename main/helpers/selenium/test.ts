import path from 'path';
import { Builder, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

/**
 * Khởi tạo WebDriver sử dụng Chrome for Testing
 * @returns {Promise<WebDriver>} Trả về instance WebDriver
 */
export const setupChromeDriver = async (): Promise<WebDriver> => {
	// Đường dẫn tương đối đến thư mục chứa Chrome và ChromeDriver
	const rootDir = path.resolve(__dirname, '../'); // Đường dẫn gốc của dự án
	const chromePath = path.join(rootDir, 'chrome', 'win64-131.0.6778.204', 'chrome-win64', 'chrome.exe');
	const driverPath = path.join(rootDir, 'chrome', 'win64-131.0.6778.204', 'chrome-win64', 'chromedriver.exe');

	// Cấu hình dịch vụ và trình duyệt
	const service = new chrome.ServiceBuilder(driverPath);
	const options = new chrome.Options().setChromeBinaryPath(chromePath);

	// Khởi tạo WebDriver
	return await new Builder().forBrowser('chrome').setChromeOptions(options).setChromeService(service).build();
};
