import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Globe, Shield, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

export const CustomerProfileModule: React.FC = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || 'Ananya Sharma');
  const [phone, setPhone] = useState(user?.phone || '+91 98480 12345');
  const [email, setEmail] = useState(user?.email || 'ananya.sharma@example.com');
  const [language, setLanguage] = useState('English / Telugu');
  const [city, setCity] = useState('Vijayawada');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">Personal Profile & Preferences</h2>
          <p className="text-xs text-slate-500">Manage your contact information, delivery city, and language preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Full Legal Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#D81B60] focus:ring-1 focus:ring-[#D81B60] outline-hidden"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Phone Number (OTP Verification)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#D81B60] focus:ring-1 focus:ring-[#D81B60] outline-hidden font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#D81B60] focus:ring-1 focus:ring-[#D81B60] outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Primary Shopping City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#D81B60]"
              >
                <option value="Vijayawada">Vijayawada, AP</option>
                <option value="Guntur">Guntur, AP</option>
                <option value="Visakhapatnam">Visakhapatnam, AP</option>
                <option value="Hyderabad">Hyderabad, TS</option>
                <option value="Tirupati">Tirupati, AP</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Preferred Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#D81B60]"
              >
                <option value="English / Telugu">English / Telugu (తెలుగు)</option>
                <option value="Telugu Only">Telugu Only (తెలుగు)</option>
                <option value="English Only">English Only</option>
                <option value="Hindi">Hindi (हिंदी)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-emerald-600 font-bold">Profile updated successfully!</span>
            ) : <span />}
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#D81B60] text-white font-bold rounded-xl hover:bg-[#C2185B] shadow-2xs transition flex items-center gap-1.5"
            >
              <Save size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
