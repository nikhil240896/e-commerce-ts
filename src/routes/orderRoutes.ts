import express from 'express';
import { OrderControllers } from '../controllers/orderController';

const router = express.Router();

router.post('/createOrder', OrderControllers.createOrder);
router.post('/getOrders', OrderControllers.getOrders);

export default router;