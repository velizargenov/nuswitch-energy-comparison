import { getData } from '../getData';
import { daysInYear, vatRate } from './constants';

const data = getData();

export const price = ANNUAL_USAGE => {
  return data
    .map(item => generateRawResult(item, ANNUAL_USAGE))
    .sort((a, b) => a.finalRate - b.finalRate);
};

export const generateRawResult = (item, ANNUAL_USAGE) => {
  const { rates, standing_charge } = item;
  let computedRate = getBaseComputedRate(rates, ANNUAL_USAGE);

  if (standing_charge) {
    computedRate = addStandingCharge(computedRate, standing_charge, daysInYear);
  }

  return {
    supplier: item.supplier,
    plan: item.plan,
    finalRate: calculateFinalRate(vatRate, computedRate)
  };
};

const getBaseComputedRate = (rates, ANNUAL_USAGE) => {
  let usage = ANNUAL_USAGE;

  return rates.reduce((accumulator, currentValue) => {
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
}

export const addStandingCharge = (computedRate, standing_charge, daysInYear) => {
  return computedRate + (daysInYear * standing_charge);
};

export const calculateFinalRate = (vatRate, computedRate) => {
  const vatToBeAdded = computedRate * vatRate;
  const rateWithStandingChargeAndVat = (computedRate + vatToBeAdded) / 100;

  return Math.round(rateWithStandingChargeAndVat * 100) / 100;
}
