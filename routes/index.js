const omit = require('lodash/omit');

const { winstonInfo } = require('../lib/logging');
const { NODE_ENV } = require('../config/env');

const initNotifRoutes = require('./notifications');
const initOfficesRoutes = require('./offices');
const initQueueRoutes = require('./queue');
const initAuthRoutes = require('./auth');

module.exports = (app) => {
  if (NODE_ENV !== 'test') {
    app.use((req, _res, next) => {
      const { method, baseUrl, path, query, body } = req;
      let data = method === 'GET' ? query : body;

      // delete password logging
      if (data && data.password) {
        data = omit(data, 'password');
      }

      winstonInfo(`[kanim-app] ${method} ${baseUrl}${path} ${JSON.stringify(data)}`);
      next();
    });
  }

  initNotifRoutes(app);
  initOfficesRoutes(app);
  initQueueRoutes(app);
  initAuthRoutes(app);
};
