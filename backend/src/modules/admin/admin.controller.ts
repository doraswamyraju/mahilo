import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { mockDataStore } from '../../data/mockStore.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getAdminAnalytics = async (req: Request, res: Response) => {
  try {
    const totalSellers = mockDataStore.sellers.length;
    const approvedSellers = mockDataStore.sellers.filter((s) => s.status === 'APPROVED').length;
    const pendingSellers = mockDataStore.sellers.filter((s) => s.status === 'UNDER_REVIEW' || s.status === 'SUBMITTED').length;
    
    const totalCustomers = mockDataStore.users.length;
    const totalProducts = mockDataStore.products.length;
    const totalServices = mockDataStore.services.length;

    // GMV & Platform revenue calculation
    let gmv = 0;
    let platformRevenue = 0;

    for (const ord of mockDataStore.orders) {
      if (ord.status === 'PAID' || ord.status === 'COMPLETED') {
        gmv += ord.netPayable;
      }
    }

    for (const b of mockDataStore.bookings) {
      if (b.status !== 'CANCELLED' && b.status !== 'REJECTED') {
        gmv += b.totalPrice;
        platformRevenue += b.platformFee;
      }
    }

    for (const so of mockDataStore.sellerOrders) {
      platformRevenue += so.platformFee;
    }

    return sendSuccess(res, {
      gmv: Number(gmv.toFixed(2)),
      platformRevenue: Number(platformRevenue.toFixed(2)),
      totalSellers,
      approvedSellers,
      pendingSellers,
      totalCustomers,
      totalProducts,
      totalServices,
      totalOrders: mockDataStore.orders.length,
      totalBookings: mockDataStore.bookings.length,
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getAdminSellers = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let sellers = mockDataStore.sellers;

    if (status) {
      sellers = sellers.filter((s) => s.status === status);
    }

    // Attach user information and documents
    const populated = sellers.map((s) => {
      const user = mockDataStore.users.find((u) => u.id === s.userId);
      const docs = mockDataStore.sellerDocuments.filter((d) => d.sellerId === s.id);
      return {
        ...s,
        ownerName: user?.fullName,
        ownerPhone: user?.phone,
        ownerEmail: user?.email,
        documents: docs,
      };
    });

    return sendSuccess(res, populated);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const updateSellerStatus = async (req: Request, res: Response) => {
  try {
    const { sellerId } = req.params;
    const { status, rejectionReason } = req.body;

    const seller = mockDataStore.sellers.find((s) => s.id === sellerId);
    if (!seller) return sendError(res, 'Seller not found', 404);

    seller.status = status;
    seller.isVerified = status === 'APPROVED';
    if (rejectionReason) seller.rejectionReason = rejectionReason;
    seller.updatedAt = new Date();

    // Notify seller
    mockDataStore.notifications.push({
      id: `notif-${uuidv4().slice(0, 8)}`,
      userId: seller.userId,
      title: status === 'APPROVED' ? 'Congratulations! Seller Account Approved' : `Seller Account ${status}`,
      message: status === 'APPROVED' 
        ? 'Your Mahilo store is now live! You can start listing products and bookable services.' 
        : `Your application status has been updated to ${status}. ${rejectionReason || ''}`,
      type: 'SELLER_STATUS',
      link: status === 'APPROVED' ? '/seller/dashboard' : '/seller/onboarding',
      isRead: false,
      createdAt: new Date(),
    });

    return sendSuccess(res, seller, `Seller status successfully updated to ${status}`);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getCommissionRules = async (req: Request, res: Response) => {
  try {
    return sendSuccess(res, mockDataStore.commissionRules);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const updateCommissionRule = async (req: Request, res: Response) => {
  try {
    const { ruleId } = req.params;
    const { value, isActive } = req.body;

    const rule = mockDataStore.commissionRules.find((r) => r.id === ruleId);
    if (!rule) return sendError(res, 'Commission rule not found', 404);

    if (value !== undefined) rule.value = Number(value);
    if (isActive !== undefined) rule.isActive = Boolean(isActive);

    return sendSuccess(res, rule, 'Commission rule updated');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getAdminSettlements = async (req: Request, res: Response) => {
  try {
    const settlements = mockDataStore.sellerSettlements.map((st) => {
      const seller = mockDataStore.sellers.find((s) => s.id === st.sellerId);
      return {
        ...st,
        seller: seller
          ? {
              businessName: seller.businessName,
              bankName: seller.bankName,
              bankAccountNumber: seller.bankAccountNumber,
              bankIfscCode: seller.bankIfscCode,
              bankAccountName: seller.bankAccountName,
            }
          : null,
      };
    });

    return sendSuccess(res, settlements);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const processSettlement = async (req: Request, res: Response) => {
  try {
    const { settlementId } = req.params;
    const { bankUtrNumber } = req.body;

    const st = mockDataStore.sellerSettlements.find((s) => s.id === settlementId);
    if (!st) return sendError(res, 'Settlement not found', 404);

    st.status = 'TRANSFERRED';
    st.bankUtrNumber = bankUtrNumber || `CMS${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    st.processedAt = new Date();

    // Record ledger debit transaction for payout
    const prevTx = mockDataStore.transactions.filter((t) => t.sellerId === st.sellerId).slice(-1)[0];
    const prevBal = prevTx ? prevTx.balanceAfter : 0;

    mockDataStore.transactions.push({
      id: `tx-${uuidv4().slice(0, 8)}`,
      sellerId: st.sellerId,
      settlementId: st.id,
      type: 'SETTLEMENT_PAYOUT',
      amount: -st.netAmount,
      balanceAfter: prevBal - st.netAmount,
      description: `Disbursement to bank account (UTR: ${st.bankUtrNumber})`,
      createdAt: new Date(),
    });

    return sendSuccess(res, st, 'Settlement marked as transferred successfully');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
