const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');

// I had to update region because S3 was keeping signing urls for a global AWS
AWS.config.update({ region: 'eu-central-1' });

const S3 = new AWS.S3({
	accessKeyId: keys.S3AccessKeyId,
	secretAccessKey: keys.S3SecretAccessKey,
});

module.exports = app => {
	app.get('/api/upload', requireLogin, (req, res) => {
		const fileKey = `${req.user.id}/${uuid()}.jpeg`;
		S3.getSignedUrl(
			'putObject',
			{
				Bucket: 'signal-in-the-static',
				ContentType: 'image/jpeg',
				Key: fileKey,
			},
			(err, url) => res.json({ fileKey, url })
		);
	});
};
