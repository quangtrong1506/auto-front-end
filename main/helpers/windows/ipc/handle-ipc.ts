import { Key, WebDriver } from 'selenium-webdriver';
import { IpcBodyInterface, IPCResponseInterface } from '../../../types';
import { log } from '../../dev-log';
import { createDriver, resizeDriver } from '../../selenium';
import { findElementByCss, findElementById, findElementsByTagName } from '../../selenium/element-finder';
import { sendWebContents } from '../../web-contents';

let driver: WebDriver | null = null;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export function handleOpenWeb(_mainWindow: Electron.BrowserWindow) {
	return async (
		_event: Electron.IpcMainInvokeEvent,
		_data: IpcBodyInterface['open']
	): Promise<IPCResponseInterface['open']> => {
		try {
			driver = await createDriver();
			if (!driver) {
				return {
					message: 'Lỗi khởi tạo trình duyệt',
					status: 'error',
					data: false
				};
			}
			await driver.get('https://www.pinterest.com/');
			await resizeDriver(driver, { width: 1280, height: 720, maximun: true });
			return {
				message: 'Đã Pinterest',
				status: 'success',
				data: true
			};
		} catch (error: unknown) {
			log.error('Lỗi xoá video:', error);
			return {
				message: 'Lỗi khởi tạo trình duyệt',
				status: 'error',
				data: false
			};
		}
	};
}
export function handleLogin(_mainWindow: Electron.BrowserWindow) {
	return async (
		_event: Electron.IpcMainInvokeEvent,
		data: IpcBodyInterface['login']
	): Promise<IPCResponseInterface['login']> => {
		try {
			if (!driver)
				return {
					message: 'Chưa có trình duyệt hoặc đã bị đóng',
					status: 'error',
					data: false
				};
			const button = await findElementByCss(driver, '[data-test-id="simple-login-button"] button');
			button?.click();
			await delay(1000);

			const emailInput = await findElementById(driver, 'email');
			await emailInput?.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
			await delay(100);
			await emailInput?.sendKeys(data.email);
			await delay(500);
			const passwordInput = await findElementById(driver, 'password');
			await passwordInput?.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
			await delay(100);
			await passwordInput?.sendKeys(data.password);
			await delay(500);
			const buttonSubmit = await findElementByCss(driver, '[data-test-id="registerFormSubmitButton"] button');
			buttonSubmit?.click();

			await delay(3000);
			const emailError = await findElementById(driver, 'email-error');
			const passwordError = await findElementById(driver, 'password-error');
			if (emailError || passwordError)
				return {
					message: 'Sai Email hoặc Password ',
					status: 'error',
					data: false
				};
			return {
				message: 'Đã Pinterest',
				status: 'success',
				data: true
			};
		} catch (error: unknown) {
			log.error('Lỗi đăng nhập', error);
			return {
				message: 'Lỗi khởi tạo trình duyệt',
				status: 'error',
				data: false
			};
		}
	};
}

export function handleSearch(_mainWindow: Electron.BrowserWindow) {
	return async (
		_event: Electron.IpcMainInvokeEvent,
		data: IpcBodyInterface['search']
	): Promise<IPCResponseInterface['search']> => {
		try {
			if (!driver)
				return {
					message: 'Chưa có trình duyệt hoặc đã bị đóng',
					status: 'error',
					data: false
				};
			const profile = await findElementByCss(driver, '[data-test-id="header-profile"]');
			if (!profile) {
				const ideas = await findElementByCss(driver, '[data-test-id="ideas-tab"] a');
				log.info('Tìm kiếm kiểu chưa login');
				ideas?.click();
				await delay(2000);
				const input = await findElementByCss(driver, '[data-test-id="search-box-input"]');
				// 3. Xoá nội dung cũ (nếu có)
				await input?.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);

				await delay(200);
				// 4. Nhập từ khoá
				await input?.sendKeys(data.query);
				await delay(300);
				// 5. Gửi phím Enter để tìm kiếm
				await input?.sendKeys(Key.ENTER);
			} else {
				log.info('Tìm kiếm kiểu login');
				const input = await findElementByCss(driver, '[data-test-id="search-box-input"]');
				input?.click();
				await delay(500);
				// 3. Xoá nội dung cũ (nếu có)
				await input?.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);

				await delay(200);
				// 4. Nhập từ khoá
				await input?.sendKeys(data.query);
				await delay(300);
				// 5. Gửi phím Enter để tìm kiếm
				await input?.sendKeys(Key.ENTER);
			}

			return {
				message: 'Đã tìm kiếm',
				status: 'success',
				data: true
			};
		} catch (error: unknown) {
			log.error('Lỗi tìm kiếm bằng text', error);
			return {
				message: 'Lỗi khởi tạo trình duyệt',
				status: 'error',
				data: false
			};
		}
	};
}

export function handleFindImage(mainWindow: Electron.BrowserWindow) {
	return async (
		_event: Electron.IpcMainInvokeEvent,
		data: IpcBodyInterface['findImage']
	): Promise<IPCResponseInterface['findImage']> => {
		try {
			if (!driver)
				return {
					message: 'Chưa có trình duyệt hoặc đã bị đóng',
					status: 'error',
					data: null
				};

			if (data.autoSroll) {
				const list: Set<string> = new Set();
				if (data.autoSroll) {
					const arrTemp = Array.from({ length: 10 });
					let page = 1;

					for (const _ of arrTemp) {
						try {
							const imageElements = (await findElementsByTagName(driver, 'img')) || [];

							for (let i = 0; i < imageElements.length; i++) {
								try {
									const images = await findElementsByTagName(driver, 'img');
									const image = images?.[i];
									if (!image) continue;

									const src = await image.getAttribute('src');
									if (src && !src.includes('60x60')) list.add(src);
								} catch (err) {
									log.warn(`[autoScroll][image] Bỏ qua ảnh bị lỗi: ${err}`);
								}
							}

							sendWebContents(mainWindow, 'findImageAuto', {
								data: Array.from(list),
								page,
								pages: arrTemp.length
							});

							await delay(200);
							await driver.actions().sendKeys(Key.SPACE).perform();
							await delay(500);
							page += 1;
						} catch (err) {
							log.error(`[autoScroll][page ${page}] Lỗi xử lý: ${err}`);
						}
					}
				}

				return {
					message: 'Đã tìm kiếm',
					status: 'success',
					data: Array.from(list)
				};
			} else {
				const list: string[] = [];
				const images = (await findElementsByTagName(driver, 'img')) || [];
				for (const image of images) {
					const src = await image.getAttribute('src');
					if (src && !src.includes('60x60')) {
						list.push(src);
					}
				}

				return {
					message: 'Đã tìm kiếm',
					status: 'success',
					data: list
				};
			}
		} catch (error: unknown) {
			log.error('Lỗi tìm hình ảnh', error);
			return {
				message: 'Lỗi khởi tạo trình duyệt',
				status: 'error',
				data: null
			};
		}
	};
}

export const ipcHandle = {
	handleOpenWeb,
	handleLogin,
	handleSearch,
	handleFindImage
};
