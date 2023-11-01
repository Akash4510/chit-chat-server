import { Router } from 'express';

import { requireUser } from '../middlewares/requireUser';
import {
  getAllUsersHandler,
  getUserHandler,
} from '../controllers/user.controller';

const usersRouter = Router();

usersRouter.get('/all', getAllUsersHandler);
usersRouter.get('/me', requireUser, getUserHandler);

export default usersRouter;
