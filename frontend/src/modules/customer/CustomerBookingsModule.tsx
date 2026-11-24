import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  Scissors, 
  Sparkles, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const CustomerBookingsModule: React.FC = () => {
  const [tab, setTab] = useState<'UPCOMING' | 'COMPLETED'>('UPCOMING');

  const bookings = [
    {
      id: 'BK-104',
      serviceTitle: 'Bridal & Event Mehendi (Full Hands & Feet)',
      expertName: 'Noor Jahan Mehendi Art',
      expertPhone: '+91 98765 43210',
      category: 'Mehendi & Henna',
      month: 'NOV',
      day: '28',
      time: '2:00 PM',
      duration: '90 mins',
      serviceType: 'Home Visit',
      address: 'Flat 402, Sai Residency, Benz Circle, Vijayawada',
      price: '₹1,499',
      status: 'CONFIRMED',
      statusLabel: 'Confirmed & Assigned'
    },
    {
      id: 'BK-092',
      serviceTitle: 'Custom Maggam Work Blouse Tailoring',
      expertName: 'Siri Tailoring & Stitching',
      expertPhone: '+91 91234 56789',
      category: 'Tailoring',
      month: 'NOV',
      day: '15',
      time: '11:00 AM',
      duration: 'Fabric Collected',
      serviceType: 'Store Pickup',
      address: 'Shop 12, Kaleswara Rao Market, Vijayawada',
      price: '₹1,200',
      status: 'COMPLETED',
      statusLabel: 'Completed & Delivered'
    }
  ];

  const filtered = bookings.filter(b => tab === 'UPCOMING' ? b.status === 'CONFIRMED' : b.status === 'COMPLETED');

  return (
    <div className="space-y-5">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200/70">
          <button
            type="button"
            onClick={() => setTab('UPCOMING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === 'UPCOMING' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Upcoming (1)
          </button>
          <button
            type="button"
            onClick={() => setTab('COMPLETED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === 'COMPLETED' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Past Appointments (1)
          </button>
        </div>

        <button 
          onClick={() => { window.location.hash = '#/'; }}
          className="px-3.5 py-1.5 bg-[#D81B60] text-white font-bold text-xs rounded-xl hover:bg-[#C2185B] shadow-2xs transition-all flex items-center gap-1.5"
        >
          <Sparkles size={13} />
          <span>Book New Service</span>
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            <div className="flex items-start gap-4">
              {/* Designer Calendar Tile */}
              <div className="w-14 h-16 rounded-2xl bg-gradient-to-b from-[#2D0133] to-[#4E0C54] text-white flex flex-col items-center justify-center shrink-0 shadow-xs border border-purple-900">
                <span className="text-[10px] font-extrabold text-[#FFD814] uppercase leading-none">{item.month}</span>
                <span className="text-xl font-black font-poppins leading-tight mt-0.5">{item.day}</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">{item.id}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    item.status === 'CONFIRMED' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {item.statusLabel}
                  </span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    {item.serviceType}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {item.serviceTitle}
                </h3>

                <p className="text-xs font-semibold text-[#D81B60]">
                  Specialist: {item.expertName}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-purple-600" />
                    <span>{item.time} ({item.duration})</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-slate-400" />
                    <span className="truncate max-w-[280px]">{item.address}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Action */}
            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
              <p className="text-base font-black text-slate-900 font-poppins">{item.price}</p>
              <div className="flex items-center gap-2 mt-2">
                {item.status === 'CONFIRMED' ? (
                  <>
                    <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all">
                      Reschedule
                    </button>
                    <a
                      href={`tel:${item.expertPhone}`}
                      className="px-3 py-1.5 bg-[#D81B60] text-white font-bold text-xs rounded-xl hover:bg-[#C2185B] transition-all flex items-center gap-1"
                    >
                      <Phone size={12} />
                      <span>Call Expert</span>
                    </a>
                  </>
                ) : (
                  <button className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all">
                    Book Again
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
