import { Response, NextFunction } from 'express';
import { omit } from 'lodash';

import { RequestWithUser } from '../types';

export const getUserHandler = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user from the request object
    const user = req.user;

    // If user is not found, return an error
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // If user is found, return the user
    return res.json({
      status: 'success',
      data: {
        user: omit(user.toJSON(), 'password', '__v'),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
