const axios = require('axios');

// List URLS
const urlLogin = 'https://antrian.imigrasi.go.id/Authentication.jsp';

// n/a
const urlRestRegister = 'https://antrian.imigrasi.go.id/rest/Registration.jsp';
const urlRestLogin = 'https://antrian.imigrasi.go.id/rest/Authentication.jsp';
const urlRestListKanim = 'https://antrian.imigrasi.go.id/rest/PostKanim.jsp';
const urlRestCheckSession = 'https://antrian.imigrasi.go.id/rest/checkSession.jsp';
const urlRestAvailabilityInfo = 'https://antrian.imigrasi.go.id/rest/AvailabilityInfo.jsp';
const urlRestQuotaInfo = 'https://antrian.imigrasi.go.id/rest/QuotaInfo.jsp';
const urlRestRegisterQueue = 'https://antrian.imigrasi.go.id/rest/RegisterQueue.jsp';
const urlRestListQueue = 'https://antrian.imigrasi.go.id/rest/ListQueue.jsp';
const urlRestCancelQueue = 'https://antrian.imigrasi.go.id/rest/CancelQueue.jsp';

// Helper
const buildHeaders = (cookie, customHeaders = {}) => Object.assign({
  Cookie: `JSESSIONID=${cookie}`,
}, customHeaders);

// Request Functions
const getMainPage = () => axios({
  method: 'get',
  url: urlLogin,
});

const postAvailabilityInfo = (cookie, token, kanimID, startDate, endDate) => axios({
  method: 'post',
  url: urlRestAvailabilityInfo,
  headers: buildHeaders(cookie),
  data: {
    Token: token,
    KANIM_ID: kanimID,
    START_DATE: startDate,
    END_DATE: endDate,
  },
});

const postCheckSession = (cookie, token) => axios({
  method: 'post',
  url: urlRestCheckSession,
  headers: buildHeaders(cookie),
  data: {
    Token: token,
  },
});

const postRegister = (cookie, data) => axios({
  method: 'post',
  url: urlRestRegister,
  headers: buildHeaders(cookie),
  data,
});

const postLogin = (cookie, username, password) => {
  const data = {
    Username: username,
    Password: password,
  };

  return axios({
    method: 'post',
    url: urlRestLogin,
    headers: buildHeaders(cookie),
    data,
  });
};

const postListKanim = cookie => axios({
  method: 'post',
  url: urlRestListKanim,
  headers: buildHeaders(cookie),
  data: {
    // Sadly this params won't work
    SearchKeyWord: '',
  },
});

const postQuotaInfo = (cookie, token, kanimID, date, startHr, endHr) => axios({
  method: 'post',
  url: urlRestQuotaInfo,
  headers: buildHeaders(cookie),
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
  headers: buildHeaders(cookie),
  data: {
    JumlahPemohon: applicantCount,
    Token: token,
    UserId: userID,
    DetailTimingId: tID,
    NAMA_PENGANTRI_1: name,
    NIK_PENGANTRI_1: nik,
  },
});

const postListQueue = (cookie, token, userID) => axios({
  method: 'post',
  url: urlRestListQueue,
  headers: buildHeaders(cookie),
  data: {
    Token: token,
    UserId: userID,
  },
});

const postCancelQueue = (cookie, queueNumber) => axios({
  method: 'post',
  url: urlRestCancelQueue,
  headers: buildHeaders(cookie),
  data: {
    NO_ANTRIAN: queueNumber,
  },
});

module.exports = {
  getMainPage,
  postAvailabilityInfo,
  postCheckSession,
  postLogin,
  postListKanim,
  postQuotaInfo,
  postRegister,
  postListQueue,
  postRegisterQueue,
  postCancelQueue,
};
