const price = require('./price');

test('price returns 1', () => {
  const expectedResult = ["eon,variable,108.68", "edf,fixed,111.25", "ovo,standard,120.23", "bg,standing-charge,121.33"];
  expect(price(1000)).toEqual(expectedResult);
});