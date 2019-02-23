#!/usr/bin/env node

const readline = require('readline');
const obj = require('./main');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const executeCommandsInOrder = (line) => {
  const arr = line.split(' ');
  const funToExecute = obj[arr[0]](arr[1])
  console.log('obj: ', funToExecute);
}

rl.on('line', executeCommandsInOrder);
