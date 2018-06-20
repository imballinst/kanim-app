const expressWinston = require('express-winston');
const winston = require('winston');

const { NODE_ENV } = require('../config/env');

const initNotifRoutes = require('./notifications');
const initOfficesRoutes = require('./offices');
const initQueueRoutes = require('./queue');
const initAuthRoutes = require('./auth');

module.exports = (app) => {
  if (NODE_ENV !== 'test') {
    app.use(expressWinston.logger({
      transports: [
        new winston.transports.Console({
          json: true,
          colorize: true,
        }),
      ],
      expressFormat: true,
      colorize: false,
      bodyBlacklist: ['password'],
    }));
  }

  initNotifRoutes(app);
  initOfficesRoutes(app);
  initQueueRoutes(app);
  initAuthRoutes(app);
};
