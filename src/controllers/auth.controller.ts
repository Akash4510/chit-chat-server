import { Request, Response, NextFunction } from 'express';

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.send({
      message: 'Username and email is required',
    });
  }

  const user = {
    username,
    email,
  };

  res.json({ message: 'OK', user });
};
