import { Router } from 'express';
import {
  loginHandler,
  logoutHandler,
  registerHandler,
} from '../controllers/auth.controller';
import validateSchema from '../middlewares/validateSchema';
import { loginSchema, registerSchema } from '../schema/auth.schema';

const authRouter = Router();

authRouter.post('/register', validateSchema(registerSchema), registerHandler);
authRouter.post('/login', validateSchema(loginSchema), loginHandler);
authRouter.post('/logout', logoutHandler);

export default authRouter;
