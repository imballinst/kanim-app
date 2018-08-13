const { postLogin } = require('../lib/request');
const { parseJSONIfString } = require('../lib/objectUtil');

module.exports = (app) => {
  app.post('/login', (req, res) => {
    // get all notification
    const response = { success: false };
    const { username, password } = req.body;

    postLogin(undefined, username, password).then(({ data }) => {
      const {
        Success, Message, Token, errorCode,
      } = parseJSONIfString(data);

      res.set('Content-Type', 'application/json');

      if (Success) {
        response.data = { token: Token, user: parseJSONIfString(Message) };
        response.success = true;
      } else {
        response.message = Message;
        response.errorCode = errorCode;
      }

      res.send(response);
    }).catch(({ message }) => res.send({
      success: false,
      message,
    }));
  });
};
