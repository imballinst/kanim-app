import {
  isInMorning,
  countAvailable,
  buildDateRange,
  getQuotaDifference,
  getOfficeQuota,
} from '../quota';

describe('Quota component (lib/quota)', () => {
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

    const dates = countAvailable(availability);

    expect(dates['Jan 5, 2018'].morning).toBe(60);
    expect(dates['Jan 5, 2018'].afternoon).toBe(30);
  });

  it('should correctly build date range based on params', () => {
    const startDate = { year: 2018, month: 0, day: 5 };
    const endDate = { year: 2018, month: 0, day: 8 };

    const resultParam11 = '2018-1-4';
    const resultParam12 = '2018-1-5';
    const resultParam21 = '2018-1-5';
    const resultParam22 = '2018-1-8';

    const resultDate1 = { startDate: resultParam11, endDate: resultParam12 };
    const resultDate2 = { startDate: resultParam21, endDate: resultParam22 };

    expect(buildDateRange(startDate)).toEqual(resultDate1);
    expect(buildDateRange(startDate, endDate)).toEqual(resultDate2);
  });

  it('should correctly get the quota difference', () => {
    const quota1 = { morning: 15, afternoon: 0 };
    const quota2 = { morning: 17, afternoon: 0 };

    expect(getQuotaDifference(quota1, quota2, 'morning')).toBe('Pagi: 15 -> 17');
    expect(getQuotaDifference(quota1, quota2, 'afternoon')).toBe('Siang: 0');
  });

  it('should correctly count total availability from start date to end date', () => {
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

    const array = getOfficeQuota(availability, '2018-01-03', '2018-01-05');

    expect(array['Jan 3, 2018']).toEqual({ morning: 0, afternoon: 0 });
    expect(array['Jan 4, 2018']).toEqual({ morning: 0, afternoon: 0 });
    expect(array['Jan 5, 2018']).toEqual({ morning: 60, afternoon: 30 });
  });
});
