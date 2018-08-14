// Enable only one thread for each slave instance
process.env.UV_THREADPOOL_SIZE = 1;

const cluster = require('cluster');
const crypto = require('crypto');

console.log(cluster.isMaster);

// Is the file being executed in the master mode?
if (cluster.isMaster) {
	// Cause index.js to be executed _again_ but in slave mode
	cluster.fork();
	cluster.fork();
} else {
	// Slave mode. Will act as a server and nothing else
	const express = require('express');
	const app = express();

	app.get('/', (req, res) => {
		crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', hash => {
			res.json(hash).send();
		});
	});

	app.get('/fast', (req, res) => {
		res.send('Fast!');
	});

	app.listen(3000, () => console.info('Server up and running on port 3000'));
}
