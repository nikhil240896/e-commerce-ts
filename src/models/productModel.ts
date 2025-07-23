import { model, Schema, Document } from 'mongoose';
import { IInventory, IVariant, IProduct } from '../interfaces/productInterface';

interface IProductDocument extends IProduct, Document {}

const VariantSchema = new Schema<IVariant>({
    type: { type: String, required: true },
    value: { type: String, required: true}
}, { _id: false });

const InventorySchema = new Schema<IInventory>({
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, required: true }
}, { _id: false });

const ProductSchema = new Schema<IProductDocument>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    tags: { type: [String] },
    variants: { type: [VariantSchema] },
    inventory: { type: InventorySchema, required: true }
}, {
    timestamps: true
});

export const Product = model<IProductDocument>('Product', ProductSchema);