import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { mockDataStore } from '../../data/mockStore.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import { SellerOrderStatus } from '../../types/index.js';

const checkoutSchema = z.object({
  shippingAddress: z.object({
    name: z.string().min(2, 'Recipient name is required'),
    phone: z.string().min(10, 'Valid phone is required'),
    addressLine1: z.string().min(3, 'Address line 1 is required'),
    addressLine2: z.string().optional(),
    landmark: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
  }),
});

export const checkout = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const validated = checkoutSchema.parse(req.body);

    const cart = mockDataStore.carts.find((c) => c.userId === userId);
    if (!cart || cart.items.length === 0) {
      return sendError(res, 'Your cart is empty', 400);
    }

    // 1. Group items by Seller
    const sellerBuckets: Record<string, { items: any[]; subTotal: number }> = {};
    let totalGross = 0;

    for (const item of cart.items) {
      const product = mockDataStore.products.find((p) => p.id === item.productId);
      if (!product || !product.isAvailable) {
        return sendError(res, `Product ${item.productId} is unavailable`, 400);
      }
      if (product.stockQuantity < item.quantity) {
        return sendError(res, `Insufficient stock for ${product.name}`, 400);
      }

      const itemTotal = product.basePrice * item.quantity;
      totalGross += itemTotal;

      if (!sellerBuckets[product.sellerId]) {
        sellerBuckets[product.sellerId] = { items: [], subTotal: 0 };
      }
      sellerBuckets[product.sellerId].items.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        unitPrice: product.basePrice,
        totalPrice: itemTotal,
      });
      sellerBuckets[product.sellerId].subTotal += itemTotal;
    }

    // 2. Calculate shipping and platform commission
    const sellerCount = Object.keys(sellerBuckets).length;
    const shippingPerSeller = 40.00;
    const totalShipping = sellerCount * shippingPerSeller;
    const netPayable = totalGross + totalShipping;

    // 3. Create Parent Order
    const parentOrderId = `ord-${uuidv4().slice(0, 8)}`;
    const orderNumber = `MHL-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const parentOrder = {
      id: parentOrderId,
      orderNumber,
      userId,
      totalGross,
      totalDiscount: 0.00,
      totalShipping,
      netPayable,
      status: 'PAID', // In production: 'PENDING_PAYMENT' until Razorpay webhook captures
      shippingAddress: validated.shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDataStore.orders.unshift(parentOrder);

    // 4. Create Seller Sub-orders
    const createdSellerOrders: any[] = [];
    const productCommissionRule = mockDataStore.commissionRules.find(
      (r) => r.vertical === 'PRODUCT' && r.isActive
    );
    const commissionPct = productCommissionRule ? Number(productCommissionRule.value) : 8.00;

    let subIndex = 1;
    for (const [sellerId, bucket] of Object.entries(sellerBuckets)) {
      const sellerSubOrderId = `so-${uuidv4().slice(0, 8)}`;
      const sellerOrderNumber = `${orderNumber}-${String.fromCharCode(64 + subIndex)}`;
      const platformFee = Number(((bucket.subTotal * commissionPct) / 100).toFixed(2));
      const sellerPayout = Number((bucket.subTotal - platformFee + shippingPerSeller).toFixed(2));

      const sellerOrder = {
        id: sellerSubOrderId,
        parentOrderId,
        sellerId,
        sellerOrderNumber,
        subTotal: bucket.subTotal,
        shippingCharge: shippingPerSeller,
        platformFee,
        sellerPayout,
        status: 'NEW' as SellerOrderStatus,
        trackingNumber: null,
        courierPartner: null,
        items: bucket.items,
        shippingAddress: validated.shippingAddress,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDataStore.sellerOrders.unshift(sellerOrder);
      createdSellerOrders.push(sellerOrder);

      // Decrement inventory stock
      for (const it of bucket.items) {
        const prod = mockDataStore.products.find((p) => p.id === it.productId);
        if (prod) {
          prod.stockQuantity = Math.max(0, prod.stockQuantity - it.quantity);
        }
      }

      // Record double-entry financial ledger credit
      const previousTx = mockDataStore.transactions
        .filter((t) => t.sellerId === sellerId)
        .slice(-1)[0];
      const prevBal = previousTx ? previousTx.balanceAfter : 0;

      mockDataStore.transactions.push({
        id: `tx-${uuidv4().slice(0, 8)}`,
        sellerId,
        sellerOrderId: sellerSubOrderId,
        type: 'SALE_CREDIT',
        amount: bucket.subTotal,
        balanceAfter: prevBal + bucket.subTotal,
        description: `Sale credit for sub-order ${sellerOrderNumber}`,
        createdAt: new Date(),
      });

      mockDataStore.transactions.push({
        id: `tx-${uuidv4().slice(0, 8)}`,
        sellerId,
        sellerOrderId: sellerSubOrderId,
        type: 'COMMISSION_DEBIT',
        amount: -platformFee,
        balanceAfter: prevBal + bucket.subTotal - platformFee,
        description: `Mahilo commission (${commissionPct}%) on ${sellerOrderNumber}`,
        createdAt: new Date(),
      });

      subIndex++;
    }

    // 5. Clear customer cart
    cart.items = [];

    return sendSuccess(
      res,
      {
        parentOrder,
        sellerOrders: createdSellerOrders,
        razorpayMock: {
          orderId: `rzp_order_${uuidv4().slice(0, 10)}`,
          amount: netPayable * 100,
          currency: 'INR',
        },
      },
      'Order placed successfully!',
      201
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return sendError(res, error.errors[0].message, 400);
    }
    return sendError(res, error.message, 500);
  }
};

export const getMyCustomerOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return sendError(res, 'Unauthorized', 401);

    const orders = mockDataStore.orders.filter((o) => o.userId === userId);

    const populated = orders.map((o) => {
      const subOrders = mockDataStore.sellerOrders.filter((so) => so.parentOrderId === o.id);
      return {
        ...o,
        subOrders: subOrders.map((so) => {
          const seller = mockDataStore.sellers.find((s) => s.id === so.sellerId);
          return {
            ...so,
            seller: seller ? { businessName: seller.businessName, slug: seller.slug } : null,
          };
        }),
      };
    });

    return sendSuccess(res, populated);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getMySellerOrders = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.sellerId;
    if (!sellerId) return sendError(res, 'Seller ID required', 400);

    const subOrders = mockDataStore.sellerOrders.filter((so) => so.sellerId === sellerId);
    return sendSuccess(res, subOrders);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const updateSellerOrderStatus = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.sellerId;
    const { sellerOrderId } = req.params;
    const { status, trackingNumber, courierPartner } = req.body;

    const subOrder = mockDataStore.sellerOrders.find((so) => so.id === sellerOrderId);
    if (!subOrder) return sendError(res, 'Sub-order not found', 404);

    if (subOrder.sellerId !== sellerId) {
      return sendError(res, 'You can only update orders placed with your own store', 403);
    }

    if (status) subOrder.status = status;
    if (trackingNumber) subOrder.trackingNumber = trackingNumber;
    if (courierPartner) subOrder.courierPartner = courierPartner;
    subOrder.updatedAt = new Date();

    return sendSuccess(res, subOrder, 'Order status updated successfully');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
