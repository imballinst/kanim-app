const app = require('../app');
// const { winstonInfo } = require('../lib/logging');
const { find, insertOne, updateOne } = require('../lib/mongo');

module.exports = () => {
  app.get('/user/:userID/notification', (req, res) => {
    // get all notification
    res.set('Content-Type', 'application/json');

    find(
      app.locals.db,
      'notification',
      { userID: req.params.userID }
    )
      .then(({ data }) => res.send({ success: true, data }))
      .catch(err => res.send({ success: false, data: err }));
  });

  app.post('/user/:userID/notification', (req, res) => {
    // add new notification
    res.set('Content-Type', 'application/json');

    insertOne(
      app.locals.db,
      'notification',
      Object.assign({}, req.body, { notified: false })
    )
      .then(({ data }) => res.send({ success: true, data }))
      .catch(err => res.send({ success: false, data: err }));
  });

  app.post('/user/:userID/notification/:notificationID', (req, res) => {
    // update a notification
    res.set('Content-Type', 'application/json');

    updateOne(
      app.locals.db,
      'notification',
      { _id: req.params.notificationID },
      { $set: req.body }
    )
      .then(({ data }) => res.send(data))
      .catch(err => res.send(err));
  });
};
