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

export type ServiceDeliveryMode = 'AT_CLIENT_LOCATION' | 'AT_SELLER_STUDIO' | 'ONLINE';

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  roles: RoleType[];
  sellerId?: string | null;
  sellerStatus?: SellerStatus | null;
  sellerBusinessName?: string | null;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
}

export interface SellerProfile {
  id: string;
  userId: string;
  businessName: string;
  slug: string;
  businessType: BusinessType;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  status: SellerStatus;
  ratingAverage: number;
  totalRatings: number;
  totalOrders: number;
  isVerified: boolean;
  city: string;
  state: string;
  productCount?: number;
  serviceCount?: number;
  products?: Product[];
  services?: Service[];
}

export interface Product {
  id: string;
  sellerId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  highlights: string[];
  basePrice: number;
  originalPrice?: number;
  sku?: string;
  isAvailable: boolean;
  stockQuantity: number;
  imageUrl: string;
  ratingAverage: number;
  totalRatings: number;
  seller?: {
    id: string;
    businessName: string;
    slug: string;
    logoUrl?: string;
    city: string;
    state: string;
    isVerified: boolean;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface Service {
  id: string;
  sellerId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  durationMinutes: number;
  deliveryMode: ServiceDeliveryMode;
  serviceRadiusKm?: number;
  advanceAmount: number;
  cancellationRule?: string;
  isAvailable: boolean;
  imageUrl: string;
  ratingAverage: number;
  totalRatings: number;
  seller?: {
    id: string;
    businessName: string;
    slug: string;
    logoUrl?: string;
    city: string;
    state: string;
    isVerified: boolean;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  itemTotal: number;
  stockAvailable: number;
  seller?: {
    id: string;
    businessName: string;
    city: string;
    state: string;
  };
}

export interface CartSellerGroup {
  sellerId: string;
  businessName: string;
  items: CartItem[];
  subTotal: number;
  shippingCharge: number;
}

export interface CartData {
  items: CartItem[];
  sellerGroups: CartSellerGroup[];
  summary: {
    itemCount: number;
    grossTotal: number;
    totalShipping: number;
    discount: number;
    netPayable: number;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  totalGross: number;
  totalDiscount: number;
  totalShipping: number;
  netPayable: number;
  status: string;
  shippingAddress: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
  subOrders?: SellerOrder[];
}

export interface SellerOrder {
  id: string;
  parentOrderId: string;
  sellerId: string;
  sellerOrderNumber: string;
  subTotal: number;
  shippingCharge: number;
  platformFee: number;
  sellerPayout: number;
  status: string;
  trackingNumber?: string | null;
  courierPartner?: string | null;
  items: any[];
  shippingAddress?: any;
  createdAt: string;
  seller?: {
    businessName: string;
    slug: string;
  };
}

export interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;
  serviceId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  advancePaid: number;
  platformFee: number;
  sellerPayout: number;
  status: string;
  serviceAddress?: any;
  specialNotes?: string;
  service?: {
    name: string;
    imageUrl: string;
    deliveryMode: ServiceDeliveryMode;
    durationMinutes: number;
  };
  seller?: {
    businessName: string;
    slug: string;
    city: string;
  };
}
