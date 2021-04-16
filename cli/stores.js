const Store = require('./store');

module.exports = {
  info: {
    store: new Store('info'),
    keys: {
      ACCESS_TOKEN: 'accessToken',
    },
  },
  kata: {
    store: new Store('kata'),
    keys: {},
  },
  workshop: {
    store: new Store('workshop'),
    keys: {},
  },
};
