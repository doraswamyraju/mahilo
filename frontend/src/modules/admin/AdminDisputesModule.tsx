import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Search, 
  Filter, 
  MessageSquare, 
  ExternalLink, 
  ArrowUpRight, 
  ShieldAlert, 
  Clock, 
  X,
  Package,
  Check
} from 'lucide-react';

interface DisputeCase {
  id: string;
  ticketNumber: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  sellerName: string;
  issueType: 'DAMAGED_IN_TRANSIT' | 'WRONG_ITEM' | 'SERVICE_QUALITY' | 'DELIVERY_DELAY';
  title: string;
  description: string;
  evidencePhotoUrl: string;
  claimAmount: number;
  status: 'OPEN' | 'REFUNDED' | 'REPLACEMENT_DISPATCHED' | 'RESOLVED';
  adminNotes?: string;
  createdAt: string;
}

const INITIAL_DISPUTES: DisputeCase[] = [
  {
    id: 'dsp-101',
    ticketNumber: 'DSP-20261124-11',
    orderNumber: 'MHL-20261124-9281',
    customerName: 'Ananya Sharma',
    customerPhone: '9876543210',
    sellerName: 'Saraswati Crafts',
    issueType: 'DAMAGED_IN_TRANSIT',
    title: 'Cracked Terracotta Jar upon unboxing',
    description: 'The package arrived today but one of the diya jars has a hairline crack on the rim. Please arrange replacement or refund.',
    evidencePhotoUrl: '/assets/mockup/handicrafts/terracotta_painted_jar.png',
    claimAmount: 599,
    status: 'OPEN',
    createdAt: 'Today, 12:30 PM'
  },
  {
    id: 'dsp-100',
    ticketNumber: 'DSP-20261118-04',
    orderNumber: 'MHL-20261115-3891',
    customerName: 'Kavitha Ramaswamy',
    customerPhone: '9811223344',
    sellerName: 'Noor Jahan Salon',
    issueType: 'SERVICE_QUALITY',
    title: 'Appointment started 45 minutes late',
    description: 'Specialist arrived late due to rain. Service was good, but requested partial discount.',
    evidencePhotoUrl: '/assets/mockup/services/salon_services.png',
    claimAmount: 100,
    status: 'RESOLVED',
    adminNotes: 'Issued ₹100 Mahilo Wallet credit voucher to customer.',
    createdAt: 'Nov 18, 2026'
  }
];

export const AdminDisputesModule: React.FC = () => {
  const [disputes, setDisputes] = useState<DisputeCase[]>(INITIAL_DISPUTES);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'REFUNDED' | 'RESOLVED'>('OPEN');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDispute, setSelectedDispute] = useState<DisputeCase | null>(null);

  const handleResolve = (disputeId: string, newStatus: DisputeCase['status'], note?: string) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: newStatus,
              adminNotes: note || (newStatus === 'REFUNDED' ? '100% refund credited to customer original payment method' : 'Resolved amicably')
            }
          : d
      )
    );
    setSelectedDispute(null);
  };

  const filteredDisputes = disputes.filter((d) => {
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        d.ticketNumber.toLowerCase().includes(q) ||
        d.orderNumber.toLowerCase().includes(q) ||
        d.customerName.toLowerCase().includes(q) ||
        d.sellerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openCount = disputes.filter((d) => d.status === 'OPEN').length;
  const resolvedCount = disputes.filter((d) => d.status === 'RESOLVED' || d.status === 'REFUNDED').length;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Header Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div 
          onClick={() => setStatusFilter('OPEN')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'OPEN' 
              ? 'bg-rose-50/70 border-rose-300 shadow-xs ring-1 ring-rose-300' 
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">Action Required</span>
            <AlertTriangle size={16} className="text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-900">{openCount}</span>
            <span className="text-[11px] font-medium text-rose-700">active ticket</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resolved Cases</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-800">{resolvedCount}</span>
            <span className="text-[11px] font-semibold text-emerald-600">under 24h turnaround</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer Trust Index</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-900">99.4%</span>
            <span className="text-[11px] font-semibold text-purple-700">Satisfactory Resolution</span>
          </div>
        </div>
      </div>

      {/* 2. Controls & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          {(['ALL', 'OPEN', 'REFUNDED', 'RESOLVED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                statusFilter === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Disputes' : st}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ticket #, order #, or customer..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D0133]/10 focus:border-[#2D0133]"
          />
        </div>
      </div>

      {/* 3. Disputes Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Ticket & Order #</th>
                <th className="py-3 px-3">Customer & Seller</th>
                <th className="py-3 px-3">Issue Type & Summary</th>
                <th className="py-3 px-3">Claim Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredDisputes.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-900">{d.ticketNumber}</span>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{d.orderNumber}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900">{d.customerName}</div>
                    <div className="text-[10px] text-slate-400">Seller: {d.sellerName}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700">
                      {d.issueType.replace(/_/g, ' ')}
                    </span>
                    <p className="font-semibold text-slate-800 text-[11px] mt-1 max-w-xs truncate">{d.title}</p>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-black text-slate-900 text-sm">₹{d.claimAmount}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    {d.status === 'OPEN' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertTriangle size={11} className="text-rose-600" />
                        <span>Action Required</span>
                      </span>
                    )}
                    {d.status === 'REFUNDED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={11} className="text-emerald-600" />
                        <span>Refunded</span>
                      </span>
                    )}
                    {d.status === 'RESOLVED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        <Check size={11} className="text-slate-600" />
                        <span>Resolved</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedDispute(d)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-lg transition"
                    >
                      <span>Review</span>
                      <ArrowUpRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Dispute Review Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Buyer Protection Ticket</span>
                <h3 className="text-sm font-black text-slate-900 font-mono mt-0.5">{selectedDispute.ticketNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedDispute(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 border-b border-slate-100 text-xs">
              <div>
                <p className="font-bold text-slate-900 text-sm">{selectedDispute.title}</p>
                <p className="text-slate-600 mt-1 leading-relaxed">{selectedDispute.description}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="font-bold text-slate-900">Order: {selectedDispute.orderNumber}</p>
                <p className="text-slate-500 text-[11px]">Customer: {selectedDispute.customerName} ({selectedDispute.customerPhone})</p>
                <p className="text-slate-500 text-[11px]">Seller: {selectedDispute.sellerName}</p>
              </div>

              {/* Photo Evidence Preview */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Evidence Provided</p>
                <img
                  src={selectedDispute.evidencePhotoUrl}
                  alt="Damaged Item Proof"
                  className="w-24 h-24 rounded-xl object-cover border border-slate-200 bg-slate-100"
                />
              </div>

              {selectedDispute.adminNotes && (
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px]">
                  <strong>Admin Resolution:</strong> {selectedDispute.adminNotes}
                </div>
              )}
            </div>

            {/* Actions */}
            {selectedDispute.status === 'OPEN' && (
              <div className="pt-4 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Resolve Dispute
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => handleResolve(selectedDispute.id, 'REFUNDED')}
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-2xs transition"
                  >
                    Authorize ₹{selectedDispute.claimAmount} Full Refund
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResolve(selectedDispute.id, 'REPLACEMENT_DISPATCHED', 'Seller notified to dispatch replacement piece immediately.')}
                    className="py-2.5 px-3 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl border border-purple-200 transition"
                  >
                    Request Replacement
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
