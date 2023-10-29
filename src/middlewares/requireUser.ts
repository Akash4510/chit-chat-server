import { Request, Response, NextFunction } from 'express';

import { signJWT, verifyJWT } from '../utils/jwt.utils';
import { accessTokenTtl } from '../config';
import { logger } from '../utils/logger';

export const requireUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the access token from the authorization header
    const authHeader = req.headers.authorization;

    // If authorization header is not present or does not start with "Bearer "
    // (Because Bearer is the authentication scheme used by the JWT), return an error
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: Access token missing',
      });
    }

    // Get the token from the authorization header
    const accessToken = authHeader.split(' ')[1];

    // Verify the token
    const { valid, expired } = verifyJWT(accessToken);

    logger.info({ valid, expired });

    // If the token is not valid, return an error
    if (!valid) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: Invalid access token',
      });
    }

    // If the token is expired and a refresh token is present in the cookies, create a new access token
    if (expired) {
      // Get the refresh token from the cookies
      const refreshToken = req.cookies['refreshToken'];

      // If refresh token is not present, return an error
      if (!refreshToken) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized: Refresh token missing',
        });
      }

      // Verify the refresh token
      const { valid, expired, decoded } = verifyJWT(refreshToken);

      // If the refresh token is invalid, return an error
      if (!valid) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized: Invalid refresh token',
        });
      }

      // If the refresh token is expired, return an error
      if (expired) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized: Log in again',
        });
      }

      // Get the userId and email from the decoded refresh token
      // The userId and email properties will be there in the decoded refresh token
      // because we set them while signing the refresh token
      const { userId, email } = decoded as { userId: string; email: string };

      // Create a new access token
      const newAccessToken = signJWT(
        { userId, email },
        { expiresIn: accessTokenTtl }
      );

      // Set the new access token in the response header
      res.setHeader('Authorization', `Bearer ${newAccessToken}`);
    }

    // If the token is valid and is not expired, proceed to the next middleware
    next();
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
