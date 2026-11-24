import { Router } from 'express';
import { createRazorpayOrder, verifyPayment } from './payments.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify', verifyPayment);

export default router;
