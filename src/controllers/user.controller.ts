import { Response, NextFunction } from 'express';
import { omit } from 'lodash';

import { RequestWithUser } from '../types';
import User from '../models/user.model';

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

export const getAllUsersHandler = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user from the request object
    const users = await User.find({});

    // If user is not found, return an error
    if (!users) {
      return res.status(404).json({
        status: 'error',
        message: 'No users found',
      });
    }

    // If user is found, return the user
    return res.json({
      status: 'success',
      data: {
        users: users.map((user) => omit(user.toJSON(), 'password', '__v')),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
