const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
	// This will allow the route handler to run first
	// we will wait for it to execute, and after it's all done
	// then we'll come back here
	// and execute clearHash()
	await next();

	clearHash(req.user.id);
};
