const fs = require('fs');
const os = require('os');
const path = require('path');
const chalk = require('chalk');
const api = require('../api');
const archive = require('../archive');
const { kata: kataStore } = require('../stores');
const { fileTimestamp, findResourceId, handleAxiosError } = require('../utils');

module.exports.command = ['read <resource> <search|id|title>', 'get'];

module.exports.describe = 'read and retrieve resource';

module.exports.builder = (yargs) => {
  yargs
    .positional('resource', {
      choices: ['kata', 'workshop'],
    })
    .positional('search', {
      describe: 'term to find resource by id, title, or general search',
      type: 'string',
    })
    .option('path', {
      alias: 'p',
      type: 'string',
      describe: 'path where to extract Kata(s)',
      default: '.',
    });
};

module.exports.handler = async (argv) => {
  const { resource, path: baseFolder, search } = argv;
  if (resource === 'kata') return readKata(search.trim(), baseFolder);
  if (resource === 'workshop') return readWorkshop(search.trim(), baseFolder);
  else console.error('Unhandled Resource Type', resource);
};

async function downloadKata(kataId, baseFolder) {
  let downloadPath = null;
  try {
    const getKataRes = await api.get(`/kata/${kataId}`);
    const kata = getKataRes.data;

    downloadPath = path.join(
      os.tmpdir(),
      `kata.${kataId}.${fileTimestamp()}.zip`
    );

    const extractPath = path.resolve(baseFolder);
    console.log(
      'Downloading',
      chalk.cyan(kata.title),
      'and extracting to:',
      chalk.grey(extractPath)
    );

    const downloadRes = await api.get(`/download/${kataId}`, {
      responseType: 'stream',
    });
    const writer = fs.createWriteStream(downloadPath);

    downloadRes.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const kataPath = path.join(extractPath, kata.title);

    await archive.unzip(downloadPath, kataPath);

    await kataStore.store.set(kataPath, kataId);
  } catch (error) {
    if (error.isAxiosError) handleAxiosError(error);
    else console.error(error);
  } finally {
    if (downloadPath && fs.existsSync(downloadPath)) {
      fs.unlinkSync(downloadPath);
    }
  }
}

async function readKata(search, baseFolder) {
  try {
    const kataId = await findResourceId('kata', search);
    if (!kataId) {
      return console.log(`No Kata found by searching for "${search}"`);
    }
    await downloadKata(kataId, baseFolder);
  } catch (error) {
    if (error.isAxiosError) handleAxiosError(error);
    else console.error(error);
  }
}

async function readWorkshop(search, baseFolder) {
  try {
    const workshopId = await findResourceId('workshop', search);
    if (!workshopId) {
      return console.log(`No Workshop found by searching for "${search}"`);
    }

    const getWorkshopRes = await api.get(`/workshop/${workshopId}`);
    const workshop = getWorkshopRes.data;
    console.group('Downloading', chalk.green(workshop.title), 'to', baseFolder);
    const downloads = [];
    for (const kataId of workshop.katas) {
      downloads.push(
        downloadKata(
          kataId,
          path.join(path.resolve(baseFolder), workshop.title)
        )
      );
    }
    await Promise.all(downloads);
    console.groupEnd();
  } catch (error) {
    if (error.isAxiosError) handleAxiosError(error);
    else console.error(error);
  }
}
