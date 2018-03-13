import { sortDate, formatDate } from '../dateUtil';

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
});
