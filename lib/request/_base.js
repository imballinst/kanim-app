const axios = require('axios');

const baseUrl = 'https://antrian.imigrasi.go.id';
const buildHeaders = (cookie, customHeaders = {}) =>
  Object.assign(
    {
      Cookie: `JSESSIONID=${cookie}`,
    },
    customHeaders
  );

module.exports = (path, method, data, cookie, customHeaders) => {
  // Validation
  if (typeof path !== 'string') {
    throw new Error('Path must be a string!');
  }

  if (typeof method !== 'string') {
    throw new Error('Method must be a string!');
  }

  if (data !== undefined && typeof data !== 'object') {
    throw new Error('Data must be an object!');
  }

  if (cookie !== undefined && typeof cookie !== 'string') {
    throw new Error('Cookie must be a string!');
  }

  if (customHeaders !== undefined && typeof customHeaders !== 'object') {
    throw new Error('Custom headers must be an object!');
  }

  // Do request if all of these requirements are fulfilled
  return axios({
    method,
    // Path always starts with "/"
    url: `${baseUrl}${path}`,
    headers: buildHeaders(cookie, customHeaders),
    data: ['put', 'post', 'patch'].includes(method.toLowerCase()) && data,
    params: method.toLowerCase() === 'get' && data,
  });
};
