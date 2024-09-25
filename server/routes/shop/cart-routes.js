import { Router } from 'express';
import { addToCart, deleteCartItem, fetchCartItems, updateCartItemQty } from '../../controllers/shop/cart-controller.js';

const router = Router();

router.post('/add', addToCart);
router.get('/get/:userId', fetchCartItems);
router.put('/update-cart', updateCartItemQty);
router.delete('/:userId/:productId', deleteCartItem);

export default router;