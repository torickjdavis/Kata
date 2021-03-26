import { Router } from 'express';

import { rootRoute } from '../controllers/api.js';

const apiRouter = Router();

apiRouter.get('/', rootRoute);

export default apiRouter;
