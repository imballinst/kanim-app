import { sortDate, formatDate, isBetween, isIntersect } from '../dateUtil';

describe('dateUtil component (lib/dateUtil)', () => {
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
    const start = new Date(2018, 0, 1);
    const end = new Date(2018, 0, 5);
    const between = new Date(2018, 0, 3);
    const notBetween = new Date(2018, 0, 7);

    expect(isBetween(start, end, between)).toBe(true);
    expect(isBetween(start, end, notBetween)).toBe(false);
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
});
