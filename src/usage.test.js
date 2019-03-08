import {
  usage,
  getDataForRequestedSupplierAndPlan,
  getAmountInPenceWithoutVatAndStandingCharge,
  calculateAnnualSpendAmount,
  convertToPences,
  removeVat,
  removeStandingCharge,
  getAmountOfEnergyWithoutThresholds,
  getAmountOfEnergyWithThresholds,
  getAmountOfThreshold
} from './usage';

describe.skip('about usage', () => {
  it('should return the expected result when the usage is invoked with the correct arguments', () => {
    const expectedResult = 44267;
    const supplierName = 'edf';
    const planName = 'fixed';
    const spend = 350;

    expect(usage(supplierName, planName, spend)).toEqual(expectedResult);
  });
});

describe('about getDataForRequestedSupplierAndPlan', () => {
  it('should find and return the data for a plan based on supplier name and plan name', () => {
    const data = [
      {"supplier": "eon", "plan": "variable", "rates": [{"price": 13.5, "threshold": 100}, {"price": 10}]},
      {"supplier": "ovo", "plan": "standard", "rates": [{"price": 12.5, "threshold": 300}, {"price": 11}]},
      {"supplier": "edf", "plan": "fixed", "rates": [{"price": 14.5, "threshold": 250}, {"price": 10.1, "threshold": 200}, {"price": 9}]},
      {"supplier": "bg", "plan": "standing-charge", "rates": [{"price": 9}], "standing_charge": 7}
    ];
    const supplierName = 'edf'
    const planName = 'fixed';
    const expectedResult = {"supplier": "edf", "plan": "fixed", "rates": [{"price": 14.5, "threshold": 250}, {"price": 10.1, "threshold": 200}, {"price": 9}]};

    expect(getDataForRequestedSupplierAndPlan(data, supplierName, planName)).toEqual(expectedResult);
  });
});

describe('about getAmountInPenceWithoutVatAndStandingCharge', () => {
  it('should calculate the right amount in pence without VAT and standing charge if any specified', () => {
    const planData = {"supplier": "edf", "plan": "fixed", "rates": [{"price": 14.5, "threshold": 250}, {"price": 10.1, "threshold": 200}, {"price": 9}]};
    const planDataWithStandingCharge = {"supplier": "bg", "plan": "standing-charge", "rates": [{"price": 9}], "standing_charge": 7};
    const numberOfMonthsInYear = 12;

    expect(getAmountInPenceWithoutVatAndStandingCharge(planData, 350, numberOfMonthsInYear)).toEqual(400000);
    expect(getAmountInPenceWithoutVatAndStandingCharge(planDataWithStandingCharge, 120, numberOfMonthsInYear)).toEqual(134588);
  });
});

describe('about calculateAnnualSpendAmount', () => {
  it('should caluclate the annual spend amount based on a monthly spend input', () => {
    const monthlySpend = 350;
    const numberOfMonthsInYear = 12;

    expect(calculateAnnualSpendAmount(monthlySpend, numberOfMonthsInYear)).toEqual(4200);
  });
});

describe('about convertToPences', () => {
  it('should convert pounds to pence', () => {
    expect(convertToPences(100)).toEqual(10000);
  });
});

describe('about removeVat', () => {
  it('should remove VAT from base price', () => {
    expect(removeVat(100, 0.05)).toEqual(95);
  });
});

describe('about removeStandingCharge', () => {
  it('should remove standing charge if specified', () => {
    expect(removeStandingCharge({standing_charge: 7}, 137143, 365)).toEqual(134588);
  });
});

describe('about getAmountOfEnergyWithoutThresholds', () => {
  it('should remove standing charge if specified', () => {
    const rates = [{ price: 9 }];
    const amountInPenceWithoutVatAndStandingCharge = 134588;
    expect(getAmountOfEnergyWithoutThresholds(rates, amountInPenceWithoutVatAndStandingCharge)).toEqual(14954);
  });
});

describe('about getAmountOfEnergyWithThresholds', () => {
  const rates = [ { price: 14.5, threshold: 250 }, { price: 10.1, threshold: 200 }, { price: 9 } ];

  it('should return the amount of energy with calculated threshoulds', () => {
    const amount = 400000;
    expect(getAmountOfEnergyWithThresholds(rates, amount)).toEqual(44267);
  });

  it('should return a map of accumulative total price and total threshold', () => {
    const expectedResult = {
      totalPrice: 5645,
      totalThreshold: 450
    }
    expect(getAmountOfThreshold(rates)).toEqual(expectedResult);
  });
});
