const Store = require('./store');

module.exports = {
  info: {
    store: new Store('info'),
    keys: {
      ACCESS_TOKEN: 'accessToken',
      USER: 'userInfo',
    },
  },
  kata: {
    store: new Store('kata'),
  },
};
