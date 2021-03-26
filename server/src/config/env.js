// inspired by create-react-app script that configures env: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/env.js

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const { NODE_ENV } = process.env;

process.env.SRC = path.resolve('.', 'src'); // resolves to src folder

const env = path.resolve(process.env.SRC, '..', '.env');

// dotenv will not set/overwrite any environment variables that already exist, so the .env* files will load in order with highest priority persisting
const dotenvFiles = [
  `${env}.${NODE_ENV}.local`,
  `${env}.${NODE_ENV}`,
  `${env}.local`,
  env
];

for (const file of dotenvFiles) {
  if (fs.existsSync(file)) dotenvExpand(dotenv.config({ path: file }));
}
