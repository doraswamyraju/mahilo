import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { mockDataStore } from '../../data/mockStore.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getSellerLedgerSummary = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.sellerId;
    if (!sellerId) return sendError(res, 'Seller ID required', 400);

    const txs = mockDataStore.transactions.filter((t) => t.sellerId === sellerId);

    let grossSales = 0;
    let totalCommission = 0;
    let totalSettled = 0;

    for (const t of txs) {
      if (t.type === 'SALE_CREDIT') {
        grossSales += t.amount;
      } else if (t.type === 'COMMISSION_DEBIT') {
        totalCommission += Math.abs(t.amount);
      } else if (t.type === 'SETTLEMENT_PAYOUT') {
        totalSettled += Math.abs(t.amount);
      }
    }

    const netPayable = grossSales - totalCommission;
    const availableBalance = netPayable - totalSettled;

    // Get order counts
    const sellerOrders = mockDataStore.sellerOrders.filter((so) => so.sellerId === sellerId);
    const sellerBookings = mockDataStore.bookings.filter((b) => {
      const srv = mockDataStore.services.find((s) => s.id === b.serviceId);
      return srv?.sellerId === sellerId;
    });

    return sendSuccess(res, {
      grossSales: Number(grossSales.toFixed(2)),
      totalCommission: Number(totalCommission.toFixed(2)),
      totalSettled: Number(totalSettled.toFixed(2)),
      availableBalance: Number(availableBalance.toFixed(2)),
      stats: {
        totalOrders: sellerOrders.length,
        completedOrders: sellerOrders.filter((o) => o.status === 'DELIVERED').length,
        activeOrders: sellerOrders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length,
        totalBookings: sellerBookings.length,
        activeBookings: sellerBookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS').length,
      },
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getSellerTransactions = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.sellerId;
    if (!sellerId) return sendError(res, 'Seller ID required', 400);

    const txs = mockDataStore.transactions
      .filter((t) => t.sellerId === sellerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return sendSuccess(res, txs);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getSellerSettlements = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.sellerId;
    if (!sellerId) return sendError(res, 'Seller ID required', 400);

    const settlements = mockDataStore.sellerSettlements.filter((s) => s.sellerId === sellerId);
    return sendSuccess(res, settlements);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const requestPayout = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.sellerId;
    if (!sellerId) return sendError(res, 'Seller ID required', 400);

    const txs = mockDataStore.transactions.filter((t) => t.sellerId === sellerId);
    let netAccrued = 0;
    for (const t of txs) {
      if (t.type === 'SALE_CREDIT') netAccrued += t.amount;
      else if (t.type === 'COMMISSION_DEBIT') netAccrued -= Math.abs(t.amount);
      else if (t.type === 'SETTLEMENT_PAYOUT') netAccrued -= Math.abs(t.amount);
    }

    if (netAccrued < 100) {
      return sendError(res, 'Minimum payout threshold is ₹100.00', 400);
    }

    const settlementRef = `STL-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;
    const newSettlement = {
      id: `stl-${uuidv4().slice(0, 8)}`,
      sellerId,
      settlementRef,
      grossAmount: netAccrued,
      deductions: 0,
      netAmount: netAccrued,
      status: 'PENDING',
      bankUtrNumber: null,
      processedAt: null,
      createdAt: new Date(),
    };

    mockDataStore.sellerSettlements.unshift(newSettlement);
    return sendSuccess(res, newSettlement, 'Payout request submitted successfully and will be disbursed to your bank account within 24-48 hours.', 201);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
