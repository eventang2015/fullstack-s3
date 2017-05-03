
var express = require('express');

var Contact = require('../models/Contact.js');

var router = express.Router();

router.get('/', (req,res,next) => {
	Contact.find( (err,contacts) => {
		if (err) return next(err);
		res.json(contacts);
	});
});
router.post('/', (req,res,next) => {
	Contact.create(req.body, (err,post) => {
		if (err) return next(err);
		res.json(post);
	});
});
router.get('/:id', (req,res,next) => {
	Contact.findById( req.params.id, (err,post) => {
		if (err) return next(err);
		res.json(post);
	});
});
router.put('/:id', (req,res,next) => {
	Contact.findByIdAndUpdate( req.params.id, req.body, {new: true}, (err, post) => {
		if (err) return next(err);
		res.json(post);
	});
});
router.delete('/:id', (req,res,next) => {
	Contact.findByIdAndRemove(req.params.id, req.body, (err,post) => {
		if (err) return next(err);
		res.json(post);
	});
});

module.exports = function(AWS) {
	if (AWS) {
		var myBucket = AWS.myBucket;
		router.post('/:id/s3url', (req,res,next) => {
			var putOptions = { Bucket: myBucket, Key: req.params.id };
			var s3 = new AWS.S3({signatureVersion: 'v4'});
			s3.getSignedUrl('putObject', putOptions, (err,url) => {
				if (err) return next(err);
				res.status(200).send({url: url});
			});
		});
		router.get('/:id/s3url', (req,res,next) => {
		        var getOptions = { Bucket: myBucket, Key: req.params.id };
			var s3 = new AWS.S3();
			s3.getSignedUrl('getObject', getOptions, (err,url) => {
				if (err) return next(err);
				res.status(200).send({url: url});
			});
		});
	}
	return router;
}

