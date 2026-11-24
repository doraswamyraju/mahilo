import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { mockDataStore } from '../../data/mockStore.js';
import { sendSuccess, sendError } from '../../utils/response.js';

const productSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  name: z.string().min(3, 'Product title is required'),
  description: z.string().min(10, 'Product description is required'),
  highlights: z.array(z.string()).default([]),
  basePrice: z.number().positive('Price must be greater than 0'),
  originalPrice: z.number().positive().optional(),
  stockQuantity: z.number().int().min(0).default(1),
  imageUrl: z.string().url('A valid image URL is required'),
});

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, minPrice, maxPrice, inStock, sellerId } = req.query;

    let items = mockDataStore.products.filter(
      (p) => p.isAvailable && p.moderationStatus === 'APPROVED'
    );

    if (sellerId) {
      items = items.filter((p) => p.sellerId === sellerId);
    }

    if (category) {
      const cat = mockDataStore.productCategories.find((c) => c.slug === category || c.id === category);
      if (cat) {
        items = items.filter((p) => p.categoryId === cat.id);
      }
    }

    if (search) {
      const q = (search as string).toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.highlights.some((h: string) => h.toLowerCase().includes(q))
      );
    }

    if (minPrice) {
      items = items.filter((p) => p.basePrice >= parseFloat(minPrice as string));
    }

    if (maxPrice) {
      items = items.filter((p) => p.basePrice <= parseFloat(maxPrice as string));
    }

    if (inStock === 'true') {
      items = items.filter((p) => p.stockQuantity > 0);
    }

    // Attach seller & category details
    const populated = items.map((p) => {
      const seller = mockDataStore.sellers.find((s) => s.id === p.sellerId);
      const category = mockDataStore.productCategories.find((c) => c.id === p.categoryId);
      return {
        ...p,
        seller: seller
          ? {
              id: seller.id,
              businessName: seller.businessName,
              slug: seller.slug,
              logoUrl: seller.logoUrl,
              city: seller.city,
              state: seller.state,
              isVerified: seller.isVerified,
            }
          : null,
        category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
      };
    });

    return sendSuccess(res, populated);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const product = mockDataStore.products.find(
      (p) => p.slug === slug || p.id === slug
    );

    if (!product) {
      return sendError(res, 'Product not found', 404);
    }

    const seller = mockDataStore.sellers.find((s) => s.id === product.sellerId);
    const category = mockDataStore.productCategories.find((c) => c.id === product.categoryId);
    const reviews = mockDataStore.reviews.filter((r) => r.productId === product.id);

    return sendSuccess(res, {
      ...product,
      seller,
      category,
      reviews,
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getProductCategories = async (req: Request, res: Response) => {
  try {
    return sendSuccess(res, mockDataStore.productCategories);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.sellerId;
    if (!sellerId) return sendError(res, 'Seller ID missing', 400);

    const validated = productSchema.parse(req.body);

    const slug = validated.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newProduct = {
      id: `prod-${uuidv4().slice(0, 8)}`,
      sellerId,
      categoryId: validated.categoryId,
      name: validated.name,
      slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
      description: validated.description,
      highlights: validated.highlights,
      basePrice: validated.basePrice,
      originalPrice: validated.originalPrice || null,
      sku: `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
      isAvailable: true,
      moderationStatus: 'APPROVED',
      ratingAverage: 0.0,
      totalRatings: 0,
      stockQuantity: validated.stockQuantity,
      imageUrl: validated.imageUrl,
      createdAt: new Date(),
    };

    mockDataStore.products.unshift(newProduct);
    return sendSuccess(res, newProduct, 'Product listed successfully', 201);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return sendError(res, error.errors[0].message, 400);
    }
    return sendError(res, error.message, 500);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.sellerId;
    const { id } = req.params;

    const product = mockDataStore.products.find((p) => p.id === id);
    if (!product) return sendError(res, 'Product not found', 404);

    // Ensure seller owns the product
    if (product.sellerId !== sellerId) {
      return sendError(res, 'You are not authorized to edit this product', 403);
    }

    const { name, description, highlights, basePrice, originalPrice, stockQuantity, imageUrl, isAvailable } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (highlights !== undefined) product.highlights = highlights;
    if (basePrice !== undefined) product.basePrice = Number(basePrice);
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
    if (stockQuantity !== undefined) product.stockQuantity = Number(stockQuantity);
    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (isAvailable !== undefined) product.isAvailable = Boolean(isAvailable);

    return sendSuccess(res, product, 'Product updated successfully');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.sellerId;
    const { id } = req.params;

    const index = mockDataStore.products.findIndex((p) => p.id === id);
    if (index === -1) return sendError(res, 'Product not found', 404);

    if (mockDataStore.products[index].sellerId !== sellerId) {
      return sendError(res, 'You are not authorized to delete this product', 403);
    }

    mockDataStore.products.splice(index, 1);
    return sendSuccess(res, null, 'Product removed successfully');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
