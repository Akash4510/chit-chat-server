import {} from 'express';
import User, { UserInput, UserDocument } from '../models/user.model';
import { FilterQuery, QueryOptions } from 'mongoose';

export const createUser = async (userInput: UserInput) => {
  try {
    const user = await User.create(userInput);
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getUser = async (
  query: FilterQuery<UserDocument>,
  options: QueryOptions = { lean: true }
) => {
  try {
    const user = await User.find(query, {}, options);
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
};
