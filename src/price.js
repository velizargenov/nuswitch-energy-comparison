const data = require('../bin/getData')();
const vatRate = 5;
const daysInYear = 365;

const addStandingChargeToComputedRate = (computedRate, standing_charge, daysInYear) => {
  const standingChargeValue = daysInYear * standing_charge;
  return computedRate + standingChargeValue;
};

const calculateVatForComputedRate = (vatRate, computedRate) => {
  return computedRate * (vatRate / 100);
};

const calculateRateWithStandingChargeAndVat = (computedRate, vatToBeAdded) => {
  return (computedRate + vatToBeAdded) / 100;
}

const roundFinalRate = (rateWithStandingChargeAndVat) => {
  return Math.round(rateWithStandingChargeAndVat * 100) / 100;
}

const calculateFinalRate = (vatRate, computedRate) => {
  const vatToBeAdded = calculateVatForComputedRate(vatRate, computedRate);
  const rateWithStandingChargeAndVat = calculateRateWithStandingChargeAndVat(computedRate, vatToBeAdded);
  const roundedFinalRate = roundFinalRate(rateWithStandingChargeAndVat);

  return roundedFinalRate;
}

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

  // Check if there is standing_charge and update computedRate
  if (standing_charge) {
    computedRate = addStandingChargeToComputedRate(computedRate, standing_charge, daysInYear);
  }

  // Calculate final price inclusive VAT and standing_charge if applicable
  const finalRate = calculateFinalRate(vatRate, computedRate);

  return {
    supplier: item.supplier,
    plan: item.plan,
    finalRate: finalRate
  };
};

const price = ANNUAL_USAGE => {
  const rawResult = data.map(item => generateRawResult(item, ANNUAL_USAGE));
  rawResult.sort((a, b) => (a.finalRate > b.finalRate) ? 1 : -1);
  let returnResult = [];
  rawResult.forEach(item => {
    console.log(`${item.supplier},${item.plan},${item.finalRate}`);
    returnResult.push(`${item.supplier},${item.plan},${item.finalRate}`)
  });
  return returnResult;
};

module.exports = price;
