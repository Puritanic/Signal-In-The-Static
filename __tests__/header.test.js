const puppeteer = require('puppeteer');

describe('Setup', () => {
	let browser;
	let page;

	beforeEach(async () => {
		browser = await puppeteer.launch({ headless: false });
		page = await browser.newPage();

		await page.goto('localhost:3000');
	});

	afterEach(async () => {
		await browser.close();
	});

	it('should launch a browser ', async () => {
		const text = await page.$eval('a.brand-logo', el => el.innerHTML);

		expect(text).toBe('Overload');
	});
});
