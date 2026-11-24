import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { sendError } from '../utils/response.js';
import { RoleType, UserSession } from '../types/index.js';
import { mockDataStore } from '../data/mockStore.js';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: UserSession;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication token required', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as UserSession;
    
    // Verify user exists and is active
    const user = mockDataStore.users.find((u) => u.id === decoded.userId);
    if (!user || !user.isActive) {
      return sendError(res, 'User account is inactive or not found', 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired authentication token', 401);
  }
};

export const requireRole = (...allowedRoles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      return sendError(
        res,
        'Access denied: You do not possess the required permissions for this action',
        403
      );
    }

    next();
  };
};

export const requireApprovedSeller = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return sendError(res, 'Authentication required', 401);
  }

  if (!req.user.roles.includes('SELLER')) {
    return sendError(res, 'Access denied: Seller account required', 403);
  }

  const seller = mockDataStore.sellers.find((s) => s.userId === req.user?.userId);
  if (!seller) {
    return sendError(res, 'Seller profile not found. Please complete onboarding.', 404);
  }

  if (seller.status !== 'APPROVED') {
    return sendError(
      res,
      `Your seller application is currently ${seller.status}. Action restricted until approved by Mahilo administrator.`,
      403
    );
  }

  req.user.sellerId = seller.id;
  req.user.sellerStatus = seller.status;
  next();
};

export const requireAdmin = requireRole('ADMIN', 'SUPER_ADMIN');
