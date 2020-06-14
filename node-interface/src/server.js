var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

//公共函数库
const customLib = require('./utils/customLib');

var interfaceOrgUserYJL = require('./routes/interfaceOrgUserYJL');
var interfaceInvestCompanyListYJL = require('./routes/interfaceInvestCompanyListYJL');

var fs = require('fs');

var winston = require('winston');

var app = express();
app.use(cors());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
if (app.get('env') === 'development') {
  app.use(logger('dev'));
}

if (app.get('env') === 'production') {
  var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {
    flags: 'a'
  });
  app.use(logger('combined', {
    stream: accessLogStream
  }));

  winston.add(winston.transports.File, {
    filename: 'app.log'
  });
}

winston.info('Hello again distributed logs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

// 组织机构和用户管理
app.use('/interface/orgUser', interfaceOrgUserYJL);
// 企查查获取投资企业接口
app.use('/interface/qcc', interfaceInvestCompanyListYJL);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000, () => {
	console.log(`The server is running at http://localhost:3000/`); // eslint-disable-line
});
//module.exports = app;