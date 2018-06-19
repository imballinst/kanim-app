const { winstonInfo } = require('../lib/logging');
const { NODE_ENV } = require('../config/env');

const initNotifRoutes = require('./notifications');
const initOfficesRoutes = require('./offices');
const initQueueRoutes = require('./queue');
const initAuthRoutes = require('./auth');

module.exports = (app) => {
  if (NODE_ENV !== 'test') {
    app.use((req, res, next) => {
      const { method, originalUrl, query, body } = req;
      const data = method === 'GET' ? query : body;

      // delete password logging
      if (data && data.password) {
        delete data.password;
      }

      winstonInfo(`[kanim-app] ${method} ${originalUrl} ${JSON.stringify(data)}`);
      next();
    });
  }

  initNotifRoutes(app);
  initOfficesRoutes(app);
  initQueueRoutes(app);
  initAuthRoutes(app);
};
