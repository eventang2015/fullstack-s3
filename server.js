
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	path = require('path');

app.set('view engine', 'ejs');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/contacts')
	.then(() => console.log('mongodb connection successful..'))
	.catch((err) => console.error(err));

var AWS = null;

if (process.env.AWS_ACCESS_KEY_ID
	&& process.env.AWS_SECRET_ACCESS_KEY
	&& process.env.AWS_DEFAULT_REGION
	&& process.env.MY_S3_BUCKET) {
  // uses standard environment variables AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION
  AWS = require('aws-sdk');
  AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });

  // mild hack to pass along non-standard MY_S3_BUCKET
  AWS.myBucket = process.env.MY_S3_BUCKET
  console.log('AWS configured...');
} else {
  console.log('Not using AWS: not all AWS_KEY variables set!');
}

app.use(express.static(__dirname + '/app'));

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

var port = '3000';
app.listen(port, () => {
	console.log('app listening...');
})

var router = express.Router();
router.get('/', (req,res,next) => {
	res.render('index', { title: 'Contact List Application', awsEnabled: (AWS!=null) });
});
app.use('/', router);

var contactsRouter = require('./routes/contacts.js')(AWS);
app.use('/contacts', contactsRouter);

