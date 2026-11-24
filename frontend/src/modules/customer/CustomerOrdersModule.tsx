import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Copy, 
  Check, 
  ExternalLink, 
  Truck, 
  CheckCircle, 
  Clock, 
  Download, 
  RotateCcw,
  ShoppingBag
} from 'lucide-react';

export interface OrderItem {
  id: string;
  orderNumber: string;
  productTitle: string;
  productImage: string;
  artisanName: string;
  artisanCity: string;
  price: string;
  quantity: number;
  status: 'OUT_FOR_DELIVERY' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';
  statusLabel: string;
  orderDate: string;
  deliveryDate: string;
  stepCurrent: number; // 1 to 4
  steps: string[];
}

export const CustomerOrdersModule: React.FC = () => {
  const [filterTab, setFilterTab] = useState<'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const orders: OrderItem[] = [
    {
      id: '1',
      orderNumber: 'MHL-9201',
      productTitle: 'Handcrafted Terracotta Diya Set (2 pcs)',
      productImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=140&q=80',
      artisanName: 'Saraswati Crafts',
      artisanCity: 'Vijayawada',
      price: '₹599',
      quantity: 1,
      status: 'OUT_FOR_DELIVERY',
      statusLabel: 'Out for Delivery',
      orderDate: 'Nov 22, 2026',
      deliveryDate: 'Expected Today by 5:00 PM',
      stepCurrent: 3,
      steps: ['Order Placed', 'Packed by Artisan', 'Out with Courier', 'Delivered']
    },
    {
      id: '2',
      orderNumber: 'MHL-9140',
      productTitle: 'Pure Mangalagiri Handloom Cotton Saree',
      productImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=140&q=80',
      artisanName: 'Anitha Fashions',
      artisanCity: 'Guntur',
      price: '₹2,499',
      quantity: 1,
      status: 'PROCESSING',
      statusLabel: 'Weaving & Packing',
      orderDate: 'Nov 21, 2026',
      deliveryDate: 'Expected Nov 26, 2026',
      stepCurrent: 2,
      steps: ['Order Placed', 'Weaving & Packing', 'Dispatched', 'Delivered']
    },
    {
      id: '3',
      orderNumber: 'MHL-8890',
      productTitle: 'Organic Herbal Cold-Pressed Soap (Pack of 3)',
      productImage: 'https://images.unsplash.com/photo-1607006314605-feed797f1fbc?auto=format&fit=crop&w=140&q=80',
      artisanName: 'Lakshmi Naturals',
      artisanCity: 'Hyderabad',
      price: '₹299',
      quantity: 1,
      status: 'DELIVERED',
      statusLabel: 'Delivered',
      orderDate: 'Nov 14, 2026',
      deliveryDate: 'Delivered on Nov 18, 2026',
      stepCurrent: 4,
      steps: ['Order Placed', 'Packed', 'Dispatched', 'Delivered']
    }
  ];

  const filteredOrders = orders.filter((order) => {
    if (filterTab === 'ACTIVE' && (order.status === 'DELIVERED' || order.status === 'CANCELLED')) return false;
    if (filterTab === 'DELIVERED' && order.status !== 'DELIVERED') return false;
    if (filterTab === 'CANCELLED' && order.status !== 'CANCELLED') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return order.productTitle.toLowerCase().includes(q) || order.orderNumber.toLowerCase().includes(q) || order.artisanName.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto border border-slate-200/70">
          {(['ALL', 'ACTIVE', 'DELIVERED'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterTab === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'ALL' ? 'All Orders (14)' : tab === 'ACTIVE' ? 'Active (2)' : 'Delivered (12)'}
            </button>
          ))}
        </div>

        {/* Search Order */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID or item..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200/80 focus:border-[#D81B60] focus:ring-2 focus:ring-[#D81B60]/15 outline-hidden"
          />
        </div>
      </div>

      {/* Orders List Cards */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div 
            key={order.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all"
          >
            {/* Top Info Bar */}
            <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Order Placed</span>
                  <p className="font-semibold text-slate-700">{order.orderDate}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Price</span>
                  <p className="font-extrabold text-slate-900">{order.price}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Artisan Store</span>
                  <p className="font-semibold text-[#D81B60]">{order.artisanName} · {order.artisanCity}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(order.orderNumber)}
                  className="font-mono font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
                >
                  <span>{order.orderNumber}</span>
                  {copiedId === order.orderNumber ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} className="text-slate-400" />}
                </button>
                <button className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-[#D81B60] bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                  <Download size={12} />
                  <span>Invoice</span>
                </button>
              </div>
            </div>

            {/* Main Item Content */}
            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <img 
                  src={order.productImage} 
                  alt={order.productTitle}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200/80 shrink-0 shadow-2xs"
                />
                <div className="space-y-1.5">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    order.status === 'OUT_FOR_DELIVERY' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : order.status === 'PROCESSING' 
                      ? 'bg-amber-50 text-amber-800 border-amber-200' 
                      : 'bg-purple-50 text-purple-800 border-purple-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      order.status === 'OUT_FOR_DELIVERY' ? 'bg-emerald-500 animate-pulse' : order.status === 'PROCESSING' ? 'bg-amber-500' : 'bg-purple-500'
                    }`} />
                    <span>{order.statusLabel}</span>
                  </span>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {order.productTitle}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {order.deliveryDate}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                <button className="px-3.5 py-2 bg-[#D81B60] text-white font-bold text-xs rounded-xl hover:bg-[#C2185B] shadow-2xs transition-all flex items-center gap-1.5">
                  <Truck size={14} />
                  <span>Track Package</span>
                </button>
                <button className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5">
                  <RotateCcw size={13} />
                  <span>Buy Again</span>
                </button>
              </div>
            </div>

            {/* Live Progress Step Bar */}
            <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100">
              <div className="grid grid-cols-4 gap-2 text-center">
                {order.steps.map((step, idx) => {
                  const isDone = idx + 1 <= order.stepCurrent;
                  const isCurrent = idx + 1 === order.stepCurrent;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className={`h-1.5 rounded-full transition-all ${
                        isDone ? 'bg-[#D81B60]' : 'bg-slate-200'
                      }`} />
                      <p className={`text-[10px] font-bold ${
                        isCurrent ? 'text-[#D81B60]' : isDone ? 'text-slate-700' : 'text-slate-400'
                      }`}>
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
