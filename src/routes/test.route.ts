import { NextFunction, Response, Router } from 'express';
import { requireUser } from '../middlewares/requireUser';
import { RequestWithUser } from '../types';

const testRouter = Router();

testRouter.get(
  '/get-user',
  requireUser,
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized',
      });
    }

    res.json({
      status: 'success',
      message: 'Hello World',
    });
  }
);

export { testRouter };
