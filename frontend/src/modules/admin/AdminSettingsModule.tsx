import React, { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Key, 
  Bell, 
  Check, 
  DollarSign, 
  Mail, 
  Phone, 
  Save, 
  Server, 
  Lock, 
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export const AdminSettingsModule: React.FC = () => {
  const [platformName, setPlatformName] = useState('Mahilo - Women Entrepreneurs Marketplace');
  const [supportEmail, setSupportEmail] = useState('support@mahilo.in');
  const [supportPhone, setSupportPhone] = useState('+91 94401 23456');
  const [payoutThreshold, setPayoutThreshold] = useState('100');
  const [settlementCycle, setSettlementCycle] = useState('T+2 Business Days');
  
  // Integrations
  const [razorpayKey, setRazorpayKey] = useState('rzp_live_94820184719284');
  const [razorpayWebhook, setRazorpayWebhook] = useState('whsec_8921471029384756');
  const [smsSenderId, setSmsSenderId] = useState('MAHILO');
  
  // Toggles
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [autoApproveReviews, setAutoApproveReviews] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fadeIn pb-8">
      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Check size={16} className="text-emerald-600" />
            <span>Platform configurations and security rules saved successfully!</span>
          </div>
        </div>
      )}

      {/* 1. General Marketplace Settings */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">General Marketplace Configuration</h3>
          <p className="text-xs text-slate-500">Contact information, support channels, and platform branding</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Marketplace Platform Name</label>
            <input
              type="text"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Official Support Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Artisan Helpline WhatsApp / Phone</label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Settlement Turnaround Cycle</label>
            <select
              value={settlementCycle}
              onChange={(e) => setSettlementCycle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
            >
              <option value="T+1 Business Day">T+1 Business Day (Next Day)</option>
              <option value="T+2 Business Days">T+2 Business Days (Standard)</option>
              <option value="Weekly Every Monday">Weekly Every Monday</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Payment Gateway & Webhook Credentials */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Payment Gateway & SMS APIs</h3>
            <p className="text-xs text-slate-500">Live API credentials for Razorpay Route and SMS gateways</p>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Razorpay Live Active</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Razorpay Key ID (Live)</label>
            <div className="relative">
              <Key size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={razorpayKey}
                onChange={(e) => setRazorpayKey(e.target.value)}
                className="w-full pl-9 pr-3 py-2 font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Webhook Secret Key</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="password"
                value={razorpayWebhook}
                onChange={(e) => setRazorpayWebhook(e.target.value)}
                className="w-full pl-9 pr-3 py-2 font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">SMS DLT Header / Sender ID</label>
            <input
              type="text"
              maxLength={6}
              value={smsSenderId}
              onChange={(e) => setSmsSenderId(e.target.value)}
              className="w-full px-3 py-2 font-mono uppercase font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Minimum Payout Threshold (INR)</label>
            <div className="relative">
              <DollarSign size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="number"
                value={payoutThreshold}
                onChange={(e) => setPayoutThreshold(e.target.value)}
                className="w-full pl-9 pr-3 py-2 font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Operational Security Toggles */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Platform Operational Toggles</h3>
          <p className="text-xs text-slate-500">Global access control, registration rules, and maintenance switch</p>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div>
              <p className="font-bold text-slate-900">Allow New Artisan Registrations</p>
              <p className="text-slate-500 text-[11px]">When disabled, new sellers cannot submit onboarding forms.</p>
            </div>
            <button
              type="button"
              onClick={() => setAllowRegistration(!allowRegistration)}
              className={`p-1.5 rounded-xl font-bold transition-all ${
                allowRegistration ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {allowRegistration ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div>
              <p className="font-bold text-slate-900">Auto-publish Verified Customer Reviews</p>
              <p className="text-slate-500 text-[11px]">Verified buyers' reviews appear instantly without pre-moderation.</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoApproveReviews(!autoApproveReviews)}
              className={`p-1.5 rounded-xl font-bold transition-all ${
                autoApproveReviews ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {autoApproveReviews ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50/50 border border-rose-200/70">
            <div>
              <p className="font-bold text-rose-900">Emergency Maintenance Mode</p>
              <p className="text-rose-600 text-[11px]">Temporarily pauses customer orders and service bookings.</p>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`p-1.5 rounded-xl font-bold transition-all ${
                maintenanceMode ? 'text-rose-600' : 'text-slate-400'
              }`}
            >
              {maintenanceMode ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#2D0133] hover:bg-[#3D0A47] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
        >
          <Save size={14} className="text-[#FFD814]" />
          <span>Save System Settings</span>
        </button>
      </div>
    </form>
  );
};
