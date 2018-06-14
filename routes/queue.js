const { parseJSONIfString } = require('../lib/objectUtil');
const {
  postCheckSession,
  postListQueue,
  postCancelQueue,
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
      postCheckSession(undefined, token).then(({ data }) => {
        const { Success, Message } = parseJSONIfString(data);

        if (Success) {
          return postListQueue(undefined, token, userID);
        }

        return { data: { Message, errorCode: 401 } };
      }).then(({ data }) => {
        const {
          Success, Message, Queues, errorCode,
        } = parseJSONIfString(data);

        res.set('Content-Type', 'application/json');

        if (!Message || Success) {
          response.data = Queues;
          response.success = true;
        } else {
          response.message = Message;
          response.errorCode = errorCode;
        }

        res.send(response);
      }).catch(err => res.send({
        success: false,
        message: err,
      }));
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
      postCheckSession(undefined, token).then(({ data }) => {
        const { Success, Message } = parseJSONIfString(data);

        if (Success) {
          return postCancelQueue(undefined, queueNumber);
        }

        return { data: { Message, errorCode: 401 } };
      }).then(({ data }) => {
        const { Success, Message, errorCode } = parseJSONIfString(data);

        res.set('Content-Type', 'application/json');

        if (!Message || Success) {
          response.success = true;
        } else {
          response.message = Message;
          response.errorCode = errorCode;
        }

        res.send(response);
      }).catch(err => res.send({
        success: false,
        message: err,
      }));
    }
  });
};
