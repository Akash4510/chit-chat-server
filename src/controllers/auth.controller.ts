import { Request, Response, NextFunction } from 'express';
import { omit } from 'lodash';

import { UserInput } from '../models/user.model';
import { createUser, getUserByEmail } from '../services/user.service';
import { signJWT } from '../utils/jwt.utils';
import { LoginInput, RegisterInput } from '../schema/auth.schema';
import { accessTokenTtl, refreshTokenTtl } from '../config';

export const registerHandler = async (
  req: Request<{}, {}, RegisterInput['body']>,
  res: Response,
  next: NextFunction
) => {
  const userInput = req.body;
  // Since this userInput only contains the properties defined in the RegisterInput schema,
  // we need to cast it to UserInput to be able to pass it to the createUser function
  // which expects a UserInput type
  // This is because UserInput is the type of the userSchema in src/models/user.model.ts
  // which has some more properties like friends, status, etc. which are not defined in
  // RegisterInput schema coz we don't need them while registering a user

  try {
    // Create the user in the database
    const user = await createUser(userInput as UserInput);

    // Create access token and refresh token
    const accessToken = signJWT(
      { userId: user._id, email: user.email },
      { expiresIn: accessTokenTtl }
    );

    const refreshToken = signJWT(
      { userId: user._id, email: user.email },
      { expiresIn: refreshTokenTtl }
    );

    // Create secure and httpOnly cookie with the refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // So that the cookie cannot be accessed by the client side
      secure: true, // So that the cookie can only be sent over https
      sameSite: 'none', // So that the cookie can be sent to cross-site requests
      maxAge: refreshTokenTtl * 1000, // Convert seconds to milliseconds
    });

    return res.json({
      status: 'success',
      message: 'User created succesffully',
      data: {
        user: omit(user.toJSON(), 'password', '__v'),
        accessToken,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const loginHandler = async (
  req: Request<{}, {}, LoginInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the email and password from the request body
    const { email, password } = req.body;

    // Check for the user in the database
    const user = await getUserByEmail(email);

    // If user is not found, return an error
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // If user is found, check if the password is valid
    const isValidPassword = await user.comparePassword(password, user.password);

    // If password is invalid, return an error
    if (!isValidPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid password',
      });
    }

    // Create access token and refresh token
    const accessToken = signJWT(
      { userId: user._id, email: user.email },
      { expiresIn: accessTokenTtl }
    );

    const refreshToken = signJWT(
      { userId: user._id, email: user.email },
      { expiresIn: refreshTokenTtl }
    );

    // Create secure and httpOnly cookie with the refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // So that the cookie cannot be accessed by the client side
      secure: true, // So that the cookie can only be sent over https
      sameSite: 'none', // So that the cookie can be sent to cross-site requests
      maxAge: refreshTokenTtl * 1000, // Convert seconds to milliseconds
    });

    // Return the user along with the access token
    return res.json({
      status: 'success',
      message: 'Login successfull',
      data: {
        user: omit(user.toJSON(), 'password', '__v'),
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Clear the refresh token cookie
    res.clearCookie('refreshToken');

    // Set the access token to null
    res.setHeader('Authorization', '');

    // Return a success message
    return res.json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
