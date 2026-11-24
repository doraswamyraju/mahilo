import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { mockDataStore } from '../../data/mockStore.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import { BookingStatus } from '../../types/index.js';

const createBookingSchema = z.object({
  serviceId: z.string().min(1, 'Service ID is required'),
  bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid date in YYYY-MM-DD required'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Start time in HH:mm format required'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'End time in HH:mm format required'),
  serviceAddress: z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
    addressLine1: z.string().min(3),
    city: z.string().min(2),
    pincode: z.string().min(6),
  }).optional(),
  specialNotes: z.string().optional(),
});

export const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const validated = createBookingSchema.parse(req.body);

    const service = mockDataStore.services.find((s) => s.id === validated.serviceId);
    if (!service || !service.isAvailable) {
      return sendError(res, 'Service is currently unavailable', 400);
    }

    // 1. Transactional Slot Concurrency Check (Prevent double booking)
    const slotConflict = mockDataStore.bookings.find(
      (b) =>
        b.serviceId === validated.serviceId &&
        b.bookingDate === validated.bookingDate &&
        b.startTime === validated.startTime &&
        b.status !== 'CANCELLED' &&
        b.status !== 'REJECTED'
    );

    if (slotConflict) {
      return sendError(
        res,
        'This appointment time slot was just reserved by another client. Please select an alternate available slot.',
        409
      );
    }

    // 2. Commission calculation
    const serviceCommissionRule = mockDataStore.commissionRules.find(
      (r) => r.vertical === 'SERVICE' && r.isActive
    );
    const commissionPct = serviceCommissionRule ? Number(serviceCommissionRule.value) : 10.00;
    const platformFee = Number(((service.price * commissionPct) / 100).toFixed(2));
    const sellerPayout = Number((service.price - platformFee).toFixed(2));

    const bookingId = `bk-${uuidv4().slice(0, 8)}`;
    const bookingNumber = `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
      id: bookingId,
      bookingNumber,
      userId,
      serviceId: service.id,
      bookingDate: validated.bookingDate,
      startTime: validated.startTime,
      endTime: validated.endTime,
      totalPrice: service.price,
      advancePaid: service.advanceAmount || 0,
      platformFee,
      sellerPayout,
      status: 'CONFIRMED' as BookingStatus,
      serviceAddress: validated.serviceAddress || null,
      specialNotes: validated.specialNotes || null,
      cancellationNote: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDataStore.bookings.unshift(newBooking);

    // Initial audit/history record
    mockDataStore.bookingStatusHistory.push({
      id: `bkh-${uuidv4().slice(0, 8)}`,
      bookingId,
      oldStatus: 'REQUESTED' as BookingStatus,
      newStatus: 'CONFIRMED' as BookingStatus,
      changedBy: userId,
      reason: 'Booking successfully confirmed upon payment',
      createdAt: new Date(),
    });

    // Ledger credit for advance or service fee
    const sellerId = service.sellerId;
    const prevTx = mockDataStore.transactions.filter((t) => t.sellerId === sellerId).slice(-1)[0];
    const prevBal = prevTx ? prevTx.balanceAfter : 0;

    if (newBooking.advancePaid > 0) {
      mockDataStore.transactions.push({
        id: `tx-${uuidv4().slice(0, 8)}`,
        sellerId,
        bookingId,
        type: 'SALE_CREDIT',
        amount: newBooking.advancePaid,
        balanceAfter: prevBal + newBooking.advancePaid,
        description: `Advance deposit for booking ${bookingNumber}`,
        createdAt: new Date(),
      });
    }

    return sendSuccess(res, newBooking, 'Service booking scheduled successfully!', 201);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return sendError(res, error.errors[0].message, 400);
    }
    return sendError(res, error.message, 500);
  }
};

export const getMyCustomerBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const bookings = mockDataStore.bookings.filter((b) => b.userId === userId);

    const populated = bookings.map((b) => {
      const service = mockDataStore.services.find((s) => s.id === b.serviceId);
      const seller = service ? mockDataStore.sellers.find((sel) => sel.id === service.sellerId) : null;
      return {
        ...b,
        service: service
          ? {
              name: service.name,
              imageUrl: service.imageUrl,
              deliveryMode: service.deliveryMode,
              durationMinutes: service.durationMinutes,
            }
          : null,
        seller: seller
          ? {
              businessName: seller.businessName,
              slug: seller.slug,
              city: seller.city,
            }
          : null,
      };
    });

    return sendSuccess(res, populated);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getMySellerBookings = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.sellerId;
    if (!sellerId) return sendError(res, 'Seller ID required', 400);

    // Find services belonging to this seller
    const sellerServiceIds = mockDataStore.services
      .filter((s) => s.sellerId === sellerId)
      .map((s) => s.id);

    const bookings = mockDataStore.bookings.filter((b) => sellerServiceIds.includes(b.serviceId));

    const populated = bookings.map((b) => {
      const service = mockDataStore.services.find((s) => s.id === b.serviceId);
      const customer = mockDataStore.users.find((u) => u.id === b.userId);
      return {
        ...b,
        serviceName: service?.name,
        customerName: customer?.fullName,
        customerPhone: customer?.phone,
      };
    });

    return sendSuccess(res, populated);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.sellerId;
    const { bookingId } = req.params;
    const { status, reason } = req.body;

    const booking = mockDataStore.bookings.find((b) => b.id === bookingId);
    if (!booking) return sendError(res, 'Booking not found', 404);

    const service = mockDataStore.services.find((s) => s.id === booking.serviceId);
    if (!service || service.sellerId !== sellerId) {
      return sendError(res, 'Unauthorized to update this booking', 403);
    }

    const oldStatus = booking.status;
    booking.status = status as BookingStatus;
    booking.updatedAt = new Date();

    mockDataStore.bookingStatusHistory.push({
      id: `bkh-${uuidv4().slice(0, 8)}`,
      bookingId,
      oldStatus,
      newStatus: booking.status,
      changedBy: req.user?.userId || 'SELLER',
      reason: reason || `Status changed from ${oldStatus} to ${status}`,
      createdAt: new Date(),
    });

    return sendSuccess(res, booking, `Booking marked as ${status}`);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
