import { Router } from 'express';
import { 
  checkout, 
  getMyCustomerOrders, 
  getMySellerOrders, 
  updateSellerOrderStatus 
} from './orders.controller.js';
import { authenticate, requireApprovedSeller } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);

// Customer checkout and tracking
router.post('/checkout', checkout);
router.get('/my-orders', getMyCustomerOrders);

// Seller sub-order fulfillment
router.get('/seller/my-orders', requireApprovedSeller, getMySellerOrders);
router.put('/seller/:sellerOrderId/status', requireApprovedSeller, updateSellerOrderStatus);

export default router;
