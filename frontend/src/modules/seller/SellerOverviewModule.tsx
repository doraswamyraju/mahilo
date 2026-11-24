import React, { useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  Calendar, 
  Users, 
  Plus, 
  ArrowUpRight, 
  AlertTriangle, 
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { DashboardKPIStatCard } from '../../components/dashboard/DashboardKPIStatCard.js';

export interface SellerOverviewProps {
  onNavigate?: (navId: string) => void;
  onOpenAddProduct?: () => void;
}

export const SellerOverviewModule: React.FC<SellerOverviewProps> = ({
  onNavigate,
  onOpenAddProduct
}) => {
  return (
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
          onClick={() => onNavigate?.('finances')}
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
          onClick={() => onNavigate?.('orders')}
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
          onClick={() => onNavigate?.('appointments')}
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
          onClick={() => onNavigate?.('reviews')}
        />
      </div>

      {/* Low Stock Alert & Festival Promotion Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 bg-gradient-to-r from-[#2A0533] via-[#3D0A47] to-[#1C0422] rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#FFD814] uppercase tracking-wider">
              Festive Boost Program Active
            </span>
            <h2 className="text-base font-bold font-poppins">List new handmade items for 0% platform fee</h2>
            <p className="text-xs text-slate-300">
              Reach over 10,000 shoppers this week in Vijayawada & Hyderabad.
            </p>
          </div>
          <button
            onClick={onOpenAddProduct}
            className="px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-950 font-bold text-xs rounded-xl shadow-xs transition shrink-0 flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Add Product</span>
          </button>
        </div>

        {/* Low Stock Card */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
              <AlertTriangle size={14} className="text-amber-600" />
              <span>Low Stock Warning</span>
            </div>
            <p className="text-xs text-slate-700 font-medium">Terracotta Handpainted Vase</p>
            <p className="text-[11px] text-amber-700">Only 2 units remaining in workshop stock.</p>
          </div>
          <button 
            onClick={() => onNavigate?.('products')}
            className="text-xs font-bold text-amber-900 hover:underline mt-2 text-left"
          >
            Update Inventory &rarr;
          </button>
        </div>
      </div>

      {/* Orders To Fulfill Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Orders Awaiting Dispatch</h2>
            <p className="text-xs text-slate-500">Print packing labels and schedule pickup</p>
          </div>
          <button
            onClick={() => onNavigate?.('orders')}
            className="text-xs font-bold text-[#D81B60] hover:underline flex items-center gap-1"
          >
            <span>View All (6)</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            { id: 'ORD-5012', customer: 'Pooja Reddy', city: 'Hyderabad', item: 'Terracotta Handpainted Vase (Set of 2)', amount: '₹1,299', status: 'Pending Label', color: 'bg-amber-50 text-amber-800 border-amber-200' },
            { id: 'ORD-5009', customer: 'Sunita Sharma', city: 'Bengaluru', item: 'Handloom Pochampally Silk Dupatta', amount: '₹1,850', status: 'Ready for Pickup', color: 'bg-blue-50 text-blue-800 border-blue-200' },
            { id: 'ORD-4982', customer: 'Deepa Verma', city: 'Chennai', item: 'Herbal Rose Water Facial Mist 200ml', amount: '₹450', status: 'Dispatched', color: 'bg-purple-50 text-purple-800 border-purple-200' },
          ].map((row) => (
            <div key={row.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-slate-400">{row.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${row.color}`}>
                    {row.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{row.item}</h3>
                <p className="text-xs text-slate-500">{row.customer} · {row.city}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-extrabold text-slate-900 font-poppins">{row.amount}</p>
                <button 
                  onClick={() => onNavigate?.('orders')}
                  className="px-3 py-1 bg-[#D81B60] text-white font-bold text-xs rounded-lg hover:bg-[#C2185B] mt-1.5 block shadow-2xs"
                >
                  Ship Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
