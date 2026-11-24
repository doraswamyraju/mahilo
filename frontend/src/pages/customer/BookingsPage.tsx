import React, { useState, useEffect } from 'react';
import { Booking } from '../../types/index.js';
import { api } from '../../services/api.js';
import { Calendar, Clock, MapPin, Store, CheckCircle, AlertCircle } from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res: any = await api.get('/bookings/my-bookings');
        if (res.success && res.data) {
          setBookings(res.data);
        }
      } catch (err) {
        console.error('Failed to load bookings', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-brand-dark font-poppins">
          My Service Appointments
        </h1>
        <p className="text-xs text-gray-500 font-nunito">
          Manage your upcoming home visits, bridal bookings, and salon appointments
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-400 animate-pulse">Loading appointments...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-brand-border text-center space-y-3">
          <Calendar size={36} className="text-gray-300 mx-auto" />
          <h3 className="text-sm font-bold text-gray-700">No appointments scheduled</h3>
          <p className="text-xs text-gray-500 font-nunito">Book salon, skincare, or bridal sessions from top rated women professionals.</p>
          <a href="#/" className="inline-block mt-2 px-5 py-2 rounded-full bg-brand-secondary text-white text-xs font-bold">
            Explore Services
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-brand-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-gray-400">#{booking.bookingNumber}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 uppercase">
                    {booking.status}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  {booking.service?.name || 'Mahilo Service'}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-nunito pt-1">
                  <div className="flex items-center gap-1 text-brand-primary font-semibold">
                    <Calendar size={13} />
                    <span>{booking.bookingDate}</span>
                  </div>
                  <div className="flex items-center gap-1 text-brand-secondary font-semibold">
                    <Clock size={13} />
                    <span>{booking.startTime} - {booking.endTime}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Store size={13} />
                    <span>{booking.seller?.businessName}</span>
                  </div>
                </div>

                {booking.serviceAddress && (
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 pt-0.5">
                    <MapPin size={12} className="text-brand-growth shrink-0" />
                    <span className="truncate">Home Visit: {booking.serviceAddress.addressLine1}, {booking.serviceAddress.city}</span>
                  </div>
                )}
              </div>

              <div className="text-right sm:border-l sm:border-brand-border sm:pl-6 shrink-0">
                <div className="text-base font-extrabold text-brand-dark">₹{booking.totalPrice}</div>
                {booking.advancePaid > 0 && (
                  <div className="text-[10px] text-emerald-600 font-semibold">
                    ₹{booking.advancePaid} advance paid
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
