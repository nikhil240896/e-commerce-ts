import { Order } from "../models/orderModel";
import { IOrder } from "../interfaces/orderInterface";

const createOrder = async (orderData: IOrder) => {
  const result = await Order.create(orderData);
  return result;
};

const getAllOrders = async (query: string | undefined) => {
  const filter = query ? { email: query } : {};
  const result = await Order.find(filter);
  return result;
};

export const OrderServices = {
  createOrder,
  getAllOrders,
};
