const data = require('../getData')();
const numberOfMonthsInYear = require('./constants').numberOfMonthsInYear;
const numberOfDaysInYear = require('./constants').numberOfDaysInYear;
const vatRate = require('./constants').vatRate;

const usage = (SUPPLIER_NAME, PLAN_NAME, SPEND) => {
  const planData = getDataForRequestedSupplierAndPlan(data, SUPPLIER_NAME, PLAN_NAME);
  const amountInPenceWithoutVatAndStandingCharge = getAmountInPenceWithoutVatAndStandingCharge(planData, SPEND, numberOfMonthsInYear);
  const { rates } = planData;

  const finalEnergyUsage = rates.some(rate => rate.threshold)
    ? getAmountOfEnergyWithThresholds(rates, amountInPenceWithoutVatAndStandingCharge)
    : getAmountOfEnergyWithoutThresholds(rates, amountInPenceWithoutVatAndStandingCharge)

  console.log(finalEnergyUsage);
  return finalEnergyUsage;
};

const getDataForRequestedSupplierAndPlan = (data, supplierName, planName) => {
  return data.find(({ supplier, plan }) => supplier === supplierName && plan === planName);
};

const getAmountInPenceWithoutVatAndStandingCharge = (planData, spend, numberOfMonthsInYear) => {
  const annualSpendAmountInPounds = calculateAnnualSpendAmount(spend, numberOfMonthsInYear);
  const annualSpendAmountInPences = convertToPences(annualSpendAmountInPounds);
  const amountWithoutVat = removeVat(annualSpendAmountInPences, vatRate);
  const amountWithoutVatAndStandingCharge = removeStandingCharge(planData, amountWithoutVat, numberOfDaysInYear);

  return amountWithoutVatAndStandingCharge;
}

const calculateAnnualSpendAmount = (monthlySpend, numberOfMonthsInYear) => {
  return monthlySpend * numberOfMonthsInYear;
};

const convertToPences = (amount) => {
  return amount * 100;
};

const removeVat = (amount, vatRate) => {
  return Math.round(amount / (1 + vatRate));
};

const removeStandingCharge = ({ standing_charge }, amount, numberOfDaysInYear) => {
  return standing_charge ? amount - (standing_charge * numberOfDaysInYear) : amount;
};

const getAmountOfEnergyWithThresholds = (rates, amount) => {
  const amountOfTotalThresholdPrice = getAmountOfThreshold(rates, amount);
  const { totalPrice, totalThreshold } = amountOfTotalThresholdPrice;
  const tempAmount = amount - totalPrice;
  const baseRate = rates.filter(rate => !rate.threshold)
  const baseRateUsage = Math.round(tempAmount / baseRate[0].price);

  return baseRateUsage + totalThreshold;
}

var getAmountOfThreshold = (rates) => {
  return rates
    .filter(rate => rate.threshold)
    .reduce((acc, currentValue) => {
      const { price, threshold } = currentValue;
      const priceInThreshold = price * threshold;
      const totalPrice = acc['totalPrice'] ? acc['totalPrice'] + priceInThreshold : priceInThreshold;
      const totalThreshold = acc['totalThreshold'] ? acc['totalThreshold'] + threshold : threshold;

      return {
        ...acc,
        ['totalPrice']: totalPrice,
        ['totalThreshold']: totalThreshold
      }
    },0)
}

var getAmountOfEnergyWithoutThresholds = (rates, amount) => {
  return Math.round(amount / (rates && rates[0] && rates[0].price));
}

module.exports = {
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
}
