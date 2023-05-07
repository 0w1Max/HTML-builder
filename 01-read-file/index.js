const fs = require('fs');
const path = require('path');
const file = `text.txt`;
const finalPath = path.join(__dirname, file);

const readableStream = fs.createReadStream(finalPath, 'utf-8');

let data = '';

readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => process.stdout.write(data));
readableStream.on('error', err => console.log(err.message));
