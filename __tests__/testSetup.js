jest.setTimeout(30000);

require('../models/User');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const keys = require('../config/keys');

mongoose.promise = global.Promise;
mongoose.connect(
	keys.mongoURI,
	{ useMongoClient: true }
);
