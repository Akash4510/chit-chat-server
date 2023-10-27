import { Request, Response, NextFunction } from 'express';
import { createUser } from '../services/user.service';
import { TUserInput } from '../models/user.model';

export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin') {
      return res.status(200).json({
        message: 'Login successfully',
        data: {
          username,
          token: 'token',
        },
      });
    }
    return res.status(401).json({
      message: 'Unauthorized',
    });
  } catch (error) {
    next(error);
  }
};

export const registerHandler = async (
  req: Request<{}, {}, TUserInput>,
  res: Response,
  next: NextFunction
) => {
  const userInput = req.body;
  const { firstName, lastName, email, password } = userInput;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      message: 'Missing required fields: firstName, lastName, email, password',
    });
  }

  try {
    const user = await createUser(userInput);
    return res.json({ message: 'OK', user });
  } catch (error) {
    return res.sendStatus(500);
  }
};
