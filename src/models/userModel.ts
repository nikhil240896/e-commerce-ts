import { model, Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../interfaces/userInterface";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/config";

interface IUserDocument extends IUser, Document {
    comparePassword(password: string): Promise<boolean>;
    generateAuthToken(): string;
}

const UserSchema = new Schema<IUserDocument>({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

UserSchema.pre<IUserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

UserSchema.methods.generateAuthToken = function () {
  //const options: SignOptions = { expiresIn: config.JWT_EXPIRES_IN };
  const token = jwt.sign(
    { id: this._id, email: this.email },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN } as SignOptions
  );
  return token;
};

UserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export const User = model<IUserDocument>("User", UserSchema);


