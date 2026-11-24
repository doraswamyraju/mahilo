import { Router } from 'express';
import { 
  getSellerLedgerSummary, 
  getSellerTransactions, 
  getSellerSettlements, 
  requestPayout 
} from './ledger.controller.js';
import { authenticate, requireApprovedSeller } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.use(requireApprovedSeller);

router.get('/summary', getSellerLedgerSummary);
router.get('/transactions', getSellerTransactions);
router.get('/settlements', getSellerSettlements);
router.post('/request-payout', requestPayout);

export default router;
