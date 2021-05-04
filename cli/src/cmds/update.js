const fs = require('fs');
const os = require('os');
const path = require('path');
const inquirer = require('inquirer');
const FormData = require('form-data');
const chalk = require('chalk');
const api = require('../api');
const archive = require('../archive');
const { info } = require('../stores');
const {
  fileTimestamp,
  findResourceId,
  handleAxiosError,
  findResourceIds,
} = require('../utils');

module.exports.command = ['update <resource> <search|id|title>', 'publish'];

module.exports.describe = 'update resource';

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
      describe: 'path to Kata content',
    });
};

module.exports.handler = async (argv) => {
  const { resource, path: kataFolder, search } = argv;
  if (resource === 'kata') return updateKata(search.trim(), kataFolder);
  if (resource === 'workshop') return updateWorkshop(search.trim());
  else console.error('Unhandled Resource Type', resource);
};

async function updateKata(search, kataFolder = '.') {
  const accessToken = await info.store.get(info.keys.ACCESS_TOKEN);
  const user = await info.store.get(info.keys.USER);

  const zipFile = path.join(os.tmpdir(), `${fileTimestamp()}.zip`);

  if (!user) return console.log('You must be signed in to update resources.');
  try {
    const kataId = await findResourceId('kata', search);
    if (!kataId) {
      return console.log(`No Kata found by searching for "${search}"`);
    }

    const getKataRes = await api.get(`/kata/${kataId}`);
    const kata = getKataRes.data;

    console.log('Updating', chalk.cyan(kata.title));

    if (kata.creator !== user._id) {
      return console.log(
        'You cannot update this resource, you did not create it.'
      );
    }

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Title:',
        default: kata.title,
      },
      {
        type: 'input',
        name: 'version',
        message: 'Version:',
        default: kata.version,
      },
      {
        type: 'input',
        name: 'kataFolder',
        message: 'Path to Kata Content:',
        default: kataFolder,
      },
    ]);

    await archive.zip(zipFile, answers.kataFolder, true);

    const formData = new FormData();
    formData.append('zip', fs.createReadStream(zipFile));
    formData.append('title', answers.title);
    formData.append('version', answers.version);
    formData.append('date', Date.now());

    await api.patch(`/kata/${kata._id}`, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('Updated', chalk.cyan(answers.title), chalk.yellow(kata._id));
  } catch (error) {
    if (error.isAxiosError) handleAxiosError(error);
    else console.error(error);
  } finally {
    if (fs.existsSync(zipFile)) fs.unlinkSync(zipFile);
  }
}

async function updateWorkshop(search) {
  const accessToken = await info.store.get(info.keys.ACCESS_TOKEN);
  const user = await info.store.get(info.keys.USER);

  if (!user) return console.log('You must be signed in to update resources.');

  try {
    const workshopId = await findResourceId('workshop', search);
    if (!workshopId) {
      return console.log(`No Workshop found by searching for "${search}"`);
    }

    const getWorkshopRes = await api.get(`/workshop/${workshopId}?populate`);
    const workshop = getWorkshopRes.data;

    console.log('Updating', chalk.bold.green(workshop.title));

    // creator._id due to populated result
    if (workshop.creator._id !== user._id) {
      return console.log(
        'You cannot update this resource, you did not create it.'
      );
    }

    const { title, existingKatas } = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Title:',
        default: workshop.title,
      },
      {
        type: 'checkbox',
        name: 'existingKatas',
        message: 'Existing Kata(s)',
        choices: workshop.katas.map(({ title, _id }) => ({
          name: title,
          value: _id,
          checked: true,
        })),
      },
    ]);
    const searchedKatas = [];
    while (true) {
      const { kata } = await inquirer.prompt({
        type: 'input',
        name: 'kata',
        message: `Kata(s) (search/id/title):`,
        default: null,
      });
      if (!kata) break;
      const kataIds = await findResourceIds('kata', kata.trim());
      searchedKatas.push(...kataIds);
    }

    const katas = [...new Set([...existingKatas, ...searchedKatas])];

    await api.patch(
      `/workshop/${workshop._id}`,
      {
        title,
        katas,
        date: Date.now(),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(
      'Updated',
      chalk.bold.green(title),
      `with ${katas.length} Katas`
    );
  } catch (error) {
    if (error.isAxiosError) handleAxiosError(error);
    else console.error(error);
  }
}
