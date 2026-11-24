import { Router } from 'express';
import { 
  getProducts, 
  getProductBySlug, 
  getProductCategories, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from './products.controller.js';
import { authenticate, requireApprovedSeller } from '../../middleware/auth.js';

const router = Router();

// Public endpoints
router.get('/', getProducts);
router.get('/categories', getProductCategories);
router.get('/:slug', getProductBySlug);

// Seller protected endpoints
router.post('/', authenticate, requireApprovedSeller, createProduct);
router.put('/:id', authenticate, requireApprovedSeller, updateProduct);
router.delete('/:id', authenticate, requireApprovedSeller, deleteProduct);

export default router;
