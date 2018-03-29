const { ObjectId } = require('mongodb');

const app = require('../app');
// const { winstonInfo } = require('../lib/logging');
const { find, insertOne, updateOne } = require('../lib/mongo');

module.exports = () => {
  app.get('/user/:userID/notification', (req, res) => {
    // get all notification
    res.set('Content-Type', 'application/json');

    const queryObject = { userID: parseInt(req.params.userID, 10) };

    // query params
    if (req.query.notified !== undefined) {
      queryObject.notified = req.query.notified === 'true';
    }

    find(
      app.locals.db,
      'notification',
      queryObject
    )
      .then(({ data }) => {
        res.send({ success: true, data });
      })
      .catch(err => res.send({ success: false, error: err }));
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
      .catch(err => res.send({ success: false, error: err }));
  });

  app.post('/user/:userID/notification/:notificationID', (req, res) => {
    // update a notification
    res.set('Content-Type', 'application/json');

    updateOne(
      app.locals.db,
      'notification',
      { _id: ObjectId(req.params.notificationID) },
      { $set: req.body }
    )
      .then(({ data }) => res.send({ success: true, data }))
      .catch(err => res.send({ success: false, error: err }));
  });
};
