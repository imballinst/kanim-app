const parse = require('date-fns/parse');
const isBefore = require('date-fns/isBefore');
const format = require('date-fns/format');
const idLocale = require('date-fns/locale/id');

module.exports = {
  sortDate: (stringDate1, stringDate2, dateFormat) => {
    const currentDate = new Date();
    const parsedDate1 = parse(stringDate1, dateFormat, currentDate);
    const parsedDate2 = parse(stringDate2, dateFormat, currentDate);

    return isBefore(parsedDate1, parsedDate2) ? -1 : 1;
  },
  formatDate: date => format(date, 'DD MMMM YYYY', { locale: idLocale }),
};
