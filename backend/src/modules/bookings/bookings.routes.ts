import { Router } from 'express';
import { 
  createBooking, 
  getMyCustomerBookings, 
  getMySellerBookings, 
  updateBookingStatus 
} from './bookings.controller.js';
import { authenticate, requireApprovedSeller } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);

// Customer booking creation & review
router.post('/', createBooking);
router.get('/my-bookings', getMyCustomerBookings);

// Seller booking management
router.get('/seller/my-bookings', requireApprovedSeller, getMySellerBookings);
router.put('/seller/:bookingId/status', requireApprovedSeller, updateBookingStatus);

export default router;
