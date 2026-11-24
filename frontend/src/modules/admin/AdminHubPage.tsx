import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { DashboardShell } from '../../components/dashboard/DashboardShell.js';
import { AdminOverviewModule } from './AdminOverviewModule.js';
import { AdminSellerApprovalsModule } from './AdminSellerApprovalsModule.js';

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
      case 'disputes': return 'Disputes & Customer Protection';
      case 'commissions': return 'Commission Rates & Payout Ledger';
      default: return 'Platform Governance Console';
    }
  };

  const getPageSubtitle = () => {
    switch (activeNavId) {
      case 'seller-approvals': return 'Review government identity proofs, trade licenses, and activate stores';
      case 'listing-moderation': return 'Ensure high product quality, fair pricing, and compliance with guidelines';
      case 'disputes': return 'Resolve returns, damaged deliveries, and customer complaints';
      case 'commissions': return 'Set platform commission tiers and track payout settlements';
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
        { label: activeNavId.charAt(0).toUpperCase() + activeNavId.slice(1) }
      ]}
      actions={
        <button
          onClick={() => setActiveNavId('seller-approvals')}
          className="px-3.5 py-2 bg-[#1E0524] text-white font-bold text-xs rounded-xl hover:bg-[#2F0838] flex items-center gap-1.5 shadow-2xs transition-all"
        >
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Verify Sellers</span>
        </button>
      }
    >
      {activeNavId === 'overview' && <AdminOverviewModule onNavigate={setActiveNavId} />}
      {activeNavId === 'seller-approvals' && <AdminSellerApprovalsModule />}
      {activeNavId === 'listing-moderation' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
          <h2 className="text-base font-bold text-slate-900">Catalog Moderation</h2>
          <p className="text-xs text-slate-500">8 listings under review for accurate categorization and high-resolution imagery.</p>
        </div>
      )}
      {activeNavId === 'disputes' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
          <h2 className="text-base font-bold text-slate-900">Dispute Resolution</h2>
          <p className="text-xs text-slate-500">1 open inquiry for damaged terracotta transport. Seller notified for replacement.</p>
        </div>
      )}
    </DashboardShell>
  );
};
