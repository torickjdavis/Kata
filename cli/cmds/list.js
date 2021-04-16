const api = require('../api');

module.exports.command = ['list <resource>', 'ls'];

module.exports.describe = 'list resource';

const PAGE_DEFAULT = 1;
const LIMIT_DEFAULT = 10;

module.exports.builder = (yargs) => {
  yargs
    .positional('resource', {
      choices: ['kata', 'workshop'],
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

async function creatorName(userId) {
  const response = await api.get(`/user/${userId}`);
  const { name } = response.data;
  return `${name.first} ${name.last}`;
}

async function displayKata({ title, creator, date }) {
  const fullName = await creatorName(creator);
  console.log(
    title,
    `(${fullName})`,
    `[${new Date(date).toLocaleDateString()}]`
  );
}

async function displayWorkshop({ title, creator, katas }) {
  const fullName = await creatorName(creator);
  console.group(title, `(${fullName})`);
  for (const kataId of katas) {
    const response = await api.get(`/kata/${kataId}`);
    const kata = response.data;
    displayKata(kata);
  }
  console.groupEnd();
}

module.exports.handler = async (argv) => {
  const {
    resource,
    all = false,
    page = PAGE_DEFAULT,
    limit = LIMIT_DEFAULT,
  } = argv;

  // prettier-ignore
  const response = await api.get(`/${resource}?page=${page}&limit=${limit}&all=${all}`);

  const results = response.data[`${resource}s`]; // only works on the plural of kata and workshop
  const meta = response.data.meta;

  if (!results.length) return console.log(`No ${resource}s to display.`);

  console.group(`Page ${meta.page} of ${meta.pages}`, `(Total ${meta.total})`);
  if (resource === 'kata') {
    // display katas
    for (const kata of results) displayKata(kata);
  } else {
    // display workshops
    for (const workshop of results) displayWorkshop(workshop);
  }
  console.groupEnd();
};
