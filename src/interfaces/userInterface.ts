import { Document } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  role: string;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
  generateAuthToken(): string; 
}