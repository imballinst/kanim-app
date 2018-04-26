const initNotifRoutes = require('./notifications');
const initOfficesRoutes = require('./offices');
const initQueueRoutes = require('./queue');
const initAuthRoutes = require('./auth');

module.exports = (app) => {
  initNotifRoutes(app);
  initOfficesRoutes(app);
  initQueueRoutes(app);
  initAuthRoutes(app);
};
