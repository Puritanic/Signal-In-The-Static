const Page = require('./helpers/page');

describe('Blogs', () => {
	let page;

	beforeEach(async () => {
		page = await Page.build();

		await page.goto('localhost:3000');
	});

	afterEach(async () => {
		await page.close();
	});

	it('should see create blog form when logged in', async () => {
		await page.login();
		await page.click('a.btn-floating');

		const label = await page.getContentsOf('form label');

		expect(label).toBe('Blog Title');
	});
});
