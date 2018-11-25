const axios = require('axios');

const baseUrl = 'https://antrian.imigrasi.go.id';
const buildHeaders = (cookie, customHeaders = {}) =>
  Object.assign(
    {
      Cookie: `JSESSIONID=${cookie}`
    },
    customHeaders
  );

module.exports = (path, method, data, cookie, customHeaders) =>
  axios({
    method,
    // Path always starts with "/"
    url: `${baseUrl}${path}`,
    headers: buildHeaders(cookie, customHeaders),
    data
  });
