const request = require('./_base');

const paths = {
  login: '/rest/Authentication.jsp',
  register: '/rest/Registration.jsp',
  resetPassword: '/rest/getForgotpass.jsp',
  checkSession: '/rest/checkSession.jsp',
};

const checkSession = (cookie, token) =>
  request(
    paths.checkSession,
    'post',
    {
      Token: token,
    },
    cookie
  );

const login = (cookie, username, password) => {
  const data = {
    Username: username,
    Password: password,
  };

  return request(paths.login, 'post', data, cookie);
};

const register = (cookie, data) => request(paths.register, 'post', data, cookie);
const resetPassword = (cookie, data) => request(paths.resetPassword, 'post', data, cookie);

module.exports = {
  checkSession,
  login,
  register,
  resetPassword,
};
