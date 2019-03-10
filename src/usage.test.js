import {
  usage,
  getAmountInPenceWithoutVatAndStandingCharge,
  removeStandingCharge,
  getAmountOfEnergyWithoutThresholds,
  getAmountOfEnergyWithThresholds,
  getAmountOfThreshold
} from './usage';

describe('about usage', () => {
  it('should return the expected result when the usage is invoked with the correct arguments', () => {
    const expectedResult = [44267];
    const supplierName = 'edf';
    const planName = 'fixed';
    const spend = 350;

    expect(usage(supplierName, planName, spend)).toEqual(expectedResult);
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

  it('should return the amount of energy with calculated thresholds', () => {
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
