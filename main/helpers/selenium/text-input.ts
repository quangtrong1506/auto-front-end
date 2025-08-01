import { WebDriver } from 'selenium-webdriver';
import { findElementByCss } from './element-finder';

// Định nghĩa kiểu Result
type Result = {
    error: null | string;
    status: 'success' | 'error';
};

/**
 * Ghi text vào một input trên trang web, trả về Promise<Result>.
 *
 * @param {WebDriver} driver - Đối tượng WebDriver đang điều khiển trình duyệt.
 * @param {string} selector - CSS selector của input mà bạn muốn ghi text vào.
 * @param {string} text - Text bạn muốn điền vào input.
 * @returns {Promise<Result>} - Kết quả thực thi (thành công hoặc lỗi).
 */
export const fillInputField = async (driver: WebDriver, selector: string, text: string): Promise<Result> => {
    try {
        // Tìm phần tử bằng CSS selector
        const inputField = await findElementByCss(driver, selector);

        // Xóa text cũ và ghi text mới
        await inputField.clear();
        await inputField.sendKeys(text);

        return { error: null, status: 'success' }; // Thành công
    } catch (error) {
        return { error: `Không tìm thấy input: ${selector}. Chi tiết lỗi: ${error}`, status: 'error' }; // Lỗi
    }
};
