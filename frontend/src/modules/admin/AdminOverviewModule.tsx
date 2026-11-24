import React from 'react';
import { DollarSign, ShieldCheck, Package, AlertCircle, Eye, FileSpreadsheet } from 'lucide-react';
import { DashboardKPIStatCard } from '../../components/dashboard/DashboardKPIStatCard.js';

export interface AdminOverviewProps {
  onNavigate?: (navId: string) => void;
}

export const AdminOverviewModule: React.FC<AdminOverviewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      {/* 4 Stat Cards with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardKPIStatCard
          title="Platform GMV"
          value="₹18.4 Lakhs"
          change="+24.8%"
          isPositive={true}
          subtext="This month"
          icon={DollarSign}
          iconColor="#10B981"
          iconBgColor="#ECFDF5"
          sparklineData={[12, 14, 15, 17, 16, 18, 18.4]}
          sparklineColor="#10B981"
        />
        <DashboardKPIStatCard
          title="Pending Sellers"
          value="5"
          change="KYC Review"
          isPositive={false}
          subtext="Requires doc check"
          icon={ShieldCheck}
          iconColor="#D81B60"
          iconBgColor="#FAF0F7"
          sparklineData={[8, 7, 9, 6, 8, 7, 5]}
          sparklineColor="#D81B60"
          onClick={() => onNavigate?.('seller-approvals')}
        />
        <DashboardKPIStatCard
          title="Listing Review"
          value="8"
          change="Catalog check"
          isPositive={true}
          subtext="Products & Services"
          icon={Package}
          iconColor="#7C3AED"
          iconBgColor="#F3E8FF"
          sparklineData={[4, 6, 5, 7, 9, 8, 8]}
          sparklineColor="#7C3AED"
          onClick={() => onNavigate?.('listing-moderation')}
        />
        <DashboardKPIStatCard
          title="Disputes"
          value="1"
          change="Action required"
          isPositive={false}
          subtext="Return refund query"
          icon={AlertCircle}
          iconColor="#F59E0B"
          iconBgColor="#FEF3C7"
          sparklineData={[2, 1, 3, 2, 1, 2, 1]}
          sparklineColor="#F59E0B"
          onClick={() => onNavigate?.('disputes')}
        />
      </div>

      {/* Seller Verification Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Artisan Verification Queue</h2>
            <p className="text-xs text-slate-500">Review business registration, Aadhaar/PAN, and store details</p>
          </div>
          <button 
            onClick={() => onNavigate?.('seller-approvals')}
            className="text-xs font-bold text-[#D81B60] hover:underline"
          >
            Manage All (5) &rarr;
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {[
            {
              store: 'Saraswati Handlooms',
              owner: 'Saraswati Devi',
              craft: 'Handwoven Ikat & Mangalagiri',
              city: 'Guntur, AP',
              docs: 'Aadhaar + Bank Details Verified',
              status: 'Pending Approval'
            },
            {
              store: 'Swathi Homemade Pickles',
              owner: 'Swathi Rao',
              craft: 'Traditional Telugu Mango & Gongura Pickles',
              city: 'Vijayawada, AP',
              docs: 'FSSAI License Uploaded',
              status: 'Pending Approval'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70">
              <div className="space-y-1">
                <p className="font-bold text-slate-900">{item.store} · <span className="text-slate-500 font-medium">{item.owner}</span></p>
                <p className="text-slate-400">{item.craft} | {item.city} | {item.docs}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onNavigate?.('seller-approvals')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-2xs"
                >
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
