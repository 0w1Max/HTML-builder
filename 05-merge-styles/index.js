const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');

const createBundle = async () => {
  const writeStream = fs.createWriteStream(bundleFile);
  const styleFiles = await fsPromises.readdir(stylesPath, {withFileTypes: true});

  styleFiles.forEach(file => {
    const readStream = fs.createReadStream(path.join(stylesPath, file.name));

    if (file.isFile() && path.extname(file.name) === '.css') {
      readStream.pipe(writeStream).on('error', err => console.log(err));
    }
  })
};

createBundle();