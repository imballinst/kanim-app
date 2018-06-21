import nock from 'nock';
import addWeeks from 'date-fns/addWeeks';
import format from 'date-fns/format';

import processorFunctions from '../processor';
import {
  getDatabaseConnection,
  closeDBConnection,
  deleteMany,
  insertMany,
  find,
} from '../../lib/mongo';

const {
  getCookieAndToken,
  getFilteredOffices,
  checkAvailabilities,
  ...untestedFunctions
} = processorFunctions;
const baseUrl = 'https://antrian.imigrasi.go.id/rest';
let client;
let db;
let counter = 0;

// Open db connection before tests
beforeAll(() => getDatabaseConnection().then(({ mongoClient, clientDb }) => {
  client = mongoClient;
  db = clientDb;
}));

// Close db connection after tests
afterAll(() => closeDBConnection(client));

describe('Processor component (lib/processor)', () => {
  const officesResponse = JSON.stringify({
    "Message":null,
    "Offices":[
      {
        "MO_TELP":"(0651)-23784",
        "MO_LATITUDE":"5.5615128",
        "MO_CODE":null,
        "MO_NAME":"Kantor Imigrasi Banda Aceh",
        "MP_ID":1,
        "MO_LONGITUDE":"95.3335824",
        "MO_ID":1,
        "PROVINCE_NAME":"Aceh",
        "IS_ACTIVE":true,
        "MO_CLASS":"Kantor Imigrasi Kelas I",
        "MO_ADDRESS":"Jalan Tengku M. Daud Beureuh No. 82, Beurawe, Kuta Alam, Kota Banda Aceh, Aceh 23373"
      },
      {
        "MO_TELP":"(0645)-43039",
        "MO_LATITUDE":"5.1778764",
        "MO_CODE":null,
        "MO_NAME":"Kantor Imigrasi Lhokseumawe",
        "MP_ID":1,
        "MO_LONGITUDE":"97.1517942",
        "MO_ID":2,
        "PROVINCE_NAME":"Aceh",
        "IS_ACTIVE":true,
        "MO_CLASS":"Kantor Imigrasi Kelas II",
        "MO_ADDRESS":"Jl. Merdeka, Lhokseumawe, Banda Sakti, Kota Lhokseumawe, Aceh 24355"
      },
      {
        "MO_TELP":"(0655)-7551358",
        "MO_LATITUDE":"4.1349887",
        "MO_CODE":null,
        "MO_NAME":"Kantor Imigrasi Meulaboh",
        "MP_ID":1,
        "MO_LONGITUDE":"96.13041939999999",
        "MO_ID":3,
        "PROVINCE_NAME":"Aceh",
        "IS_ACTIVE":true,
        "MO_CLASS":"Kantor Imigrasi Kelas II",
        "MO_ADDRESS":"Jl. Merdeka No.4 Meulaboh Kel. Pasar Aceh, KEc. Johan Pahlawan, Aceh Barat, NAD, 23613"
      }
    ]
  });

  afterEach(() => {
    counter += 1;
    nock.cleanAll()
  });

  it('should correctly get cookie and token', () => {
    const loginResponse = JSON.stringify({
      Message:{
        "MU_ID":123412341234,
        "MU_USERNAME":"testusername",
        "MU_PASSWORD":"testpassword",
        "MU_TELEPHONE":"0123456789",
        "MU_EMAIL":"hahaa@gmail.com",
        "MU_ALAMAT":"earth",
        "MU_NIK":"1234123412341234",
        "MU_SESSION_ID":"sessionid",
        "MU_SESSION_EXPIRY":"Jan 28, 2018 9:29:01 AM",
        "MU_STATE":0,
        "is_active":true
      },
      Token:'token',
      Id:123412341234,
      Success:true
    });

    nock(baseUrl)
      .post('/Authentication.jsp')
      .reply(200, loginResponse, {
        'set-cookie': ['asdf=qwe;hehe=1']
      });

    return getCookieAndToken().then(({ cookie, token }) => {
      expect(cookie).toBe('qwe');
      expect(token).toBe('token');
    });
  });

  it('should correctly filter offices', () => {
    nock(baseUrl)
      .post('/PostKanim.jsp')
      .reply(200, officesResponse);

    return getFilteredOffices('kuki', 'Meulaboh').then(offices => expect(offices).toEqual([{
      "MO_TELP":"(0655)-7551358",
      "MO_LATITUDE":"4.1349887",
      "MO_CODE":null,
      "MO_NAME":"Kantor Imigrasi Meulaboh",
      "MP_ID":1,
      "MO_LONGITUDE":"96.13041939999999",
      "MO_ID":3,
      "PROVINCE_NAME":"Aceh",
      "IS_ACTIVE":true,
      "MO_CLASS":"Kantor Imigrasi Kelas II",
      "MO_ADDRESS":"Jl. Merdeka No.4 Meulaboh Kel. Pasar Aceh, KEc. Johan Pahlawan, Aceh Barat, NAD, 23613"
    }]));
  });

  it('should correctly check availabilities and send email accordingly', () => {
    return deleteMany(db, 'notif_test', {}).then(() => insertMany(
      db,
      'notif_test',
      [
        {
          userID: 1,
          email: 'test@gmail.com',
          moID: 3,
          session: 'both',
          startDate: new Date(2018, 0, 1),
          endDate: new Date(2018, 0, 2),
          notified: true,
          expired: true,
          treshold: 10,
        },
        {
          userID: 1,
          email: 'test@gmail.com',
          moID: 3,
          session: 'morning',
          startDate: new Date(2018, 0, 2),
          endDate: new Date(2018, 0, 3),
          notified: false,
          expired: false,
          treshold: 35,
        },
        {
          userID: 2,
          email: 'test2@gmail.com',
          moID: 4,
          session: 'afternoon',
          startDate: new Date(2018, 0, 3),
          endDate: new Date(2018, 0, 4),
          notified: false,
          expired: false,
          treshold: 20,
        },
        {
          userID: 2,
          email: 'test2@gmail.com',
          moID: 3,
          session: 'both',
          startDate: new Date(2018, 0, 3),
          endDate: new Date(2018, 0, 6),
          notified: false,
          expired: false,
          treshold: 25,
        }
      ],
    )).then((res) => {
      nock(baseUrl)
        .post('/PostKanim.jsp')
        .reply(200, officesResponse);

      nock(baseUrl)
        .post('/AvailabilityInfo.jsp')
        .reply(200, {
          Availability: [
            {
              MD_AVAILABILITY: 15,
              TS_MULAI: null,
              MD_IDOFFICE: 3,
              MD_MULAI: 800,
              MD_TID: 45144,
              MT_TANGGAL: 'Jan 5, 2018',
              MD_QUOTA: 15,
              TS_SELESAI: null,
              MD_ID: 41412,
              MD_SELESAI: 900
            },
            {
              MD_AVAILABILITY: 15,
              TS_MULAI: null,
              MD_IDOFFICE: 3,
              MD_MULAI: 901,
              MD_TID: 45148,
              MT_TANGGAL: 'Jan 5, 2018',
              MD_QUOTA: 15,
              TS_SELESAI: null,
              MD_ID: 41416,
              MD_SELESAI: 1000
            },
            {
              MD_AVAILABILITY: 15,
              TS_MULAI: null,
              MD_IDOFFICE: 3,
              MD_MULAI: 1001,
              MD_TID: 45152,
              MT_TANGGAL: 'Jan 5, 2018',
              MD_QUOTA: 15,
              TS_SELESAI: null,
              MD_ID: 41420,
              MD_SELESAI: 1100
            },
            {
              MD_AVAILABILITY: 15,
              TS_MULAI: null,
              MD_IDOFFICE: 3,
              MD_MULAI: 1101,
              MD_TID: 45160,
              MT_TANGGAL: 'Jan 5, 2018',
              MD_QUOTA: 15,
              TS_SELESAI: null,
              MD_ID: 41428,
              MD_SELESAI: 1200
            },
            {
              MD_AVAILABILITY: 15,
              TS_MULAI: null,
              MD_IDOFFICE: 3,
              MD_MULAI: 1300,
              MD_TID: 45168,
              MT_TANGGAL: 'Jan 5, 2018',
              MD_QUOTA: 15,
              TS_SELESAI: null,
              MD_ID: 41436,
              MD_SELESAI: 1400
            },
            {
              MD_AVAILABILITY: 15,
              TS_MULAI: null,
              MD_IDOFFICE: 3,
              MD_MULAI: 1401,
              MD_TID: 45176,
              MT_TANGGAL: 'Jan 5, 2018',
              MD_QUOTA: 15,
              TS_SELESAI: null,
              MD_ID: 41444,
              MD_SELESAI: 1500
            }
          ],
          Message: null,
          Success: null
        });

      nock('https://api.sendgrid.com/')
        .post('/v3/mail/send')
        .reply(202, [
          {
            toJSON: () => ({ statusCode: 202 }),
          }
        ]);

      return getFilteredOffices('kuki', 'Meulaboh');
    }).then(offices => {
      const startDate = new Date(2018, 0, 3);
      const endDate = addWeeks(startDate, 2);
      const dates = {
        startDate: format(startDate, 'YYYY-M-D'),
        endDate: format(endDate, 'YYYY-M-D'),
      };

      return checkAvailabilities(db, '', '', offices, dates);
    }).then(({ success, updatedIDs, expiredIDs }) => {
      return Promise.all([
        find(db, 'notif_test', { _id: { $in: updatedIDs }}),
        find(db, 'notif_test', { _id: { $in: expiredIDs }}),
      ])
    }).then(([updatedQuery, expiredQuery]) => {
      expect(updatedQuery.success).toBe(true);
      expect(updatedQuery.data[0].notified).toBe(true);

      expect(expiredQuery.success).toBe(true);
      expect(expiredQuery.data[0].expired).toBe(true);
    });
  });
});

describe('processor counter (lib/processor)', () => {
  it('should test all functions', () => {
    expect(Object.keys(untestedFunctions).length).toBe(0);
    expect(counter).toBe(Object.keys(processorFunctions).length);
  });
});
