import { Router } from 'express';

import { requireUser } from '../middlewares/requireUser';
import { getUserHandler } from '../controllers/user.controller';

const userRouter = Router();

userRouter.get('/me', requireUser, getUserHandler);

export { userRouter };
