import { destructureObj, parseJSONIfString } from '../objectUtil';

describe('objectUtil Components (libs/objectUtil)', () => {
  it('should destructure an object correctly', () => {
    const testObj = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    };
    const { a, b, rest: restProps } = destructureObj(testObj, ['a', 'b']);

    expect(a).toBe(1);
    expect(b).toBe(2);
    expect(restProps).toEqual({ c: 3, d: 4 });
  });

  it('should convert to JSON if it is a string', () => {
    const expectedJSON = { test: 'a' };
    const string = JSON.stringify(expectedJSON);

    expect(parseJSONIfString(string)).toEqual(expectedJSON);
  });
});
