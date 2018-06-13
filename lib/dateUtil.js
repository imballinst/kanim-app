const parse = require('date-fns/parse');
const subDays = require('date-fns/subDays');
const getDate = require('date-fns/getDate');
const getMonth = require('date-fns/getMonth');
const getYear = require('date-fns/getYear');
const isBefore = require('date-fns/isBefore');
const isAfter = require('date-fns/isAfter');
const isSameDay = require('date-fns/isSameDay');
const format = require('date-fns/format');
const idLocale = require('date-fns/locale/id');

const isBetween = (startDate, endDate, date) => (
  (isBefore(startDate, date) || isSameDay(startDate, date)) &&
  (!isAfter(date, endDate) || isSameDay(endDate, date))
);

module.exports = {
  sortDate: (stringDate1, stringDate2, dateFormat) => {
    const currentDate = new Date();
    const parsedDate1 = parse(stringDate1, dateFormat, currentDate);
    const parsedDate2 = parse(stringDate2, dateFormat, currentDate);

    return isBefore(parsedDate1, parsedDate2) ? -1 : 1;
  },
  formatDate: date => format(date, 'DD MMMM YYYY', { locale: idLocale }),
  isBetween,
  isIntersect: (outerDate, innerDate) => {
    const { start, end } = outerDate;
    const { start: innerStart, end: innerEnd } = innerDate;

    return isBetween(start, end, innerStart) || isBetween(start, end, innerEnd);
  },
  buildDateRange: (startDateObj, endDateObj) => {
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
  },
};
