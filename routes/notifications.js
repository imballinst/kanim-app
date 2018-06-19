const { ObjectId } = require('mongodb');

// const { winstonInfo } = require('../lib/logging');
const { find, insertOne, updateOne } = require('../lib/mongo');

module.exports = (app) => {
  app.get('/user/:userID/notification', (req, res) => {
    // get all notification
    res.set('Content-Type', 'application/json');

    const { notified, treshold, session = 'both' } = req.query;

    const queryObject = {
      userID: req.params.userID,
      session: {
        $in: session === 'both' ? ['both', 'morning', 'afternoon'] : [session],
      },
    };

    // conditional queries
    if (notified !== undefined) {
      queryObject.notified = notified === 'true';
    }

    if (treshold !== undefined) {
      queryObject.treshold = { $gte: parseInt(treshold, 10) };
    }

    find(
      app.locals.db,
      'notification',
      queryObject
    )
      .then(({ data }) => res.send({ success: true, data }))
      .catch(err => res.send({ success: false, message: err }));
  });

  app.post('/user/:userID/notification', (req, res) => {
    const { userID } = req.params;

    // add new notification
    res.set('Content-Type', 'application/json');

    insertOne(
      app.locals.db,
      'notification',
      Object.assign({}, req.body, { userID, notified: false, expired: false })
    )
      .then(({ data }) => res.send({ success: true, data }))
      .catch(err => res.send({ success: false, message: err }));
  });

  app.put('/user/:userID/notification/:notificationID', (req, res) => {
    // update a notification
    res.set('Content-Type', 'application/json');

    updateOne(
      app.locals.db,
      'notification',
      { _id: ObjectId(req.params.notificationID) },
      { $set: req.body }
    )
      .then(({ data }) => res.send({ success: true, data }))
      .catch(err => res.send({ success: false, message: err }));
  });
};
