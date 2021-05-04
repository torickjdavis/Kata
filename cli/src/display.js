const chalk = require('chalk');
const api = require('./api');

const MIN_ID_LENGTH = 6;

function idFormat({ show, length = MIN_ID_LENGTH }) {
  return (id) => (show ? id.substring(0, length) : '');
}

async function displayKata({ _id, title, creator, date }, idConfig) {
  const id = idFormat(idConfig)(_id);
  console.log(
    `${id ? `${chalk.yellow(id)} ` : ''}${chalk.cyan(title)}`,
    `(${creator?.name.full || creator?.email || chalk.red('Invalid Creator')})`,
    chalk.grey(`[${new Date(date).toLocaleDateString()}]`)
  );
}

async function displayWorkshop({ _id, title, creator, date, katas }, idConfig) {
  const id = idFormat(idConfig)(_id);
  console.group(
    `${id ? `${chalk.dim.yellow(id)} ` : ''}${chalk.bold.green(title)}`,
    `(${creator?.name.full || creator?.email || chalk.red('Invalid Creator')})`,
    chalk.grey(`[${new Date(date).toLocaleDateString()}]`)
  );
  for (const kata of katas) {
    const response = await api.get(`/kata/${kata._id}?populate`); // get detailed kata
    await displayKata(response.data, idConfig);
  }
  console.groupEnd();
}

module.exports = {
  idFormat,
  MIN_ID_LENGTH,
  kata: displayKata,
  workshop: displayWorkshop,
};
