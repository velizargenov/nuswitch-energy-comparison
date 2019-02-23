const fs = require('fs');
const path = require('path');

const getData = () => {
  const[,, ...args] = process.argv;
  const filePath = path.join(__dirname, args[0]);
  const sampleData = fs.readFileSync(filePath, 'utf8');
  const sampleDataToJson = JSON.parse(sampleData);

  return sampleDataToJson;
};

module.exports = getData;
