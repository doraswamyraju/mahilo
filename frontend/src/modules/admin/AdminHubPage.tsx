import React, { useState } from 'react';
import { ShieldCheck, FolderKanban, ShoppingBag, Calendar, DollarSign, AlertTriangle, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { DashboardShell } from '../../components/dashboard/DashboardShell.js';
import { AdminOverviewModule } from './AdminOverviewModule.js';
import { AdminSellerApprovalsModule } from './AdminSellerApprovalsModule.js';
import { AdminCatalogModerationModule } from './AdminCatalogModerationModule.js';
import { AdminOrdersModule } from './AdminOrdersModule.js';
import { AdminBookingsModule } from './AdminBookingsModule.js';
import { AdminCommissionsModule } from './AdminCommissionsModule.js';
import { AdminDisputesModule } from './AdminDisputesModule.js';
import { AdminCategoriesModule } from './AdminCategoriesModule.js';
import { AdminSettingsModule } from './AdminSettingsModule.js';

export interface AdminHubPageProps {
  initialNavId?: string;
}

export const AdminHubPage: React.FC<AdminHubPageProps> = ({ initialNavId = 'overview' }) => {
  const { user, switchRole, logout } = useAuth();
  const [activeNavId, setActiveNavId] = useState(initialNavId);
  const [searchQuery, setSearchQuery] = useState('');

  const getPageTitle = () => {
    switch (activeNavId) {
      case 'seller-approvals': return 'Artisan KYC & Store Approvals';
      case 'listing-moderation': return 'Catalog Moderation Queue';
      case 'all-orders': return 'Universal Order Oversight';
      case 'all-bookings': return 'Service Bookings Control';
      case 'commissions': return 'Commission Rates & Payout Ledger';
      case 'disputes': return 'Disputes & Customer Protection';
      case 'categories': return 'Category & Banner Promotions';
      case 'settings': return 'Platform Security & System Settings';
      default: return 'Platform Governance Console';
    }
  };

  const getPageSubtitle = () => {
    switch (activeNavId) {
      case 'seller-approvals': return 'Review government identity proofs, trade licenses, and activate stores';
      case 'listing-moderation': return 'Ensure high product quality, fair pricing, and compliance with guidelines';
      case 'all-orders': return 'Monitor multi-vendor shipments, carrier delivery updates, and fulfillment stages';
      case 'all-bookings': return 'Track doorstep home visits, specialist assignments, and session completion';
      case 'commissions': return 'Set platform commission tiers and disburse automated seller bank payouts';
      case 'disputes': return 'Resolve customer complaints, return requests, and authorize buyer refunds';
      case 'categories': return 'Curate featured artisan collections, categories, and homepage hero carousels';
      case 'settings': return 'Manage platform configuration, payment gateway keys, and SMS/Email notification templates';
      default: return 'Monitor GMV growth, seller verifications, and marketplace trust metrics';
    }
  };

  return (
    <DashboardShell
      role="ADMIN"
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
        { label: activeNavId.charAt(0).toUpperCase() + activeNavId.slice(1).replace(/-/g, ' ') }
      ]}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveNavId('listing-moderation')}
            className="px-3 py-2 bg-white text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 border border-slate-200 flex items-center gap-1.5 shadow-2xs transition-all"
          >
            <FolderKanban size={14} className="text-[#D81B60]" />
            <span>Moderate Catalog</span>
          </button>
          <button
            onClick={() => setActiveNavId('seller-approvals')}
            className="px-3.5 py-2 bg-[#1E0524] text-white font-bold text-xs rounded-xl hover:bg-[#2F0838] flex items-center gap-1.5 shadow-2xs transition-all"
          >
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Verify Sellers</span>
          </button>
        </div>
      }
    >
      {activeNavId === 'overview' && <AdminOverviewModule onNavigate={setActiveNavId} />}
      {activeNavId === 'seller-approvals' && <AdminSellerApprovalsModule />}
      {activeNavId === 'listing-moderation' && <AdminCatalogModerationModule />}
      {activeNavId === 'all-orders' && <AdminOrdersModule />}
      {activeNavId === 'all-bookings' && <AdminBookingsModule />}
      {activeNavId === 'commissions' && <AdminCommissionsModule />}
      {activeNavId === 'disputes' && <AdminDisputesModule />}
      {activeNavId === 'categories' && <AdminCategoriesModule />}
      
      {activeNavId === 'settings' && <AdminSettingsModule />}
    </DashboardShell>
  );
};
