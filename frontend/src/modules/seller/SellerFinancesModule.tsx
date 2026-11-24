import React from 'react';
import { DollarSign, TrendingUp, Download, CheckCircle2, ArrowDownLeft, Landmark } from 'lucide-react';
import { DashboardKPIStatCard } from '../../components/dashboard/DashboardKPIStatCard.js';

export const SellerFinancesModule: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardKPIStatCard
          title="Available for Payout"
          value="₹14,250"
          change="Ready to withdraw"
          isPositive={true}
          subtext="Next cycle: Friday"
          icon={DollarSign}
          iconColor="#10B981"
          iconBgColor="#ECFDF5"
        />
        <DashboardKPIStatCard
          title="Total Lifetime Payouts"
          value="₹1,84,500"
          change="+₹24,000 this month"
          isPositive={true}
          subtext="Direct bank transfers"
          icon={TrendingUp}
          iconColor="#7C3AED"
          iconBgColor="#F3E8FF"
        />
        <DashboardKPIStatCard
          title="Bank Account Status"
          value="Verified"
          change="State Bank of India"
          isPositive={true}
          subtext="A/C: **** 4892"
          icon={Landmark}
          iconColor="#D81B60"
          iconBgColor="#FAF0F7"
        />
      </div>

      {/* Settlement History */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Recent Payout Settlements</h2>
            <p className="text-xs text-slate-500">Processed weekly via NEFT/IMPS to your verified bank account</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-bold text-[#D81B60] bg-pink-50 border border-pink-100 px-3 py-1.5 rounded-xl hover:bg-pink-100">
            <Download size={13} />
            <span>Tax Statement</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {[
            { id: 'PAY-8902', date: 'Nov 20, 2026', amount: '₹12,400', ref: 'SBI-UTR-902144', status: 'Settled' },
            { id: 'PAY-8841', date: 'Nov 13, 2026', amount: '₹18,950', ref: 'SBI-UTR-883190', status: 'Settled' },
            { id: 'PAY-8799', date: 'Nov 06, 2026', amount: '₹9,800', ref: 'SBI-UTR-871102', status: 'Settled' }
          ].map((item) => (
            <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/60">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900">{item.id} · <span className="text-slate-400 font-normal">{item.ref}</span></p>
                <p className="text-slate-500 text-[11px]">{item.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-900 font-poppins">{item.amount}</p>
                <span className="text-emerald-600 font-bold text-[10px] inline-flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  <span>{item.status}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
