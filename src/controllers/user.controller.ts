import { Response, NextFunction } from 'express';
import { RequestWithUser } from '../types';
import { omit } from 'lodash';
import { logger } from '../utils/logger';

export const getUserHandler = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user from the request object
    const user = req.user;

    logger.info(user, 'User from req object');

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
