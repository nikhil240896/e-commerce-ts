import { z } from 'zod';

const variantSchemaValidation = z.object({
    type: z.string().min(1, 'Variant type is required'),
    value: z.string().min(1, 'Variant value is required')
})

const inventorySchemaValidation = z.object({
    quantity: z.number().min(0, 'Quantity cannot be negative'),
    inStock: z.boolean().refine((val) => typeof val === 'boolean', 'In stock must be a boolean') // Ensure inStock is boolean
})

const ProductSchemaValidation = z.object({
  name: z.string().min(3, 'Name should be 3 characters long'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  variants: z.array(variantSchemaValidation).min(1, 'At least one variant is required'),
  inventory: inventorySchemaValidation
});

export default ProductSchemaValidation;




