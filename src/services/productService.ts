import { Product } from "../models/productModel";
import { IProduct } from "../interfaces/productInterface";

const createProduct = async (productData: IProduct) => {
  const result = await Product.create(productData);
  return result;
};

const getProducts = async (searchTerm = "") => {
  const query = searchTerm ? { name: { $regex: searchTerm, $options: "i" }} : {};
  const result = await Product.find(query);
  return result;
};

const getSingleProduct = async (id: string) => {
  const result = await Product.findById(id);
  return result;
};

const updateProduct = async (productId: string, data: IProduct) => {
  const result = await Product.findByIdAndUpdate(productId, data, { new: true });
  return result;
};

const deleteProduct = async (id: string) => {
  const result = await Product.findByIdAndDelete(id);
  return result;
};

export const ProductServices = {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
};
