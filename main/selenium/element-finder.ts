import { By, WebDriver, WebElement } from 'selenium-webdriver';
import { log } from '../helpers';

/**
 * Tìm phần tử bằng ID.
 * @param driver - WebDriver instance
 * @param id - ID của phần tử
 * @returns Promise<WebElement>
 */
export const findElementById = async (driver: WebDriver, id: string): Promise<WebElement | null> => {
	try {
		return await driver.findElement(By.id(id));
	} catch (error) {
		log.error(error);
		return null;
	}
};

/**
 * Tìm phần tử bằng class name.
 * @param driver - WebDriver instance
 * @param className - Tên class của phần tử
 * @returns Promise<WebElement>
 */
export const findElementByClassName = async (driver: WebDriver, className: string): Promise<WebElement | null> => {
	try {
		return await driver.findElement(By.className(className));
	} catch (error) {
		log.error(error);
		return null;
	}
};

/**
 * Tìm phần tử bằng CSS selector.
 * @param driver - WebDriver instance
 * @param selector - CSS selector của phần tử
 * @returns Promise<WebElement>
 */
export const findElementByCss = async (driver: WebDriver, selector: string): Promise<WebElement | null> => {
	try {
		return await driver.findElement(By.css(selector));
	} catch (error) {
		log.error(error);
		return null;
	}
};

/**
 * Tìm phần tử bằng Xpath.
 * @param driver - WebDriver instance
 * @param xpath - Xpath của phần tử
 * @returns Promise<WebElement>
 */
export const findElementByXpath = async (driver: WebDriver, xpath: string): Promise<WebElement | null> => {
	try {
		return await driver.findElement(By.xpath(xpath));
	} catch (error) {
		log.error(error);
		return null;
	}
};

/**
 * Tìm danh sách phần tử bằng class name.
 * @param driver - WebDriver instance
 * @param className - Tên class của phần tử
 * @returns Promise<WebElement[]>
 */
export const findElementsByClassName = async (driver: WebDriver, className: string): Promise<WebElement[] | null> => {
	try {
		return await driver.findElements(By.className(className));
	} catch (error) {
		log.error(error);
		return null;
	}
};

/**
 * Tìm danh sách phần tử bằng CSS selector.
 * @param driver - WebDriver instance
 * @param selector - CSS selector của phần tử
 * @returns Promise<WebElement[]>
 */
export const findElementsByCss = async (driver: WebDriver, selector: string): Promise<WebElement[] | null> => {
	try {
		return await driver.findElements(By.css(selector));
	} catch (error) {
		log.error(error);
		return null;
	}
};

/**
 * Tìm danh sách phần tử bằng Xpath.
 * @param driver - WebDriver instance
 * @param xpath - Xpath của phần tử
 * @returns Promise<WebElement[]>
 */
export const findElementsByXpath = async (driver: WebDriver, xpath: string): Promise<WebElement[] | null> => {
	try {
		return await driver.findElements(By.xpath(xpath));
	} catch (error) {
		log.error(error);
		return null;
	}
};

/**
 * Tìm danh sách phần tử bằng tag name.
 * @param driver - WebDriver instance
 * @param tagName - Tag name của phần tử
 * @returns Promise<WebElement[]>
 */
export const findElementsByTagName = async (driver: WebDriver, tagName: string): Promise<WebElement[] | null> => {
	try {
		return await driver.findElements(By.css(tagName));
	} catch (error) {
		log.error(error);
		return null;
	}
};
