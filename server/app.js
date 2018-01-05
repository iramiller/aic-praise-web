const express = require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Logging setup
const winston = require('winston');
const expressWinston = require('express-winston');
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info',
    }),
  ],
});

let index = require('./routes/index');
let users = require('./routes/users');

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
}));

// Add routers.
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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
