import { Request, Response, NextFunction } from "express";
import { IUser } from "../interfaces/userInterface";
import { UserServices } from "../services/userService";
import UserSchemaValidation from "../validations/uservalidation";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/appError";
import { User } from "../models/userModel";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = UserSchemaValidation.safeParse(req.body);
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message); // message
      return next(new AppError(`${errorMessages.join(", ")}`, 400));
    }

    const userData = result.data;
    const existingUser = await User.findOne({ email: userData?.email });
    if (existingUser)
      return next(new AppError("User with same email already exists", 400));

    const data = await UserServices.createUser(userData);

    return res.status(200).json({
      status: true,
      message: "User created successfully",
      data,
    });
  }
);

const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new AppError("Email or Password is missing", 400));

    const findUser = await UserServices.findUserByEmail(email);
    if (!findUser) return next(new AppError("Invalid email or password", 400));

    const isPasswordValid = await findUser.comparePassword(password);
    if (!isPasswordValid)
      return next(new AppError("Invalid email or password", 400));

    // Create token
    // const token = jwt.sign(
    //   { id: findUser._id, email: findUser.email },
    //   config.JWT_SECRET,
    //   { expiresIn: config.JWT_EXPIRES_IN } as jwt.SignOptions
    // );

    const token = findUser.generateAuthToken();

    return res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      data: {
        email: findUser.email,
        role: findUser.role,
      },
    });
  }
);

export const UserControllers = {
  registerUser,
  loginUser,
};
