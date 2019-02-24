const price = require('.').price;

test('price returns 1', () => {
  expect(price()).toBe(1);
});