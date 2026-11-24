import React, { useState } from 'react';
import { ShieldCheck, Eye, Check, X, FileText, Download } from 'lucide-react';

export const AdminSellerApprovalsModule: React.FC = () => {
  const [sellers, setSellers] = useState([
    {
      id: 'appr-1',
      storeName: 'Saraswati Handlooms',
      ownerName: 'Saraswati Devi',
      craft: 'Handwoven Ikat & Mangalagiri Sarees',
      city: 'Guntur, Andhra Pradesh',
      phone: '+91 94401 23456',
      docs: ['Aadhaar Card (Verified)', 'Bank Passbook (Verified)', 'Handloom Weaver ID'],
      appliedDate: 'Nov 23, 2026',
      status: 'PENDING'
    },
    {
      id: 'appr-2',
      storeName: 'Swathi Homemade Pickles & Spices',
      ownerName: 'Swathi Rao',
      craft: 'Traditional Andhra Gongura & Mango Pickles',
      city: 'Vijayawada, Andhra Pradesh',
      phone: '+91 98480 98765',
      docs: ['Aadhaar Card (Verified)', 'FSSAI License 2026 (Verified)'],
      appliedDate: 'Nov 22, 2026',
      status: 'PENDING'
    },
    {
      id: 'appr-3',
      storeName: 'Divya Bridal Makeover & Mehendi',
      ownerName: 'Divya Sri',
      craft: 'Doorstep Bridal Mehendi & Facial Artistry',
      city: 'Visakhapatnam, Andhra Pradesh',
      phone: '+91 91000 11223',
      docs: ['Aadhaar Card (Verified)', 'Cosmetology Certificate'],
      appliedDate: 'Nov 20, 2026',
      status: 'PENDING'
    }
  ]);

  const handleApprove = (id: string) => {
    setSellers(sellers.filter(s => s.id !== id));
  };

  const handleReject = (id: string) => {
    setSellers(sellers.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Artisan KYC & Onboarding Queue</h2>
          <p className="text-xs text-slate-500">Verify government identity, trade credentials, and approve storefronts</p>
        </div>
        <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
          {sellers.length} Pending Verifications
        </span>
      </div>

      <div className="space-y-4">
        {sellers.map((seller) => (
          <div
            key={seller.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">{seller.storeName}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  KYC Pending
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium">
                Founder: <strong>{seller.ownerName}</strong> · {seller.city} · Contact: {seller.phone}
              </p>

              <p className="text-xs text-slate-500">
                Craft / Category: <strong className="text-slate-700">{seller.craft}</strong>
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {seller.docs.map((doc, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                    <FileText size={11} className="text-slate-400" />
                    <span>{doc}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
              <button
                onClick={() => handleApprove(seller.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1"
              >
                <Check size={14} />
                <span>Approve & Activate</span>
              </button>
              <button
                onClick={() => handleReject(seller.id)}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition flex items-center gap-1"
              >
                <X size={14} />
                <span>Reject</span>
              </button>
            </div>
          </div>
        ))}

        {sellers.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 space-y-2">
            <ShieldCheck size={32} className="text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">Verification Queue Cleared</h3>
            <p className="text-xs text-slate-500">All pending artisan onboarding applications have been processed.</p>
          </div>
        )}
      </div>
    </div>
  );
};
