const dateUtils = require('../dateUtil');

const {
  sortDate,
  formatDate,
  isBetween,
  isIntersect,
  buildDateRange,
  ...untestedFunctions
} = dateUtils;
let counter = 0;

describe('dateUtil component (lib/dateUtil)', () => {
  afterEach(() => {
    counter += 1;
  });

  it('should correctly sort date', () => {
    const dateFormat = 'MMM D, YYYY';
    const date1 = 'Jan 1, 2018';
    const date2 = 'Jan 2, 2018';

    expect(sortDate(date1, date2, dateFormat)).toBe(-1);
    expect(sortDate(date2, date1, dateFormat)).toBe(1);
  });

  it('should correctly format date', () => {
    const date = new Date(2018, 0, 1);

    expect(formatDate(date)).toBe('01 Januari 2018');
  });

  it('should check if is between', () => {
    // Different start and end dates
    const start = new Date(2018, 0, 1);
    const end = new Date(2018, 0, 5);
    const between = new Date(2018, 0, 3);
    const between2 = new Date(2018, 0, 1);
    const between3 = new Date(2018, 0, 5);
    const notBetween = new Date(2018, 0, 7);

    expect(isBetween(start, end, between)).toBe(true);
    expect(isBetween(start, end, between2)).toBe(true);
    expect(isBetween(start, end, between3)).toBe(true);
    expect(isBetween(start, end, notBetween)).toBe(false);

    // Same start and end dates
    const sameDate = new Date(2018, 0, 1);

    expect(isBetween(sameDate, sameDate, sameDate)).toBe(true);
  });

  it('should check if intersects', () => {
    const outer = {
      start: new Date(2018, 0, 1),
      end: new Date(2018, 0, 5),
    };
    const inner = {
      start: new Date(2018, 0, 3),
      end: new Date(2018, 0, 6),
    };
    const notIntersect = {
      start: new Date(2018, 0, 7),
      end: new Date(2018, 0, 8),
    };

    expect(isIntersect(outer, inner)).toBe(true);
    expect(isIntersect(outer, notIntersect)).toBe(false);
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
});

describe('dateUtil counter (lib/dateUtil)', () => {
  it('should test all functions', () => {
    expect(Object.keys(untestedFunctions).length).toBe(0);
    expect(counter).toBe(Object.keys(dateUtils).length);
  });
});
