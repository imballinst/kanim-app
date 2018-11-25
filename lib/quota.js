const addDays = require('date-fns/addDays');
const parse = require('date-fns/parse');
const format = require('date-fns/format');
const isAfter = require('date-fns/isAfter');

const { parseJSONIfString } = require('./objectUtil');

// Helper functions
const isInMorning = (time) => {
  // time: various from 3 to 4 digits, ie. 911, 0911, or 0900
  // 0900 if parsed to integer will be 9, that's why we multiply it by 100
  const timeString = time.toString();
  let timeInt = parseInt(timeString, 10);

  if (timeString.length <= 2) {
    timeInt *= 100;
  }

  return timeInt <= 1200;
};

// Main functions
const countAvailable = (availability) => {
  const dates = {};

  // Iterate and aggregate availabilities
  availability.forEach(({ MD_MULAI, MD_AVAILABILITY, MT_TANGGAL }) => {
    const element = dates[MT_TANGGAL];

    // if not defined, define one
    if (!element) {
      dates[MT_TANGGAL] = { morning: 0, afternoon: 0 };
    }

    const addedProperty = isInMorning(MD_MULAI) ? 'morning' : 'afternoon';

    dates[MT_TANGGAL][addedProperty] += MD_AVAILABILITY;
  });

  return dates;
};

const defaultQuota = { morning: 0, afternoon: 0 };
const getQuotaDifference = (lastQuota = defaultQuota, currentQuota = defaultQuota, property) => {
  const lastSessionQuota = lastQuota[property];
  const currentSessionQuota = currentQuota[property];
  const propertyText = property === 'morning' ? 'Pagi' : 'Siang';
  const changes =
    lastSessionQuota === currentSessionQuota ?
      currentSessionQuota :
      `${lastSessionQuota} -> ${currentSessionQuota}`;

  return `${propertyText}: ${changes}`;
};

const getOfficeQuota = (availability, startDate, endDate) => {
  const dateResponseFormat = 'MMM D, YYYY';
  const dateParamsFormat = 'YYYY-M-D';

  const officeDates = {};
  const dates = countAvailable(availability, dateResponseFormat);

  const iterateEnd = parse(endDate, dateParamsFormat, new Date());
  let iterate = parse(startDate, dateParamsFormat, new Date());

  while (!isAfter(iterate, iterateEnd)) {
    const toResponseFormat = format(iterate, dateResponseFormat);

    if (dates[toResponseFormat]) {
      officeDates[toResponseFormat] = dates[toResponseFormat];
    } else {
      officeDates[toResponseFormat] = { morning: 0, afternoon: 0 };
    }

    iterate = addDays(iterate, 1);
  }

  return officeDates;
};

/**
 * getOfficesQuota: get offices quota; with the identifier either MO_ID or MO_NAME
 * res: responses in array
 * property: MO_ID or MO_NAME
 * offices: list of offices
 * dateRange: object consists of startDate and endDate
 */
const getOfficesQuota = (res, property, offices, dateRange) => {
  const { startDate, endDate } = dateRange;
  const currentOffices = {};

  // Fill to currentOffices
  res.forEach(({ config, data }) => {
    // config.data is request body used
    const officeID = parseJSONIfString(config.data).KANIM_ID;
    const office = offices.find(({ MO_ID }) => MO_ID === officeID);
    const dates = getOfficeQuota(data.Availability, startDate, endDate);

    currentOffices[office[property]] = dates;
  });

  return currentOffices;
};

module.exports = {
  isInMorning,
  countAvailable,
  getQuotaDifference,
  getOfficeQuota,
  getOfficesQuota,
};
