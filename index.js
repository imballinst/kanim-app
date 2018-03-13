require('dotenv').config();

const parse = require('date-fns/parse');
const getDate = require('date-fns/getDate');
const getMonth = require('date-fns/getMonth');
const getYear = require('date-fns/getYear');
const addMonths = require('date-fns/addMonths');
const { CronJob } = require('cron');

const { winstonInfo, winstonError } = require('./lib/logging');
const { formatDate } = require('./lib/dateUtil');
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
const { countAvailable, getQuotaDifference } = require('./lib/parser');

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
let lastOffices = {};
let cookie;
let token;
let offices;

const getAvailabilities = () => getMainPage().then((res) => {
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
  const nameFilter = 'Jakarta';

  offices = res.data.Offices.filter(({ MO_NAME }) => MO_NAME.includes(nameFilter));

  offices.forEach(({ MO_ID }) => {
    promises.push(postAvailabilityInfo(cookie, token, MO_ID, startParams, endParams));
  });

  return Promise.all(promises);
})
  .then((res) => {
    const dateFormat = 'MMM D, YYYY';
    const currentOffices = {};
    let text = '';

    // Fill to currentOffices
    res.forEach(({ data }, idx) => {
      const dates = countAvailable(data.Availability, dateFormat);
      const officeName = offices[idx].MO_NAME;

      if (!currentOffices[officeName]) {
        currentOffices[officeName] = {};
      }

      // list dates and quota each day
      dates.forEach(({ date, morning, afternoon }) => {
        const parsedDate = parse(date, dateFormat, new Date());
        const formattedDate = formatDate(parsedDate);

        currentOffices[officeName][formattedDate] = { morning, afternoon };
      });
    });

    // Check the difference
    if (Object.keys(lastOffices).length !== 0) {
      offices.forEach(({ MO_NAME: officeName }) => {
        const lastOfficesDates = lastOffices[officeName];
        const currentOfficesDates = currentOffices[officeName];

        text += `${officeName}\n`;

        const lastDates = Object.keys(lastOfficesDates);
        const currentDates = Object.keys(currentOfficesDates).reduce((arr, key) => {
          const isExists = lastDates.includes(key);

          return isExists ? arr : arr.concat(key);
        }, []);
        const allDates = lastDates.concat(currentDates);

        // iterate all dates across last offices and current offices
        if (allDates.length) {
          allDates.forEach((date) => {
            const morningDifference = getQuotaDifference(
              lastOfficesDates[date],
              currentOfficesDates[date],
              'morning'
            );
            const afternoonDifference = getQuotaDifference(
              lastOfficesDates[date],
              currentOfficesDates[date],
              'afternoon'
            );
            text += `[${date}] ${morningDifference}, ${afternoonDifference}\n`;
          });
        } else {
          text += `Tidak ada kuota dari ${formatDate(startDate)} ` +
            `hingga ${formatDate(endDate)}\n`;
        }

        text += '-------------------\n';
      });

      winstonInfo(`Rekap:\n${text}`);
    }

    lastOffices = currentOffices;
  })
  .catch((err) => {
    winstonError(err);
  });

// CronJob
const job = new CronJob(
  '0,30 * * * * *',
  getAvailabilities,
  undefined,
  true,
  'Asia/Jakarta'
);
