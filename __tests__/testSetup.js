require('../models/User');
const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.promise = global.Promise;
mongoose.connect(
	keys.mongoURI,
	{ useMongoClient: true }
);
