import sortDate from '../dateUtil';

describe('dateUtil component (lib/dateUtil)', () => {
  it('should correctly sort date', () => {
    const format = 'MMM D, YYYY';
    const date1 = 'Jan 1, 2018';
    const date2 = 'Jan 2, 2018';

    expect(sortDate(date1, date2, format)).toBe(-1);
    expect(sortDate(date2, date1, format)).toBe(1);
  });
});
