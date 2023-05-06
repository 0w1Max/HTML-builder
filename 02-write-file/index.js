const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');
const file = 'text.txt';
const finalPath = path.join(__dirname, file);

const writeStream = fs.createWriteStream(finalPath);

stdout.write('Введите текст:\n');
stdout.write('> ');
stdin.on('data', data => {
  const dataString = data.toString();

  stdout.write('> ');

  if (dataString.trim() === 'exit') process.exit();

  writeStream.write(data);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write(`Ваш текст сохранён в файле ${file}`));
