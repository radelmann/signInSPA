var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var env = require('./config/env.js');

mongoose.connect(env.db_url);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(passport.initialize());

app.use(express.static('client'));

require('./config/passport')(passport);
require('./routes.js')(app, passport);

app.listen(env.port, function () {
  console.log('listening on port: ' + env.port);
});