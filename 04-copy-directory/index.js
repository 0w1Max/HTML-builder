const fsPromises = require('fs/promises');
const path = require('path');
const originalFolder = 'files';
const copiedFolder = 'files-copy';
const originalPath = path.join(__dirname, originalFolder);
const copiedPath = path.join(__dirname, copiedFolder);

const copyDir = async () => {
  try {
    await fsPromises.mkdir(copiedPath, {recursive: true});

    const originalFiles = await fsPromises.readdir(originalPath, { withFileTypes: true });
    const copiedFiles = await fsPromises.readdir(copiedPath, { withFileTypes: true });

    copiedFiles.forEach(async file => {
      const copiedFile = path.join(copiedPath, file.name);

      await fsPromises.unlink(copiedFile);
    });

    originalFiles.forEach(async file => {
      if (file.isFile()) {
        const originalFile = path.join(originalPath, file.name);
        const copiedFile = path.join(copiedPath, file.name);

        await fsPromises.copyFile(originalFile, copiedFile);
      }
    });
  }
  catch (err) {
    console.log(err);
  }
};

copyDir();
