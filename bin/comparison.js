#!/usr/bin/env node

const readline = require('readline');
const exported = require('./index');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const executeCommandsInOrder = (line) => {
  const args = line.split(' ');
  const functionName = args && args[0];
  const functionParameters = [].slice.call(args.splice(1));

  return exported[functionName](...functionParameters);
}

rl.on('line', executeCommandsInOrder);
