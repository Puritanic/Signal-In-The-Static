const util = require('util');
const mongoose = require('mongoose');
const redis = require('redis');

const redisURL = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisURL);

// Modify redis get func to use promises instead of callbacks
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

// Example of monkey patching third patching lib
// We're injecting our redis cache check before mongoose exec method is executed
mongoose.Query.prototype.exec = async function() {
	// Create unique key with query contents and collection name
	const uniqueKey = JSON.stringify(
		Object.assign({}, this.getQuery(), {
			collection: this.mongooseCollection.name,
		})
	);

	// Do we have any cached data in redis related to this query?
	const cacheValue = await client.get(uniqueKey);
	// if yes, respond to request right away and return
	if (cacheValue) {
		console.log('From cache ');
		const doc = JSON.parse(cacheValue);

		// NOTE: Mongoose expects mongoose document to be returned, so we have to
		// transform data received from redis to be of the right type, we can transform
		// this data by wrapping it with this.model constructor
		return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc);
	}
	// if no, we need to respond to request and update our cache to store the data
	const result = await exec.apply(this, arguments);
	console.log(result);

	client.set(uniqueKey, JSON.stringify(result));

	return result;
};
