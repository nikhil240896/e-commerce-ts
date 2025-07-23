import { z } from "zod";
import mongoose from "mongoose";

const OrderSchemaValidation = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .transform((val) => val.toLowerCase().trim()),

  productId: z
    .string()
    .min(1, "Product ID is required")
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid product ID format",
    }),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be at least 1")
    .min(1, "Quantity must be at least 1"),
  price: z
    .number()
    .nonnegative("Price cannot be negative")
    .min(0, "Price cannot be negative"),
});

export default OrderSchemaValidation;
