import { By, WebDriver, WebElement } from 'selenium-webdriver';

/**
 * Tìm phần tử bằng ID.
 * @param driver - WebDriver instance
 * @param id - ID của phần tử
 * @returns Promise<WebElement>
 */
export const findElementById = async (driver: WebDriver, id: string): Promise<WebElement> =>
    driver.findElement(By.id(id));

/**
 * Tìm phần tử bằng class name.
 * @param driver - WebDriver instance
 * @param className - Tên class của phần tử
 * @returns Promise<WebElement>
 */
export const findElementByClassName = async (driver: WebDriver, className: string): Promise<WebElement> =>
    driver.findElement(By.className(className));

/**
 * Tìm phần tử bằng CSS selector.
 * @param driver - WebDriver instance
 * @param selector - CSS selector của phần tử
 * @returns Promise<WebElement>
 */
export const findElementByCss = async (driver: WebDriver, selector: string): Promise<WebElement> =>
    driver.findElement(By.css(selector));

/**
 * Tìm phần tử bằng Xpath.
 * @param driver - WebDriver instance
 * @param xpath - Xpath của phần tử
 * @returns Promise<WebElement>
 */
export const findElementByXpath = async (driver: WebDriver, xpath: string): Promise<WebElement> =>
    driver.findElement(By.xpath(xpath));

/**
 * Tìm danh sách phần tử bằng class name.
 * @param driver - WebDriver instance
 * @param className - Tên class của phần tử
 * @returns Promise<WebElement[]>
 */
export const findElementsByClassName = async (driver: WebDriver, className: string): Promise<WebElement[]> =>
    driver.findElements(By.className(className));

/**
 * Tìm danh sách phần tử bằng CSS selector.
 * @param driver - WebDriver instance
 * @param selector - CSS selector của phần tử
 * @returns Promise<WebElement[]>
 */
export const findElementsByCss = async (driver: WebDriver, selector: string): Promise<WebElement[]> =>
    driver.findElements(By.css(selector));

/**
 * Tìm danh sách phần tử bằng Xpath.
 * @param driver - WebDriver instance
 * @param xpath - Xpath của phần tử
 * @returns Promise<WebElement[]>
 */
export const findElementsByXpath = async (driver: WebDriver, xpath: string): Promise<WebElement[]> =>
    driver.findElements(By.xpath(xpath));

/**
 * Tìm danh sách phần tử bằng tag name.
 * @param driver - WebDriver instance
 * @param tagName - Tag name của phần tử
 * @returns Promise<WebElement[]>
 */
export const findElementsByTagName = async (driver: WebDriver, tagName: string): Promise<WebElement[]> =>
    driver.findElements(By.tagName(tagName));
