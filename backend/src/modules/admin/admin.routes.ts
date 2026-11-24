import { Router } from 'express';
import { 
  getAdminAnalytics, 
  getAdminSellers, 
  updateSellerStatus, 
  getCommissionRules, 
  updateCommissionRule, 
  getAdminSettlements, 
  processSettlement,
  getAdminProducts,
  updateProductModerationStatus,
  getAdminServices,
  updateServiceModerationStatus,
  getAdminOrders,
  updateAdminOrderStatus,
  getAdminBookings,
  updateAdminBookingStatus
} from './admin.controller.js';
import { authenticate, requireAdmin } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

// Analytics & KYC
router.get('/analytics', getAdminAnalytics);
router.get('/sellers', getAdminSellers);
router.put('/sellers/:sellerId/status', updateSellerStatus);

// Catalog Moderation
router.get('/products', getAdminProducts);
router.put('/products/:productId/moderation', updateProductModerationStatus);
router.get('/services', getAdminServices);
router.put('/services/:serviceId/moderation', updateServiceModerationStatus);

// Orders & Bookings
router.get('/orders', getAdminOrders);
router.put('/orders/:orderId/status', updateAdminOrderStatus);
router.get('/bookings', getAdminBookings);
router.put('/bookings/:bookingId/status', updateAdminBookingStatus);

// Financials & Settlements
router.get('/commissions', getCommissionRules);
router.put('/commissions/:ruleId', updateCommissionRule);
router.get('/settlements', getAdminSettlements);
router.put('/settlements/:settlementId', processSettlement);

export default router;
