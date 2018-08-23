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
		const text = await page.getContentsOf('a.brand-logo');

		expect(text).toBe('Overload');
	});

	it('should start auth flow on clicking login btn', async () => {
		await page.click('.right a');

		const url = await page.url();

		expect(url).toMatch(/accounts\.google\.com/);
	});

	describe('when user logged in', () => {
		beforeEach(async () => {
			await page.login();
		});

		it('should display correct buttons', async () => {
			const logoutText = await page.getContentsOf('a[href="/auth/logout"]');

			expect(logoutText).toBe('Logout');
		});
	});
});
