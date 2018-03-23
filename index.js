require('dotenv').config();

global.Promise = require('bluebird');

const parse = require('date-fns/parse');
const getDate = require('date-fns/getDate');
const getMonth = require('date-fns/getMonth');
const getYear = require('date-fns/getYear');
const addMonths = require('date-fns/addMonths');
const { CronJob } = require('cron');

const {
  winstonInfo,
  // winstonError,
} = require('./lib/logging');
const { isBetween } = require('./lib/dateUtil');
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
const {
  countAvailable,
  // getQuotaDifference,
} = require('./lib/parser');
const {
  getDatabaseConnection,
  closeDBConnection,
  insertMany,
  deleteMany,
  find,
  updateMany,
} = require('./lib/mongo');
const { sendMail } = require('./lib/mail');

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
const dateFormat = 'MMM D, YYYY';
let cookie;
let token;
let offices;
// let lastOffices;
let client;
let db;

const getAvailabilities = nameFilter => postListKanim(cookie).then((res) => {
  const promises = [];
  const startParams = `${startDateObj.year}-${startDateObj.month + 1}-${startDateObj.day}`;
  const endParams = `${endDateObj.year}-${endDateObj.month + 1}-${endDateObj.day}`;

  offices = res.data.Offices.filter(({ MO_NAME }) => MO_NAME.includes(nameFilter));

  offices.forEach(({ MO_ID }) => {
    promises.push(postAvailabilityInfo(cookie, token, MO_ID, startParams, endParams));
  });

  const officeNames = offices.map(({ MO_NAME }) => MO_NAME).join(', ');
  winstonInfo(`Checking availabilities for ${officeNames}...`);

  return Promise.all(promises);
});

/**
 * getOfficesQuota: get offices quota; with the identifier either MO_ID or MO_NAME
 * res: responses in array
 * property: MO_ID or MO_NAME
 */
const getOfficesQuota = (res, property) => {
  const currentOffices = {};

  // Fill to currentOffices
  res.forEach(({ data }, idx) => {
    const dates = countAvailable(data.Availability, dateFormat);
    const officeIdentifier = offices[idx][property];

    if (!currentOffices[officeIdentifier]) {
      currentOffices[officeIdentifier] = {};
    }

    // list dates and quota each day
    dates.forEach(({ date, morning, afternoon }) => {
      const parsedDate = parse(date, dateFormat, new Date());

      currentOffices[officeIdentifier][parsedDate] = { morning, afternoon };
    });
  });

  // lastOffices = currentOffices;

  return currentOffices;
};

// const printOfficesQuotaDifferences = (currentOffices) => {
//   let text = '';

//   // Check the difference
//   if (lastOffices && Object.keys(lastOffices).length !== 0) {
//     offices.forEach(({ MO_NAME: officeName }) => {
//       const lastOfficesDates = lastOffices[officeName];
//       const currentOfficesDates = currentOffices[officeName];

//       text += `${officeName}\n`;

//       const lastDates = Object.keys(lastOfficesDates);
//       const currentDates = Object.keys(currentOfficesDates).reduce((arr, key) => {
//         const isExists = lastDates.includes(key);

//         return isExists ? arr : arr.concat(key);
//       }, []);
//       const allDates = lastDates.concat(currentDates);

//       // iterate all dates across last offices and current offices
//       if (allDates.length) {
//         allDates.forEach((date) => {
//           const morningDifference = getQuotaDifference(
//             lastOfficesDates[date],
//             currentOfficesDates[date],
//             'morning'
//           );
//           const afternoonDifference = getQuotaDifference(
//             lastOfficesDates[date],
//             currentOfficesDates[date],
//             'afternoon'
//           );
//           text += `[${date}] ${morningDifference}, ${afternoonDifference}\n`;
//         });
//       } else {
//         text += `Tidak ada kuota dari ${formatDate(startDate)} ` +
//         `hingga ${formatDate(endDate)}\n`;
//       }

//       text += '-------------------\n';
//     });

//     winstonInfo(`Rekap:\n${text}`);
//   }
// };

const checkAvailabilities = (dbObject, nameFilter) => Promise.all([
  find(dbObject, 'notifications', { notified: false }),
  getAvailabilities(nameFilter),
]).then(([dbRes, array]) => {
  const currentOffices = getOfficesQuota(array, 'MO_ID');
  const mappedOffices = offices.reduce((sum, cur) => {
    const { MO_ID, MO_NAME } = cur;

    return Object.assign(sum, { [MO_ID]: MO_NAME });
  }, {});

  if (dbRes.data.length) {
    const updatedIDs = [];

    dbRes.data.forEach(({
      _id: id,
      mo_id: moID,
      // session,
      start_date: innerStart,
      end_date: innerEnd, email,
    }) => {
      if(currentOffices[moID]) {
        const includedDates = [];

        Object.keys(currentOffices[moID]).forEach((date) => {
          if (isBetween(innerStart, innerEnd, date)) {
            const { morning, afternoon } = currentOffices[moID][date];

            includedDates.push({ date, morning, afternoon });
          }
        });

        if (includedDates.length) {
          sendMail(email, mappedOffices[moID], includedDates);
          updatedIDs.push(id);
        }
      }
    });

    updateMany(
      dbObject, 'notifications',
      { _id: { $in: updatedIDs } },
      { $set: { notified: true } }
    );
  } else {
    winstonInfo('No users need to be notified at the moment.');
  }
});

// Main application
getMainPage().then((res) => {
  const [, jSessionID] = res.headers['set-cookie'][0].split(';')[0].split('=');
  cookie = jSessionID;

  return postLogin(cookie);
}).then((res) => {
  const parsedJSON = JSON.parse(res.data);
  token = parsedJSON.Token;

  return getDatabaseConnection();
}).then(({ mongoClient, clientDb }) => {
  client = mongoClient;
  db = clientDb;

  return deleteMany(db, 'notifications');
})
  .then(() => insertMany(db, 'notifications', [
    {
      email: 'ballinst@gmail.com',
      mo_id: 20,
      session: 'morning',
      start_date: new Date(2018, 2, 20),
      end_date: new Date(2018, 3, 20),
      notified: false,
    }, {
      email: 'ballinst@gmail.com',
      mo_id: 21,
      session: 'afternoon',
      start_date: new Date(2018, 2, 20),
      end_date: new Date(2018, 3, 20),
      notified: false,
    },
  ]))
  .then(() => {
  // CronJob
    const job = new CronJob(
      '0,30 * * * * *',
      () => checkAvailabilities(db, 'Jakarta'),
      () => closeDBConnection(client),
      true,
      'Asia/Jakarta'
    );
  });
