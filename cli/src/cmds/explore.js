const chalk = require('chalk');
const api = require('../api');
const display = require('../display');
const { handleAxiosError } = require('../utils');

module.exports.command = ['explore <resource> <query>', 'search'];

module.exports.describe = 'list resources found by searching';

module.exports.builder = (yargs) => {
  yargs.positional('resource', {
    choices: ['kata', 'workshop'],
  });
};

module.exports.handler = async (argv) => {
  const { resource, query } = argv;
  try {
    const response = await api.get(`/search/${resource}?q=${query}&populate`);

    const results = response.data[`${resource}s`]; // only works on the plural of kata and workshop

    // prettier-ignore
    if (!results.length) return console.log(`No ${resource}s found by "${query}".`);

    if (resource === 'kata') {
      for (const kata of results) {
        await display.kata(kata, { show: false });
      }
    } else if (resource === 'workshop') {
      for (const workshop of results) {
        await display.workshop(workshop, { show: false });
      }
    } else console.log('Unexpected Resource Type', resource);
  } catch (error) {
    if (error.isAxiosError) handleAxiosError(error);
    else console.error(error);
  }
};
