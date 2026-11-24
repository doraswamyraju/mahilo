import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { mockDataStore } from '../../data/mockStore.js';
import { sendSuccess, sendError } from '../../utils/response.js';

const applySellerSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  businessType: z.enum([
    'INDIVIDUAL_ARTISAN',
    'HOME_BASED',
    'REGISTERED_SOLE_PROPRIETOR',
    'PARTNERSHIP',
    'PRIVATE_LIMITED',
    'SELF_HELP_GROUP',
  ]),
  description: z.string().min(10, 'Please provide a brief business description'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  panNumber: z.string().optional(),
  gstin: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankIfscCode: z.string().optional(),
  bankAccountName: z.string().optional(),
  bankName: z.string().optional(),
  logoUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
});

export const applyForSeller = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const validated = applySellerSchema.parse(req.body);

    // Check if seller profile already exists
    const existing = mockDataStore.sellers.find((s) => s.userId === userId);
    if (existing) {
      return sendError(
        res,
        `You already have an existing seller application in '${existing.status}' status.`,
        400
      );
    }

    const slug = validated.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newSeller = {
      id: `seller-${uuidv4().slice(0, 8)}`,
      userId,
      businessName: validated.businessName,
      slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
      businessType: validated.businessType,
      description: validated.description,
      logoUrl: validated.logoUrl || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=200&q=80',
      bannerUrl: validated.bannerUrl || 'https://images.unsplash.com/photo-1493106819501-66d381c466f1?auto=format&fit=crop&w=1200&q=80',
      status: 'UNDER_REVIEW', // Needs Admin approval
      ratingAverage: 0.0,
      totalRatings: 0,
      totalOrders: 0,
      isVerified: false,
      panNumber: validated.panNumber || null,
      gstin: validated.gstin || null,
      bankAccountNumber: validated.bankAccountNumber || null,
      bankIfscCode: validated.bankIfscCode || null,
      bankAccountName: validated.bankAccountName || null,
      bankName: validated.bankName || null,
      city: validated.city,
      state: validated.state,
      createdAt: new Date(),
    };

    mockDataStore.sellers.push(newSeller);

    // Link SELLER role to existing user if not already linked
    const existingRole = mockDataStore.userRoles.find(
      (ur) => ur.userId === userId && ur.roleId === 'role-2'
    );
    if (!existingRole) {
      mockDataStore.userRoles.push({
        userId,
        roleId: 'role-2', // SELLER
      });
    }

    return sendSuccess(
      res,
      newSeller,
      'Your seller onboarding application has been submitted and is under review by Mahilo admins.',
      201
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return sendError(res, error.errors[0].message, 400);
    }
    return sendError(res, error.message, 500);
  }
};

export const getMySellerProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const seller = mockDataStore.sellers.find((s) => s.userId === userId);
    if (!seller) {
      return sendError(res, 'No seller profile associated with this account', 404);
    }
    return sendSuccess(res, seller);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const updateMySellerProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const seller = mockDataStore.sellers.find((s) => s.userId === userId);
    if (!seller) {
      return sendError(res, 'Seller profile not found', 404);
    }

    const { businessName, description, logoUrl, bannerUrl, city, state, bankAccountNumber, bankIfscCode, bankAccountName } = req.body;

    if (businessName) seller.businessName = businessName;
    if (description) seller.description = description;
    if (logoUrl) seller.logoUrl = logoUrl;
    if (bannerUrl) seller.bannerUrl = bannerUrl;
    if (city) seller.city = city;
    if (state) seller.state = state;
    if (bankAccountNumber) seller.bankAccountNumber = bankAccountNumber;
    if (bankIfscCode) seller.bankIfscCode = bankIfscCode;
    if (bankAccountName) seller.bankAccountName = bankAccountName;

    return sendSuccess(res, seller, 'Seller profile updated successfully');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getPublicSellerBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const seller = mockDataStore.sellers.find((s) => s.slug === slug && s.status === 'APPROVED');
    if (!seller) {
      return sendError(res, 'Seller storefront not found or not currently active', 404);
    }

    // Include seller's products and services
    const products = mockDataStore.products.filter(
      (p) => p.sellerId === seller.id && p.isAvailable && p.moderationStatus === 'APPROVED'
    );
    const services = mockDataStore.services.filter(
      (s) => s.sellerId === seller.id && s.isAvailable && s.moderationStatus === 'APPROVED'
    );

    return sendSuccess(res, {
      ...seller,
      products,
      services,
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getAllApprovedSellers = async (req: Request, res: Response) => {
  try {
    const sellers = mockDataStore.sellers
      .filter((s) => s.status === 'APPROVED')
      .map((s) => {
        const productCount = s.productCount || `${mockDataStore.products.filter((p) => p.sellerId === s.id).length}+ products`;
        const serviceCount = s.serviceCount || `${mockDataStore.services.filter((srv) => srv.sellerId === s.id).length}+ services`;
        return {
          ...s,
          productCount,
          serviceCount,
        };
      });

    return sendSuccess(res, sellers);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
