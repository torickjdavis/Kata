const { NODE_ENV } = process.env;

export const isProd = NODE_ENV === 'production' || NODE_ENV === 'prod';
export const isDev = !isProd; // any value indicates dev

// prettier-ignore
export const queryToBoolean = (query) => typeof query === 'boolean' ? query : query !== 'false';

export const modelRefPaths = (model) => {
  const refPaths = [];
  for (const [name, path] of [
    ...Object.entries(model.schema.paths),
    ...Object.entries(model.schema.subpaths),
  ]) {
    if (path.options.ref) refPaths.push(name.replace('.$', '')); // make arrays into key
  }
  return refPaths;
};
