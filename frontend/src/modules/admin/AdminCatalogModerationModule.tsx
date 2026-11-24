import React, { useState } from 'react';
import { 
  FolderKanban, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  Eye, 
  ExternalLink,
  Sparkles,
  ShoppingBag,
  Scissors,
  Check,
  X,
  Store,
  Tag
} from 'lucide-react';

interface CatalogItem {
  id: string;
  type: 'product' | 'service';
  name: string;
  category: string;
  sellerName: string;
  sellerCity: string;
  price: number;
  stockOrDuration: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  imageUrl: string;
  submittedDate: string;
  rejectionReason?: string;
}

const INITIAL_CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'prod-h-5',
    type: 'product',
    name: 'Handpainted Coasters (Set of 6)',
    category: 'Handicrafts',
    sellerName: 'Saraswati Crafts',
    sellerCity: 'Vijayawada',
    price: 349,
    stockOrDuration: '40 in stock',
    status: 'PENDING_REVIEW',
    imageUrl: '/assets/mockup/handicrafts/handpainted_coasters.png',
    submittedDate: '2 hours ago'
  },
  {
    id: 'prod-h-6',
    type: 'product',
    name: 'Wooden Jewellery Box with Brass Inlay',
    category: 'Handicrafts',
    sellerName: 'Saraswati Crafts',
    sellerCity: 'Vijayawada',
    price: 899,
    stockOrDuration: '22 in stock',
    status: 'PENDING_REVIEW',
    imageUrl: '/assets/mockup/handicrafts/wooden_jewellery_box.png',
    submittedDate: '4 hours ago'
  },
  {
    id: 'srv-5',
    type: 'service',
    name: 'Traditional Andhra Home Catering (20 Pax)',
    category: 'Food & Events',
    sellerName: 'Anitha Kitchens',
    sellerCity: 'Vijayawada',
    price: 1499,
    stockOrDuration: '120 min prep',
    status: 'PENDING_REVIEW',
    imageUrl: '/assets/mockup/home/pickle_combo.png',
    submittedDate: '1 day ago'
  },
  {
    id: 'prod-h-1',
    type: 'product',
    name: 'Handwoven Jute Handbag',
    category: 'Handicrafts',
    sellerName: 'Saraswati Crafts',
    sellerCity: 'Vijayawada',
    price: 799,
    stockOrDuration: '45 in stock',
    status: 'APPROVED',
    imageUrl: '/assets/mockup/handicrafts/handwoven_jute_handbag.png',
    submittedDate: 'Nov 18, 2026'
  },
  {
    id: 'prod-f-1',
    type: 'product',
    name: 'Pure Mangalagiri Handloom Cotton Saree',
    category: 'Fashion',
    sellerName: 'Anitha Fashions',
    sellerCity: 'Guntur',
    price: 2499,
    stockOrDuration: '15 in stock',
    status: 'APPROVED',
    imageUrl: '/assets/mockup/fashion/mangalagiri_cotton_saree.png',
    submittedDate: 'Nov 15, 2026'
  },
  {
    id: 'srv-1',
    type: 'service',
    name: 'Doorstep Herbal Facial & Clean-up',
    category: 'Beauty & Wellness',
    sellerName: 'Noor Jahan Salon',
    sellerCity: 'Vijayawada',
    price: 299,
    stockOrDuration: '45 mins',
    status: 'APPROVED',
    imageUrl: '/assets/mockup/services/salon_services.png',
    submittedDate: 'Nov 12, 2026'
  }
];

export const AdminCatalogModerationModule: React.FC = () => {
  const [items, setItems] = useState<CatalogItem[]>(INITIAL_CATALOG_ITEMS);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PRODUCTS' | 'SERVICES'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'>('PENDING_REVIEW');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Rejection modal state
  const [rejectItem, setRejectItem] = useState<CatalogItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'APPROVED', rejectionReason: undefined } : item
      )
    );
  };

  const handleConfirmReject = () => {
    if (!rejectItem) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === rejectItem.id
          ? { ...item, status: 'REJECTED', rejectionReason: rejectReason || 'Listing did not meet high-quality image or description standards' }
          : item
      )
    );
    setRejectItem(null);
    setRejectReason('');
  };

  const filteredItems = items.filter((item) => {
    if (activeTab === 'PRODUCTS' && item.type !== 'product') return false;
    if (activeTab === 'SERVICES' && item.type !== 'service') return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.sellerName.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = items.filter((i) => i.status === 'PENDING_REVIEW').length;
  const approvedCount = items.filter((i) => i.status === 'APPROVED').length;
  const rejectedCount = items.filter((i) => i.status === 'REJECTED').length;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Header Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div 
          onClick={() => setStatusFilter('PENDING_REVIEW')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'PENDING_REVIEW' 
              ? 'bg-amber-50/70 border-amber-300 shadow-xs ring-1 ring-amber-300' 
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Awaiting Review</span>
            <AlertCircle size={16} className="text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-900">{pendingCount}</span>
            <span className="text-[11px] font-medium text-amber-700">listings pending</span>
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('APPROVED')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'APPROVED' 
              ? 'bg-emerald-50/70 border-emerald-300 shadow-xs ring-1 ring-emerald-300' 
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Approved & Live</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-900">{approvedCount}</span>
            <span className="text-[11px] font-medium text-emerald-700">active in store</span>
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('REJECTED')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'REJECTED' 
              ? 'bg-rose-50/70 border-rose-300 shadow-xs ring-1 ring-rose-300' 
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Rejected / Revoked</span>
            <XCircle size={16} className="text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-900">{rejectedCount}</span>
            <span className="text-[11px] font-medium text-rose-700">needs changes</span>
          </div>
        </div>
      </div>

      {/* 2. Control Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Items ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('PRODUCTS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'PRODUCTS' ? 'bg-white text-[#D81B60] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag size={13} />
            <span>Products</span>
          </button>
          <button
            onClick={() => setActiveTab('SERVICES')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'SERVICES' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scissors size={13} />
            <span>Services</span>
          </button>
        </div>

        {/* Search input & Filter */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, artisan or category..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D0133]/10 focus:border-[#2D0133]"
            />
          </div>
          <button
            onClick={() => setStatusFilter(statusFilter === 'ALL' ? 'PENDING_REVIEW' : 'ALL')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700"
          >
            <Filter size={13} />
            <span>{statusFilter === 'ALL' ? 'All Statuses' : 'Pending Only'}</span>
          </button>
        </div>
      </div>

      {/* 3. Catalog Moderation Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Item Details</th>
                <th className="py-3 px-3">Type & Category</th>
                <th className="py-3 px-3">Woman Artisan / Studio</th>
                <th className="py-3 px-3">Price & Stock</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <FolderKanban size={32} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-semibold text-slate-600">No items found matching the current filter</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Switch filters or clear your search query</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    {/* Item Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200/80 shrink-0 bg-slate-50"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/logo-light.png';
                          }}
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-slate-900 truncate hover:text-[#D81B60] cursor-pointer">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Submitted {item.submittedDate} • ID: {item.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Type & Category */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          item.type === 'product' ? 'bg-pink-50 text-[#D81B60]' : 'bg-purple-50 text-purple-700'
                        }`}>
                          {item.type.toUpperCase()}
                        </span>
                        <span className="text-[11px] text-slate-600 font-medium">{item.category}</span>
                      </div>
                    </td>

                    {/* Artisan */}
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-900">{item.sellerName}</div>
                      <div className="text-[10px] text-slate-400">{item.sellerCity}</div>
                    </td>

                    {/* Price & Stock */}
                    <td className="py-3.5 px-3">
                      <div className="font-black text-slate-900">₹{item.price.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{item.stockOrDuration}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      {item.status === 'PENDING_REVIEW' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>Under Review</span>
                        </span>
                      )}
                      {item.status === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={12} className="text-emerald-600" />
                          <span>Approved</span>
                        </span>
                      )}
                      {item.status === 'REJECTED' && (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle size={12} className="text-rose-600" />
                            <span>Rejected</span>
                          </span>
                          {item.rejectionReason && (
                            <p className="text-[10px] text-rose-600 mt-1 max-w-[160px] truncate" title={item.rejectionReason}>
                              {item.rejectionReason}
                            </p>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.status !== 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() => handleApprove(item.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-2xs transition"
                            title="Approve for public marketplace"
                          >
                            <Check size={12} />
                            <span>Approve</span>
                          </button>
                        )}
                        {item.status !== 'REJECTED' && (
                          <button
                            type="button"
                            onClick={() => setRejectItem(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-[11px] rounded-lg shadow-2xs transition"
                            title="Reject listing with reason"
                          >
                            <X size={12} />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Rejection Reason Modal */}
      {rejectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <X size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Reject Listing</h3>
                  <p className="text-[11px] text-slate-400 truncate max-w-[240px]">{rejectItem.name}</p>
                </div>
              </div>
              <button
                onClick={() => setRejectItem(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Reason for Rejection <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Image resolution is blurry; price exceeds standard pricing; please update description with exact dimensions."
                rows={3}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setRejectReason('Low-resolution / blurry product photo')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-600 font-medium"
                >
                  Low resolution photo
                </button>
                <button
                  type="button"
                  onClick={() => setRejectReason('Incomplete description or missing dimensions')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-600 font-medium"
                >
                  Incomplete description
                </button>
                <button
                  type="button"
                  onClick={() => setRejectReason('Incorrect category selection')}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-600 font-medium"
                >
                  Wrong category
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectItem(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-2xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
