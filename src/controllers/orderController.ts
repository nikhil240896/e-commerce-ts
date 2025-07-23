import { Request, Response, NextFunction } from "express";
import OrderSchemaValidation from "../validations/orderValidation";
import { OrderServices } from "../services/orderService";
import { IOrder } from "../interfaces/orderInterface";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/appError";
import { Product } from "../models/productModel";

const createOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = OrderSchemaValidation.safeParse(req.body);
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      return next(
        new AppError(`Invalid input data: ${errorMessages.join(", ")}`, 400)
      );
    }

    const orderData = result.data as IOrder;

    const product = await Product.findById(orderData.productId);

    if(!product) return next(new AppError("Product not found", 400));

    if(product && product.inventory.quantity < orderData.quantity) {
        return next(new AppError("Insufficient quantity available", 400))
    }

    if(product) {
        product.inventory.quantity -= orderData.quantity;
        product.inventory.inStock = product.inventory.quantity === 0 ? false : true;
        await product.save();
    }
    const data = await OrderServices.createOrder(orderData);

    return res.status(201).json({
      status: true,
      message: "Order created successfully",
      data,
    });
  }
);

const getOrders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const orders = await OrderServices.getAllOrders(email);
    if (!orders || orders.length === 0) {
      return next(new AppError("No orders found for this email", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  }
);

export const OrderControllers = {
  createOrder,
  getOrders,
};
