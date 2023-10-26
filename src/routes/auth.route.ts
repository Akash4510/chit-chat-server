import { Router } from 'express';

const authRouter = Router();

authRouter.post('/login', (req, res) => {
  res.send('Login');
});

authRouter.post('/register', (req, res) => {
  res.send('Register');
});

export { authRouter };
