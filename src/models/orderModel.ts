import { model, Schema, Document } from "mongoose";
import { IOrder } from "../interfaces/orderInterface";

interface IOrderDocument extends IOrder, Document {}

const OrderSchema = new Schema<IOrderDocument>({
  email: { type: String, required: true, trim: true, lowercase: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: [1, 'Quantity must be at least 1'] },
  price: { type: Number, required: true, min: [0, 'Price cannot be negative'] },
}, {
    versionKey: false // Removes the __v field 
});

export const Order = model<IOrderDocument>("Order", OrderSchema);