import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { 
  ShieldCheck, 
  Store, 
  DollarSign, 
  Users, 
  CheckCircle, 
  XCircle, 
  Sliders, 
  Landmark, 
  FileText,
  AlertCircle 
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SELLERS' | 'COMMISSIONS' | 'SETTLEMENTS'>('OVERVIEW');

  const [analytics, setAnalytics] = useState<any | null>(null);
  const [sellers, setSellers] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [settlements, setSettlements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [anaRes, selRes, commRes, stlRes]: any = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/sellers'),
        api.get('/admin/commissions'),
        api.get('/admin/settlements'),
      ]);

      if (anaRes.success) setAnalytics(anaRes.data);
      if (selRes.success) setSellers(selRes.data);
      if (commRes.success) setCommissions(commRes.data);
      if (stlRes.success) setSettlements(stlRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUpdateSellerStatus = async (sellerId: string, status: string) => {
    try {
      const res: any = await api.put(`/admin/sellers/${sellerId}/status`, { status });
      if (res.success) {
        setActionNotice(`Seller application has been set to ${status}.`);
        loadAdminData();
        setTimeout(() => setActionNotice(null), 4000);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateCommission = async (ruleId: string, value: number) => {
    try {
      const res: any = await api.put(`/admin/commissions/${ruleId}`, { value });
      if (res.success) {
        setActionNotice('Commission rate updated successfully.');
        loadAdminData();
        setTimeout(() => setActionNotice(null), 4000);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleProcessSettlement = async (settlementId: string) => {
    try {
      const res: any = await api.put(`/admin/settlements/${settlementId}`, {});
      if (res.success) {
        setActionNotice('Settlement payout marked as transferred with bank UTR.');
        loadAdminData();
        setTimeout(() => setActionNotice(null), 4000);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-semibold shadow-sm">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-brand-dark to-brand-primary p-6 sm:p-8 rounded-3xl text-white shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-growth text-xs font-bold uppercase mb-2">
            <ShieldCheck size={14} />
            <span>Mahilo Super-Admin & Operations Suite</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-poppins">
            Administrative Control Panel
          </h1>
          <p className="text-xs text-white/80 font-nunito">
            Seller verification, commission rules, financial settlements & marketplace moderation
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-2 text-xs font-bold">
        {[
          { key: 'OVERVIEW', label: 'Platform Metrics' },
          { key: 'SELLERS', label: `Seller Applications (${sellers.filter(s => s.status !== 'APPROVED').length} Pending)` },
          { key: 'COMMISSIONS', label: 'Commission Engine' },
          { key: 'SETTLEMENTS', label: `Bank Settlements (${settlements.filter(s => s.status === 'PENDING').length} Pending)` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition ${
              activeTab === tab.key
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-card">
              <span className="text-xs text-gray-500 font-semibold block">Gross Merchandise Value (GMV)</span>
              <div className="text-2xl font-extrabold text-brand-dark font-poppins mt-1">
                ₹{analytics?.gmv || 0}
              </div>
              <span className="text-[10px] text-brand-growth font-bold mt-1 block">Total platform sales</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-card">
              <span className="text-xs text-gray-500 font-semibold block">Mahilo Net Commission</span>
              <div className="text-2xl font-extrabold text-brand-primary font-poppins mt-1">
                ₹{analytics?.platformRevenue || 0}
              </div>
              <span className="text-[10px] text-gray-400 font-medium mt-1 block">Accrued marketplace fee</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-card">
              <span className="text-xs text-gray-500 font-semibold block">Approved Sellers</span>
              <div className="text-2xl font-extrabold text-emerald-600 font-poppins mt-1">
                {analytics?.approvedSellers || 0} / {analytics?.totalSellers || 0}
              </div>
              <span className="text-[10px] text-amber-600 font-bold mt-1 block">
                {analytics?.pendingSellers || 0} awaiting review
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-card">
              <span className="text-xs text-gray-500 font-semibold block">Registered Customers</span>
              <div className="text-2xl font-extrabold text-brand-secondary font-poppins mt-1">
                {analytics?.totalCustomers || 0}
              </div>
              <span className="text-[10px] text-gray-400 font-medium mt-1 block">Total platform accounts</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SELLERS APPROVAL QUEUE */}
      {activeTab === 'SELLERS' && (
        <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 font-poppins">
              Women Entrepreneurs Registration & KYC Verification
            </h2>
          </div>

          <div className="divide-y divide-brand-border">
            {sellers.map((seller) => (
              <div key={seller.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">{seller.businessName}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      seller.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : seller.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {seller.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 font-nunito max-w-xl">{seller.description}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 pt-1">
                    <span>Owner: <b>{seller.ownerName}</b></span>
                    <span>•</span>
                    <span>Contact: {seller.ownerPhone}</span>
                    <span>•</span>
                    <span>Location: {seller.city}, {seller.state}</span>
                    <span>•</span>
                    <span>Entity: {seller.businessType}</span>
                  </div>

                  {seller.bankAccountNumber && (
                    <div className="text-[10px] text-gray-500 bg-brand-bg px-2.5 py-1 rounded-lg inline-block mt-1">
                      Bank: {seller.bankName} (A/C: {seller.bankAccountNumber}, IFSC: {seller.bankIfscCode})
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {seller.status !== 'APPROVED' && (
                    <button
                      onClick={() => handleUpdateSellerStatus(seller.id, 'APPROVED')}
                      className="px-4 py-2 rounded-xl bg-brand-growth text-white text-xs font-bold hover:opacity-95 shadow-sm transition flex items-center gap-1.5"
                    >
                      <CheckCircle size={14} />
                      <span>Approve Seller</span>
                    </button>
                  )}

                  {seller.status !== 'REJECTED' && (
                    <button
                      onClick={() => handleUpdateSellerStatus(seller.id, 'REJECTED')}
                      className="px-4 py-2 rounded-xl bg-red-100 text-red-700 text-xs font-bold hover:bg-red-200 transition flex items-center gap-1.5"
                    >
                      <XCircle size={14} />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: COMMISSION RULES */}
      {activeTab === 'COMMISSIONS' && (
        <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-5">
          <div>
            <h2 className="text-sm font-bold text-gray-900 font-poppins flex items-center gap-2">
              <Sliders size={16} className="text-brand-primary" />
              <span>Independent Commission Configuration (Products vs Services)</span>
            </h2>
            <p className="text-xs text-gray-500 font-nunito mt-1">
              Admin configured rates applied during order splits and appointment booking ledger credits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commissions.map((comm) => (
              <div key={comm.id} className="p-5 rounded-2xl bg-brand-bg border border-brand-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-brand-primary">
                    {comm.vertical} Commission
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-brand-dark font-poppins">
                    {comm.value}%
                  </span>
                  <span className="text-xs text-gray-500">platform share</span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleUpdateCommission(comm.id, Number(comm.value) - 1)}
                    className="px-3 py-1 rounded-lg bg-white border border-gray-300 text-xs font-bold hover:bg-gray-50"
                  >
                    -1%
                  </button>
                  <button
                    onClick={() => handleUpdateCommission(comm.id, Number(comm.value) + 1)}
                    className="px-3 py-1 rounded-lg bg-white border border-gray-300 text-xs font-bold hover:bg-gray-50"
                  >
                    +1%
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SETTLEMENTS */}
      {activeTab === 'SETTLEMENTS' && (
        <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 font-poppins">Seller Payout Disbursements</h2>
            <span className="text-xs text-gray-500">Direct NEFT/IMPS settlement requests</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-bg text-gray-600 font-bold border-b border-brand-border">
                <tr>
                  <th className="p-3">Ref #</th>
                  <th className="p-3">Seller Store</th>
                  <th className="p-3">Bank Details</th>
                  <th className="p-3">Net Payout</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {settlements.map((stl) => (
                  <tr key={stl.id} className="hover:bg-brand-bg/40">
                    <td className="p-3 font-bold font-mono text-gray-800">{stl.settlementRef}</td>
                    <td className="p-3 font-semibold text-brand-dark">
                      {stl.seller?.businessName || 'Seller Store'}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-gray-800">{stl.seller?.bankName || 'Bank'}</div>
                      <div className="text-[10px] text-gray-500 font-mono">
                        A/C: {stl.seller?.bankAccountNumber} (IFSC: {stl.seller?.bankIfscCode})
                      </div>
                    </td>
                    <td className="p-3 font-extrabold text-emerald-600">₹{stl.netAmount}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        stl.status === 'TRANSFERRED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {stl.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {stl.status === 'PENDING' ? (
                        <button
                          onClick={() => handleProcessSettlement(stl.id)}
                          className="px-3 py-1.5 rounded-xl bg-brand-growth text-white text-xs font-bold hover:opacity-95 shadow-sm transition"
                        >
                          Disburse Funds
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-gray-500">UTR: {stl.bankUtrNumber}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
