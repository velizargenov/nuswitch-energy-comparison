import readline from 'readline';
import commands from './commands';
import outputFormatter from './outputFormatter';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const executeCommandsInOrder = (line) => {
  const [command, ...args] = line.trim().split(' ');
  const result = commands[command](...args);
  return result.map(data => outputFormatter[command](data));
}

rl.on('line', executeCommandsInOrder);
