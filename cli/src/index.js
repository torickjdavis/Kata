#!/usr/bin/env node
require('./config/env');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

// prettier-ignore
yargs(hideBin(process.argv)).commandDir('cmds').demandCommand().help().strict().argv;
