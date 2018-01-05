import { isInMorning, countAvailable } from '../parser';

describe('Parser component (lib/parser)', () => {
  it('should correctly check morning/afternoon time', () => {
    const time1Digit = 9;
    const time2Digit = 12;
    const time3Digit = 900;
    const time4Digit = 1201;

    expect(isInMorning(time1Digit)).toBe(true);
    expect(isInMorning(time2Digit)).toBe(true);
    expect(isInMorning(time3Digit)).toBe(true);
    expect(isInMorning(time4Digit)).toBe(false);
  });

  it('should correctly count total availability across morning and afternoon', () => {
    const availability = [
      {
         MD_AVAILABILITY: 15,
         TS_MULAI: null,
         MD_IDOFFICE: 1,
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
         MD_IDOFFICE: 1,
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
         MD_IDOFFICE: 1,
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
         MD_IDOFFICE: 1,
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
         MD_IDOFFICE: 1,
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
         MD_IDOFFICE: 1,
         MD_MULAI: 1401,
         MD_TID: 45176,
         MT_TANGGAL: 'Jan 5, 2018',
         MD_QUOTA: 15,
         TS_SELESAI: null,
         MD_ID: 41444,
         MD_SELESAI: 1500
      }
    ];

    const { morning, afternoon } = countAvailable(availability);

    expect(morning).toBe(60);
    expect(afternoon).toBe(30);
  });
});
