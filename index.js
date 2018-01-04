require('dotenv').config();

const axios = require('axios');

// List URLS
const urlLogin = 'https://antrian.imigrasi.go.id/Authentication.jsp';
const urlHome = 'https://antrian.imigrasi.go.id/Index.jsp';

const urlRestLogin = 'https://antrian.imigrasi.go.id/rest/Authentication.jsp';
const urlRestListKanim = 'https://antrian.imigrasi.go.id/rest/PostKanim.jsp';
const urlRestCheckSession = 'https://antrian.imigrasi.go.id/rest/checkSession.jsp';
const urlRestAvailabilityInfo = 'https://antrian.imigrasi.go.id/rest/AvailabilityInfo.jsp';

// Helper
const buildHeaders = (cookie, url, dataLength, customHeaders = {}) => ({
  'Host': 'antrian.imigrasi.go.id',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:57.0) Gecko/20100101 Firefox/57.0',
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  'Referer': url,
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Length': `${dataLength}`,
  'Cookie': `JSESSIONID=${cookie}`,
  'Connection': 'keep-alive',
  'Pragma': 'no-cache',
  'Cache-Control': 'no-cache',
});

// Login
const login = (cookie) => {
  const data = {
    Username: process.env.Username,
    Password: process.env.Password,
  };

  return axios({
    method: 'post',
    url: urlRestLogin,
    headers: buildHeaders(cookie, urlRestLogin, JSON.stringify(data).length),
    data
  });
};

// List kantor imigrasi
const getListKanim = (cookie) => axios({
  method: 'post',
  url: urlRestListKanim,
  headers: buildHeaders(cookie, urlHome),
  data: {
    // Sadly this params won't work
    SearchKeyWord: '',
  }
});

// Get session token
const checkSession = (cookie) => axios({
  method: 'post',
  url: urlRestCheckSession,
  headers: buildHeaders(cookie, urlHome)
});

// Get availability info
const getAvailabilityInfo = (cookie, token, kanimID, startDate, endDate) => axios({
  method: 'post',
  url: urlRestAvailabilityInfo,
  headers: buildHeaders(cookie, urlHome),
  data: {
    Token: token,
    KANIM_ID: kanimID,
    START_DATE: startDate,
    END_DATE: endDate,
  }
});

// Main
let cookieContainer;
let tokenContainer;
let kanimsContainer;

axios({
  method: 'get',
  url: urlLogin,
}).then((res) => {
  cookieContainer = res.headers['set-cookie'][0].split(';')[0].split('=')[1];

  return login(cookieContainer);
}).then((res) => {
  const parsedJSON = JSON.parse(res.data);
  tokenContainer = parsedJSON.Token;

  return getListKanim(cookieContainer);
}).then((res) => {
  kanimsContainer = res.data.Offices;

  const kanimID = 20;
  const startDate = '2018-1-4';
  const endDate = '2018-3-5';

  return getAvailabilityInfo(cookieContainer, tokenContainer, kanimID, startDate, endDate);
}).then((res) => {
  console.log(res.data);
}).catch((err) => {
  console.log(err);
});
