const parse = require('date-fns/parse');
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
};
