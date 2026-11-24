import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem } from './cart.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getCart);
router.post('/items', addToCart);
router.put('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeCartItem);

export default router;
