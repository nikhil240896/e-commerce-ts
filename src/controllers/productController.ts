import { Request, Response, NextFunction } from "express";
import ProductSchemaValidation from "../validations/productValidation";
import { ProductServices } from "../services/productService";
import { IProduct } from "../interfaces/productInterface";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/appError";

// const createProduct = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const result = ProductSchemaValidation.safeParse(req.body);

//     // if (!result.success) {
//     //   // Extract a meaningful error message from Zod's error
//     //   const errorMessage =
//     //     result.error.issues
//     //       .map((issue) => `${issue.path.join(".")} - ${issue.message}`)
//     //       .join(", ") || "Validation error";
//     //   return next(new AppError(errorMessage, 400));
//     // }

//     if (!result.success) {
//       // Improved error handling that shows all validation errors
//       const errorMessages = result.error.issues.map(issue => {
//         // For required fields, the path will be ['name'], ['description'], etc.
//         const field = issue.path.join('.');
//         return `${field} is required`; // or use issue.message for Zod's default messages
//       });

//       // Join all error messages with a comma
//       const fullErrorMessage = errorMessages.join(', ');
//       //const fullErrorMessage = errorMessages[0];
//       return next(new AppError(fullErrorMessage, 400));
//     }

//     // Type cast validatedProduct to IProduct
//     const productData = result.data as IProduct;

//     const data = await ProductServices.createProduct(productData);

//     return res.status(201).json({
//       status: true,
//       data,
//     });
//   }
// );


const createProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = ProductSchemaValidation.safeParse(req.body);

    if (!result.success) {
      const firstError = result.error.issues[0];
      const fieldName = firstError.path.join('.');

      // Robust missing field detection that works with all Zod versions
      const isMissingField = (
        // Standard Zod v3+ missing field detection
        (firstError.code === 'invalid_type' && 
         (firstError as any).received === 'undefined') ||
        // Fallback detection for other cases
        firstError.message.includes('undefined') ||
        firstError.message.includes('required')
      );

      if (isMissingField) {
        return next(new AppError(`${fieldName} is required`, 400));
      }

      // Handle empty string cases that should follow min length validation
      if (firstError.code === 'too_small' && firstError.minimum === 1) {
        return next(new AppError(`${fieldName} is required`, 400));
      }

      // Default to Zod's validation message for all other cases
      return next(new AppError(firstError.message, 400));
    }

    const productData = result.data as IProduct;
    const data = await ProductServices.createProduct(productData);

    return res.status(201).json({
      status: true,
      message: "Product created successfully",
      data,
    });
  }
);


const getAllProducts = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const { searchTerm } = req.body;
    const result = await ProductServices.getProducts(searchTerm as string);

    if (!result || result.length === 0) {
      return next(AppError.notFound("No products found."))
    }
    return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: result
    })

});

const getSingleProduct = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const { id: productId } = req.params;
    const result = await ProductServices.getSingleProduct(productId);
    return res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        data: result
    })

});

const updateSingleProduct = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const { id: productId } = req.params;
    const data = req.body;
    const result = await ProductServices.updateProduct(productId, data );
    return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: result
    })

});

const deleteProduct = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const { id: productId } = req.params;
    await ProductServices.deleteProduct(productId);
    return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data: null
    })

});

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateSingleProduct,
  deleteProduct
};
