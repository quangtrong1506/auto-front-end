/**
 * Tạo WebDriver ổn định bằng PATH trick (tránh lỗi ServiceBuilder/TypeScript).
 * - Thêm thư mục chứa driver vào PATH rồi build bình thường.
 */

import path from 'path';
import { Builder, WebDriver } from 'selenium-webdriver';
import type { BrowserKind } from './driver-manager';
import { ensureDriver } from './driver-manager';

/** Map BrowserKind → tên browser cho selenium-webdriver */
function toSeleniumName(browser: BrowserKind): string {
	if (browser === 'ie') return 'internet explorer';
	if (browser === 'edge') return 'MicrosoftEdge'; // selenium mới vẫn hiểu 'MicrosoftEdge'
	if (browser === 'safari') return 'safari';
	if (browser === 'opera') return 'opera';
	if (browser === 'firefox') return 'firefox';
	return 'chrome';
}

/**
 * Tạo WebDriver:
 * - Tự tải driver nếu thiếu (lazy)
 * - Thêm PATH để Selenium tự nhận
 * - Trả về instance WebDriver
 */
export async function createDriver(
	browser: BrowserKind,
	onProgress?: Parameters<typeof ensureDriver>[1]
): Promise<WebDriver> {
	const driverPath = await ensureDriver(browser, onProgress);
	const dir = path.dirname(driverPath);

	// Append vào PATH (ưu tiên thư mục driver trước)
	if (process.platform === 'win32') process.env.PATH = `${dir};${process.env.PATH || ''}`;
	else process.env.PATH = `${dir}:${process.env.PATH || ''}`;

	// Build
	const driver = await new Builder().forBrowser(toSeleniumName(browser)).build();
	return driver;
}
