const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const assets = path.join(__dirname, 'assets');
const dist = path.join(__dirname, 'project-dist');
const components = path.join(__dirname, 'components');

const createDir = async () => {
  await fsPromises.mkdir(dist, {recursive: true});
}

// const copyDir = async (originDir, newDir) => {
//   await fsPromises.mkdir(newDir, {recursive: true});

//   const originFiles = await fsPromises.readdir(originDir, { withFileTypes: true });
//   const copiedFiles = await fsPromises.readdir(newDir, { withFileTypes: true });

//   copiedFiles.forEach(async file => {
//     const copiedFile = path.join(newDir, file.name);

//     await fsPromises.unlink(copiedFile);
//   });

//   originFiles.forEach(async file => {
//     if (file.isDirectory()) {
//       const mainDir = path.join(originDir, file.name);
//       const newDir = path.join(dist, 'assets', file.name);

//       console.log(mainDir);
//       console.log(newDir);
//       await copyDir(mainDir, path.join(dist, 'assets', file.name));
//     }

//     if (file.isFile()) {
//       const originFile = path.join(originDir, file.name);
//       const copiedFile = path.join(newDir, file.name);

//       await fsPromises.copyFile(originFile, copiedFile);
//     }
//   });
// };

const createStyles = async () => {
  const stylesPath = path.join(__dirname, 'styles');
  const bundleFile = path.join(dist, 'style.css');

  const writeStream = fs.createWriteStream(bundleFile);
  const styleFiles = await fsPromises.readdir(stylesPath, {withFileTypes: true});

  styleFiles.forEach(file => {
    const readStream = fs.createReadStream(path.join(stylesPath, file.name));

    if (file.isFile() && path.extname(file.name) === '.css') {
      readStream.pipe(writeStream).on('error', err => console.log(err));
    }
  })
}

createDir();
// copyDir(assets, path.join(dist, 'assets'));
createStyles();
