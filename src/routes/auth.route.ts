import { Router } from 'express';
import { loginHandler, registerHandler } from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/login', loginHandler);
authRouter.post('/register', registerHandler);

export { authRouter };
