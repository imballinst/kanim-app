const { ObjectId } = require('mongodb');

const app = require('../app');
// const { winstonInfo } = require('../lib/logging');
const { find, insertOne, updateOne } = require('../lib/mongo');
const { postAvailabilityInfo, postCheckSession } = require('../lib/requests');
const { getOfficeQuota } = require('../lib/quota');

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

  app.post('/quota/:moID', (req, res) => {
    // get quota for an office
    const { token, startDate, endDate } = req.body;
    const response = { success: false };

    res.set('Content-Type', 'application/json');

    if (!token) {
      response.error = 'Please provide token!';
      res.send(response);
    } else {
      postCheckSession(undefined, token).then(({ data }) => {
        const { Success, Message } = data;

        if (Success) {
          return postAvailabilityInfo(undefined, token, req.params.moID, startDate, endDate);
        }

        return { data: { Message, errorCode: 401 } };
      }).then(({ data }) => {
        const {
          Success, Message, Availability, errorCode,
        } = data;

        if (!Message || Success) {
          const quota = getOfficeQuota(Availability);

          response.data = quota;
          response.success = true;
        } else {
          response.error = Message;
          response.errorCode = errorCode;
        }

        res.send(response);
      });
    }
  });
};
