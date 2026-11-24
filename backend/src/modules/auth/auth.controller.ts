import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { mockDataStore } from '../../data/mockStore.js';
import { config } from '../../config/index.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import { RoleType, UserSession } from '../../types/index.js';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  identifier: z.string().min(3, 'Phone or email required'),
  password: z.string().min(1, 'Password is required'),
});

export const register = async (req: Request, res: Response) => {
  try {
    const validated = registerSchema.parse(req.body);

    // Check if phone or email is already registered
    const existingPhone = mockDataStore.users.find((u) => u.phone === validated.phone);
    if (existingPhone) {
      return sendError(res, 'A user with this mobile number already exists', 409);
    }

    if (validated.email) {
      const existingEmail = mockDataStore.users.find((u) => u.email === validated.email);
      if (existingEmail) {
        return sendError(res, 'A user with this email address already exists', 409);
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validated.password, salt);

    const newUser = {
      id: `usr-${uuidv4().slice(0, 8)}`,
      fullName: validated.fullName,
      email: validated.email || null,
      phone: validated.phone,
      passwordHash,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(validated.fullName)}`,
      isActive: true,
      isPhoneVerified: true,
      isEmailVerified: !!validated.email,
      createdAt: new Date(),
    };

    mockDataStore.users.push(newUser);

    // Assign default role: CUSTOMER
    mockDataStore.userRoles.push({
      userId: newUser.id,
      roleId: 'role-1', // CUSTOMER
    });

    // Initialize an empty cart for this user
    mockDataStore.carts.push({
      id: `cart-${uuidv4().slice(0, 8)}`,
      userId: newUser.id,
      items: [],
    });

    // Build JWT payload
    const tokenPayload: UserSession = {
      userId: newUser.id,
      email: newUser.email || undefined,
      phone: newUser.phone,
      fullName: newUser.fullName,
      roles: ['CUSTOMER'],
    };

    const token = jwt.sign(tokenPayload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as any,
    });

    return sendSuccess(
      res,
      {
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          phone: newUser.phone,
          email: newUser.email,
          avatarUrl: newUser.avatarUrl,
          roles: ['CUSTOMER'],
          sellerStatus: null,
        },
        token,
      },
      'Welcome to Mahilo! Account created successfully.',
      201
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return sendError(res, error.errors[0].message, 400);
    }
    return sendError(res, error.message, 500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validated = loginSchema.parse(req.body);

    const user = mockDataStore.users.find(
      (u) => u.phone === validated.identifier || u.email === validated.identifier
    );

    if (!user) {
      return sendError(res, 'Invalid mobile/email or password', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'This account has been deactivated. Please contact support.', 403);
    }

    const isMatch = await bcrypt.compare(validated.password, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Invalid mobile/email or password', 401);
    }

    // Resolve assigned roles
    const userRoleMappings = mockDataStore.userRoles.filter((ur) => ur.userId === user.id);
    const roleIds = userRoleMappings.map((ur) => ur.roleId);
    const assignedRoles = mockDataStore.roles
      .filter((r) => roleIds.includes(r.id))
      .map((r) => r.name as RoleType);

    // Resolve Seller profile if present
    const seller = mockDataStore.sellers.find((s) => s.userId === user.id);

    const tokenPayload: UserSession = {
      userId: user.id,
      email: user.email || undefined,
      phone: user.phone,
      fullName: user.fullName,
      roles: assignedRoles,
      sellerId: seller?.id,
      sellerStatus: seller?.status,
    };

    const token = jwt.sign(tokenPayload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as any,
    });

    return sendSuccess(
      res,
      {
        user: {
          id: user.id,
          fullName: user.fullName,
          phone: user.phone,
          email: user.email,
          avatarUrl: user.avatarUrl,
          roles: assignedRoles,
          sellerId: seller?.id || null,
          sellerStatus: seller?.status || null,
          sellerBusinessName: seller?.businessName || null,
        },
        token,
      },
      'Logged in successfully'
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return sendError(res, error.errors[0].message, 400);
    }
    return sendError(res, error.message, 500);
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const user = mockDataStore.users.find((u) => u.id === req.user?.userId);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const userRoleMappings = mockDataStore.userRoles.filter((ur) => ur.userId === user.id);
    const roleIds = userRoleMappings.map((ur) => ur.roleId);
    const assignedRoles = mockDataStore.roles
      .filter((r) => roleIds.includes(r.id))
      .map((r) => r.name as RoleType);

    const seller = mockDataStore.sellers.find((s) => s.userId === user.id);

    return sendSuccess(res, {
      id: user.id,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      avatarUrl: user.avatarUrl,
      roles: assignedRoles,
      sellerId: seller?.id || null,
      sellerStatus: seller?.status || null,
      sellerBusinessName: seller?.businessName || null,
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
