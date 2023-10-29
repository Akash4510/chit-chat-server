import jwt from 'jsonwebtoken';
import { privateKey, publicKey } from '../secret';

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
    return {
      valid: error.message !== 'jwt malformed',
      expired: error.message === 'jwt expired',
      decoded: null,
    };
  }
};
