import { 
  ShoppingBag, 
  Package, 
  Calendar, 
  Heart, 
  MapPin, 
  User, 
  Star, 
  Store, 
  LayoutDashboard, 
  PlusCircle, 
  Scissors, 
  DollarSign, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  FolderKanban, 
  BarChart3, 
  AlertTriangle, 
  FileText,
  Settings,
  HelpCircle
} from 'lucide-react';
import { RoleType } from '../../types/index.js';

export interface DashboardNavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string | number;
  badgeColor?: 'magenta' | 'amber' | 'emerald' | 'purple' | 'gray';
  routeHash?: string;
  sectionHeader?: string;
}

export interface RoleDashboardConfig {
  role: RoleType;
  title: string;
  subtitle: string;
  accentColor: string;
  badgeLabel: string;
  navItems: DashboardNavItem[];
}

export const DASHBOARD_CONFIGS: Record<RoleType, RoleDashboardConfig> = {
  CUSTOMER: {
    role: 'CUSTOMER',
    title: 'Customer Hub',
    subtitle: 'Manage your shopping orders, bookings & saved preferences',
    accentColor: '#D81B60',
    badgeLabel: 'Shopper',
    navItems: [
      { id: 'overview', label: 'My Hub Overview', icon: LayoutDashboard, routeHash: '#/account' },
      { id: 'orders', label: 'My Orders', icon: Package, badge: 3, badgeColor: 'amber', routeHash: '#/orders' },
      { id: 'bookings', label: 'Service Bookings', icon: Calendar, badge: 1, badgeColor: 'purple', routeHash: '#/bookings' },
      { id: 'wishlist', label: 'Wishlist & Saved', icon: Heart, badge: 8, badgeColor: 'magenta' },
      { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
      { id: 'reviews', label: 'My Reviews', icon: Star },
      { id: 'profile', label: 'Profile Settings', icon: User },
      { id: 'help', label: 'Help & FAQs', icon: HelpCircle, sectionHeader: 'Support' }
    ]
  },
  SELLER: {
    role: 'SELLER',
    title: 'Artisan Business Hub',
    subtitle: 'Manage your digital storefront, inventory, orders & payouts',
    accentColor: '#4E0C54',
    badgeLabel: 'Verified Artisan',
    navItems: [
      { id: 'overview', label: 'Business Overview', icon: LayoutDashboard },
      { id: 'products', label: 'Products & Stock', icon: Package, badge: '12 Active', badgeColor: 'emerald' },
      { id: 'services', label: 'Service Catalog', icon: Scissors, badge: '4 Services', badgeColor: 'purple' },
      { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, badge: '3 Pending', badgeColor: 'amber' },
      { id: 'appointments', label: 'Bookings & Slots', icon: Calendar, badge: '2 Today', badgeColor: 'magenta' },
      { id: 'finances', label: 'Earnings & Payouts', icon: DollarSign, sectionHeader: 'Financials' },
      { id: 'reviews', label: 'Customer Reviews', icon: MessageSquare },
      { id: 'storefront', label: 'Storefront Profile', icon: Store, sectionHeader: 'Settings' },
      { id: 'settings', label: 'Store Settings', icon: Settings }
    ]
  },
  ADMIN: {
    role: 'ADMIN',
    title: 'Admin Governance Console',
    subtitle: 'Platform moderation, seller verification, commissions & dispute resolution',
    accentColor: '#2D0133',
    badgeLabel: 'Platform Admin',
    navItems: [
      { id: 'overview', label: 'Platform KPIs', icon: BarChart3 },
      { id: 'seller-approvals', label: 'Seller Verification', icon: ShieldCheck, badge: '4 Pending', badgeColor: 'amber' },
      { id: 'listing-moderation', label: 'Catalog Moderation', icon: FolderKanban, badge: '6 Review', badgeColor: 'purple' },
      { id: 'all-orders', label: 'Orders & Deliveries', icon: ShoppingBag },
      { id: 'all-bookings', label: 'Platform Bookings', icon: Calendar },
      { id: 'categories', label: 'Category & Banners', icon: FileText, sectionHeader: 'Configuration' },
      { id: 'commissions', label: 'Commission & Payouts', icon: DollarSign },
      { id: 'disputes', label: 'Complaints & Disputes', icon: AlertTriangle, badge: '1 Open', badgeColor: 'magenta', sectionHeader: 'Governance' },
      { id: 'settings', label: 'System Settings', icon: Settings }
    ]
  },
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    title: 'Super Admin Console',
    subtitle: 'Global infrastructure, payment gateways, role access & audit ledger',
    accentColor: '#1E1B4B',
    badgeLabel: 'Super Admin',
    navItems: [
      { id: 'overview', label: 'Platform KPIs', icon: BarChart3 },
      { id: 'seller-approvals', label: 'Seller Verification', icon: ShieldCheck, badge: '4 Pending', badgeColor: 'amber' },
      { id: 'listing-moderation', label: 'Catalog Moderation', icon: FolderKanban },
      { id: 'commissions', label: 'Commission & Payouts', icon: DollarSign },
      { id: 'settings', label: 'Platform Security', icon: Settings }
    ]
  }
};
