const fs = require('fs');
const path = require('path')
const file = 'text.txt';

fs.readFile(
  path.join(__dirname, file),
  'utf-8',
  (err, data) => {
    if (err) return console.error(err.message);
    console.log(data);
  }
);
