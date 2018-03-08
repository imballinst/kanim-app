const parse = require('date-fns/parse');
const isBefore = require('date-fns/isBefore');

module.exports = (stringDate1, stringDate2, format) => {
  const currentDate = new Date();
  const parsedDate1 = parse(stringDate1, format, currentDate);
  const parsedDate2 = parse(stringDate2, format, currentDate);

  return isBefore(parsedDate1, parsedDate2) ? -1 : 1;
};
