import { Router } from 'express';
import multer from 'multer';

import { rootRoute } from '../controllers/api.js';
import resource from '../resource.js';
import { authenticate, validate } from '../controllers/auth.js';
import {
  downloadKata,
  getUserKatas,
  createSubmission,
  getSubmission,
  listSubmissions,
} from '../controllers/katas.js';
import search from '../controllers/search.js';

import Kata from '../models/Kata.js';
import Workshop from '../models/Workshop.js';
import User from '../models/User.js';

import { authorize } from '../middleware.js';

const apiRouter = Router();

// TODO disallow updating a user unless you are them, same goes for created resources

const zipUpload = [
  multer({
    fileFilter: (req, file, cb) =>
      cb(null, file.mimetype === 'application/zip'),
  }).single('zip'),
  (req, res, next) => {
    req.body.zip = req.file?.buffer;
    next();
  },
];

const authConfig = {
  verifier: (token) => User.verifyToken(token), // can't just pass User.verifyToken due to this binding
  create: true,
  modify: true,
  replace: true,
  delete: true,
};

const modelMadeBy = (model) => async (user, resourceId) => {
  const instance = await model.findById(resourceId);
  return user._id.toString() === instance.creator.toString(); // works due to common pattern across models
};

apiRouter.get('/', rootRoute);
apiRouter.use(
  resource(User, {
    auth: {
      ...authConfig,
      create: false, // no need to authorize to create users
      madeBy: async (authUser, resourceId) => {
        return authUser._id.toString() === resourceId;
      },
    },
  })
);
apiRouter.use(
  resource(Kata, {
    preMiddleware: { create: zipUpload, replace: zipUpload, modify: zipUpload },
    auth: {
      ...authConfig,
      madeBy: modelMadeBy(Kata),
    },
  })
);
apiRouter.use(
  resource(Workshop, {
    auth: {
      ...authConfig,
      madeBy: modelMadeBy(Workshop),
    },
  })
);

apiRouter.post('/login', authenticate);
apiRouter.post('/validate', validate);
apiRouter.get('/search/:resource', search);
apiRouter.get('/userKatas/:id', getUserKatas);
apiRouter.get('/download/:kataId', downloadKata);
apiRouter.post(
  '/submission/:userId',
  authorize(authConfig.verifier)(true),
  createSubmission
);
apiRouter.get('/submission/:userId/:submissionId', getSubmission);
apiRouter.get(
  '/submissions/:userId',
  authorize(authConfig.verifier)(true),
  listSubmissions
);

export default apiRouter;
