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
