const fs = require('fs');
const path = require('path');
const { stdout } = process;
const folder = 'secret-folder';
const finalPath = path.join(__dirname, folder);

fs.readdir(finalPath, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err.message);

  files.forEach(file => {
    if (file.isFile()) {
      fs.stat(path.join(finalPath, file.name), (err, stats) => {
        if (err) console.log(err.message);

        const ext = path.extname(file.name).slice(1);
        const size = (stats.size / 1024).toFixed(1);
        const output = `${file.name} - ${ext} - ${size}kb\n`;

        stdout.write(output);
      })
    }
  });
});
