const fs = require('fs');
const http = require('http');
const redis = require('redis');
const url = require('url');

// Logging setup
const winston = require('winston');
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info',
    }),
  ],
});

/**
 * Returns health status of this process for kubernetes monitoring.
 *
 * @param {IncomingMessage} req - HTTP request message.
 * @param {ServerResponse} res - Response object for HTTP request.
 */
function healthHandler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('ok');
}

/**
 * Returns the current status of this instnace (used by kubernetes to know if this
 * instance is busy processing or not)
 *
 * @param {IncomingMessage} req - HTTP request message.
 * @param {ServerResponse} res - Response object for HTTP request.
 */
function statusHandler(req, res) {
  // if access_state != READY
  // result = HttpResponse(503, "Process is currently unavailable - $(access_state)")
  // else
  // result = HttpResponse("application/json", "{ \"status\": \"$(access_state)\"}")

  // TODO: Replase hard coded an OK response  based on active/inactive.
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('ok');
}

/**
 * Not found response handler.
 *
 * @param {IncomingMessage} req - HTTP request message.
 * @param {ServerResponse} res - Response object for HTTP request.
 */
function notFoundHandler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('ok');
}

const routes = {
  '/healthz': healthHandler,
  '/status': statusHandler,
  '/404': notFoundHandler,
};

logger.info('Starting PRAiSE Web Worker...');

// Create the simple web handler endpoint for system monitoring purposes.
http.createServer((req, res) => {
  let route = url.parse(req.url, true);

  if (!keys(routes).contains(route)) {
    logger.log({message: 'Not found', request: req});
    routes['/404'](req, res);
  } else {
    routes[route](req, res);
  }
}).listen(process.env.PORT || 3000);

// Redis configuration options.
let opts = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: 6379,
  retryStrategy: function(options) {
    if (options.attempt > 10) {
      logger.error('Redis max reconnection attempts exceeded.\nTerminating Process...');
      process.nextTick(() => process.exit(1));
      return undefined;
    }
    let timeout = Math.round((options.attempt * options.attempt) / 10);
    // reconnect after an amount of time (with some back off)
    logger.warn(`Redis connection (${opts.host}:${opts.port}) failed: retrying in ${timeout} seconds ...`);

    return timeout * 1000;
  },
};

logger.info('Connecting to Redis...');
// Connection to redis that executes normal commands.
let cmdClient = redis.createClient(opts);
cmdClient.on('error', logger.log);

// Connection to redis that runs in subscription mode.
let subClient = redis.createClient(opts);
subClient.on('error', logger.log);
