import chromedriver from 'chromedriver';
import * as webdriver from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

const { Builder, Browser } = webdriver;

export const createDriver = async () => {
	const serviceBuilder = new chrome.ServiceBuilder(chromedriver.path);
	return await new Builder().forBrowser(Browser.CHROME).setChromeService(serviceBuilder).build();
};
