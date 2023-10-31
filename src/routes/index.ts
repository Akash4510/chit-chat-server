import { Router } from 'express';

import { authRouter } from './auth.route';
import { testRouter } from './test.route';
import { userRouter } from './user.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/test', testRouter);
router.use('/user', userRouter);

export default router;
