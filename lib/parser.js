// Helper functions
const isInMorning = (time) => {
  const timeString = time.toString();
  let timeInt = parseInt(timeString, 10);

  if (timeString.length <= 2) {
    timeInt *= 100;
  }

  return timeInt <= 1200;
};

// Exported functions
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

module.exports = { isInMorning, countAvailable };
