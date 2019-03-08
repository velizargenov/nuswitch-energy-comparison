const priceOutputFormatter = (data) => {
  const { supplier, plan, finalRate } = data;
  console.log(`${supplier},${plan},${finalRate}`)
}

const usageOutputFormatter = (data) => {
  console.log(data)
}

export default {
  price: priceOutputFormatter,
  usage: usageOutputFormatter
}