var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var package = require('../package.json');

var config = package.config;
var app = express();
app.listen(3000);

// app.set('view engine', 'jade');
// app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(config.assetsPublicPath, express.static(path.join(__dirname, 'public')));

var api = require('./api/routes');
app.use('/api/', api);

console.log('NODE_ENV', process.env.NODE_ENV);

