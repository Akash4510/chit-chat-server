import { Router } from 'express';

import { authRouter } from './auth.route';
import { testRouter } from './test.route';
import { userRouter } from './user.route';
import { usersRouter } from './users.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/test', testRouter);
router.use('/user', userRouter);
router.use('/users', usersRouter);

export default router;
