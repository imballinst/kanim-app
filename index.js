require('dotenv').config();

const winston = require('winston');
const format = require('date-fns/format');
const {
  getMainPage,
  postAvailabilityInfo,
  // postCancelQueue,
  // postCheckSession,
  // postListQueue,
  postLogin,
  postListKanim,
  // postQuotaInfo,
  // postRegisterQueue,
} = require('./lib/requests');
const { countAvailable } = require('./lib/parser');

// Main
const startDateObj = { year: 2018, month: 0, day: 5 };
const endDateObj = { year: 2018, month: 0, day: 6 };
let cookie;
let token;
let offices;

getMainPage().then((res) => {
  const [, jSessionID] = res.headers['set-cookie'][0].split(';')[0].split('=');
  cookie = jSessionID;

  return postLogin(cookie);
}).then((res) => {
  const parsedJSON = JSON.parse(res.data);
  token = parsedJSON.Token;

  return postListKanim(cookie);
}).then((res) => {
  offices = res.data.Offices;

  const promises = [];
  const startDate = `${startDateObj.year}-${startDateObj.month}-${startDateObj.day}`;
  const endDate = `${endDateObj.year}-${endDateObj.month}-${endDateObj.day}`;

  offices.forEach(({ MO_ID }) => {
    promises.push(postAvailabilityInfo(cookie, token, MO_ID, startDate, endDate));
  });

  return Promise.all(promises);
})
  .then((res) => {
    res.forEach((r, idx) => {
      const { morning, afternoon } = countAvailable(r.data.Availability);

      if (morning && afternoon) {
        const { year, month, day } = startDateObj;
        const formattedDate = format(new Date(year, month, day), 'DD MMMM YYYY');

        winston.info(`${offices[idx].MO_NAME} - ${formattedDate}`);
        winston.info(`morning: ${morning}, afternoon: ${afternoon}`);
        winston.info('-------------------');
      }
    });
  })
  .catch((err) => {
    winston.error(err);
  });
