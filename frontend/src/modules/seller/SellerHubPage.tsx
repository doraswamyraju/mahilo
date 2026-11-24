import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { DashboardShell } from '../../components/dashboard/DashboardShell.js';
import { SellerOverviewModule } from './SellerOverviewModule.js';
import { SellerProductsModule } from './SellerProductsModule.js';
import { SellerServicesModule } from './SellerServicesModule.js';
import { SellerOrdersModule } from './SellerOrdersModule.js';
import { SellerFinancesModule } from './SellerFinancesModule.js';

export interface SellerHubPageProps {
  initialNavId?: string;
}

export const SellerHubPage: React.FC<SellerHubPageProps> = ({ initialNavId = 'overview' }) => {
  const { user, switchRole, logout } = useAuth();
  const [activeNavId, setActiveNavId] = useState(initialNavId);
  const [searchQuery, setSearchQuery] = useState('');

  const getPageTitle = () => {
    switch (activeNavId) {
      case 'products': return 'Product Inventory & Stock';
      case 'services': return 'Doorstep & Studio Services';
      case 'orders': return 'Customer Orders Fulfillment';
      case 'finances': return 'Earnings & Bank Settlements';
      case 'storefront': return 'Digital Storefront Profile';
      default: return 'Artisan Business Studio';
    }
  };

  const getPageSubtitle = () => {
    switch (activeNavId) {
      case 'products': return 'Add, edit, and monitor stock levels for your handcrafted items';
      case 'services': return 'Manage service packages, hourly slots, and home-visit pricing';
      case 'orders': return 'Print labels, dispatch orders, and track fulfillment performance';
      case 'finances': return 'Monitor gross sales, platform fees, and direct bank payouts';
      case 'storefront': return 'Customize your artisan brand banner, bio, and WhatsApp support';
      default: return 'Grow your handmade business, manage live orders, and review customer ratings';
    }
  };

  return (
    <DashboardShell
      role="SELLER"
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
          onClick={() => setActiveNavId('products')}
          className="px-3.5 py-2 bg-[#D81B60] text-white font-bold text-xs rounded-xl hover:bg-[#C2185B] flex items-center gap-1.5 shadow-2xs transition-all"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>Add Product</span>
        </button>
      }
    >
      {activeNavId === 'overview' && (
        <SellerOverviewModule 
          onNavigate={setActiveNavId} 
          onOpenAddProduct={() => setActiveNavId('products')} 
        />
      )}
      {activeNavId === 'products' && <SellerProductsModule />}
      {activeNavId === 'services' && <SellerServicesModule />}
      {activeNavId === 'orders' && <SellerOrdersModule />}
      {activeNavId === 'finances' && <SellerFinancesModule />}
      {activeNavId === 'storefront' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4 max-w-xl">
          <h2 className="text-base font-bold text-slate-900">Storefront Branding</h2>
          <p className="text-xs text-slate-500">Your store is live at <strong>mahilo.in/#/store/saraswati-crafts</strong></p>
          <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
            <p className="font-bold text-slate-800">Store Name: Saraswati Crafts</p>
            <p className="text-slate-600">Location: Vijayawada, Andhra Pradesh</p>
            <p className="text-slate-600">Badge: Verified Women Artisan Tier 1</p>
          </div>
        </div>
      )}
    </DashboardShell>
  );
};
