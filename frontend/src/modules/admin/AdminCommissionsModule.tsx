import React, { useState } from 'react';
import { 
  DollarSign, 
  Percent, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Building2, 
  CreditCard, 
  Search, 
  Filter, 
  Edit3, 
  Check, 
  X,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface CommissionTier {
  id: string;
  category: string;
  vertical: 'PRODUCT' | 'SERVICE';
  ratePercent: number;
  promoLabel?: string;
  updatedAt: string;
}

interface SellerSettlement {
  id: string;
  settlementRef: string;
  sellerName: string;
  sellerCity: string;
  bankName: string;
  maskedAccount: string;
  ifscCode: string;
  grossAmount: number;
  netAmount: number;
  status: 'PENDING' | 'TRANSFERRED';
  bankUtr?: string;
  date: string;
}

const INITIAL_TIERS: CommissionTier[] = [
  { id: 'tier-1', category: 'Handicrafts & Decor', vertical: 'PRODUCT', ratePercent: 5.0, promoLabel: 'Standard Tier', updatedAt: 'Nov 10, 2026' },
  { id: 'tier-2', category: 'Handloom & Fashion', vertical: 'PRODUCT', ratePercent: 6.0, promoLabel: 'Competitive Tier', updatedAt: 'Nov 12, 2026' },
  { id: 'tier-3', category: 'Homemade Food & Pickles', vertical: 'PRODUCT', ratePercent: 8.0, promoLabel: 'Low F&B Tier', updatedAt: 'Nov 14, 2026' },
  { id: 'tier-4', category: 'Beauty & Salon Services', vertical: 'SERVICE', ratePercent: 10.0, promoLabel: 'Doorstep Specialist', updatedAt: 'Nov 15, 2026' },
  { id: 'tier-5', category: 'Tailoring & Stitching', vertical: 'SERVICE', ratePercent: 8.0, promoLabel: 'Craft Specialist', updatedAt: 'Nov 15, 2026' },
  { id: 'tier-6', category: 'Early Artisan Launch Offer', vertical: 'PRODUCT', ratePercent: 0.0, promoLabel: '0% First 50 Sellers', updatedAt: 'Nov 18, 2026' },
];

const INITIAL_SETTLEMENTS: SellerSettlement[] = [
  {
    id: 'stl-101',
    settlementRef: 'STL-20261124-819',
    sellerName: 'Saraswati Crafts',
    sellerCity: 'Vijayawada',
    bankName: 'State Bank of India',
    maskedAccount: '•••• 4921',
    ifscCode: 'SBIN0001842',
    grossAmount: 1883,
    netAmount: 1883,
    status: 'PENDING',
    date: 'Today, 08:00 AM'
  },
  {
    id: 'stl-102',
    settlementRef: 'STL-20261123-402',
    sellerName: 'Anitha Fashions',
    sellerCity: 'Guntur',
    bankName: 'HDFC Bank',
    maskedAccount: '•••• 8820',
    ifscCode: 'HDFC0002914',
    grossAmount: 2374,
    netAmount: 2374,
    status: 'PENDING',
    date: 'Yesterday, 04:00 PM'
  },
  {
    id: 'stl-100',
    settlementRef: 'STL-20261118-291',
    sellerName: 'Saraswati Crafts',
    sellerCity: 'Vijayawada',
    bankName: 'State Bank of India',
    maskedAccount: '•••• 4921',
    ifscCode: 'SBIN0001842',
    grossAmount: 3450,
    netAmount: 3450,
    status: 'TRANSFERRED',
    bankUtr: 'CMS982147109283',
    date: 'Nov 19, 2026'
  }
];

export const AdminCommissionsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TIERS' | 'SETTLEMENTS'>('SETTLEMENTS');
  const [tiers, setTiers] = useState<CommissionTier[]>(INITIAL_TIERS);
  const [settlements, setSettlements] = useState<SellerSettlement[]>(INITIAL_SETTLEMENTS);
  
  // Edit rate modal
  const [editingTier, setEditingTier] = useState<CommissionTier | null>(null);
  const [newRate, setNewRate] = useState<number>(5.0);

  const handleDisburse = (id: string) => {
    const randomUtr = `CMS${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    setSettlements((prev) =>
      prev.map((st) =>
        st.id === id
          ? { ...st, status: 'TRANSFERRED', bankUtr: randomUtr }
          : st
      )
    );
  };

  const handleSaveRate = () => {
    if (!editingTier) return;
    setTiers((prev) =>
      prev.map((t) =>
        t.id === editingTier.id
          ? { ...t, ratePercent: newRate, updatedAt: 'Just now' }
          : t
      )
    );
    setEditingTier(null);
  };

  const pendingSettlementTotal = settlements
    .filter((s) => s.status === 'PENDING')
    .reduce((sum, s) => sum + s.netAmount, 0);

  const totalTransferred = settlements
    .filter((s) => s.status === 'TRANSFERRED')
    .reduce((sum, s) => sum + s.netAmount, 0);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Header Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Payouts</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">₹{pendingSettlementTotal.toLocaleString('en-IN')}</span>
            <span className="text-[11px] font-medium text-amber-600">to 2 verified artisans</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Disbursed to Date</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-800">₹{totalTransferred.toLocaleString('en-IN')}</span>
            <span className="text-[11px] font-semibold text-emerald-600">via IMPS / NEFT</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Promo Offer</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-900">0%</span>
            <span className="text-[11px] font-bold text-[#D81B60]">Launch Promo Active</span>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          <button
            onClick={() => setActiveTab('SETTLEMENTS')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'SETTLEMENTS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard size={14} className="text-emerald-600" />
            <span>Seller Bank Settlements</span>
          </button>
          <button
            onClick={() => setActiveTab('TIERS')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'TIERS' ? 'bg-white text-[#D81B60] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Percent size={14} className="text-[#D81B60]" />
            <span>Commission Rates by Category</span>
          </button>
        </div>
      </div>

      {/* 3. Settlements Tab */}
      {activeTab === 'SETTLEMENTS' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Settlement Ref</th>
                  <th className="py-3 px-3">Artisan / Store</th>
                  <th className="py-3 px-3">Bank Details</th>
                  <th className="py-3 px-3">Disbursement Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {settlements.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">{st.settlementRef}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{st.date}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">{st.sellerName}</div>
                      <div className="text-[10px] text-slate-400">{st.sellerCity}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-800">{st.bankName}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {st.maskedAccount} • {st.ifscCode}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-black text-slate-900 text-sm">₹{st.netAmount.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">Net Payout (0% fees)</div>
                    </td>

                    <td className="py-3.5 px-3">
                      {st.status === 'PENDING' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock size={11} className="text-amber-600" />
                          <span>Pending Payout</span>
                        </span>
                      ) : (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={11} className="text-emerald-600" />
                            <span>Transferred</span>
                          </span>
                          {st.bankUtr && (
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">UTR: {st.bankUtr}</p>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {st.status === 'PENDING' ? (
                        <button
                          type="button"
                          onClick={() => handleDisburse(st.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-2xs transition"
                        >
                          <Check size={12} />
                          <span>Disburse via IMPS</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Commission Tiers Tab */}
      {activeTab === 'TIERS' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Marketplace Category</th>
                  <th className="py-3 px-3">Vertical</th>
                  <th className="py-3 px-3">Commission Rate</th>
                  <th className="py-3 px-3">Special Label</th>
                  <th className="py-3 px-3">Last Modified</th>
                  <th className="py-3 px-4 text-right">Edit Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {tiers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{t.category}</td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        t.vertical === 'PRODUCT' ? 'bg-pink-50 text-[#D81B60]' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {t.vertical}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-sm font-black text-slate-900">{t.ratePercent}%</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {t.promoLabel}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 text-[11px]">{t.updatedAt}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTier(t);
                          setNewRate(t.ratePercent);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition"
                      >
                        <Edit3 size={12} />
                        <span>Change</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Edit Rate Modal */}
      {editingTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900">Update Platform Commission</h3>
            <p className="text-xs text-slate-500 mt-0.5">{editingTier.category}</p>

            <div className="py-4 space-y-2">
              <label className="block text-xs font-bold text-slate-700">Commission Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="30"
                  value={newRate}
                  onChange={(e) => setNewRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">%</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Applied automatically to all newly placed orders in this category.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingTier(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRate}
                className="px-4 py-1.5 text-xs font-bold bg-[#D81B60] hover:bg-[#C2185B] text-white rounded-lg shadow-2xs"
              >
                Save Rate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
