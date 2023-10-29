import { NextFunction, Request, Response, Router } from 'express';
import { requireUser } from '../middlewares/requireUser';
const testRouter = Router();

testRouter.get(
  '/get-user',
  requireUser,
  (req: Request, res: Response, next: NextFunction) => {
    res.json({
      message: 'Hello World',
    });
  }
);

export { testRouter };
