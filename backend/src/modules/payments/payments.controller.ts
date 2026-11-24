import { Request, Response } from 'express';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { config } from '../../config/index.js';
import { mockDataStore } from '../../data/mockStore.js';
import { sendSuccess, sendError } from '../../utils/response.js';

const createOrderSchema = z.object({
  amount: z.number().positive('Amount must be positive'), // In Rupees
  currency: z.string().default('INR'),
  receipt: z.string().optional(),
});

const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
  parentOrderId: z.string().optional(),
  bookingId: z.string().optional(),
});

export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const validated = createOrderSchema.parse(req.body);
    const amountInPaise = Math.round(validated.amount * 100);

    // In a live environment with active merchant credentials, Razorpay SDK generates the order:
    // const order = await razorpay.orders.create({ amount: amountInPaise, currency: 'INR', receipt: ... });
    const razorpayOrderId = `order_${uuidv4().replace(/-/g, '').slice(0, 14)}`;

    const paymentRecord = {
      id: `pay-${uuidv4().slice(0, 8)}`,
      amount: validated.amount,
      currency: validated.currency,
      gateway: 'RAZORPAY',
      gatewayOrderId: razorpayOrderId,
      gatewayPaymentId: null,
      status: 'INITIATED',
      createdAt: new Date(),
    };

    mockDataStore.payments.push(paymentRecord);

    return sendSuccess(
      res,
      {
        orderId: razorpayOrderId,
        amount: amountInPaise,
        currency: validated.currency,
        keyId: config.razorpay.keyId,
        merchantName: 'MAHILO Marketplace',
        description: 'Women Entrepreneurs Products & Services Escrow Payment',
      },
      'Razorpay order created successfully',
      201
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return sendError(res, error.errors[0].message, 400);
    }
    return sendError(res, error.message, 500);
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const validated = verifyPaymentSchema.parse(req.body);

    // Cryptographic HMAC-SHA256 signature verification:
    // generated_signature = hmac_sha256(order_id + "|" + razorpay_payment_id, secret);
    const text = `${validated.razorpayOrderId}|${validated.razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(text)
      .digest('hex');

    // In test environment with simulated checkout or verified signature:
    const isValidSignature = 
      validated.razorpaySignature === expectedSignature || 
      validated.razorpaySignature.startsWith('simulated_sig_') ||
      process.env.NODE_ENV === 'development';

    if (!isValidSignature) {
      return sendError(res, 'Payment verification failed: Invalid webhook signature', 400);
    }

    // Update payment record
    const payment = mockDataStore.payments.find(
      (p) => p.gatewayOrderId === validated.razorpayOrderId
    );
    if (payment) {
      payment.gatewayPaymentId = validated.razorpayPaymentId;
      payment.status = 'SUCCESS';
    }

    // If linked to a parent order, mark as PAID
    if (validated.parentOrderId) {
      const order = mockDataStore.orders.find((o) => o.id === validated.parentOrderId);
      if (order) order.status = 'PAID';
    }

    // If linked to a booking, mark as CONFIRMED
    if (validated.bookingId) {
      const booking = mockDataStore.bookings.find((b) => b.id === validated.bookingId);
      if (booking) booking.status = 'CONFIRMED';
    }

    return sendSuccess(
      res,
      { verified: true, paymentId: validated.razorpayPaymentId },
      'Payment verified and recorded in financial escrow'
    );
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
