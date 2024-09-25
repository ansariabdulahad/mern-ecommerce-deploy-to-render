import { Router } from 'express';
import { capturePayment, createOrder, getAllOrdersByUser, getOrderDetails } from '../../controllers/shop/order-controller.js';

const router = Router();

router.post('/create', createOrder);
router.post('/capture', capturePayment);
router.get('/list/:userId', getAllOrdersByUser);
router.get('/details/:id', getOrderDetails);

export default router;