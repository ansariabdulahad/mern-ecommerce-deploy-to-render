import { Router } from 'express';
import { getFilteredProducts, getProductDetails } from '../../controllers/shop/products-controller.js';

const router = Router();

router.get('/get', getFilteredProducts);
router.get('/get/:id', getProductDetails);

export default router;