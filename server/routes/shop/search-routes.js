import { Router } from 'express';
import { searchProducts } from '../../controllers/shop/search-controller.js';

const router = Router();

router.get('/:keyword', searchProducts);

export default router;