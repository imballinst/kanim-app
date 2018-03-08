const axios = require('axios');

// List URLS
const urlLogin = 'https://antrian.imigrasi.go.id/Authentication.jsp';
const urlHome = 'https://antrian.imigrasi.go.id/Index.jsp';

const urlRestLogin = 'https://antrian.imigrasi.go.id/rest/Authentication.jsp';
const urlRestListKanim = 'https://antrian.imigrasi.go.id/rest/PostKanim.jsp';
const urlRestCheckSession = 'https://antrian.imigrasi.go.id/rest/checkSession.jsp';
const urlRestAvailabilityInfo = 'https://antrian.imigrasi.go.id/rest/AvailabilityInfo.jsp';
const urlRestQuotaInfo = 'https://antrian.imigrasi.go.id/rest/QuotaInfo.jsp';
const urlRestRegisterQueue = 'https://antrian.imigrasi.go.id/rest/RegisterQueue.jsp';
const urlRestListQueue = 'https://antrian.imigrasi.go.id/rest/ListQueue.jsp';
const urlRestCancelQueue = 'https://antrian.imigrasi.go.id/rest/CancelQueue.jsp';

// Helper
const buildHeaders = (cookie, url, dataLength, customHeaders = {}) => Object.assign({
  Host: 'antrian.imigrasi.go.id',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:57.0) Gecko/20100101 Firefox/57.0',
  Accept: 'application/json',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  Referer: url,
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Length': `${dataLength}`,
  Cookie: `JSESSIONID=${cookie}`,
  Connection: 'keep-alive',
  Pragma: 'no-cache',
  'Cache-Control': 'no-cache',
}, customHeaders);

// Request Functions
const getMainPage = () => axios({
  method: 'get',
  url: urlLogin,
});

const postAvailabilityInfo = (cookie, token, kanimID, startDate, endDate) => axios({
  method: 'post',
  url: urlRestAvailabilityInfo,
  headers: buildHeaders(cookie, urlHome),
  data: {
    Token: token,
    KANIM_ID: kanimID,
    START_DATE: startDate,
    END_DATE: endDate,
  },
});

const postCancelQueue = (cookie, queueString) => axios({
  method: 'post',
  url: urlRestCancelQueue,
  headers: buildHeaders(cookie, urlHome),
  data: {
    NO_ANTRIAN: queueString,
  },
});

const postCheckSession = cookie => axios({
  method: 'post',
  url: urlRestCheckSession,
  headers: buildHeaders(cookie, urlHome),
});

const postListQueue = (cookie, token, userID) => axios({
  method: 'post',
  url: urlRestListQueue,
  headers: buildHeaders(cookie, urlHome),
  data: {
    Token: token,
    UserId: userID,
  },
});

const postLogin = (cookie) => {
  const data = {
    Username: process.env.Username,
    Password: process.env.Password,
  };

  return axios({
    method: 'post',
    url: urlRestLogin,
    headers: buildHeaders(cookie, urlRestLogin, JSON.stringify(data).length),
    data,
  });
};

const postListKanim = cookie => axios({
  method: 'post',
  url: urlRestListKanim,
  headers: buildHeaders(cookie, urlHome),
  data: {
    // Sadly this params won't work
    SearchKeyWord: '',
  },
});

const postQuotaInfo = (cookie, token, kanimID, date, startHr, endHr) => axios({
  method: 'post',
  url: urlRestQuotaInfo,
  headers: buildHeaders(cookie, urlHome),
  data: {
    Token: token,
    KANIM_ID: kanimID,
    REQUESTED_DATE: date,
    START_HOUR: startHr,
    END_HOUR: endHr,
  },
});

const postRegisterQueue = (cookie, applicantCount, token, userID, tID, name, nik) => axios({
  method: 'post',
  url: urlRestRegisterQueue,
  headers: buildHeaders(cookie, urlHome),
  data: {
    JumlahPemohon: applicantCount,
    Token: token,
    UserId: userID,
    DetailTimingId: tID,
    NAMA_PENGANTRI_1: name,
    NIK_PENGANTRI_1: nik,
  },
});

module.exports = {
  getMainPage,
  postAvailabilityInfo,
  postCancelQueue,
  postCheckSession,
  postListQueue,
  postLogin,
  postListKanim,
  postQuotaInfo,
  postRegisterQueue,
};
