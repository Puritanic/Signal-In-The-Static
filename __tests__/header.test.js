const Page = require('./helpers/page');

describe('Navigation', () => {
	let page;

	beforeEach(async () => {
		page = await Page.build();
		await page.goto('localhost:3000');
	});

	afterEach(async () => {
		await page.close();
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
		await page.login();

		const logoutText = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

		expect(logoutText).toBe('Logout');
	});
});
