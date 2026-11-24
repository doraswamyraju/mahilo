import { Router } from 'express';
import { 
  applyForSeller, 
  getMySellerProfile, 
  updateMySellerProfile, 
  getPublicSellerBySlug, 
  getAllApprovedSellers 
} from './sellers.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getAllApprovedSellers);
router.get('/:slug', getPublicSellerBySlug);

// Authenticated routes
router.post('/apply', authenticate, applyForSeller);
router.get('/me/profile', authenticate, getMySellerProfile);
router.put('/me/profile', authenticate, updateMySellerProfile);

export default router;
