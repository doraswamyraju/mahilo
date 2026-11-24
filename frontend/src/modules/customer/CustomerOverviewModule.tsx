import React, { useState } from 'react';
import { 
  Package, 
  Calendar, 
  Heart, 
  Coins, 
  Crown, 
  ArrowUpRight, 
  Copy, 
  Check, 
  ChevronRight, 
  Clock, 
  CheckCircle,
  ShoppingBag
} from 'lucide-react';
import { DashboardKPIStatCard } from '../../components/dashboard/DashboardKPIStatCard.js';

export interface CustomerOverviewProps {
  onNavigate?: (navId: string) => void;
  onExploreStores?: () => void;
}

export const CustomerOverviewModule: React.FC<CustomerOverviewProps> = ({
  onNavigate,
  onExploreStores = () => { window.location.hash = '#/'; }
}) => {
  const [timeHorizon, setTimeHorizon] = useState<'7D' | '30D' | 'QUARTER' | 'ALL'>('30D');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Time Horizon Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Cluster: <strong>Vijayawada & Hyderabad Clusters</strong></span>
        </div>

        <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/70 text-xs font-semibold self-start sm:self-auto">
          {(['7D', '30D', 'QUARTER', 'ALL'] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setTimeHorizon(period)}
              className={`px-3 py-1 rounded-lg transition-all text-[11px] font-bold ${
                timeHorizon === period
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {period === '7D' ? '7 Days' : period === '30D' ? '30 Days' : period === 'QUARTER' ? 'Quarter' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardKPIStatCard
          title="Total Orders"
          value={timeHorizon === '7D' ? '3' : timeHorizon === '30D' ? '14' : '38'}
          change="+2 active"
          isPositive={true}
          subtext="1 delivering today"
          icon={Package}
          iconColor="#D81B60"
          iconBgColor="#FAF0F7"
          sparklineData={[8, 11, 14, 12, 19, 16, 22]}
          sparklineColor="#D81B60"
          onClick={() => onNavigate?.('orders')}
        />
        <DashboardKPIStatCard
          title="Service Bookings"
          value="2"
          change="Upcoming"
          isPositive={true}
          subtext="Bridal Mehndi & Salon"
          icon={Calendar}
          iconColor="#7C3AED"
          iconBgColor="#F3E8FF"
          sparklineData={[1, 2, 1, 3, 2, 2, 4]}
          sparklineColor="#7C3AED"
          onClick={() => onNavigate?.('bookings')}
        />
        <DashboardKPIStatCard
          title="Saved Artisans"
          value="8"
          change="+2 new"
          isPositive={true}
          subtext="Handicrafts & Sarees"
          icon={Heart}
          iconColor="#E11D48"
          iconBgColor="#FFE4E6"
          sparklineData={[3, 4, 5, 5, 6, 7, 8]}
          sparklineColor="#E11D48"
          onClick={() => onNavigate?.('wishlist')}
        />
        <DashboardKPIStatCard
          title="Mahilo Coins"
          value="450"
          change="₹45 Value"
          isPositive={true}
          subtext="Redeem at checkout"
          icon={Coins}
          iconColor="#D97706"
          iconBgColor="#FEF3C7"
          sparklineData={[120, 200, 280, 240, 350, 410, 450]}
          sparklineColor="#D97706"
        />
      </div>

      {/* Mahilo Signature: Women Empowerment Impact Card */}
      <div className="bg-gradient-to-r from-purple-900 via-[#3D0A47] to-[#200527] rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#FFD814] text-[11px] font-bold border border-white/15">
            <Crown size={12} />
            <span>Mahilo Patron Impact</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-poppins">
            You have directly supported 4 Women Entrepreneurs
          </h2>
          <p className="text-xs text-purple-200 max-w-xl font-normal leading-relaxed">
            100% of your product purchases and doorstep service bookings go directly to women artisans, weavers, and beauty specialists across Andhra Pradesh & Telangana.
          </p>
        </div>

        <div className="flex items-center gap-5 shrink-0 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/15">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90">
              <circle cx="28" cy="28" r="22" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none" />
              <circle cx="28" cy="28" r="22" stroke="#FFD814" strokeWidth="4" strokeDasharray="138" strokeDashoffset="25" strokeLinecap="round" fill="none" />
            </svg>
            <span className="absolute text-xs font-black text-[#FFD814]">82%</span>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-purple-200 tracking-wider">Direct Contribution</p>
            <p className="text-lg font-black font-poppins text-white">₹6,840</p>
            <span className="text-[10px] text-[#FFD814] font-semibold">👑 Gold Patron Tier</span>
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders & Upcoming Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Recent Orders</h2>
              <p className="text-xs text-slate-500">Live order fulfillment and real-time transit status</p>
            </div>
            <button
              onClick={() => onNavigate?.('orders')}
              className="text-xs font-bold text-[#D81B60] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              {
                id: 'MHL-9201',
                title: 'Handcrafted Terracotta Diya Set (2 pcs)',
                artisan: 'Saraswati Crafts · Vijayawada',
                price: '₹599',
                status: 'Out for Delivery',
                step: '3 of 4: Out with Courier',
                statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
                dotColor: 'bg-emerald-500',
                image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=120&q=80',
                date: 'Arrives today by 5 PM'
              },
              {
                id: 'MHL-9140',
                title: 'Pure Mangalagiri Handloom Cotton Saree',
                artisan: 'Anitha Fashions · Guntur',
                price: '₹2,499',
                status: 'Processing',
                step: '2 of 4: Weaver Quality Check',
                statusColor: 'bg-amber-50 text-amber-800 border-amber-200/80',
                dotColor: 'bg-amber-500',
                image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=120&q=80',
                date: 'Dispatching tomorrow'
              }
            ].map((order) => (
              <div key={order.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-start gap-3.5">
                  <img 
                    src={order.image} 
                    alt={order.title}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200/80 shrink-0 shadow-2xs"
                  />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(order.id)}
                        className="text-xs font-mono font-bold text-slate-500 hover:text-[#D81B60] flex items-center gap-1 group"
                        title="Click to copy ID"
                      >
                        <span>{order.id}</span>
                        {copiedId === order.id ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} className="text-slate-300 group-hover:text-slate-500" />}
                      </button>
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${order.statusColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${order.dotColor}`} />
                        <span>{order.status}</span>
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{order.title}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {order.artisan} · <span className="text-slate-400">{order.step}</span>
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <p className="text-sm sm:text-base font-extrabold text-slate-900 font-poppins">{order.price}</p>
                  <button 
                    onClick={() => onNavigate?.('orders')}
                    className="text-xs font-bold text-[#D81B60] hover:underline mt-0.5 flex items-center gap-0.5"
                  >
                    <span>Track Status</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Upcoming Appointments */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">Appointments</h2>
                <p className="text-xs text-slate-500">Doorstep & parlor appointments</p>
              </div>
              <span className="text-[10px] font-bold text-[#D81B60] bg-pink-50 border border-pink-100 px-2.5 py-0.5 rounded-full">
                1 Confirmed
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              <div className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/30 flex items-start gap-3.5">
                <div className="w-11 h-12 rounded-xl bg-gradient-to-b from-[#2D0133] to-[#4E0C54] text-white flex flex-col items-center justify-center shrink-0 shadow-xs border border-purple-900">
                  <span className="text-[9px] font-extrabold text-[#FFD814] uppercase leading-none">NOV</span>
                  <span className="text-base font-black font-poppins leading-tight">28</span>
                </div>

                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-[#2D0133] truncate">Bridal Mehendi Session</span>
                    <span className="text-[9px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded shrink-0">
                      Home
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium truncate">Noor Jahan · Certified Artist</p>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                    <Clock size={11} className="text-purple-600" />
                    <span>2:00 PM · 90 mins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate?.('bookings')}
            className="w-full mt-4 py-2.5 text-xs font-bold text-center text-[#D81B60] bg-pink-50 hover:bg-pink-100/80 border border-pink-100 rounded-xl transition-all"
          >
            Manage All Bookings
          </button>
        </div>
      </div>
    </div>
  );
};
