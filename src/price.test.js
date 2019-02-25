const price = require('./price').price;
const generateRawResult = require('./price').generateRawResult;
const addStandingChargeToComputedRate = require('./price').addStandingChargeToComputedRate;

describe('about price', () => {
  test('should return the expected result for annual usage of 1000 kWh', () => {
    const expectedResult = [
      'eon,variable,108.68',
      'edf,fixed,111.25',
      'ovo,standard,120.23',
      'bg,standing-charge,121.33'
    ];
    expect(price(1000)).toEqual(expectedResult);
  });

  test('should return the expected result for annual usage of 2000 kWh', () => {
    const expectedResult = [
      'edf,fixed,205.75',
      'eon,variable,213.68',
      'bg,standing-charge,215.83',
      'ovo,standard,235.73'
    ];
    expect(price(2000)).toEqual(expectedResult);
  });
});

describe('about generateRawResult', () => {
  let ANNUAL_USAGE;
  beforeEach(() => {
    ANNUAL_USAGE = 1000;
  })
  test('should return the expected result for 1000 kWh annual usage taking into account one threshold and the base price', () => {
    const item = { supplier: 'ovo', plan: 'standard',rates: [ { price: 12.5, threshold: 300 }, { price: 11 } ] }
    const expectedResult = {
      supplier: 'ovo',
      plan: 'standard',
      finalRate: 120.23
    };
    expect(generateRawResult(item, ANNUAL_USAGE)).toEqual(expectedResult);
  });

  test('should return the expected result for 2000 kWh annual usage taking into account one threshold and the base price', () => {
    const item = { supplier: 'ovo', plan: 'standard',rates: [ { price: 12.5, threshold: 300 }, { price: 11 } ] };
    ANNUAL_USAGE = 2000;
    const expectedResult = {
      supplier: 'ovo',
      plan: 'standard',
      finalRate: 235.73
    };
    expect(generateRawResult(item, ANNUAL_USAGE)).toEqual(expectedResult);
  });

  test('should return the expected result for 1000 kWh annual usage taking into account two thresholds and the base price', () => {
    const item = {"supplier": "edf", "plan": "fixed", "rates": [{"price": 14.5, "threshold": 250}, {"price": 10.1, "threshold": 200}, {"price": 9}]};
    const expectedResult = {
      supplier: 'edf',
      plan: 'fixed',
      finalRate: 111.25
    };
    expect(generateRawResult(item, ANNUAL_USAGE)).toEqual(expectedResult);
  });

  test('should return the expected result for 2000 kWh annual usage taking into account two threshold and the base price', () => {
    const item = {"supplier": "edf", "plan": "fixed", "rates": [{"price": 14.5, "threshold": 250}, {"price": 10.1, "threshold": 200}, {"price": 9}]};
    ANNUAL_USAGE = 2000;
    const expectedResult = {
      supplier: 'edf',
      plan: 'fixed',
      finalRate: 205.75
    };
    expect(generateRawResult(item, ANNUAL_USAGE)).toEqual(expectedResult);
  });

  test('should return the expected result for 1000 kWh annual usage taking into account the base price and no thresholds', () => {
    const item = {"supplier": "eon", "plan": "variable", "rates": [{"price": 10}]};
    const expectedResult = {
      supplier: 'eon',
      plan: 'variable',
      finalRate: 105
    };
    expect(generateRawResult(item, ANNUAL_USAGE)).toEqual(expectedResult);
  });

  test('should return the expected result for 2000 kWh annual usage taking into account the base price and no thresholds', () => {
    const item = {"supplier": "eon", "plan": "variable", "rates": [{"price": 10}]};
    ANNUAL_USAGE = 2000;
    const expectedResult = {
      supplier: 'eon',
      plan: 'variable',
      finalRate: 210
    };
    expect(generateRawResult(item, ANNUAL_USAGE)).toEqual(expectedResult);
  });

  test('should only calculate as many kWh as the ANNUAL_USAGE specified is', () => {
    const item = { supplier: 'ovo', plan: 'standard',rates: [ { price: 12.5, threshold: 1100 }, { price: 11 } ] }
    const ANNUAL_USAGE = 1000;
    const expectedResult = {
      supplier: 'ovo',
      plan: 'standard',
      finalRate: 131.25
    };
    expect(generateRawResult(item, ANNUAL_USAGE)).toEqual(expectedResult);
  });

  describe('about addStandingChargeToComputedRate', () => {
    test('should add the standing daily charge if available', () => {
      computedRate = 111.25;
      standing_charge = 7;
      daysInYear = 365;
      expect(addStandingChargeToComputedRate(computedRate, standing_charge, daysInYear)).toEqual(2666.25);
    });
  });

});
