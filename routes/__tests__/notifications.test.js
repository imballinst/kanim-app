const request = require('supertest');

const {
  getDatabaseConnection,
  closeDBConnection,
  deleteMany,
  insertMany,
  find,
} = require('../../lib/mongo');
const app = require('../../app');
const initNotifRoutes = require('../notifications');
let promise;
let db;
let client;

beforeAll(() => {
  initNotifRoutes(app);

  promise = getDatabaseConnection();

  return promise.then(({ mongoClient, clientDb }) => {
    app.locals.db = clientDb;
    db = clientDb;
    client = mongoClient;
  });
});

afterAll(() => promise.then(({ mongoClient }) => closeDBConnection(mongoClient)));

describe('base route (routes/base)', () => {
  beforeAll(() => deleteMany(db, 'notification', {}).then(() => insertMany(
    db,
    'notification',
    [
      {
        userID: 1,
        email: 'test@gmail.com',
        moID: 20,
        session: 'both',
        startDate: new Date(2018, 0, 1),
        endDate: new Date(2018, 0, 2),
        notified: true,
      },
      {
        userID: 1,
        email: 'test@gmail.com',
        moID: 20,
        session: 'both',
        startDate: new Date(2018, 0, 2),
        endDate: new Date(2018, 0, 3),
        notified: false,
      },
      {
        userID: 2,
        email: 'test2@gmail.com',
        moID: 24,
        session: 'both',
        startDate: new Date(2018, 0, 3),
        endDate: new Date(2018, 0, 4),
        notified: false,
      },
      {
        userID: 3,
        email: 'test3@gmail.com',
        moID: 20,
        session: 'both',
        startDate: new Date(2018, 0, 3),
        endDate: new Date(2018, 0, 6),
        notified: false,
      }
    ],
  )));

  it('tests route GET /user/:userID/notification', () => {
    return Promise.all([
      // Get all notifications for userID #1
      request(app)
        .get('/user/1/notification')
        .expect(200)
        .then(({ body }) => {
          const { data, success } = body;

          expect(data.length).toBe(2);
          expect(success).toBe(true);

          expect(data[0].notified).toBe(true);
          expect(data[1].notified).toBe(false);
        }),
      // Get notified notification for userID #1
      request(app)
        .get('/user/1/notification?notified=true')
        .expect(200)
        .then(({ body }) => {
          const { data, success } = body;

          expect(data.length).toBe(1);
          expect(success).toBe(true);

          expect(data[0].notified).toBe(true);
        }),
      // Get unnotified notification for userID #1
      request(app)
        .get('/user/1/notification?notified=false')
        .expect(200)
        .then(({ body }) => {
          const { data, success } = body;

          expect(data.length).toBe(1);
          expect(success).toBe(true);

          expect(data[0].notified).toBe(false);
        }),
    ]);
  });

  it('tests route POST /user/:userID/notification', () => request(app)
    .post('/user/1/notification')
    .send({
      userID: 4,
      email: 'test4@gmail.com',
      moID: 20,
      session: 'both',
      startDate: new Date(2018, 0, 3),
      endDate: new Date(2018, 0, 6),
    })
    .expect(200)
    .then(({ body }) => {
      const { success } = body;

      expect(success).toBe(true);

      return find(db, 'notification', { userID: 4 });
    })
    .then(({ success, data }) => {
      expect(success).toBe(true);
      expect(data[0].userID).toBe(4);
      expect(data[0].email).toBe('test4@gmail.com');
      expect(data[0].notified).toBe(false);
    })
  );

  it('tests route put /user/:userID/notification/:notificationID', () => find(
      db,
      'notification',
      { userID: 4 }
    ).then(({ data }) => {
      const notificationID = data[0]._id.toString();

      return request(app)
        .put(`/user/4/notification/${notificationID}`)
        .send({
          notified: true,
        })
        .expect(200)
        .then(({ body }) => {
          const { success, data } = body;

          expect(success).toBe(true);

          return find(db, 'notification', { userID: 4 });
        })
        .then(({ success, data }) => {
          expect(success).toBe(true);
          expect(data[0].userID).toBe(4);
          expect(data[0].email).toBe('test4@gmail.com');
          expect(data[0].notified).toBe(true);
        });
    })
  );
});
