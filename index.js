import readline from 'readline';
import commands from './commands';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const executeCommandsInOrder = (line) => {
  const [command, ...args] = line.trim().split(' ');
  return commands[command](...args);
}

rl.on('line', executeCommandsInOrder);
