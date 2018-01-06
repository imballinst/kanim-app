const subDays = require('date-fns/sub_days');
const getDate = require('date-fns/get_date');
const getMonth = require('date-fns/get_month');
const getYear = require('date-fns/get_year');

// Helper functions
const isInMorning = (time) => {
  const timeString = time.toString();
  let timeInt = parseInt(timeString, 10);

  if (timeString.length <= 2) {
    timeInt *= 100;
  }

  return timeInt <= 1200;
};

// Main functions
const countAvailable = (availability) => {
  let morning = 0;
  let afternoon = 0;

  availability.forEach(({ MD_MULAI, MD_AVAILABILITY }) => {
    if (isInMorning(MD_MULAI)) {
      morning += MD_AVAILABILITY;
    } else {
      afternoon += MD_AVAILABILITY;
    }
  });

  return { morning, afternoon };
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

module.exports = { isInMorning, countAvailable, buildDateRange };
