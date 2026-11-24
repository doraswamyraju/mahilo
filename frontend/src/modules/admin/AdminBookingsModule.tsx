import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowUpRight, 
  Scissors, 
  Sparkles, 
  Check, 
  Copy,
  DollarSign
} from 'lucide-react';

interface AdminBooking {
  id: string;
  bookingNumber: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  specialistName: string;
  specialistPhone: string;
  date: string;
  month: string;
  day: string;
  timeSlot: string;
  address: string;
  city: string;
  totalPrice: number;
  advancePaid: number;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  specialNotes?: string;
}

const INITIAL_BOOKINGS: AdminBooking[] = [
  {
    id: 'bk-mhl-201',
    bookingNumber: 'BKG-20261128-4012',
    clientName: 'Ananya Sharma',
    clientPhone: '9876543210',
    serviceName: 'Bridal & Event Mehendi Art',
    specialistName: 'Noor Jahan Mehendi Art',
    specialistPhone: '9876543211',
    date: '2026-11-28',
    month: 'NOV',
    day: '28',
    timeSlot: '02:00 PM - 03:30 PM',
    address: 'Flat 402, Sri Sai Nilayam, Benz Circle',
    city: 'Vijayawada',
    totalPrice: 599,
    advancePaid: 100,
    status: 'CONFIRMED',
    specialNotes: 'Bridal Henna trial for family reception'
  },
  {
    id: 'bk-mhl-202',
    bookingNumber: 'BKG-20261115-3891',
    clientName: 'Ananya Sharma',
    clientPhone: '9876543210',
    serviceName: 'Custom Blouse Tailoring & Styling',
    specialistName: 'Siri Tailoring Hub',
    specialistPhone: '9876543212',
    date: '2026-11-15',
    month: 'NOV',
    day: '15',
    timeSlot: '11:00 AM - 11:45 AM',
    address: 'Flat 402, Sri Sai Nilayam, Benz Circle',
    city: 'Vijayawada',
    totalPrice: 450,
    advancePaid: 50,
    status: 'COMPLETED',
    specialNotes: 'Measurement and neck design styling'
  },
  {
    id: 'bk-mhl-203',
    bookingNumber: 'BKG-20261110-3450',
    clientName: 'Kavitha Ramaswamy',
    clientPhone: '9811223344',
    serviceName: 'Herbal Fruit Clean-up & Facial',
    specialistName: 'Noor Jahan Salon',
    specialistPhone: '9876543211',
    date: '2026-11-10',
    month: 'NOV',
    day: '10',
    timeSlot: '04:00 PM - 05:00 PM',
    address: 'Plot 12, Jubilee Hills',
    city: 'Hyderabad',
    totalPrice: 299,
    advancePaid: 100,
    status: 'COMPLETED'
  }
];

export const AdminBookingsModule: React.FC = () => {
  const [bookings, setBookings] = useState<AdminBooking[]>(INITIAL_BOOKINGS);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);

  const handleUpdateStatus = (bookingId: string, newStatus: AdminBooking['status']) => {
    setBookings((prev) =>
      prev.map((bk) => (bk.id === bookingId ? { ...bk, status: newStatus } : bk))
    );
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const filteredBookings = bookings.filter((bk) => {
    if (statusFilter !== 'ALL' && bk.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        bk.bookingNumber.toLowerCase().includes(q) ||
        bk.clientName.toLowerCase().includes(q) ||
        bk.specialistName.toLowerCase().includes(q) ||
        bk.serviceName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const upcomingCount = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;
  const totalBookingsValue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Header Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upcoming Appointments</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-900">{upcomingCount}</span>
            <span className="text-[11px] font-medium text-purple-700">scheduled home visits</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed Sessions</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-800">{completedCount}</span>
            <span className="text-[11px] font-semibold text-emerald-600">100% verified</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Booking GMV</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">₹{totalBookingsValue.toLocaleString('en-IN')}</span>
            <span className="text-[11px] font-semibold text-slate-500">advances secured</span>
          </div>
        </div>
      </div>

      {/* 2. Controls & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          {(['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                statusFilter === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Bookings' : st}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search booking #, client, or specialist..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D0133]/10 focus:border-[#2D0133]"
          />
        </div>
      </div>

      {/* 3. Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-3">Service & Booking #</th>
                <th className="py-3 px-3">Client & Location</th>
                <th className="py-3 px-3">Specialist Partner</th>
                <th className="py-3 px-3">Pricing & Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Calendar size={32} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-semibold text-slate-600">No service bookings found</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-slate-50/50 transition">
                    {/* Date Tile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-200/80 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[9px] font-black text-purple-700 tracking-wider uppercase leading-none">{bk.month}</span>
                          <span className="text-base font-black text-slate-900 leading-tight mt-0.5">{bk.day}</span>
                        </div>
                        <div className="text-[11px] font-bold text-slate-700">
                          {bk.timeSlot}
                        </div>
                      </div>
                    </td>

                    {/* Service & Booking # */}
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">{bk.serviceName}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{bk.bookingNumber}</div>
                    </td>

                    {/* Client & Location */}
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-900">{bk.clientName}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} />
                        <span>{bk.city}</span>
                      </div>
                    </td>

                    {/* Specialist */}
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-purple-900">{bk.specialistName}</div>
                      <div className="text-[10px] text-slate-400">{bk.specialistPhone}</div>
                    </td>

                    {/* Pricing & Status */}
                    <td className="py-3.5 px-3">
                      <div className="font-black text-slate-900">₹{bk.totalPrice}</div>
                      <div className="mt-1">
                        {bk.status === 'CONFIRMED' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock size={10} className="text-amber-600" />
                            <span>Confirmed</span>
                          </span>
                        )}
                        {bk.status === 'COMPLETED' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={10} className="text-emerald-600" />
                            <span>Completed</span>
                          </span>
                        )}
                        {bk.status === 'CANCELLED' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle size={10} className="text-rose-600" />
                            <span>Cancelled</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(bk)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-lg transition"
                      >
                        <span>Oversight</span>
                        <ArrowUpRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Booking Detail & Oversight Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Appointment</span>
                <h3 className="text-sm font-black text-slate-900 font-mono mt-0.5">{selectedBooking.bookingNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 border-b border-slate-100 text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Service Offered</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedBooking.serviceName}</p>
                <p className="text-purple-700 font-semibold text-[11px] mt-0.5">By {selectedBooking.specialistName}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="text-slate-700 font-bold">Client: {selectedBooking.clientName} ({selectedBooking.clientPhone})</p>
                <p className="text-slate-500 text-[11px]">Address: {selectedBooking.address}, {selectedBooking.city}</p>
                {selectedBooking.specialNotes && (
                  <p className="text-amber-800 text-[11px] font-medium pt-1 border-t border-slate-200/80">
                    Notes: {selectedBooking.specialNotes}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">Total Price: ₹{selectedBooking.totalPrice}</span>
                <span className="font-bold text-emerald-700">Advance Paid: ₹{selectedBooking.advancePaid}</span>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="pt-4 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Manage Appointment
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'COMPLETED')}
                  className="py-2 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition"
                >
                  Mark Completed
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'CANCELLED')}
                  className="py-2 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl border border-rose-200 transition"
                >
                  Cancel & Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
