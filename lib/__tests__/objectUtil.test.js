import objectFunctions from '../objectUtil';

const { destructureObj, parseJSONIfString, ...untestedFunctions } = objectFunctions;
let counter = 0;

describe('objectUtil Components (lib/objectUtil)', () => {
  afterEach(() => {
    counter += 1;
  });

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

describe('objectUtil counter (lib/objectUtil)', () => {
  it('should test all functions', () => {
    expect(Object.keys(untestedFunctions).length).toBe(0);
    expect(counter).toBe(Object.keys(objectFunctions).length);
  });
});
