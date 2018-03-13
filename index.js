require('dotenv').config();

const winston = require('winston');
const format = require('date-fns/format');
const parse = require('date-fns/parse');
const idLocale = require('date-fns/locale/id');
const getDate = require('date-fns/getDate');
const getMonth = require('date-fns/getMonth');
const getYear = require('date-fns/getYear');
const addMonths = require('date-fns/addMonths');
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
const startDate = new Date();
const startDateObj = {
  year: getYear(startDate),
  month: getMonth(startDate),
  day: getDate(startDate),
};
const endDate = addMonths(startDate, 3);
const endDateObj = {
  year: getYear(endDate),
  month: getMonth(endDate),
  day: getDate(endDate),
};
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
  const promises = [];
  const startParams = `${startDateObj.year}-${startDateObj.month + 1}-${startDateObj.day}`;
  const endParams = `${endDateObj.year}-${endDateObj.month + 1}-${endDateObj.day}`;
  const nameFilter = 'karta';

  offices = res.data.Offices.filter(({ MO_NAME }) => MO_NAME.includes(nameFilter));

  offices.forEach(({ MO_ID }) => {
    promises.push(postAvailabilityInfo(cookie, token, MO_ID, startParams, endParams));
  });

  return Promise.all(promises);
})
  .then((res) => {
    const dateFormat = 'MMM D, YYYY';
    let text = '';

    res.forEach(({ data }, idx) => {
      const dates = countAvailable(data.Availability, dateFormat);

      text += `${offices[idx].MO_NAME}\n`;

      dates.forEach((dateElement) => {
        const parsedDate = parse(dateElement.date, dateFormat, new Date());
        const formattedDate = format(parsedDate, 'DD MMMM YYYY', { locale: idLocale });

        text += `[${formattedDate}] pagi: ${dateElement.morning}` +
          `, siang: ${dateElement.afternoon}\n`;
      });

      text += '-------------------\n';
    });

    winston.info(`Rekap:\n${text}`);
  })
  .catch((err) => {
    winston.error(err);
  });
