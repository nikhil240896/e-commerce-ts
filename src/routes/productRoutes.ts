import express from 'express';
import { ProductControllers } from '../controllers/productController';
import { verifyJWT, authorizeRoles } from '../middlewares/verifyToken';

const router = express.Router();

router.post('/createProduct', verifyJWT, authorizeRoles("admin"), ProductControllers.createProduct);
router.post('/getProducts', verifyJWT, ProductControllers.getAllProducts);
router.get('/getProducts/:id', ProductControllers.getSingleProduct);
router.put('/updateProduct/:id', ProductControllers.updateSingleProduct);
router.delete('/deleteProduct/:id', ProductControllers.deleteProduct);

export default router;

// tsc --init  // to generate tsconfig.json file
// npm run build  // creates a dist folder
// npm run start:dev // to run the script
// require('crypto').randomBytes(64).toString('hex') // to generate JWT_SECRET