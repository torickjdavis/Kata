const Store = require('./store');

module.exports = {
  info: {
    store: new Store('info'),
    keys: {
      ACCESS_TOKEN: 'accessToken',
      DECODED_TOKEN: 'decodedToken',
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
