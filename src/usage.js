import { getData } from '../getData';
import { vatRate, daysInYear, monthsInYear } from './constants';

const data = getData();

export const usage = (SUPPLIER_NAME, PLAN_NAME, SPEND) => {
  const planData = data.find(({ supplier, plan }) => supplier === SUPPLIER_NAME && plan === PLAN_NAME);
  const amountInPenceWithoutVatAndStandingCharge = getAmountInPenceWithoutVatAndStandingCharge(planData, SPEND, monthsInYear);
  const { rates } = planData;

  const finalEnergyUsage = rates.some(rate => rate.threshold)
    ? getAmountOfEnergyWithThresholds(rates, amountInPenceWithoutVatAndStandingCharge)
    : getAmountOfEnergyWithoutThresholds(rates, amountInPenceWithoutVatAndStandingCharge)

  return [finalEnergyUsage];
};

export const getAmountInPenceWithoutVatAndStandingCharge = (planData, monthlySpend, monthsInYear) => {
  const annualAmountInPounds = monthlySpend * monthsInYear;
  const amountInPence = annualAmountInPounds * 100;
  const amountWithoutVat = Math.round(amountInPence / (1 + vatRate));
  const amountWithoutVatAndStandingCharge = removeStandingCharge(planData, amountWithoutVat, daysInYear);

  return amountWithoutVatAndStandingCharge;
}

export const removeStandingCharge = ({ standing_charge }, amount, daysInYear) => {
  return standing_charge ? amount - (standing_charge * daysInYear) : amount;
};

export const getAmountOfEnergyWithThresholds = (rates, amount) => {
  const amountOfTotalThresholdPrice = getAmountOfThreshold(rates, amount);
  const { totalPrice, totalThreshold } = amountOfTotalThresholdPrice;
  const tempAmount = amount - totalPrice;
  const baseRate = rates.filter(rate => !rate.threshold)
  const baseRateUsage = Math.round(tempAmount / baseRate[0].price);

  return baseRateUsage + totalThreshold;
}

export const getAmountOfThreshold = (rates) => {
  return rates
    .filter(rate => rate.threshold)
    .reduce(calculateTotalPriceAndThreshold, 0)
}

const calculateTotalPriceAndThreshold = (acc, currentValue) => {
  const { price, threshold } = currentValue;
  const priceInThreshold = price * threshold;
  const totalPrice = acc['totalPrice'] ? acc['totalPrice'] + priceInThreshold : priceInThreshold;
  const totalThreshold = acc['totalThreshold'] ? acc['totalThreshold'] + threshold : threshold;

  return {
    ...acc,
    totalPrice,
    totalThreshold
  }
}

export var getAmountOfEnergyWithoutThresholds = (rates, amount) => {
  return Math.round(amount / rates[0].price);
}
