const chalk = require('chalk');
const api = require('../api');
const display = require('../display');

module.exports.command = ['list <resource>', 'ls'];

module.exports.describe = 'list resource';

const PAGE_DEFAULT = 1;
const LIMIT_DEFAULT = 10;
const { MIN_ID_LENGTH } = display;

module.exports.builder = (yargs) => {
  yargs
    .positional('resource', {
      choices: ['kata', 'workshop'],
    })
    .option('id-show', {
      alias: 'i',
      type: 'boolean',
      describe: 'output the resource ID',
    })
    .option('id-length', {
      type: 'number',
      describe: `limit the resource ID length (default and min ${MIN_ID_LENGTH})`,
      coerce(arg) {
        if (arg === undefined || arg === null) return MIN_ID_LENGTH;
        if (MIN_ID_LENGTH <= arg) return arg;
        throw new Error('Minimum Length of 6');
      },
      implies: 'id-show',
    })
    .option('page', {
      alias: 'p',
      type: 'number',
      describe: `the requested page number; omitted means page ${PAGE_DEFAULT}`,
    })
    .option('limit', {
      alias: 'l',
      type: 'number',
      describe: `the number of results per page; defaults as ${LIMIT_DEFAULT}`,
    })
    .option('all', {
      alias: 'a',
      type: 'boolean',
      describe: 'show all results for a resource',
      conflicts: ['page', 'limit'],
    });
};

module.exports.handler = async (argv) => {
  const {
    resource,
    idShow,
    idLength,
    all = false,
    page = PAGE_DEFAULT,
    limit = LIMIT_DEFAULT,
  } = argv;

  // prettier-ignore
  const response = await api.get(`/${resource}?page=${page}&limit=${limit}&all=${all}&populate`);

  const results = response.data[`${resource}s`]; // only works on the plural of kata and workshop
  const meta = response.data.meta;

  if (!results.length) return console.log(`No ${resource}s to display.`);

  console.group(`Page ${meta.page} of ${meta.pages}`, `(Total ${meta.total})`);
  if (resource === 'kata') {
    // display katas
    for (const kata of results) {
      await display.kata(kata, { show: idShow, length: idLength });
    }
  } else if (resource === 'workshop') {
    // display workshops
    for (const workshop of results) {
      await display.workshop(workshop, { show: idShow, length: idLength });
    }
  } else console.log('Unexpected Resource Type', resource);
  console.groupEnd();
};
