const { parseJSONIfString } = require('../lib/objectUtil');
const {
  checkSession, getQueues, registerQueue, deleteQueue,
} = require('../lib/request');

module.exports = (app) => {
  app.get('/queue', (req, res) => {
    const token = req.headers['x-imm-token'];
    const { userID } = req.query;
    const response = { success: false };

    if (!token) {
      response.message = 'Please provide token!';
      res.send(response);
    } else {
      checkSession(undefined, token)
        .then(({ data }) => {
          const { Success, Message, jumlah } = parseJSONIfString(data);

          if (Success) {
            return Promise.all([getQueues(undefined, token, userID), jumlah]);
          }

          return { data: { Message, errorCode: 401 } };
        })
        .then(([{ data }, queuesUsed]) => {
          const {
            Success, Message, Queues, errorCode,
          } = parseJSONIfString(data);

          res.set('Content-Type', 'application/json');

          if (!Message || Success) {
            response.data = { queues: Queues, queuesUsed };
            response.success = true;
          } else {
            response.message = Message;
            response.errorCode = errorCode;
          }

          res.send(response);
        })
        .catch(({ message }) => res.send({ success: false, message }));
    }
  });

  app.post('/queue', (req, res) => {
    // get quota for an office
    const token = req.headers['x-imm-token'];
    const {
      applicantCount, userID, timingID, name, nik,
    } = req.body;
    const response = { success: false };

    res.set('Content-Type', 'application/json');

    if (!token) {
      response.message = 'Please provide token!';
      res.send(response);
    } else {
      checkSession(undefined, token)
        .then(({ data }) => {
          const { Success, Message, jumlah } = parseJSONIfString(data);

          if (Success && jumlah < 5) {
            return registerQueue(undefined, applicantCount, token, userID, timingID, name, nik);
          } else if (Success && jumlah === 5) {
            return { data: { Message: 'Kuota habis', errorCode: 400 } };
          }

          return { data: { Message, errorCode: 401 } };
        })
        .then(({ data }) => {
          const {
            Message, NO_ANTRIAN, Success, errorCode,
          } = parseJSONIfString(data);

          if (!Message || Success) {
            response.data = { queueNumber: NO_ANTRIAN };
            response.success = true;
          } else {
            response.message = Message;
            response.errorCode = errorCode;
          }

          res.send(response);
        })
        .catch(({ message }) => res.send({ success: false, message }));
    }
  });

  app.delete('/queue/:queueNumber', (req, res) => {
    const token = req.headers['x-imm-token'];
    const { queueNumber } = req.params;
    const response = { success: false };

    if (!token) {
      response.message = 'Please provide token!';
      res.send(response);
    } else {
      checkSession(undefined, token)
        .then(({ data }) => {
          const { Success, Message } = parseJSONIfString(data);

          if (Success) {
            return deleteQueue(undefined, queueNumber);
          }

          return { data: { Message, errorCode: 401 } };
        })
        .then(({ data }) => {
          const { Success, Message, errorCode } = parseJSONIfString(data);

          res.set('Content-Type', 'application/json');

          if (!Message || Success) {
            response.success = true;
          } else {
            response.message = Message;
            response.errorCode = errorCode;
          }

          res.send(response);
        })
        .catch(({ message }) => res.send({ success: false, message }));
    }
  });
};
