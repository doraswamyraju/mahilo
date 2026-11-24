import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { DashboardShell } from '../../components/dashboard/DashboardShell.js';
import { CustomerOverviewModule } from './CustomerOverviewModule.js';
import { CustomerOrdersModule } from './CustomerOrdersModule.js';
import { CustomerBookingsModule } from './CustomerBookingsModule.js';
import { CustomerWishlistModule } from './CustomerWishlistModule.js';
import { CustomerAddressesModule } from './CustomerAddressesModule.js';
import { CustomerProfileModule } from './CustomerProfileModule.js';

export interface CustomerHubPageProps {
  initialNavId?: string;
}

export const CustomerHubPage: React.FC<CustomerHubPageProps> = ({ initialNavId = 'overview' }) => {
  const { user, switchRole, logout } = useAuth();
  const [activeNavId, setActiveNavId] = useState(initialNavId);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with route hash if present (#/orders, #/bookings, #/account)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#/orders') setActiveNavId('orders');
    else if (hash === '#/bookings') setActiveNavId('bookings');
    else if (hash === '#/account') setActiveNavId('overview');
  }, []);

  const getPageTitle = () => {
    switch (activeNavId) {
      case 'orders': return 'My Orders & Deliveries';
      case 'bookings': return 'Service Appointments';
      case 'wishlist': return 'Saved Artisan Finds';
      case 'addresses': return 'Saved Addresses';
      case 'profile': return 'Account Profile & Settings';
      case 'help': return 'Customer Help & Support';
      default: return `Welcome back, ${user?.fullName?.split(' ')[0] || 'Ananya'} 👋`;
    }
  };

  const getPageSubtitle = () => {
    switch (activeNavId) {
      case 'orders': return 'Track live shipments, download tax receipts, and reorder favorites';
      case 'bookings': return 'Manage upcoming doorstep beauty sessions, tailoring, and salon visits';
      case 'wishlist': return 'Handcrafted treasures and artisan stores you favorited';
      case 'addresses': return 'Manage delivery locations for home and office';
      case 'profile': return 'Update contact details, shopping clusters, and language preferences';
      case 'help': return 'Frequently asked questions, return policies, and live customer chat';
      default: return 'Explore your handcrafted orders, appointments, and patron rewards';
    }
  };

  return (
    <DashboardShell
      role="CUSTOMER"
      onRoleChange={(newRole) => switchRole(newRole)}
      activeNavId={activeNavId}
      onNavChange={setActiveNavId}
      user={user}
      onLogout={logout}
      title={getPageTitle()}
      subtitle={getPageSubtitle()}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      breadcrumbs={[
        { label: activeNavId.charAt(0).toUpperCase() + activeNavId.slice(1) }
      ]}
      actions={
        <button
          onClick={() => { window.location.hash = '#/'; }}
          className="px-3.5 py-2 bg-[#D81B60] text-white font-bold text-xs rounded-xl hover:bg-[#C2185B] flex items-center gap-1.5 shadow-2xs transition-all"
        >
          <ShoppingBag size={14} />
          <span>Shop Marketplace</span>
        </button>
      }
    >
      {activeNavId === 'overview' && <CustomerOverviewModule onNavigate={setActiveNavId} />}
      {activeNavId === 'orders' && <CustomerOrdersModule />}
      {activeNavId === 'bookings' && <CustomerBookingsModule />}
      {activeNavId === 'wishlist' && <CustomerWishlistModule />}
      {activeNavId === 'addresses' && <CustomerAddressesModule />}
      {activeNavId === 'profile' && <CustomerProfileModule />}
      {activeNavId === 'help' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4 max-w-2xl">
          <h2 className="text-base font-bold text-slate-900">Need Help with an Order or Booking?</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our women entrepreneur support team is here for you. For instant delivery inquiries, return requests, or rescheduling support, reach out to us:
          </p>
          <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-100 text-xs space-y-1.5">
            <p className="font-bold text-[#D81B60]">WhatsApp & Call Support: +91 80088 12345</p>
            <p className="text-slate-600">Hours: Monday to Saturday, 9:00 AM – 7:00 PM</p>
            <p className="text-slate-600">Email: support@mahilo.in</p>
          </div>
        </div>
      )}
    </DashboardShell>
  );
};
