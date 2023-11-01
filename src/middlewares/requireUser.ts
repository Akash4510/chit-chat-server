import { Response, NextFunction } from 'express';

import { signJWT, verifyJWT } from '../utils/jwt.utils';
import { accessTokenTtl } from '../config';
import { logger } from '../utils/logger';
import { RequestWithUser } from '../types';
import { getUser } from '../services/user.service';

export const requireUser = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the access token from the authorization header
    const authHeader = req.headers.authorization;

    // If authorization header is not present or does not start with "Bearer "
    // (Because Bearer is the authentication scheme used by the JWT), return an error
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.error(
        'Authorization header not found or not in correct format - REQUIRE_USER_MIDDLEWARE'
      );

      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized',
      });
    }

    // Get the token from the authorization header
    const accessToken = authHeader.split(' ')[1];

    // Verify the token
    const { valid, expired, decoded } = verifyJWT(accessToken);

    // If the token is not valid, return an error
    if (!valid) {
      logger.error('Invalid access token - REQUIRE_USER_MIDDLEWARE');

      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized',
      });
    }

    // If the token is valid and not expired, proceed to the next middleware
    if (!expired) {
      const { userId, email } = decoded as { userId: string; email: string };

      // Get the user from the database
      const user = await getUser({ _id: userId, email });

      // If the user is not found, return an error
      if (!user) {
        logger.error('User not found - REQUIRE_USER_MIDDLEWARE');

        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized: User not found',
        });
      }

      // Set the user in the request object
      req.user = user;

      // Proceed to the next middleware
      return next();
    }

    // If the token is expired and a refresh token is present in the cookies, create a new access token
    const refreshToken = req.cookies['refreshToken'];

    // If the refresh token is not present, return an error
    if (!refreshToken) {
      logger.error('Refresh token not found - REQUIRE_USER_MIDDLEWARE');

      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized',
      });
    }

    // Verify the refresh token
    const {
      valid: validRefreshToken,
      expired: refreshTokenExpired,
      decoded: decodedRefreshToken,
    } = verifyJWT(refreshToken);

    // If the refresh token is not valid, return an error
    if (!validRefreshToken) {
      logger.error('Invalid refresh token - REQUIRE_USER_MIDDLEWARE');

      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized',
      });
    }

    // If the refresh token is expired, return an error
    if (refreshTokenExpired) {
      logger.error('Refresh token expired - REQUIRE_USER_MIDDLEWARE');

      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: Please log in again',
      });
    }

    // Get the user id and email from the refresh token
    const { userId, email } = decodedRefreshToken as {
      userId: string;
      email: string;
    };

    // If the refresh token is valid and not expired, create a new access token
    const newAccessToken = signJWT(
      { userId, email },
      { expiresIn: accessTokenTtl }
    );

    logger.info('Access token refreshed - REQUIRE_USER_MIDDLEWARE');

    // Set the new access token in the response header
    res.setHeader('New-Access-Token', newAccessToken);

    // Set the user in the request object
    const user = await getUser({ _id: userId, email });

    // If the user is not found, return an error
    if (!user) {
      logger.error('User not found - REQUIRE_USER_MIDDLEWARE');
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: User not found',
      });
    }

    // Set the user in the request object
    req.user = user;

    // Proceed to the next middleware
    return next();
  } catch (error: any) {
    logger.error(`${error.message} - REQUIRE_USER_MIDDLEWARE`);

    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
