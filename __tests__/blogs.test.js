const Page = require('./helpers/page');

describe('Blogs - ', async () => {
	let page;

	beforeEach(async () => {
		page = await Page.build();
		await page.goto('localhost:3000');
	});

	afterEach(async () => {
		await page.close();
	});

	describe('When logged in', () => {
		beforeEach(async () => {
			await page.login();
			await page.click('a.btn-floating');
		});

		it('User should see create blog form', async () => {
			const label = await page.getContentsOf('form label');

			expect(label).toBe('Blog Title');
		});

		describe('And using valid inputs', async () => {
			beforeEach(async () => {
				await page.type('.title input', 'The Title');
				await page.type('.content input', 'Long content text!');
				await page.click('form button');
			});

			it('should take user to the review screen', async () => {
				const h5 = await page.getContentsOf('h5');

				expect(h5).toBe('Please confirm your entries');
			});

			it('should add blog to the index page after submit and save', async () => {
				await page.click('button.green');
				await page.waitFor('.card');

				const title = await page.getContentsOf('.card-title');
				const content = await page.getContentsOf('.card-title + p');

				expect(title).toBe('The Title');
				expect(content).toBe('Long content text!');
			});
		});

		describe('And using invalid inputs', () => {
			beforeEach(async () => {
				await page.click('form button');
			});

			it('form should show an error message', async () => {
				const errMsg = 'You must provide a value';
				const title = await page.getContentsOf('.title .red-text');
				const content = await page.getContentsOf('.content .red-text');

				expect(title).toBe(errMsg);
				expect(content).toBe(errMsg);
			});
		});
	});

	describe('When not logged in', () => {
		it('user should not be able to crete post', async () => {
			const result = await page.evaluate(() => {
				return fetch('api/blogs', {
					method: 'POST',
					credentials: 'same-origin',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ title: 'Some title', content: 'Some content' }),
				}).then(res => res.json());
			});

			expect(result).toEqual({ error: 'You must log in!' });
		});

		it('user should not be able to get a list of posts', async () => {
			const result = await page.evaluate(() => {
				return fetch('api/blogs', {
					method: 'GET',
					credentials: 'same-origin',
					headers: {
						'Content-Type': 'application/json',
					},
				}).then(res => res.json());
			});

			expect(result).toEqual({ error: 'You must log in!' });
		});
	});
});
