#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
// import inquirer from 'inquirer';
// import axios from 'axios';

const listOptions = {
  page: {
    alias: 'p',
    type: 'number',
  },
  limit: {
    alias: 'l',
    type: 'number',
  },
  all: {
    alias: 'a',
    conflicts: ['limit', 'page'],
    type: 'boolean',
  },
};

const argv = yargs(hideBin(process.argv))
  .usage('$0 <cmd> [args]')
  .command(['create', 'init', 'make', 'mk'], 'Create new resource', (yargs) =>
    yargs
      .command('kata', '', (argv) => console.log('Create Kata', argv))
      .command('workshop', '', {
        title: {
          alias: 't',
          demandOption: true,
          type: 'string',
        },
        katas: {
          alias: 'k',
          demandOption: true,
          type: 'array',
        },
      })
      .demandCommand()
  )
  .command(['read', 'get', '$0'], 'Access individual resources', {})
  .command(['update', 'publish', 'up'], 'Update resource', {})
  .command(['delete', 'remove', 'rm'], 'Delete resource', {})
  .command(['list', 'ls'], 'List resource', (yargs) =>
    yargs
      .command('kata', '', listOptions)
      .command('workshop', '', listOptions)
      .demandCommand()
  )
  .strict()
  .wrap(null).argv;
console.log(argv);

// import os from 'os';
// console.log(os.homedir());

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
