import { TUserInput, User } from '../models/user.model';

export const createUser = async (userInput: TUserInput) => {
  try {
    const user = await User.create(userInput);
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
};
