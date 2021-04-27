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

// no-op (next) middleware
export const noOp = (req, res, next) => next();

// middleware to protect a route
export function authorize(tokenVerifier = null, madeBy = null) {
  const verify = async (req, res, next) => {
    const resourceId = req.params.id;
    if (!tokenVerifier) {
      throw new Error('Requested Verification without Verifier');
    }

    const authorization = req.headers['authorization'];

    if (!authorization) {
      return res
        .status(status.UNAUTHORIZED)
        .json({ message: 'Missing Authorization Header' });
    }

    const [, token] = authorization.match(/Bearer (.+)/); // Bearer TOKEN

    if (!token) {
      return res
        .status(status.UNAUTHORIZED)
        .json({ message: 'Missing Bearer Token' });
    }

    try {
      req.user = await tokenVerifier(token);
      if (madeBy) {
        const isMadeBy = await madeBy(req.user, resourceId);
        if (!isMadeBy) {
          return res
            .status(status.UNAUTHORIZED)
            .json({ message: 'This resource was not made by you.' });
        }
      }
      next();
    } catch (error) {
      res.status(status.FORBIDDEN);
      next(error);
    }
  };

  return (shouldVerify = false) => {
    if (shouldVerify) return verify;
    return noOp;
  };
}
