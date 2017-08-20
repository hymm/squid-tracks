const { sort } = require('./sort-array');
const defaultArray = [
  { name: 'apple', number: '3' },
  { name: 'orange', number: '1' },
  { name: 'banana', number: '10' }
];

describe('sort', () => {
  it('should sort values corrently if value is number', () => {
    const array = defaultArray.slice();

    sort(array, 'number', 'down', parseFloat);
    expect(array[0].name).toBe('orange');
    expect(array[1].name).toBe('apple');
    expect(array[2].name).toBe('banana');
  });

  it('should sort values corrently if value type is not specified', () => {
    const array = defaultArray.slice();

    sort(array, 'name', 'down');
    expect(array[0].name).toBe('apple');
    expect(array[1].name).toBe('banana');
    expect(array[2].name).toBe('orange');
  });
});
