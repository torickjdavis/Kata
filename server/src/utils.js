const { NODE_ENV } = process.env;

export const isProd = NODE_ENV === 'production' || NODE_ENV === 'prod';
export const isDev = !isProd; // any value indicates dev
