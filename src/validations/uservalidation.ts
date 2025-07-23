import { z } from "zod";
import mongoose from "mongoose";

const UserSchemaValidation = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Please use a valid email address" })
    .nonempty({ message: "Email is required" }),
  password: z
    .string()
    .trim()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),
  role: z.string().nonempty({ message: "Role is required" }),
});

export default UserSchemaValidation;