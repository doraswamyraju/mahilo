import React, { useState, useEffect } from 'react';
import { Service } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';
import { X, Calendar, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (booking: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  service,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  
  // Tomorrow's date formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(defaultDateStr);
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotMessage, setSlotMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Address for home services
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState(user ? 'Mumbai' : '');
  const [pincode, setPincode] = useState('400053');
  const [notes, setNotes] = useState('');

  // Fetch slots whenever service or selectedDate changes
  useEffect(() => {
    if (!service || !isOpen) return;

    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      setError(null);
      setSelectedSlot(null);
      try {
        const res: any = await api.get(`/services/${service.id}/available-slots?date=${selectedDate}`);
        if (res.success && res.data) {
          setSlots(res.data.slots || []);
          if (!res.data.isOperatingDay) {
            setSlotMessage(res.data.message || 'Provider does not offer slots on this day.');
          } else {
            setSlotMessage(null);
          }
        }
      } catch (err: any) {
        setSlotMessage('Could not retrieve available slots for this date.');
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [service, selectedDate, isOpen]);

  if (!isOpen || !service) return null;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to confirm this appointment.');
      return;
    }
    if (!selectedSlot) {
      setError('Please select an available time slot.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: any = {
        serviceId: service.id,
        bookingDate: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        specialNotes: notes || undefined,
      };

      if (service.deliveryMode === 'AT_CLIENT_LOCATION') {
        payload.serviceAddress = {
          name: user.fullName,
          phone: user.phone,
          addressLine1,
          city,
          pincode,
        };
      }

      const res: any = await api.post('/bookings', payload);
      if (res.success) {
        onSuccess(res.data);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Booking conflict or server error. Please try another slot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-brand-border overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">
              Schedule Appointment
            </span>
            <h2 className="text-base sm:text-lg font-bold font-poppins truncate max-w-[340px]">
              {service.name}
            </h2>
            <p className="text-xs text-white/90 font-nunito mt-0.5">
              ₹{service.price} • {service.durationMinutes} mins • {service.seller?.businessName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleBookingSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Calendar size={14} className="text-brand-primary" />
              <span>Select Appointment Date</span>
            </label>
            <input
              type="date"
              required
              min={defaultDateStr}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Clock size={14} className="text-brand-secondary" />
              <span>Choose Available Slot</span>
            </label>

            {isLoadingSlots ? (
              <div className="py-8 text-center text-xs text-gray-500 animate-pulse">
                Checking provider availability calendar...
              </div>
            ) : slotMessage ? (
              <div className="p-4 bg-brand-bg rounded-xl border border-brand-border text-center text-xs text-gray-600">
                {slotMessage}
              </div>
            ) : slots.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-xl text-center text-xs text-gray-500">
                No slots open on this date.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map((slot) => {
                  const isSelected = selectedSlot?.startTime === slot.startTime;
                  return (
                    <button
                      key={slot.startTime}
                      type="button"
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition border ${
                        !slot.isAvailable
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                          : 'bg-white text-gray-800 border-gray-200 hover:border-brand-primary hover:bg-brand-bg'
                      }`}
                    >
                      {slot.startTime}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Home Service Address (if applicable) */}
          {service.deliveryMode === 'AT_CLIENT_LOCATION' && (
            <div className="space-y-3 pt-2 border-t border-brand-border">
              <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <MapPin size={14} className="text-brand-growth" />
                <span>Service Delivery Address (Home Visit)</span>
              </label>

              <div>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Flat/House No., Building Name, Street"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="PIN code"
                  maxLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Special Instructions / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Any skin allergies, specific hair length, or gate landmark"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Summary */}
          <div className="p-3 bg-brand-bg rounded-xl border border-brand-border flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-500 block">Total Service Fee</span>
              <span className="text-base font-extrabold text-brand-dark">₹{service.price}</span>
            </div>
            {service.advanceAmount > 0 && (
              <div className="text-right">
                <span className="text-gray-500 block">Advance Payable Now</span>
                <span className="text-sm font-bold text-brand-secondary">₹{service.advanceAmount}</span>
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !selectedSlot}
              className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-95 shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} />
              <span>{isSubmitting ? 'Confirming Appointment...' : 'Confirm Booking'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
