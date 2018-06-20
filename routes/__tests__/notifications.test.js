import request from 'supertest';

import {
  getDatabaseConnection,
  closeDBConnection,
  deleteMany,
  insertMany,
  find,
} from '../../lib/mongo';
import app from '../../app';
import initNotifRoutes from '../notifications';
let db;
let client;

beforeAll(() => {
  initNotifRoutes(app);

  return getDatabaseConnection().then(({ mongoClient, clientDb }) => {
    app.locals.db = clientDb;
    db = clientDb;
    client = mongoClient;
  });
});

afterAll(() => closeDBConnection(client));

describe('base route (routes/base)', () => {
  beforeAll(() => deleteMany(db, 'notification', {}).then(() => insertMany(
    db,
    'notification',
    [
      {
        userID: '1',
        email: 'test@gmail.com',
        moID: 20,
        session: 'both',
        startDate: new Date(2018, 0, 1),
        endDate: new Date(2018, 0, 2),
        notified: true,
        expired: true,
        treshold: 10,
      },
      {
        userID: '1',
        email: 'test@gmail.com',
        moID: 20,
        session: 'morning',
        startDate: new Date(2018, 0, 2),
        endDate: new Date(2018, 0, 3),
        notified: false,
        expired: false,
        treshold: 35,
      },
      {
        userID: '2',
        email: 'test2@gmail.com',
        moID: 24,
        session: 'afternoon',
        startDate: new Date(2018, 0, 3),
        endDate: new Date(2018, 0, 4),
        notified: false,
        expired: false,
        treshold: 20,
      },
      {
        userID: '2',
        email: 'test2@gmail.com',
        moID: 20,
        session: 'both',
        startDate: new Date(2018, 0, 3),
        endDate: new Date(2018, 0, 6),
        notified: false,
        expired: false,
        treshold: 25,
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
      // Get notification with minimum treshold
      request(app)
        .get('/user/2/notification?notified=false&treshold=22')
        .expect(200)
        .then(({ body }) => {
          const { data, success } = body;

          expect(data.length).toBe(1);
          expect(success).toBe(true);

          expect(data[0].notified).toBe(false);
          expect(data[0].treshold).toBe(25);
        }),
      // Get notification specific session: afternoon
      request(app)
        .get('/user/2/notification?notified=false&session=afternoon')
        .expect(200)
        .then(({ body }) => {
          const { data, success } = body;

          expect(data.length).toBe(1);
          expect(success).toBe(true);

          expect(data[0].notified).toBe(false);
          expect(data[0].treshold).toBe(20);
        }),
      // Get notification specific session: morning
      request(app)
        .get('/user/2/notification?notified=false&session=morning')
        .expect(200)
        .then(({ body }) => {
          const { data, success } = body;

          expect(data.length).toBe(0);
          expect(success).toBe(true);
        }),
      // Get notification specific session: afternoon and treshold more than 20
      request(app)
        .get('/user/2/notification?notified=false&session=afternoon&treshold=25')
        .expect(200)
        .then(({ body }) => {
          const { data, success } = body;

          expect(data.length).toBe(0);
          expect(success).toBe(true);
        }),
    ]);
  });

  it('tests route POST /user/:userID/notification', () => request(app)
    .post('/user/4/notification')
    .send({
      userID: '4',
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

      return find(db, 'notification', { userID: '4' });
    })
    .then(({ success, data }) => {
      expect(success).toBe(true);
      expect(data[0].userID).toBe('4');
      expect(data[0].email).toBe('test4@gmail.com');
      expect(data[0].notified).toBe(false);
    })
  );

  it('tests route GET /user/:userID/notification/:notificationID', () => find(
      db,
      'notification',
      { userID: '4' }
    ).then(({ data }) => {
      const notificationID = data[0]._id.toString();

      return request(app)
        .get(`/user/4/notification/${notificationID}`)
        .expect(200)
        .then(({ body }) => {
          const { success, data } = body;

          expect(success).toBe(true);
          expect(data.userID).toBe('4');
          expect(data.email).toBe('test4@gmail.com');
          expect(data.notified).toBe(false);
        });
    })
  );

  it('tests route PUT /user/:userID/notification/:notificationID', () => find(
      db,
      'notification',
      { userID: '4' }
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

          return find(db, 'notification', { userID: '4' });
        })
        .then(({ success, data }) => {
          expect(success).toBe(true);
          expect(data[0].userID).toBe('4');
          expect(data[0].email).toBe('test4@gmail.com');
          expect(data[0].notified).toBe(true);
        });
    })
  );
});
