const Keygrip = require('keygrip');
const { Buffer } = require('safe-buffer');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = user => {
	// Trick puppeteer browser that user is logged in
	// We're using keygrip to create cookie and cookie signature
	const sessionObject = { passport: { user: user._id.toString() } };
	const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
	// sig is checking that our cookie is not modified by 3rd party
	const sig = keygrip.sign('session=' + session);
	/*******************************************************************/

	return { session, sig };
};
