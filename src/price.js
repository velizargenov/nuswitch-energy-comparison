import { getData } from '../getData';
import { numberOfDaysInYear, vatRate } from './constants';

const data = getData();

export const price = ANNUAL_USAGE => {
  return data
    .map(item => generateRawResult(item, ANNUAL_USAGE))
    .sort((a, b) => a.finalRate - b.finalRate);
};

export const generateRawResult = (item, ANNUAL_USAGE) => {
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

export const addStandingChargeToComputedRate = (computedRate, standing_charge, numberOfDaysInYear) => {
  const standingChargeValue = numberOfDaysInYear * standing_charge;
  return computedRate + standingChargeValue;
};

export const calculateFinalRate = (vatRate, computedRate) => {
  const vatToBeAdded = calculateVatForComputedRate(vatRate, computedRate);
  const rateWithStandingChargeAndVat = calculateRateWithStandingChargeAndVat(computedRate, vatToBeAdded);

  return roundFinalRate(rateWithStandingChargeAndVat);
}

export const calculateVatForComputedRate = (vatRate, computedRate) => {
  return computedRate * vatRate;
};

export const calculateRateWithStandingChargeAndVat = (computedRate, vatToBeAdded) => {
  return (computedRate + vatToBeAdded) / 100;
}

export const roundFinalRate = (rateWithStandingChargeAndVat) => {
  return Math.round(rateWithStandingChargeAndVat * 100) / 100;
}
