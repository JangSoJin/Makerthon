var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var redis = require('redis');
var JSON = require('JSON');
//var client = redis.createClient(6379, '127.0.0.1');
var client = redis.createClient(6380, 'elrois.redis.cache.windows.net', {
    auth_pass: 'bnBvbX+Ii02JxsxegBxi292MiV7mBfCRafwWJt4KeWM=',
    tls: {
        servername: 'elrois.redis.cache.windows.net'
    }
});

/*
var firebase = require('firebase');
var admin = require('firebase-admin');

var config = {
    apiKey: "AIzaSyDwt2S42-VF1Yp7WcB-0-toK_OiXSNW3X4",
    authDomain: "makerthon-157bf.firebaseapp.com",
    databaseURL: "https://makerthon-157bf.firebaseio.com/",
    storageBucket: "gs://makerthon-157bf.appspot.com/"
};
firebase.initializeApp(config);
*/

var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var guard = require('./routes/guard');
var data = require('./routes/data');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    req.cache = client;
    next();
});

app.use('/', index);
app.use('/users', users);
app.use('/auth', auth);
app.use('/guard', guard);
app.use('/data', data);
app.post('/flush', function(req, res) {
    client.flushdb(function(error, succeeded) {
        res.json({ reply: succeeded });
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
