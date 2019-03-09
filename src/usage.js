import { getData } from '../getData';
import { vatRate, daysInYear, monthsInYear } from './constants';

const data = getData();

export const usage = (SUPPLIER_NAME, PLAN_NAME, SPEND) => {
  const planData = getDataForRequestedSupplierAndPlan(data, SUPPLIER_NAME, PLAN_NAME);
  const amountInPenceWithoutVatAndStandingCharge = getAmountInPenceWithoutVatAndStandingCharge(planData, SPEND, monthsInYear);
  const { rates } = planData;

  const finalEnergyUsage = rates.some(rate => rate.threshold)
    ? getAmountOfEnergyWithThresholds(rates, amountInPenceWithoutVatAndStandingCharge)
    : getAmountOfEnergyWithoutThresholds(rates, amountInPenceWithoutVatAndStandingCharge)

  return [finalEnergyUsage];
};

export const getDataForRequestedSupplierAndPlan = (data, supplierName, planName) => {
  return data.find(({ supplier, plan }) => supplier === supplierName && plan === planName);
};

export const getAmountInPenceWithoutVatAndStandingCharge = (planData, spend, monthsInYear) => {
  const annualSpendAmountInPounds = calculateAnnualSpendAmount(spend, monthsInYear);
  const annualSpendAmountInPence = convertToPence(annualSpendAmountInPounds);
  const amountWithoutVat = removeVat(annualSpendAmountInPence, vatRate);
  const amountWithoutVatAndStandingCharge = removeStandingCharge(planData, amountWithoutVat, daysInYear);

  return amountWithoutVatAndStandingCharge;
}

export const calculateAnnualSpendAmount = (monthlySpend, monthsInYear) => {
  return monthlySpend * monthsInYear;
};

export const convertToPence = (amount) => {
  return amount * 100;
};

export const removeVat = (amount, vatRate) => {
  return Math.round(amount / (1 + vatRate));
};

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
    .reduce((acc, currentValue) => {
      const { price, threshold } = currentValue;
      const priceInThreshold = price * threshold;
      const totalPrice = acc['totalPrice'] ? acc['totalPrice'] + priceInThreshold : priceInThreshold;
      const totalThreshold = acc['totalThreshold'] ? acc['totalThreshold'] + threshold : threshold;

      return {
        ...acc,
        totalPrice,
        totalThreshold
      }
    },0)
}

export var getAmountOfEnergyWithoutThresholds = (rates, amount) => {
  return Math.round(amount / (rates && rates[0] && rates[0].price));
}
