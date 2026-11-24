import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { mockDataStore } from '../../data/mockStore.js';
import { sendSuccess, sendError } from '../../utils/response.js';

const reviewSchema = z.object({
  productId: z.string().optional(),
  serviceId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3, 'Please write a brief review comment'),
});

export const createReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const validated = reviewSchema.parse(req.body);
    if (!validated.productId && !validated.serviceId) {
      return sendError(res, 'Must review either a product or a service', 400);
    }

    const user = mockDataStore.users.find((u) => u.id === userId);

    const newReview = {
      id: `rev-${uuidv4().slice(0, 8)}`,
      userId,
      productId: validated.productId || null,
      serviceId: validated.serviceId || null,
      rating: validated.rating,
      comment: validated.comment,
      sellerReply: null,
      isVerified: true, // Verified buyer
      userName: user?.fullName || 'Verified Customer',
      createdAt: new Date(),
    };

    mockDataStore.reviews.unshift(newReview);

    // Recompute average rating on the product or service
    if (validated.productId) {
      const prod = mockDataStore.products.find((p) => p.id === validated.productId);
      if (prod) {
        const prodReviews = mockDataStore.reviews.filter((r) => r.productId === prod.id);
        const sum = prodReviews.reduce((acc, r) => acc + r.rating, 0);
        prod.ratingAverage = Number((sum / prodReviews.length).toFixed(1));
        prod.totalRatings = prodReviews.length;
      }
    }

    if (validated.serviceId) {
      const srv = mockDataStore.services.find((s) => s.id === validated.serviceId);
      if (srv) {
        const srvReviews = mockDataStore.reviews.filter((r) => r.serviceId === srv.id);
        const sum = srvReviews.reduce((acc, r) => acc + r.rating, 0);
        srv.ratingAverage = Number((sum / srvReviews.length).toFixed(1));
        srv.totalRatings = srvReviews.length;
      }
    }

    return sendSuccess(res, newReview, 'Thank you! Your verified review has been published.', 201);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return sendError(res, error.errors[0].message, 400);
    }
    return sendError(res, error.message, 500);
  }
};

export const replyToReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const sellerId = req.user?.sellerId;

    if (!sellerId) return sendError(res, 'Seller account required', 403);
    if (!reply) return sendError(res, 'Reply text is required', 400);

    const review = mockDataStore.reviews.find((r) => r.id === id);
    if (!review) return sendError(res, 'Review not found', 404);

    review.sellerReply = reply;
    return sendSuccess(res, review, 'Response to review published');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getReviews = async (req: Request, res: Response) => {
  try {
    const { productId, serviceId } = req.query;
    let reviews = mockDataStore.reviews;

    if (productId) {
      reviews = reviews.filter((r) => r.productId === productId);
    } else if (serviceId) {
      reviews = reviews.filter((r) => r.serviceId === serviceId);
    }

    const populated = reviews.map((r) => {
      const user = mockDataStore.users.find((u) => u.id === r.userId);
      return {
        ...r,
        userName: user?.fullName || 'Verified Customer',
        userAvatar: user?.avatarUrl,
      };
    });

    return sendSuccess(res, populated);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
