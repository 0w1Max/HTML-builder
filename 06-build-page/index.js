const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const assets = path.join(__dirname, 'assets');
const dist = path.join(__dirname, 'project-dist');
const components = path.join(__dirname, 'components');

const createDir = async (dir) => {
  await fsPromises.mkdir(dir, {recursive: true});
}

// const unlinkFiles = async () => {
  // copiedFiles.forEach(async file => {
  //   const copiedFile = path.join(dist, file.name);
  //   console.log('Unlink ' + file.name);

  //   await fsPromises.unlink(copiedFile);
  // });
// };

const copyDir = async (srcDir, newDir) => {
  await createDir(newDir);

  const originFiles = await fsPromises.readdir(srcDir, { withFileTypes: true });
  // const copiedFiles = await fsPromises.readdir(dist, { withFileTypes: true });

  // copiedFiles.forEach(async file => {
  //   const copiedFile = path.join(dist, file.name);
  //   console.log('Unlink ' + file.name);

  //   await fsPromises.unlink(copiedFile);
  // });

  originFiles.forEach(async file => {
    if (file.isDirectory()) {;
      const currentSrcDir = path.join(assets, file.name);
      const currentCopyDir = path.join(newDir, 'assets', file.name);

      await createDir(currentCopyDir);
      await copyDir(currentSrcDir, currentCopyDir);
    }

    if (file.isFile()) {
      const originFile = path.join(srcDir, file.name);
      const copiedFile = path.join(newDir, file.name);

      await fsPromises.copyFile(originFile, copiedFile);
    }
  });
};

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
  });
};

copyDir(assets, dist);
createStyles();
