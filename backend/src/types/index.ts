export type RoleType = 'CUSTOMER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN';

export type SellerStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'ADDITIONAL_INFO_REQUIRED' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'SUSPENDED';

export type BusinessType = 
  | 'INDIVIDUAL_ARTISAN' 
  | 'HOME_BASED' 
  | 'REGISTERED_SOLE_PROPRIETOR' 
  | 'PARTNERSHIP' 
  | 'PRIVATE_LIMITED' 
  | 'SELF_HELP_GROUP';

export type ListingModerationStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export type ServiceDeliveryMode = 'AT_CLIENT_LOCATION' | 'AT_SELLER_STUDIO' | 'ONLINE';

export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'PARTIALLY_FULFILLED' | 'COMPLETED' | 'CANCELLED';

export type SellerOrderStatus = 
  | 'NEW' 
  | 'ACCEPTED' 
  | 'PROCESSING' 
  | 'READY_TO_SHIP' 
  | 'SHIPPED' 
  | 'DELIVERED' 
  | 'CANCELLED' 
  | 'RETURN_REQUESTED' 
  | 'RETURNED' 
  | 'REFUNDED';

export type BookingStatus = 
  | 'REQUESTED' 
  | 'PENDING_CONFIRMATION' 
  | 'CONFIRMED' 
  | 'RESCHEDULE_REQUESTED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'REJECTED' 
  | 'NO_SHOW';

export type TransactionType = 
  | 'SALE_CREDIT' 
  | 'COMMISSION_DEBIT' 
  | 'PAYMENT_GATEWAY_FEE' 
  | 'REFUND_DEBIT' 
  | 'SETTLEMENT_PAYOUT';

export interface UserSession {
  userId: string;
  email?: string;
  phone: string;
  fullName: string;
  roles: RoleType[];
  sellerId?: string;
  sellerStatus?: SellerStatus;
}
