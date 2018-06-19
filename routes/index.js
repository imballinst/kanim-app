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
      expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
      colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    }));
  }

  initNotifRoutes(app);
  initOfficesRoutes(app);
  initQueueRoutes(app);
  initAuthRoutes(app);
};
