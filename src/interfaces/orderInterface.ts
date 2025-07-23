import { Types } from "mongoose";

export interface IOrder {
  email: string;
  productId: Types.ObjectId | string; 
  quantity: number;
  price: number;
}