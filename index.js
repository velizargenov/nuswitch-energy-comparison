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
  const planName = args.slice(1, args.length - 1).join(' ');
  const newArgs = [args[0], planName, args[args.length - 1]];

  const result = commands[command](...newArgs);
  return result.map(data => outputFormatter[command](data));
}

rl.on('line', executeCommandsInOrder);
