import { Router } from 'express';

import authRouter from './auth.route';
import usersRouter from './users.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);

export default router;
