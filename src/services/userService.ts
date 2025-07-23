import { User } from "../models/userModel";
import { IUser, IUserDocument } from "../interfaces/userInterface";

const createUser = async (userData: IUser) => {
  const result = await User.create(userData);
  return result;
};

const findUserByEmail = async (email: string): Promise<IUserDocument | null> => {
  const result = await User.findOne({ email });
  return result;
};

export const UserServices = {
  createUser,
  findUserByEmail,
};
