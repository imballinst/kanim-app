const request = require('./_base');

const paths = {
  home: '/Authentication.jsp',
  login: '/rest/Authentication.jsp',
  register: '/rest/Registration.jsp',
  resetPassword: '/rest/getForgotpass.jsp',
  checkSession: '/rest/checkSession.jsp'
};

const getHome = () => request('get', paths.home);
const checkSession = (cookie, token) =>
  request(
    paths.checkSession,
    'post',
    {
      Token: token
    },
    cookie
  );

const login = (cookie, username, password) => {
  const data = {
    Username: username,
    Password: password
  };

  return request(paths.login, 'post', cookie, data);
};

const register = (cookie, data) => request(paths.register, 'post', cookie, data);
const resetPassword = (cookie, data) => request(paths.resetPassword, 'post', cookie, data);

module.exports = {
  getHome,
  checkSession,
  login,
  register,
  resetPassword
};
