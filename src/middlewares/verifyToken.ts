import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import asyncHandler from "../utils/asyncHandler";
import { config } from "../config/config";
import { User } from "../models/userModel";
import { IUserDocument } from "../interfaces/userInterface";

// Extend the Request interface to include the user property
declare global { // Tells TypeScript we're modifying something in the global scope
  namespace Express { // We're modifying types within Express's namespace
    interface Request { // We're extending the existing Request interface
      user?: IUserDocument; // Adds an optional user property (? means optional)
    }
  }
}

// Type for the decoded JWT
interface IDecodedToken extends JwtPayload {
  id: string;
  email: string;
}

const verifyJWT = asyncHandler(async (req: Request, _: Response, next: NextFunction) => {
  // 1. Get token from header
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return next(new AppError("Unauthorized: No token provided", 401));
  }

  // 2. Verify token - let errors propagate to global error handler
  const decoded = jwt.verify(token, config.JWT_SECRET) as IDecodedToken;
  
  // 3. Check if user still exists
  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    return next(new AppError("User belonging to this token no longer exists", 401));
  }

  // 4. Attach user to request object
  req.user = user;
  next();
});

const authorizeRoles = (...roles: string[]) => {
  return (req: Request, _: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Role '${req.user.role}' is not authorized to access this resource`,
          403
        )
      );
    }

    next();
  };
};

export { verifyJWT, authorizeRoles };