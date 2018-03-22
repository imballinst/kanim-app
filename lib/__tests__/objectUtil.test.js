import destructureObj from '../objectUtil';

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
});
