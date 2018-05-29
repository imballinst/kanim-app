// Import functions
const addDays = require('date-fns/addDays');

const { SEEDER_EMAIL } = require('../config/env');
const {
  getDatabaseConnection,
  closeDBConnection,
  deleteMany,
  insertMany,
} = require('../lib/mongo');

// Begin seeding
deleteMany(db, 'notification', {}).then(() => insertMany(
  db,
  'notification',
  [
    {
      userID: 1,
      email: SEEDER_EMAIL,
      moID: 20,
      session: 'both',
      startDate: addDays(new Date(), 3),
      endDate: addDays(new Date(), 6),
      notified: true,
      treshold: 10,
    },
    {
      userID: 1,
      email: SEEDER_EMAIL,
      moID: 20,
      session: 'morning',
      startDate: addDays(new Date(), 3),
      endDate: addDays(new Date(), 6),
      notified: false,
      treshold: 35,
    },
    {
      userID: 2,
      email: SEEDER_EMAIL,
      moID: 24,
      session: 'afternoon',
      startDate: addDays(new Date(), 3),
      endDate: addDays(new Date(), 6),
      notified: false,
      treshold: 20,
    },
    {
      userID: 3,
      email: SEEDER_EMAIL,
      moID: 20,
      session: 'both',
      startDate: addDays(new Date(), 3),
      endDate: addDays(new Date(), 6),
      notified: false,
      treshold: 25,
    }
  ],
));
