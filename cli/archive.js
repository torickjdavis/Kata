const fs = require('fs');
const fsp = require('fs/promises');
const archiver = require('archiver');
const unzipper = require('unzipper');
const path = require('path');
const ProgressBar = require('progress');

async function zip(filename, directory, displayProgress = false) {
  return new Promise(async (resolve, reject) => {
    directory = path.resolve(directory);
    // prettier-ignore
    if (!fs.existsSync(directory)) return reject(`${directory} does not exist.`);
    const output = fs.createWriteStream(filename);
    const archive = archiver('zip');

    output.on('close', () => resolve(archive.pointer())); // resolve with bytes
    archive.on('warning', (error) => reject(error));
    archive.on('error', (error) => reject(error));

    if (displayProgress) {
      const total = await directorySize(directory);
      const barFormat = `ZIP ${directory} [:bar] :percent :etas`;
      const bar = new ProgressBar(barFormat, { total });
      // prettier-ignore
      archive.on('progress', (progess) => bar.update(progess.fs.processedBytes / total));
    }

    archive.pipe(output);

    archive.directory(directory, false);
    archive.finalize();
  });
}

async function unzip(filename, destination) {
  const directory = await unzipper.Open.file(filename);
  await directory.extract({ path: destination });
}

async function directorySize(directory) {
  return new Promise(async (resolve, reject) => {
    try {
      let size = 0;
      const stat = await fsp.stat(directory);
      size += stat.size;
      if (!stat.isDirectory()) return resolve(size);
      const paths = await fsp.readdir(directory);
      // prettier-ignore
      const sizes = await Promise.all(paths.map((p) => directorySize(path.join(directory, p))));
      size += sizes.reduce((sum, s) => sum + s, 0);
      resolve(size);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { zip, unzip };
