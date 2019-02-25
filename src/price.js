const data = require('../getData')();
const vatRate = require('./constants').vatRate;
const numberOfDaysInYear = require('./constants').numberOfDaysInYear;

const price = ANNUAL_USAGE => {
  let returnResult = [];
  const rawResult = data
    .map(item => generateRawResult(item, ANNUAL_USAGE))
    .sort((a, b) => a.finalRate - b.finalRate);

  rawResult.forEach(item => {
    returnResult.push(`${item.supplier},${item.plan},${item.finalRate}`);
    console.log(`${item.supplier},${item.plan},${item.finalRate}`);
  });
  return returnResult;
};

const generateRawResult = (item, ANNUAL_USAGE) => {
  let usage = ANNUAL_USAGE;
  const { rates, standing_charge } = item;

  let computedRate = rates.reduce((accumulator, currentValue) => {
    while (usage >= 0) {
      const { threshold, price } = currentValue;
      if (threshold) {
        const maxThresholdAllowed = threshold > usage ? usage : threshold;
        usage = usage - maxThresholdAllowed;
        return accumulator + (maxThresholdAllowed * price);
      } else {
        return accumulator + (usage * price);
      }
    }
  }, 0);

  if (standing_charge) {
    computedRate = addStandingChargeToComputedRate(computedRate, standing_charge, numberOfDaysInYear);
  }

  return {
    supplier: item.supplier,
    plan: item.plan,
    finalRate: calculateFinalRate(vatRate, computedRate)
  };
};

const addStandingChargeToComputedRate = (computedRate, standing_charge, numberOfDaysInYear) => {
  const standingChargeValue = numberOfDaysInYear * standing_charge;
  return computedRate + standingChargeValue;
};

const calculateFinalRate = (vatRate, computedRate) => {
  const vatToBeAdded = calculateVatForComputedRate(vatRate, computedRate);
  const rateWithStandingChargeAndVat = calculateRateWithStandingChargeAndVat(computedRate, vatToBeAdded);

  return roundFinalRate(rateWithStandingChargeAndVat);
}

const calculateVatForComputedRate = (vatRate, computedRate) => {
  return computedRate * vatRate;
};

const calculateRateWithStandingChargeAndVat = (computedRate, vatToBeAdded) => {
  return (computedRate + vatToBeAdded) / 100;
}

const roundFinalRate = (rateWithStandingChargeAndVat) => {
  return Math.round(rateWithStandingChargeAndVat * 100) / 100;
}

module.exports = {
  price,
  generateRawResult,
  addStandingChargeToComputedRate,
  calculateFinalRate,
  calculateVatForComputedRate,
  calculateRateWithStandingChargeAndVat,
  roundFinalRate
};
