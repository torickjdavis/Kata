#!/usr/bin/env node
require('./config/env');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

yargs(hideBin(process.argv))
  .commandDir('cmds')
  .demandCommand()
  .help()
  .strict()
  .wrap(yargs.terminalWidth()).argv;

// const listOptions = {
//   page: {
//     alias: 'p',
//     type: 'number',
//   },
//   limit: {
//     alias: 'l',
//     type: 'number',
//   },
//   all: {
//     alias: 'a',
//     conflicts: ['limit', 'page'],
//     type: 'boolean',
//   },
// };

// const argv = yargs(hideBin(process.argv))
//   .usage('$0 <cmd> [args]')
//   .command(['create', 'init', 'make', 'mk'], 'Create new resource', (yargs) =>
//     yargs
//       .command('kata', '', (argv) => console.log('Create Kata', argv))
//       .command('workshop', '', {
//         title: {
//           alias: 't',
//           demandOption: true,
//           type: 'string',
//         },
//         katas: {
//           alias: 'k',
//           demandOption: true,
//           type: 'array',
//         },
//       })
//       .demandCommand()
//   )
//   .command(['read', 'get', '$0'], 'Access individual resources', {})
//   .command(['update', 'publish', 'up'], 'Update resource', {})
//   .command(['delete', 'remove', 'rm'], 'Delete resource', {})
//   .command(['list', 'ls'], 'List resource', (yargs) =>
//     yargs
//       .command('kata', '', listOptions)
//       .command('workshop', '', listOptions)
//       .demandCommand()

/**
 *  <cli name> <action> [resource]
 *  <action>
 *      init/create/mk
 *      get/read
 *      publish/update
 *      remove/delete/rm
 *      list/ls
 *      submit
 *      login/logout (auth only)
 *  <resource>
 *    kata
 *    workshop
 *    auth
 */

// <cli name> <action> [resource]
// kata-cli login
// kata-cli create kata
// kata-cli create workshop
