const puppeteer = require('puppeteer');

describe('Navigation', () => {
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

	it('should render header correctly', async () => {
		const text = await page.$eval('a.brand-logo', el => el.innerHTML);

		expect(text).toBe('Overload');
	});

	it('should start auth flow on clicking login btn', async () => {
		await page.click('.right a');

		const url = await page.url();

		expect(url).toMatch(/accounts\.google\.com/);
	});

	it('should display correct buttons when user is logged in', async () => {
		// Trick puppeteer browser that user is logged in
		// We're using keygrip to create cookie and cookie signature
		const Keygrip = require('keygrip');
		const { Buffer } = require('safe-buffer');
		const keys = require('../config/keys');
		const id = '5b72cd1604be502a923cd1cb';
		const sessionObject = { passport: { user: id } };
		const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
		const keygrip = new Keygrip([keys.cookieKey]);
		// sig is checking that our cookie is not modified by 3rd party
		const sig = keygrip.sign('session=' + sessionString);
		/*******************************************************************/

		// Set false cookies to browser instance
		await page.setCookie({ name: 'session', value: sessionString });
		await page.setCookie({ name: 'session.sig', value: sig });
		// We have to refresh the page so that cookies come into effect
		await page.goto('localhost:3000');
		// wait for anchor to be rendered (tests are trying to be as fast as possible
		// so this test will fail becuse the test will be finished by the time anchor is rendered)
		await page.waitFor('a[href="/auth/logout"]');

		const logoutText = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

		expect(logoutText).toBe('Logout');
	});
});
