require('./config/env');
const os = require('os');
const path = require('path');
const fs = require('fs');

const sqlitePath = path.join(os.homedir(), process.env.SQLITE_DB);

if (fs.existsSync(sqlitePath)) {
  console.log('Removing SQLite storage cache.');
  fs.unlinkSync(sqlitePath);
}
