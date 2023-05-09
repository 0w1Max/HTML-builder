const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const assets = path.join(__dirname, 'assets');
const dist = path.join(__dirname, 'project-dist');
const components = path.join(__dirname, 'components');

const createDir = async (dir) => {
  await fsPromises.mkdir(dir, {recursive: true});
}

const removeFiles = async () => {
  await createDir(dist);

  const copiedPath = path.join(dist, 'assets');
  const copyAssets = await fsPromises.readdir(dist, { withFileTypes: true });
  
  copyAssets.forEach(async dir => {
    if (dir.name === 'assets') {
      const copiedFiles = await fsPromises.readdir(copiedPath, { withFileTypes: true });

      copiedFiles.forEach(async file => {
        if (file) {
          const copy = path.join(copiedPath, file.name);

          if (file.isDirectory()) {
            const currentDir = await fsPromises.readdir(copy, { withFileTypes: true });
            currentDir.forEach(async files => {
              if (files && files.isFile()) {
                await fsPromises.unlink(path.join(copy, files.name));
                console.log('Unlink ' + files.name);
              }
            });

            // await fsPromises.rmdir(copy, {recursive: true});
          }
        }
      });
    }
  });
};

const copyDir = async (srcDir, newDir) => {
  await createDir(newDir);

  const originFiles = await fsPromises.readdir(srcDir, { withFileTypes: true });

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

      fsPromises.copyFile(originFile, copiedFile);
    }
  });
};

const generateTemplates = async () => {
  let template = await fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8')
  const componentsList = Array.from(template.match(/{{([^{}]+)}}/g));

  componentsList.forEach(async componentName => {
    const componentPath = path.join(components, `${componentName.slice(2, -2)}.html`);

    const componentFile = await fsPromises.readFile(componentPath, 'utf-8');
    template = await template.replaceAll(componentName, componentFile);

    fsPromises.writeFile(path.join(dist, 'index.html'), template, 'utf-8');
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

(async () => {
  await removeFiles();
  await copyDir(assets, dist);
  await generateTemplates();
  await createStyles();
})();
