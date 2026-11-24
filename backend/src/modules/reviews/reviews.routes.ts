import { Router } from 'express';
import { createReview, replyToReview, getReviews } from './reviews.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.get('/', getReviews);
router.post('/', authenticate, createReview);
router.post('/:id/reply', authenticate, replyToReview);

export default router;
