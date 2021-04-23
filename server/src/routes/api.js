import { Router } from 'express';
import multer from 'multer';

import { rootRoute } from '../controllers/api.js';
import resource from '../resource.js';
import { authenticate } from '../controllers/auth.js';
import { getUserKatas } from '../controllers/katas.js';
import search from '../controllers/search.js';

import Kata from '../models/Kata.js';
import Workshop from '../models/Workshop.js';
import User from '../models/User.js';

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

apiRouter.get('/', rootRoute);
apiRouter.use(resource(User));
apiRouter.use(
  resource(Kata, { create: zipUpload, replace: zipUpload, modify: zipUpload })
);
apiRouter.use(resource(Workshop));
apiRouter.post('/login', authenticate);
apiRouter.get('/search/:resource', search);
apiRouter.get('/userKatas/:id', getUserKatas);

export default apiRouter;
