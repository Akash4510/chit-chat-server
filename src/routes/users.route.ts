import { Router } from 'express';

import { getAllUsersHandler } from '../controllers/user.controller';

const usersRouter = Router();

usersRouter.get('/all', getAllUsersHandler);

export { usersRouter };
