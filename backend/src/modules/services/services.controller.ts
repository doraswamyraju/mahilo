import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { mockDataStore } from '../../data/mockStore.js';
import { sendSuccess, sendError } from '../../utils/response.js';

const serviceSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  name: z.string().min(3, 'Service name is required'),
  description: z.string().min(10, 'Service description is required'),
  price: z.number().positive('Price must be greater than 0'),
  durationMinutes: z.number().int().min(15).default(60),
  deliveryMode: z.enum(['AT_CLIENT_LOCATION', 'AT_SELLER_STUDIO', 'ONLINE']),
  serviceRadiusKm: z.number().int().positive().optional(),
  advanceAmount: z.number().min(0).default(0),
  cancellationRule: z.string().optional(),
  imageUrl: z.string().url('A valid image URL is required'),
});

export const getServices = async (req: Request, res: Response) => {
  try {
    const { category, search, deliveryMode, maxPrice, sellerId } = req.query;

    let items = mockDataStore.services.filter(
      (s) => s.isAvailable && s.moderationStatus === 'APPROVED'
    );

    if (sellerId) {
      items = items.filter((s) => s.sellerId === sellerId);
    }

    if (category) {
      const cat = mockDataStore.serviceCategories.find((c) => c.slug === category || c.id === category);
      if (cat) {
        items = items.filter((s) => s.categoryId === cat.id);
      }
    }

    if (deliveryMode) {
      items = items.filter((s) => s.deliveryMode === deliveryMode);
    }

    if (search) {
      const q = (search as string).toLowerCase();
      items = items.filter(
        (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      );
    }

    if (maxPrice) {
      items = items.filter((s) => s.price <= parseFloat(maxPrice as string));
    }

    const populated = items.map((s) => {
      const seller = mockDataStore.sellers.find((sel) => sel.id === s.sellerId);
      const category = mockDataStore.serviceCategories.find((c) => c.id === s.categoryId);
      return {
        ...s,
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

export const getServiceBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const service = mockDataStore.services.find((s) => s.slug === slug || s.id === slug);
    if (!service) {
      return sendError(res, 'Service not found', 404);
    }

    const seller = mockDataStore.sellers.find((sel) => sel.id === service.sellerId);
    const category = mockDataStore.serviceCategories.find((c) => c.id === service.categoryId);
    const reviews = mockDataStore.reviews.filter((r) => r.serviceId === service.id);

    return sendSuccess(res, {
      ...service,
      seller,
      category,
      reviews,
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getServiceCategories = async (req: Request, res: Response) => {
  try {
    return sendSuccess(res, mockDataStore.serviceCategories);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

// Real-time Slot Engine: dynamically creates available appointment slots for a selected date
export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date } = req.query; // YYYY-MM-DD

    if (!date) {
      return sendError(res, 'Date query parameter (YYYY-MM-DD) is required', 400);
    }

    const service = mockDataStore.services.find((s) => s.id === id || s.slug === id);
    if (!service) return sendError(res, 'Service not found', 404);

    const targetDate = new Date(date as string);
    const dayOfWeek = targetDate.getDay(); // 0 = Sun, 1 = Mon ...

    // Find seller's recurring availability rule for this day
    const availability = mockDataStore.serviceAvailabilities.find(
      (a) => a.sellerId === service.sellerId && a.dayOfWeek === dayOfWeek && a.isActive
    );

    if (!availability) {
      return sendSuccess(res, {
        date,
        dayOfWeek,
        isOperatingDay: false,
        message: 'Provider does not offer service appointments on this day of the week',
        slots: [],
      });
    }

    // Generate intervals between startTime and endTime
    const [startH, startM] = availability.startTime.split(':').map(Number);
    const [endH, endM] = availability.endTime.split(':').map(Number);
    const slotDuration = availability.slotDuration || service.durationMinutes || 60;
    const buffer = availability.bufferMinutes || 15;

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    // Get already confirmed or requested bookings for this service & date
    const existingBookings = mockDataStore.bookings.filter(
      (b) =>
        b.serviceId === service.id &&
        b.bookingDate === (date as string) &&
        b.status !== 'CANCELLED' &&
        b.status !== 'REJECTED'
    );

    const slots: any[] = [];
    while (currentMinutes + slotDuration <= endMinutes) {
      const slotStartH = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
      const slotStartM = (currentMinutes % 60).toString().padStart(2, '0');
      const slotStartTime = `${slotStartH}:${slotStartM}`;

      const slotEndTotal = currentMinutes + slotDuration;
      const slotEndH = Math.floor(slotEndTotal / 60).toString().padStart(2, '0');
      const slotEndM = (slotEndTotal % 60).toString().padStart(2, '0');
      const slotEndTime = `${slotEndH}:${slotEndM}`;

      // Check if slot overlaps with an existing booking
      const isBooked = existingBookings.some((b) => b.startTime === slotStartTime);

      slots.push({
        startTime: slotStartTime,
        endTime: slotEndTime,
        isAvailable: !isBooked,
      });

      currentMinutes += slotDuration + buffer;
    }

    return sendSuccess(res, {
      date,
      dayOfWeek,
      isOperatingDay: true,
      serviceName: service.name,
      durationMinutes: service.durationMinutes,
      slots,
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.sellerId;
    if (!sellerId) return sendError(res, 'Seller ID missing', 400);

    const validated = serviceSchema.parse(req.body);

    const slug = validated.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newService = {
      id: `srv-${uuidv4().slice(0, 8)}`,
      sellerId,
      categoryId: validated.categoryId,
      name: validated.name,
      slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
      description: validated.description,
      price: validated.price,
      durationMinutes: validated.durationMinutes,
      deliveryMode: validated.deliveryMode,
      serviceRadiusKm: validated.serviceRadiusKm || 15,
      advanceAmount: validated.advanceAmount,
      cancellationRule: validated.cancellationRule || 'Free cancellation up to 6 hours before start time.',
      isAvailable: true,
      moderationStatus: 'APPROVED',
      ratingAverage: 0.0,
      totalRatings: 0,
      imageUrl: validated.imageUrl,
      createdAt: new Date(),
    };

    mockDataStore.services.unshift(newService);
    return sendSuccess(res, newService, 'Service listing published successfully', 201);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return sendError(res, error.errors[0].message, 400);
    }
    return sendError(res, error.message, 500);
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.sellerId;
    const { id } = req.params;

    const service = mockDataStore.services.find((s) => s.id === id);
    if (!service) return sendError(res, 'Service not found', 404);

    if (service.sellerId !== sellerId) {
      return sendError(res, 'Unauthorized to edit this service', 403);
    }

    const { name, description, price, durationMinutes, deliveryMode, advanceAmount, isAvailable, imageUrl } = req.body;

    if (name !== undefined) service.name = name;
    if (description !== undefined) service.description = description;
    if (price !== undefined) service.price = Number(price);
    if (durationMinutes !== undefined) service.durationMinutes = Number(durationMinutes);
    if (deliveryMode !== undefined) service.deliveryMode = deliveryMode;
    if (advanceAmount !== undefined) service.advanceAmount = Number(advanceAmount);
    if (isAvailable !== undefined) service.isAvailable = Boolean(isAvailable);
    if (imageUrl !== undefined) service.imageUrl = imageUrl;

    return sendSuccess(res, service, 'Service updated successfully');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
