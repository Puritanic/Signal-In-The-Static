const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
	static async build() {
		const browser = await puppeteer.launch({ headless: false });
		const page = await browser.newPage();
		const customPage = new CustomPage(page);

		return new Proxy(customPage, {
			get(target, property) {
				return customPage[property] || browser[property] || page[property];
			},
		});
	}
	constructor(page) {
		this.page = page;
	}

	async login() {
		const user = await userFactory();
		const { session, sig } = sessionFactory(user);

		// Set false cookies to browser instance
		await this.page.setCookie({ name: 'session', value: session });
		await this.page.setCookie({ name: 'session.sig', value: sig });
		// We have to refresh the this.page so that cookies come into effect
		await this.page.goto('localhost:3000');
		// wait for anchor to be rendered (tests are trying to be as fast as possible
		// so this test will fail becuse the test will be finished by the time anchor is rendered)
		await this.page.waitFor('a[href="/auth/logout"]');
		await this.page.goto('localhost:3000/blogs');
	}

	getContentsOf(selector) {
		return this.page.$eval(selector, el => el.innerHTML);
	}

	get(url) {
		return this.page.evaluate(
			_url =>
				fetch(_url, {
					method: 'GET',
					credentials: 'same-origin',
					headers: {
						'Content-Type': 'application/json',
					},
				}).then(res => res.json()),
			url
		);
	}

	post(url, body) {
		return this.page.evaluate(
			(_url, _body) =>
				fetch(_url, {
					method: 'POST',
					credentials: 'same-origin',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(_body),
				}).then(res => res.json()),
			url,
			body
		);
	}
}

module.exports = CustomPage;
