const { postLogin, postRegister, postResetPassword } = require('../lib/request');
const { parseJSONIfString } = require('../lib/objectUtil');

module.exports = app => {
  app.post('/login', (req, res) => {
    // get all notification
    const response = { success: false };
    const { username, password } = req.body;

    postLogin(undefined, username, password)
      .then(({ data }) => {
        const { Success, Message, Token, errorCode } = parseJSONIfString(data);

        res.set('Content-Type', 'application/json');

        if (Success) {
          response.data = { token: Token, user: parseJSONIfString(Message) };
          response.success = true;
        } else {
          response.message = Message;
          response.errorCode = errorCode;
        }

        res.send(response);
      })
      .catch(({ message }) =>
        res.send({
          success: false,
          message
        })
      );
  });

  app.post('/signup', (req, res) => {
    const response = { success: false };
    const {
      Username: username,
      Password: password,
      NIK: nik,
      Telephone: phone,
      Email: email,
      Alamat: address
    } = req.body;

    postRegister(undefined, {
      Username: username,
      Password: password,
      NIK: nik,
      Telephone: phone,
      Email: email,
      Alamat: address
    })
      .then(({ data }) => {
        const { Message: message, UserId: userID, Success: success } = data;

        if (success) {
          response.success = true;
        } else {
          response.message = message;
        }

        res.send(response);
      })
      .catch(({ message }) =>
        res.send({
          success: false,
          message
        })
      );
  });

  app.post('/reset_password', (req, res) => {
    const response = { success: false };
    const { request: email } = req.body;

    postRegister(undefined, {
      request: email
    })
      .then(({ data }) => {
        const { Message: message, data: userData, Success: success } = data;

        if (success) {
          response.success = true;
          response.data = userData[0];
        } else {
          response.message = message;
        }

        res.send(response);
      })
      .catch(({ message }) =>
        res.send({
          success: false,
          message
        })
      );
  });
};
