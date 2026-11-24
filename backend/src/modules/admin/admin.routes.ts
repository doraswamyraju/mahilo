import { Router } from 'express';
import { 
  getAdminAnalytics, 
  getAdminSellers, 
  updateSellerStatus, 
  getCommissionRules, 
  updateCommissionRule, 
  getAdminSettlements, 
  processSettlement 
} from './admin.controller.js';
import { authenticate, requireAdmin } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/analytics', getAdminAnalytics);
router.get('/sellers', getAdminSellers);
router.put('/sellers/:sellerId/status', updateSellerStatus);
router.get('/commissions', getCommissionRules);
router.put('/commissions/:ruleId', updateCommissionRule);
router.get('/settlements', getAdminSettlements);
router.put('/settlements/:settlementId', processSettlement);

export default router;
