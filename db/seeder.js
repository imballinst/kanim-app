require('dotenv').config();

// Import modules
global.Promise = require('bluebird');
const addDays = require('date-fns/addDays');

const { SEEDER_EMAIL, APPLY_SEED } = require('../config/env');
const {
  getDatabaseConnection,
  closeDBConnection,
  deleteMany,
  insertMany,
} = require('../lib/mongo');

// Begin seeding
getDatabaseConnection().then(({ mongoClient, clientDb }) => {
  deleteMany(clientDb, 'notifications', {}).then(() => {
    if (APPLY_SEED === 'true') {
      return insertMany(
        clientDb,
        'notifications',
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
      );
    }

    return '';
  }).then(() => closeDBConnection(mongoClient));
});
