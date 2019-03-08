import {
  price,
  generateRawResult,
  addStandingChargeToComputedRate,
  calculateFinalRate,
  calculateVatForComputedRate,
  calculateRateWithStandingChargeAndVat,
  roundFinalRate
} from './price';

describe('about price', () => {
  it('should return the expected result for annual usage of 1000 kWh', () => {
    const expectedResult = ['eon,variable,108.68', 'edf,fixed,111.25', 'ovo,standard,120.23', 'bg,standing-charge,121.33'];
    expect(price(1000)).toEqual(expectedResult);
  });

  it('should return the expected result for annual usage of 2000 kWh', () => {
    const expectedResult = ['edf,fixed,205.75', 'eon,variable,213.68', 'bg,standing-charge,215.83', 'ovo,standard,235.73'];
    expect(price(2000)).toEqual(expectedResult);
  });
});

describe('about generateRawResult', () => {
  it('should return the expected result for 1000 kWh annual usage taking into account one threshold and the base price', () => {
    const item = {supplier: 'ovo', plan: 'standard', rates: [{price: 12.5, threshold: 300}, {price: 11}]};
    const expectedResult = { supplier: 'ovo', plan: 'standard', finalRate: 120.23 };
    const annualUsage = 1000;
    expect(generateRawResult(item, annualUsage)).toEqual(expectedResult);
  });

  it('should return the expected result for 2000 kWh annual usage taking into account one threshold and the base price', () => {
    const item = { supplier: 'ovo', plan: 'standard',rates: [ { price: 12.5, threshold: 300 }, { price: 11 } ] };
    const expectedResult = { supplier: 'ovo', plan: 'standard', finalRate: 235.73 };
    const annualUsage = 2000;
    expect(generateRawResult(item, annualUsage)).toEqual(expectedResult);
  });

  it('should return the expected result for 1000 kWh annual usage taking into account two thresholds and the base price', () => {
    const item = {"supplier": "edf", "plan": "fixed", "rates": [{"price": 14.5, "threshold": 250}, {"price": 10.1, "threshold": 200}, {"price": 9}]};
    const expectedResult = { supplier: 'edf', plan: 'fixed', finalRate: 111.25 };
    const annualUsage = 1000;
    expect(generateRawResult(item, annualUsage)).toEqual(expectedResult);
  });

  it('should return the expected result for 2000 kWh annual usage taking into account two threshold and the base price', () => {
    const item = {"supplier": "edf", "plan": "fixed", "rates": [{"price": 14.5, "threshold": 250}, {"price": 10.1, "threshold": 200}, {"price": 9}]};
    const expectedResult = { supplier: 'edf', plan: 'fixed', finalRate: 205.75 };
    const annualUsage = 2000;
    expect(generateRawResult(item, annualUsage)).toEqual(expectedResult);
  });

  it('should return the expected result for 1000 kWh annual usage taking into account the base price and no thresholds', () => {
    const item = {"supplier": "eon", "plan": "variable", "rates": [{"price": 10}]};
    const expectedResult = { supplier: 'eon', plan: 'variable', finalRate: 105 };
    const annualUsage = 1000;
    expect(generateRawResult(item, annualUsage)).toEqual(expectedResult);
  });

  it('should return the expected result for 2000 kWh annual usage taking into account the base price and no thresholds', () => {
    const item = {"supplier": "eon", "plan": "variable", "rates": [{"price": 10}]};
    const expectedResult = { supplier: 'eon', plan: 'variable', finalRate: 210};
    const annualUsage = 2000;
    expect(generateRawResult(item, annualUsage)).toEqual(expectedResult);
  });

  it('should only calculate as many kWh as the ANNUAL_USAGE specified is', () => {
    const item = { supplier: 'ovo', plan: 'standard',rates: [ { price: 12.5, threshold: 1100 }, { price: 11 } ] }
    const expectedResult = { supplier: 'ovo', plan: 'standard', finalRate: 131.25 };
    const annualUsage = 1000;
    expect(generateRawResult(item, annualUsage)).toEqual(expectedResult);
  });
});

describe('about addStandingChargeToComputedRate', () => {
  it('should add the standing daily charge if available', () => {
    const computedRate = 111.25;
    const standing_charge = 7;
    const daysInYear = 365;
    expect(addStandingChargeToComputedRate(computedRate, standing_charge, daysInYear)).toEqual(2666.25);
  });
});

describe('about calculateFinalRate', () => {
  it('it should return the final rate with VAT and standing charge added as well as naturally rounded', () => {
    const vatRate = 0.05;
    const computedRate = 10350;
    const expectedResult = 108.68;
    expect(calculateFinalRate(vatRate, computedRate)).toEqual(expectedResult);
  });
});

describe('about calculateVatForComputedRate', () => {
  it('it should return the VAT to be added to the rate', () => {
    const vatRate = 0.05;
    const computedRate = 10350;
    const expectedResult = 517.5;
    expect(calculateVatForComputedRate(vatRate, computedRate)).toEqual(expectedResult);
  });
});

describe('about calculateRateWithStandingChargeAndVat', () => {
  it('should return rate with added VAT and standing charge', () => {
    const computedRate = 10350;
    const vatToBeAdded = 517.5;
    const expectedResult = 108.675;
    expect(calculateRateWithStandingChargeAndVat(computedRate, vatToBeAdded)).toEqual(expectedResult);
  });
});

describe('about roundFinalRate', () => {
  it('should naturally round a number to the second decimal point', () => {
    const rateWithStandingChargeAndVat = 108.675;
    const expectedResult = 108.68;
    expect(roundFinalRate(rateWithStandingChargeAndVat)).toEqual(expectedResult);
  });
});
