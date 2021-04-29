const inquirer = require('inquirer');
const chalk = require('chalk');
const api = require('../api');
const { info } = require('../stores');
const { findResourceId, handleAxiosError } = require('../utils');

module.exports.command = [
  'delete <resource> <search|id|title>',
  'remove',
  'rm',
];

module.exports.describe = 'delete resource';

module.exports.builder = (yargs) => {
  yargs
    .positional('resource', {
      choices: ['kata', 'workshop'],
    })
    .positional('search', {
      describe: 'term to find resource by id, title, or general search',
      type: 'string',
    });
};

module.exports.handler = async (argv) => {
  const { resource, search } = argv;
  if (resource === 'kata') return deleteKata(search.trim());
  if (resource === 'workshop') return deleteWorkshop(search.trim());
  else console.error('Unhandled Resource Type', resource);
};

async function deleteKata(search) {
  const accessToken = await info.store.get(info.keys.ACCESS_TOKEN);
  const user = await info.store.get(info.keys.USER);

  if (!user) return console.log('You must be signed in to delete resources.');

  try {
    const kataId = await findResourceId('kata', search);
    if (!kataId) {
      return console.log(`No Kata found by searching for "${search}"`);
    }

    const getKataRes = await api.get(`/kata/${kataId}`);
    const kata = getKataRes.data;

    if (kata.creator !== user._id) {
      return console.log(
        'You cannot update this resource, you did not create it.'
      );
    }

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to delete ${chalk.cyan(
          kata.title
        )}? This is irreversible!`,
        default: false,
      },
    ]);

    if (!confirm) return console.log('Cancelled delete.');

    await api.delete(`/kata/${kata._id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('Deleted', chalk.cyan(kata.title), chalk.yellow(kata._id));
  } catch (error) {
    if (error.isAxiosError) handleAxiosError(error);
    else console.error(error);
  }
}

async function deleteWorkshop(search) {
  const accessToken = await info.store.get(info.keys.ACCESS_TOKEN);
  const user = await info.store.get(info.keys.USER);

  try {
    const workshopId = await findResourceId('workshop', search);
    if (!workshopId) {
      return console.log(`No Workshop found by searching for "${search}"`);
    }

    const getWorkshopRes = await api.get(`/workshop/${workshopId}`);
    const workshop = getWorkshopRes.data;

    if (workshop.creator !== user._id) {
      return console.log(
        'You cannot update this resource, you did not create it.'
      );
    }

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to delete ${chalk.cyan(
          workshop.title
        )}? This is irreversible!`,
        default: false,
      },
    ]);

    if (!confirm) return console.log('Cancelled delete.');

    await api.delete(`/workshop/${workshop._id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(
      'Deleted',
      chalk.bold.green(workshop.title),
      chalk.yellow(workshop._id)
    );
  } catch (error) {
    if (error.isAxiosError) handleAxiosError(error);
    else console.error(error);
  }
}
