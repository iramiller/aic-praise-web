const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Logging setup
const winston = require('winston');
const expressWinston = require('express-winston');
const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: () => (new Date()).toLocaleTimeString(),
      colorize: true,
      level: 'info',
    }),
  ],
});

let index = require('./routes/index');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// express-winston logger makes sense BEFORE the routers.
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: false,
  msg: '{{res.statusCode}} {{req.method}} {{req.url}} - {{res.responseTime}}ms',
}));

// Add routers.
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.statusCode = 404;
  res.statusMessage = 'Not Found';
});


// express-winston errorLogger makes sense AFTER the router.
app.use(expressWinston.errorLogger({
  winstonInstance: logger,
}));

// generic http error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = (process.env.NODE_ENV !== 'production' ? err : {});

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
