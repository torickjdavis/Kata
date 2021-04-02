import { Router } from 'express';

import { rootRoute } from '../controllers/api.js';
import resource from '../resource.js';

import Kata from '../models/Kata.js';
import Workshop from '../models/Workshop.js';
import User from '../models/User.js';

const apiRouter = Router();

apiRouter.get('/', rootRoute);
apiRouter.use(resource(User));
apiRouter.use(resource(Kata));
apiRouter.use(resource(Workshop));

export default apiRouter;
