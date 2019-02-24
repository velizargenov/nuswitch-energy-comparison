const data = require('./getData')();

const price = ANNUAL_USAGE => {
  return 1;
};

const usage = (SUPPLIER_NAME, PLAN_NAME, SPEND) => {
  return 2
};

const exit = () => {
  return 3
};

module.exports = {
  price: price,
  usage: usage,
  exit: exit
};
