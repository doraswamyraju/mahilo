import { Router } from 'express';
import { 
  getServices, 
  getServiceBySlug, 
  getServiceCategories, 
  getAvailableSlots, 
  createService, 
  updateService 
} from './services.controller.js';
import { authenticate, requireApprovedSeller } from '../../middleware/auth.js';

const router = Router();

// Public endpoints
router.get('/', getServices);
router.get('/categories', getServiceCategories);
router.get('/:id/available-slots', getAvailableSlots);
router.get('/:slug', getServiceBySlug);

// Seller protected endpoints
router.post('/', authenticate, requireApprovedSeller, createService);
router.put('/:id', authenticate, requireApprovedSeller, updateService);

export default router;
