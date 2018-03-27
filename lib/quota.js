const subDays = require('date-fns/subDays');
const getDate = require('date-fns/getDate');
const getMonth = require('date-fns/getMonth');
const getYear = require('date-fns/getYear');
const parse = require('date-fns/parse');

const { sortDate } = require('./dateUtil');

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
const countAvailable = (availability, format) => {
  const dateArray = [];

  // Iterate and aggregate availabilities
  availability.forEach(({ MD_MULAI, MD_AVAILABILITY, MT_TANGGAL }) => {
    let elementIndex = dateArray.findIndex(({ date }) => date === MT_TANGGAL);

    // if not defined, define one
    if (elementIndex === -1) {
      dateArray.push({ date: MT_TANGGAL, morning: 0, afternoon: 0 });
      elementIndex = dateArray.length - 1;
    }

    const addedProperty = isInMorning(MD_MULAI) ? 'morning' : 'afternoon';

    dateArray[elementIndex][addedProperty] += MD_AVAILABILITY;
  });

  // Sort dateArray
  return dateArray.sort(({ date: date1 }, { date: date2 }) => sortDate(date1, date2, format));
};

const buildDateRange = (startDateObj, endDateObj) => {
  // If both parameters are present, execute normally
  // If only startDate are present, then make it the endDateObj, with startDateObj - the previous day from endDateObj
  let startDate;
  let endDate;

  // Add 1 to month because API is receiving month in 1-12
  if (startDateObj && endDateObj) {
    startDate = `${startDateObj.year}-${startDateObj.month + 1}-${startDateObj.day}`;
    endDate = `${endDateObj.year}-${endDateObj.month + 1}-${endDateObj.day}`;
  } else {
    const { year, month, day } = startDateObj;
    const tempDate = subDays(new Date(year, month, day), 1);

    startDate = `${getYear(tempDate)}-${getMonth(tempDate) + 1}-${getDate(tempDate)}`;
    endDate = `${startDateObj.year}-${startDateObj.month + 1}-${startDateObj.day}`;
  }

  return { startDate, endDate };
};

const defaultQuota = { morning: 0, afternoon: 0 };
const getQuotaDifference = (lastQuota = defaultQuota, currentQuota = defaultQuota, property) => {
  const lastSessionQuota = lastQuota[property];
  const currentSessionQuota = currentQuota[property];
  const propertyText = property === 'morning' ? 'Pagi' : 'Siang';
  const changes = lastSessionQuota === currentSessionQuota ?
    currentSessionQuota : `${lastSessionQuota} -> ${currentSessionQuota}`;

  return `${propertyText}: ${changes}`;
};

/**
 * getOfficesQuota: get offices quota; with the identifier either MO_ID or MO_NAME
 * res: responses in array
 * property: MO_ID or MO_NAME
 */
const getOfficesQuota = (res, property, offices) => {
  const dateFormat = 'MMM D, YYYY';
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

  return currentOffices;
};

module.exports = {
  isInMorning,
  countAvailable,
  buildDateRange,
  getQuotaDifference,
  getOfficesQuota,
};
