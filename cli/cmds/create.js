const fs = require('fs');
const os = require('os');
const path = require('path');
const inquirer = require('inquirer');
const FormData = require('form-data');
const chalk = require('chalk');
const api = require('../api');
const archive = require('../archive');
const { info } = require('../stores');
const { fileTimestamp } = require('../util');

module.exports.command = ['create <resource>', 'init', 'make', 'mk'];

module.exports.describe = 'create resource';

module.exports.builder = (yargs) => {
  yargs
    .positional('resource', {
      choices: ['kata', 'workshop'],
    })
    .option('path', {
      alias: 'p',
      type: 'string',
      describe: 'path to Kata content',
    });
};

module.exports.handler = async (argv) => {
  const { resource, path: kataFolder } = argv;
  if (resource === 'kata') return createKata(kataFolder);
  if (resource === 'workshop') return createWorkshop();
};

async function createKata(kataFolder = '.') {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Title:',
    },
    {
      type: 'input',
      name: 'version',
      message: 'Version:',
      default: '1.0.0',
    },
    {
      type: 'input',
      name: 'kataFolder',
      message: 'Path to Kata Content:',
      default: kataFolder,
    },
  ]);
  const zipFile = path.join(os.tmpdir(), `${fileTimestamp()}.zip`);
  try {
    await archive.zip(zipFile, answers.kataFolder, true);

    const accessToken = await info.store.get(info.keys.ACCESS_TOKEN);
    const user = await info.store.get(info.keys.DECODED_TOKEN);

    const formData = new FormData();
    formData.append('zip', fs.createReadStream(zipFile));
    formData.append('title', answers.title);
    formData.append('version', answers.version);
    formData.append('creator', user._id);

    const res = await api.post('/kata', formData, {
      headers: {
        ...formData.getHeaders(),
        Authentication: `Bearer ${accessToken}`,
      },
    });
    console.log(
      'Created',
      chalk.cyan(answers.title),
      chalk.yellow(res.data._id)
    );
  } catch (error) {
    console.error(error);
  } finally {
    if (fs.existsSync(zipFile)) fs.unlinkSync(zipFile);
  }
}

async function createWorkshop() {
  const { title } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Title:',
    },
  ]);
  const katas = [];
  while (true) {
    const { kata } = await inquirer.prompt({
      type: 'input',
      name: 'kata',
      message: `Kata (id/title):`,
      default: null,
    });
    if (!kata) break;
    const res = await api.get(`/search/kata?q=${kata.trim()}`);
    const queryKatas = res.data.katas;

    if (!queryKatas.length)
      console.log(`No Kata found by searching for "${kata}"`);
    if (queryKatas.length === 1) katas.push(queryKatas[0]._id);
    else {
      const { selected } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'selected',
          message: 'Select Kata(s) from Search Result:',
          choices: queryKatas.map((k) => ({ name: k.title, value: k._id })),
        },
      ]);
      katas.push(...selected);
    }
  }

  try {
    const accessToken = await info.store.get(info.keys.ACCESS_TOKEN);
    const user = await info.store.get(info.keys.DECODED_TOKEN);

    await api.post(
      '/workshop',
      {
        title,
        katas,
        creator: user._id,
      },
      {
        headers: {
          Authentication: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(
      'Created',
      chalk.bold.green(title),
      `with ${katas.length} Katas`
    );
  } catch (error) {
    console.error(error);
  }
}
