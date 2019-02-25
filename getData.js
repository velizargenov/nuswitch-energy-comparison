const fs = require('fs');

const getData = () => {
  const[,, ...args] = process.argv;
  const filePath = (args && args[0]) || './plans.json';
  const sampleData = fs.readFileSync(filePath, 'utf8');
  const sampleDataToJson = JSON.parse(sampleData);

  return sampleDataToJson;
};

module.exports = getData;
