import jwt from 'jsonwebtoken';
import { privateKey, publicKey } from '../secret';
import { logger } from './logger';

export const signJWT = (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: 'ES512',
  });
};

export const verifyJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: any) {
    logger.error(error.message, 'JWT Verification Error');
    return {
      valid: !(
        error.message === 'jwt malformed' ||
        error.message === 'invalid signature'
      ),
      expired: error instanceof jwt.TokenExpiredError,
      decoded: null,
    };
  }
};
