import { buildMail } from '../mail';

describe('mail component (lib/mail)', () => {
  it('should correctly build html and text object', () => {
    const officeName = 'kanim x';
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

    expect(buildMail(officeName, quotaObjectArray1)).toEqual({
      subject: `Notifikasi Kuota Kanim ${officeName}`,
      text: `Halo! ${officeName} untuk tanggal 01 Januari 2018 saat ini terbuka ` +
        `dengan kuota pagi 16 orang dan kuota siang 23 orang.`,
      html: `Halo!<br><br><b>${officeName}</b> untuk tanggal <b>01 Januari 2018</b>` +
        ` saat ini terbuka dengan kuota pagi <b>16</b> orang dan kuota siang` +
        ` 23 orang.`,
    });

    expect(buildMail(officeName, quotaObjectArray2)).toEqual({
      subject: `Notifikasi Kuota Kanim ${officeName}`,
      text: `Halo! ${officeName} untuk tanggal 1. 01 Januari 2018 (pagi: 16 orang, siang: 23` +
        ` orang), 2. 02 Januari 2018 (pagi: 17 orang, siang: 24 orang).`,
      html: `Halo!<br><br><b>${officeName}</b> untuk tanggal: <ol><li>01 Januari 2018` +
        ` (pagi: 16 orang, siang: 23 orang)</li><li>02 Januari 2018 (pagi: 17 orang, siang: 24 ` +
        `orang)</li></ol><br>`,
    });
  });
});
