import nock from 'nock';

import { buildMail, sendMail } from '../mail';

describe('mail component (lib/mail)', () => {
  afterEach(() => nock.cleanAll());

  it('should correctly build html and text object', () => {
    const officeName = 'kanim x';
    const endingWords = 'Semoga lancar ya proses pengurusan paspornya!';
    const quotaObjectArray1 = [
      {
        date: new Date(2018, 0, 1),
        morning: 16,
        afternoon: 23,
      }
    ];
    const quotaObjectArray2 = [
      {
        date: new Date(2018, 0, 1),
        morning: 16,
        afternoon: 23,
      },
      {
        date: new Date(2018, 0, 2),
        morning: 17,
        afternoon: 24,
      }
    ];

    // A day
    const text1 = `Halo! Telah tersedia kuota untuk ${officeName} pada tanggal 01 Januari 2018 ` +
      `dengan kuota pagi 16 orang dan kuota siang 23 orang. ${endingWords}`;
    const html1 = `Halo!<br><br>Telah tersedia kuota untuk <b>${officeName}</b> pada tanggal` +
      ` <b>01 Januari 2018</b> dengan kuota pagi <b>16</b> orang dan kuota siang` +
      ` 23 orang.<br>${endingWords}`;

    // A couple of days
    const text2 = `Halo! Telah tersedia kuota untuk ${officeName} pada tanggal 1. 01 Januari 2018` +
      ` (pagi: 16 orang, siang: 23 orang), 2. 02 Januari 2018 (pagi: 17 orang, siang:` +
      ` 24 orang). ${endingWords}`;
    const html2 = `Halo!<br><br>Telah tersedia kuota untuk <b>${officeName}</b> pada tanggal: <ol>` +
      `<li>01 Januari 2018 (pagi: 16 orang, siang: 23 orang)</li>` +
      `<li>02 Januari 2018 (pagi: 17 orang, siang: 24 orang)</li>` +
      `</ol><br>${endingWords}`;

    // Expect
    expect(buildMail(officeName, quotaObjectArray1)).toEqual({
      subject: `Notifikasi Kuota Kanim ${officeName}`,
      text: text1,
      html: html1,
    });

    expect(buildMail(officeName, quotaObjectArray2)).toEqual({
      subject: `Notifikasi Kuota Kanim ${officeName}`,
      text: text2,
      html: html2,
    });
  });

  it('should correctly send mail', () => {
    nock('https://api.sendgrid.com/')
      .post('/v3/mail/send')
      .reply(202, [
        {
          toJSON: () => ({ statusCode: 202 }),
        }
      ]);

    const quotaObjectArray = [{
      date: 'Jan 5, 2018',
      morning: 13,
      afternoon: 30,
    }];

    return sendMail('email', 1, 'office name', quotaObjectArray).then(({ statusCode, dbID }) => {
      expect(statusCode).toBe(202);
      expect(dbID).toBe(1);
    });
  });
});
