import { Router } from 'express';
import { authRouter } from './auth.route';
import { testRouter } from './test.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/test', testRouter);

export default router;
