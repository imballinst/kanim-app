// Import modules
const getDate = require('date-fns/getDate');
const getMonth = require('date-fns/getMonth');
const getYear = require('date-fns/getYear');
const isBefore = require('date-fns/isBefore');
const isAfter = require('date-fns/isAfter');

// Environment settings
const {
  NODE_ENV,
  KANIM_USERNAME: username,
  KANIM_PASSWORD: password,
} = require('../config/env');
const { parseJSONIfString } = require('./objectUtil');
const { winstonInfo } = require('./logging');
const { isBetween } = require('./dateUtil');
const {
  postAvailabilityInfo,
  postLogin,
  postListKanim,
} = require('./request');
const { getOfficesQuota } = require('./quota');
const {
  find,
  updateMany,
} = require('./mongo');
const { sendMail } = require('./mail');

const getCookieAndToken = () => postLogin(undefined, username, password)
  .then((res) => {
    const [, jSessionID] = res.headers['set-cookie'][0].split(';')[0].split('=');
    const parsedJSON = parseJSONIfString(res.data);

    return {
      cookie: jSessionID,
      token: parsedJSON.Token,
    };
  });

const getFilteredOffices = (cookie, nameFilter) => postListKanim(cookie).then(response =>
  response.data.Offices.filter(({ MO_NAME }) => MO_NAME.includes(nameFilter)));

const getAvailabilities = (cookie, token, offices, dateRange) => {
  const promises = [];
  const { startDate, endDate } = dateRange;
  // Date params
  const startDateObj = {
    year: getYear(startDate),
    month: getMonth(startDate),
    day: getDate(startDate),
  };
  const endDateObj = {
    year: getYear(endDate),
    month: getMonth(endDate),
    day: getDate(endDate),
  };
  const startParams = `${startDateObj.year}-${startDateObj.month + 1}-${startDateObj.day}`;
  const endParams = `${endDateObj.year}-${endDateObj.month + 1}-${endDateObj.day}`;

  offices.forEach(({ MO_ID }) => {
    promises.push(postAvailabilityInfo(cookie, token, MO_ID, startParams, endParams));
  });

  const officeNames = offices.map(({ MO_NAME }) => MO_NAME).join(', ');
  winstonInfo(`Checking availabilities for ${officeNames}...`);

  return Promise.all(promises);
};

const checkAvailabilities = (db, cookie, token, offices, dateRange) => {
  if (NODE_ENV === 'production' || NODE_ENV === 'test') {
    const collection = NODE_ENV === 'production' ? 'notifications' : 'notif_test';

    return Promise.all([
      find(db, collection, { notified: false, expired: false }),
      getAvailabilities(cookie, token, offices, dateRange),
    ]).then(([dbRes, kanimRes]) => {
      const currentOffices = getOfficesQuota(kanimRes, 'MO_ID', offices, dateRange);
      const mappedOffices = offices.reduce((sum, cur) => {
        const { MO_ID, MO_NAME } = cur;

        return Object.assign(sum, { [MO_ID]: MO_NAME });
      }, {});
      const updatedIDs = [];
      const expiredIDs = [];

      if (dbRes.data.length) {
        const mails = [];

        dbRes.data.forEach(({
          _id: id,
          moID,
          session,
          treshold,
          startDate: innerStart,
          endDate: innerEnd,
          email,
        }) => {
          if (currentOffices[moID]) {
            const { startDate, endDate } = dateRange;

            if (isBefore(innerStart, startDate) && isBefore(innerEnd, endDate)) {
              // Check if expired
              expiredIDs.push(id);
            } else {
              // Not expired yet, because one of there is an intersection
              // from either innerStart and innerEnd
              const includedDates = [];
              const dates = Object.keys(currentOffices[moID]);
              const { length } = dates;
              let continueIterating = true;
              let index = 0;

              while (index < length && continueIterating) {
                const date = dates[index];

                if (isBetween(innerStart, innerEnd, date)) {
                  // If not expired
                  const { morning, afternoon } = currentOffices[moID][date];

                  const isMorningIncluded = morning >= treshold;
                  const isAfternoonIncluded = afternoon >= treshold;
                  const isIncluded = {
                    morning: isMorningIncluded,
                    afternoon: isAfternoonIncluded,
                    both: isMorningIncluded || isAfternoonIncluded,
                  };

                  if (isIncluded[session]) {
                    includedDates.push({ date, morning, afternoon });
                  }
                } else if (isAfter(date, innerEnd)) {
                  // Stop the iteration because it's unnecessary
                  continueIterating = false;
                }

                index += 1;
              }

              if (includedDates.length) {
                mails.push(sendMail(email, id, mappedOffices[moID], includedDates));
              }
            }
          }
        });

        return Promise.all(mails).then((responses) => {
          responses.forEach(({ statusCode, dbID }) => {
            // If response success, update
            if (statusCode === 202) {
              updatedIDs.push(dbID);
            }
          });

          return Promise.all([
            // Update emailed IDs
            updateMany(
              db,
              collection,
              { _id: { $in: updatedIDs } },
              { $set: { notified: true } }
            ),
            // Update expired IDs
            updateMany(
              db,
              collection,
              { _id: { $in: expiredIDs } },
              { $set: { expired: true } }
            ),
          ]);
        }).then(([updateQuery, expireQuery]) => ({
          success: updateQuery.success && expireQuery.success,
          updatedIDs,
          expiredIDs,
        }));
      }

      winstonInfo('No users need to be notified at the moment.');

      return {
        success: false,
        updatedIDs,
        expiredIDs,
      };
    });
  }

  return Promise.resolve();
};

module.exports = {
  getCookieAndToken,
  getFilteredOffices,
  checkAvailabilities,
};
