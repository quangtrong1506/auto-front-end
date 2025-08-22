import { WebDriver } from 'selenium-webdriver';

export const openWeb = async (driver: WebDriver, url: string) => {
	try {
		await driver.get(url);
		return {
			success: true,
			message: 'Đã mở web'
		};
	} catch {
		return {
			success: false,
			message: `Lỗi không thể mở ${url}`
		};
	}
};
