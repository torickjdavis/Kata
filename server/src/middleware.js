import { isDev } from './utils.js';
import status from 'http-status';

export function notFound(req, res, next) {
  res.status(status.NOT_FOUND);
  next(new Error(`Not Found ${req.originalUrl}`));
}

export function error(err, req, res, next) {
  // if it's still success, resolve as error
  if (res.statusCode == status.OK) res.status(status.INTERNAL_SERVER_ERROR);
  console.error(err);
  res.json({
    message: err.message,
    stack: isDev ? err.stack : '🥞',
  });
}
