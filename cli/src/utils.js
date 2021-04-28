const api = require('./api');
const inquirer = require('inquirer');

function fileTimestamp() {
  const now = new Date();
  now.setMilliseconds(0);
  return now.toISOString().replace('.000Z', '').replace(/[T:]/g, '_');
}

function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1);
}

async function findResourceIds(resource, search, multiple = true) {
  //returns multiple ? always an array : id or null
  const res = await api.get(`/search/${resource}?q=${search.trim()}`);
  const searchResults = res.data[`${resource}s`];

  const resourceName = `${capitalize(resource)}${multiple ? '(s)' : ''}`;

  if (!searchResults.length) return multiple ? [] : null;
  if (searchResults.length === 1) {
    return multiple ? searchResults : searchResults[0]._id;
  }

  const { selected } = await inquirer.prompt([
    {
      type: multiple ? 'checkbox' : 'list',
      name: 'selected',
      message: `Select ${resourceName} from Search Result:`,
      choices: searchResults.map(({ title, _id }) => ({
        name: title,
        value: _id,
      })),
    },
  ]);
  return selected; // will be array if checkbox; otherwise one item
}

async function findResourceId(resource, search) {
  return await findResourceIds(resource, search, false);
}

function handleAxiosError(error) {
  if (!error.isAxiosError) throw error;
  console.error('There was an API error with your request.');
  console.error(error.message);
  if (error.response?.data?.message === 'jwt expired') {
    return console.error('Your access token has expired, please login again.');
  }
  console.error(error.response?.data || 'No further details from the API.');
}

module.exports = {
  fileTimestamp,
  capitalize,
  findResourceIds,
  findResourceId,
  handleAxiosError,
};
