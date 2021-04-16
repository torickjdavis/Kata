require('./config/env');
const os = require('os');
const path = require('path');
const KeyV = require('keyv');

class Store {
  constructor(namespace) {
    this.namespace = namespace;
    this.path = `sqlite://${path.join(os.homedir(), process.env.SQLITE_DB)}`;
    this.store = new KeyV(this.path, { namespace: this.namespace });
  }

  async set(key, value) {
    return this.store.set(key, value);
  }

  async get(key) {
    return this.store.get(key);
  }

  async remove(key) {
    return this.store.delete(key);
  }

  async clear() {
    return this.store.clear();
  }
}

module.exports = Store;
