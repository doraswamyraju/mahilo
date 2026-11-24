import React, { useState } from 'react';
import { 
  Package, 
  Calendar, 
  Heart, 
  Coins, 
  Plus, 
  ArrowUpRight, 
  Filter, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  FileSpreadsheet,
  Store,
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  Award,
  Crown,
  ExternalLink,
  MapPin,
  Truck
} from 'lucide-react';
import { RoleType } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { DashboardShell } from './DashboardShell.js';
import { DashboardKPIStatCard } from './DashboardKPIStatCard.js';

export const DashboardDemoHub: React.FC = () => {
  const { user, activeRole, switchRole, logout } = useAuth();
  const [role, setRole] = useState<RoleType>(activeRole || 'CUSTOMER');
  const [activeNavId, setActiveNavId] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive filters
  const [timeHorizon, setTimeHorizon] = useState<'7D' | '30D' | 'QUARTER' | 'ALL'>('30D');
  const [orderTab, setOrderTab] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRoleChange = (newRole: RoleType) => {
    setRole(newRole);
    setActiveNavId('overview');
    if (switchRole) {
      switchRole(newRole);
    }
  };

  // ==========================================
  // 1. CUSTOMER / SHOPPER VIEW
  // ==========================================
  const renderCustomerHub = () => (
    <div className="space-y-6">
      
      {/* Time-Horizon & View Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Store Ledger: <strong>Vijayawada & Hyderabad Clusters</strong></span>
        </div>

        {/* Segmented Filter */}
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

      {/* 4 Stat Cards with Sparklines */}
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

      {/* Bespoke Mahilo Signature: Women Empowerment Impact Card */}
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

        {/* Circular Progress & Payout Counter */}
        <div className="flex items-center gap-5 shrink-0 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/15">
          <div className="relative w-14 h-14 flex items-center justify-center">
            {/* SVG Progress Ring */}
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

      {/* Main Grid: Orders & Upcoming Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Recent Marketplace Orders</h2>
              <p className="text-xs text-slate-500">Live order fulfillment and real-time transit status</p>
            </div>

            {/* Status Tabs */}
            <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setOrderTab('ALL')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  orderTab === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All (14)
              </button>
              <button
                type="button"
                onClick={() => setOrderTab('ACTIVE')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  orderTab === 'ACTIVE' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Active (2)
              </button>
              <button
                type="button"
                onClick={() => setOrderTab('COMPLETED')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  orderTab === 'COMPLETED' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Delivered (12)
              </button>
            </div>
          </div>

          {/* Orders List with Real Media Thumbnails */}
          <div className="divide-y divide-slate-100">
            {[
              {
                id: 'MHL-9201',
                title: 'Handcrafted Terracotta Diya Set (2 pcs)',
                artisan: 'Saraswati Crafts',
                city: 'Vijayawada',
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
                artisan: 'Anitha Fashions',
                city: 'Guntur',
                price: '₹2,499',
                status: 'Processing',
                step: '2 of 4: Weaver Quality Check',
                statusColor: 'bg-amber-50 text-amber-800 border-amber-200/80',
                dotColor: 'bg-amber-500',
                image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=120&q=80',
                date: 'Dispatching tomorrow'
              },
              {
                id: 'MHL-8890',
                title: 'Organic Herbal Cold-Pressed Soap (Trio)',
                artisan: 'Lakshmi Naturals',
                city: 'Hyderabad',
                price: '₹299',
                status: 'Delivered',
                step: 'Delivered on Nov 18',
                statusColor: 'bg-purple-50 text-purple-800 border-purple-200/80',
                dotColor: 'bg-purple-500',
                image: 'https://images.unsplash.com/photo-1607006314605-feed797f1fbc?auto=format&fit=crop&w=120&q=80',
                date: 'Delivered to Home'
              }
            ]
              .filter(o => orderTab === 'ALL' || (orderTab === 'ACTIVE' && o.status !== 'Delivered') || (orderTab === 'COMPLETED' && o.status === 'Delivered'))
              .map((order) => (
                <div key={order.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-start gap-3.5">
                    {/* Media Thumbnail */}
                    <img 
                      src={order.image} 
                      alt={order.title}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200/80 shrink-0 shadow-2xs"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {/* Click to Copy ID */}
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
                        {order.artisan} · {order.city} · <span className="text-slate-400">{order.step}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <p className="text-sm sm:text-base font-extrabold text-slate-900 font-poppins">{order.price}</p>
                    <button 
                      onClick={() => { window.location.hash = '#/orders'; }}
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

        {/* Right Column: Upcoming Appointments with Designer Calendar Badges */}
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
              {/* Designer Appointment Card */}
              <div className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/30 flex items-start gap-3.5">
                {/* Designer Calendar Date Tile */}
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

              {/* Second Appointment */}
              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-start gap-3.5">
                <div className="w-11 h-12 rounded-xl bg-slate-200 text-slate-700 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase leading-none">NOV</span>
                  <span className="text-base font-black font-poppins leading-tight text-slate-800">15</span>
                </div>

                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-800 truncate">Custom Blouse Tailoring</span>
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded shrink-0">
                      Done
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">Siri Tailoring Hub · Vijayawada</p>
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600">
                    <CheckCircle size={11} />
                    <span>Collected & Fitted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => { window.location.hash = '#/bookings'; }}
            className="w-full mt-4 py-2.5 text-xs font-bold text-center text-[#D81B60] bg-pink-50 hover:bg-pink-100/80 border border-pink-100 rounded-xl transition-all"
          >
            Manage All Bookings
          </button>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // 2. SELLER / ARTISAN STUDIO VIEW
  // ==========================================
  const renderSellerStudio = () => (
    <div className="space-y-6">
      {/* 4 Stat Cards with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardKPIStatCard
          title="Monthly Revenue"
          value="₹48,250"
          change="+18.4%"
          isPositive={true}
          subtext="vs last month"
          icon={TrendingUp}
          iconColor="#10B981"
          iconBgColor="#ECFDF5"
          sparklineData={[18, 24, 21, 35, 30, 42, 48]}
          sparklineColor="#10B981"
        />
        <DashboardKPIStatCard
          title="Pending Orders"
          value="6"
          change="Action required"
          isPositive={false}
          subtext="Ship within 24h"
          icon={Package}
          iconColor="#D97706"
          iconBgColor="#FEF3C7"
          sparklineData={[3, 5, 4, 8, 6, 9, 6]}
          sparklineColor="#D97706"
        />
        <DashboardKPIStatCard
          title="Service Slots"
          value="3"
          change="2 today"
          isPositive={true}
          subtext="Tailoring & Salon"
          icon={Calendar}
          iconColor="#7C3AED"
          iconBgColor="#F3E8FF"
          sparklineData={[1, 2, 2, 4, 3, 2, 3]}
          sparklineColor="#7C3AED"
        />
        <DashboardKPIStatCard
          title="Store Rating"
          value="4.9 / 5"
          change="84 reviews"
          isPositive={true}
          subtext="98% on-time fulfillment"
          icon={Users}
          iconColor="#D81B60"
          iconBgColor="#FAF0F7"
          sparklineData={[4.5, 4.6, 4.7, 4.8, 4.8, 4.9, 4.9]}
          sparklineColor="#D81B60"
        />
      </div>

      {/* Seller Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Recent Orders to Fulfill</h2>
            <p className="text-xs text-slate-500">Print shipping labels and confirm dispatch</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-all">
            <Filter size={13} />
            <span>Filter</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4 sm:px-6">Order ID</th>
                <th className="p-4">Customer & City</th>
                <th className="p-4">Item Details</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 sm:px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {[
                { id: 'ORD-5012', customer: 'Pooja Reddy', city: 'Hyderabad', item: 'Terracotta Handpainted Vase (Set of 2)', amount: '₹1,299', status: 'Pending Label', color: 'bg-amber-50 text-amber-800 border-amber-200/80' },
                { id: 'ORD-5009', customer: 'Sunita Sharma', city: 'Bengaluru', item: 'Handloom Pochampally Silk Dupatta', amount: '₹1,850', status: 'Ready for Pickup', color: 'bg-blue-50 text-blue-800 border-blue-200/80' },
                { id: 'ORD-4982', customer: 'Deepa Verma', city: 'Chennai', item: 'Herbal Rose Water Facial Mist 200ml', amount: '₹450', status: 'Dispatched', color: 'bg-purple-50 text-purple-800 border-purple-200/80' },
              ].map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 sm:px-6 font-bold font-mono text-slate-900">{row.id}</td>
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{row.customer}</p>
                    <p className="text-[11px] text-slate-400 font-normal">{row.city}</p>
                  </td>
                  <td className="p-4 max-w-[220px] truncate font-medium text-slate-700">{row.item}</td>
                  <td className="p-4 font-bold text-slate-900 font-poppins">{row.amount}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${row.color}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 text-right">
                    <button className="px-3.5 py-1.5 bg-[#D81B60] text-white font-bold text-xs rounded-xl hover:bg-[#C2185B] shadow-2xs transition-all">
                      Ship Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // 3. ADMIN GOVERNANCE VIEW
  // ==========================================
  const renderAdminConsole = () => (
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
        />
      </div>

      {/* Seller Verification Queue */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Artisan Onboarding Queue</h2>
            <p className="text-xs text-slate-500">Verify seller credentials, business registration & government IDs</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-bold text-[#D81B60] bg-pink-50 hover:bg-pink-100 border border-pink-100 px-3 py-1.5 rounded-xl transition-all">
            <FileSpreadsheet size={13} />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            {
              store: 'Saraswati Handlooms',
              owner: 'Saraswati Devi',
              craft: 'Handwoven Ikat & Mangalagiri',
              city: 'Guntur, AP',
              docs: 'Aadhaar + Bank Details Verified',
              status: 'Pending Review'
            },
            {
              store: 'Swathi Homemade Pickles',
              owner: 'Swathi Rao',
              craft: 'Traditional Telugu Mango & Gongura Pickles',
              city: 'Vijayawada, AP',
              docs: 'FSSAI License Uploaded',
              status: 'Pending Review'
            },
            {
              store: 'Divya Bridal Makeover & Mehendi',
              owner: 'Divya Sri',
              craft: 'Bridal Beauty & Mehendi Services',
              city: 'Visakhapatnam, AP',
              docs: 'Portfolio + ID Proof',
              status: 'Pending Review'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{item.store}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">Founder: {item.owner} · {item.city}</p>
                <p className="text-xs text-slate-400">Craft: {item.craft} | {item.docs}</p>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1">
                  <Eye size={13} />
                  <span>Inspect</span>
                </button>
                <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-all">
                  Approve
                </button>
                <button className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-all">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <DashboardShell
      role={role}
      onRoleChange={handleRoleChange}
      activeNavId={activeNavId}
      onNavChange={setActiveNavId}
      user={user}
      onLogout={logout}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      breadcrumbs={[
        { label: activeNavId.charAt(0).toUpperCase() + activeNavId.slice(1) }
      ]}
      actions={
        role === 'SELLER' ? (
          <button className="px-3.5 py-2 bg-[#D81B60] text-white font-bold text-xs rounded-xl hover:bg-[#C2185B] flex items-center gap-1.5 shadow-sm transition-all">
            <Plus size={14} strokeWidth={2.5} />
            <span>Add Product</span>
          </button>
        ) : role === 'ADMIN' ? (
          <button className="px-3.5 py-2 bg-[#1E0524] text-white font-bold text-xs rounded-xl hover:bg-[#2A0831] flex items-center gap-1.5 shadow-sm transition-all">
            <ShieldCheck size={14} />
            <span>Audit Logs</span>
          </button>
        ) : (
          <button 
            onClick={() => { window.location.hash = '#/'; }}
            className="px-3.5 py-2 bg-[#D81B60] text-white font-bold text-xs rounded-xl hover:bg-[#C2185B] flex items-center gap-1.5 shadow-sm transition-all"
          >
            <ShoppingBag size={14} />
            <span>Explore Stores</span>
          </button>
        )
      }
    >
      {/* Role-specific Dashboard Views */}
      {role === 'CUSTOMER' && renderCustomerHub()}
      {role === 'SELLER' && renderSellerStudio()}
      {(role === 'ADMIN' || role === 'SUPER_ADMIN') && renderAdminConsole()}
    </DashboardShell>
  );
};
