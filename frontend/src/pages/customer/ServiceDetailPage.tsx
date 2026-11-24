import React, { useState, useEffect } from 'react';
import { Service } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../services/api.js';
import { BookingModal } from '../../components/marketplace/BookingModal.js';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  CheckCircle, 
  ShieldCheck, 
  ArrowLeft, 
  Home, 
  Building2, 
  Sparkles,
  MessageSquarePlus,
  CheckCircle2,
  FileText 
} from 'lucide-react';

interface ServiceDetailPageProps {
  slug: string;
  onBack: () => void;
  onVisitStore?: (sellerSlug: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  slug,
  onBack,
  onVisitStore,
}) => {
  const { user } = useAuth();
  const [service, setService] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSuccessNotice, setBookingSuccessNotice] = useState<string | null>(null);

  // Review modal
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [ratingVal, setRatingVal] = useState(5);
  const [commentVal, setCommentVal] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const loadService = async () => {
    try {
      const res: any = await api.get(`/services/${slug}`);
      if (res.success && res.data) {
        setService(res.data);
      }
      const revRes: any = await api.get(`/reviews?serviceId=${res.data.id}`);
      if (revRes.success) {
        setReviews(revRes.data);
      }
    } catch (err) {
      console.error('Failed to load service', err);
    }
  };

  useEffect(() => {
    loadService();
  }, [slug]);

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-gray-500 animate-pulse">
        Loading service details...
      </div>
    );
  }

  const handleBookingSuccess = (booking: any) => {
    setBookingSuccessNotice(`Appointment (#${booking.bookingNumber}) confirmed for ${booking.bookingDate} at ${booking.startTime}!`);
    setTimeout(() => setBookingSuccessNotice(null), 6000);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to share your experience.');
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res: any = await api.post('/reviews', {
        serviceId: service.id,
        rating: ratingVal,
        comment: commentVal,
      });
      if (res.success) {
        setIsReviewOpen(false);
        setCommentVal('');
        loadService();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn font-nunito">
      {/* Back link */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline"
      >
        <ArrowLeft size={16} />
        <span>Back to Services</span>
      </button>

      {/* Booking Alert Banner */}
      {bookingSuccessNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center justify-between text-xs font-bold shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span>{bookingSuccessNotice}</span>
          </div>
          <a href="#/bookings" className="underline">View My Bookings</a>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Portfolio & Visuals */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[16/11] w-full rounded-3xl overflow-hidden bg-brand-bg border border-brand-border shadow-card relative">
            <img
              src={service.imageUrl}
              alt={service.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1.5">
              {service.deliveryMode === 'AT_CLIENT_LOCATION' ? <Home size={14} className="text-emerald-600" /> : <Building2 size={14} className="text-purple-600" />}
              <span>{service.deliveryMode === 'AT_CLIENT_LOCATION' ? 'At Home Service' : 'At Studio / Salon'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Service Details & Booking Action */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-secondary">
                {service.category?.name || 'Professional Service'}
              </span>
              {service.ratingAverage > 0 && (
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                  <Star size={13} className="text-amber-500 fill-amber-500" />
                  <span>{service.ratingAverage}</span>
                  <span className="text-gray-400">({service.totalRatings} verified clients)</span>
                </div>
              )}
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-brand-dark font-poppins leading-tight">
              {service.name}
            </h1>

            {/* Provider info */}
            {service.seller && (
              <div className="pt-1 flex items-center gap-2">
                <span className="text-xs text-gray-500">Provided by:</span>
                <span className="text-xs font-bold text-brand-secondary flex items-center gap-1">
                  <span>{service.seller.businessName}</span>
                  {service.seller.isVerified && (
                    <CheckCircle size={14} className="text-brand-growth shrink-0" />
                  )}
                </span>
                <span className="text-gray-400 text-xs">•</span>
                <span className="text-xs text-gray-500">{service.seller.city}, {service.seller.state}</span>
              </div>
            )}
          </div>

          {/* Pricing & Duration Bar */}
          <div className="p-4 bg-brand-bg rounded-2xl border border-brand-border/80 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-brand-dark font-poppins">
                ₹{service.price.toLocaleString('en-IN')}
              </div>
              {service.advanceAmount > 0 && (
                <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                  ₹{service.advanceAmount} advance deposit payable at reservation
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-brand-border text-xs font-bold text-gray-700">
              <Clock size={15} className="text-brand-secondary" />
              <span>Duration: {service.durationMinutes} Minutes</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 pt-2 border-t border-brand-border">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Service Description
            </span>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Cancellation Policy */}
          {service.cancellationRule && (
            <div className="p-3.5 bg-white rounded-2xl border border-brand-border space-y-1 text-xs">
              <span className="font-bold text-gray-800 flex items-center gap-1.5">
                <FileText size={14} className="text-brand-primary" />
                <span>Cancellation & Rescheduling Policy</span>
              </span>
              <p className="text-gray-500 leading-relaxed">{service.cancellationRule}</p>
            </div>
          )}

          {/* Direct Booking CTA */}
          <div className="pt-2">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full py-4 px-6 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-brand-secondary to-brand-primary hover:opacity-95 shadow-md transition flex items-center justify-center gap-2"
            >
              <Calendar size={18} />
              <span>Select Date & Book Available Slot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Verified Reviews Section */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-brand-border shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-gray-900 font-poppins">
              Verified Client Reviews ({reviews.length})
            </h3>
            <p className="text-xs text-gray-500">Feedback from clients who completed this appointment</p>
          </div>

          <button
            onClick={() => setIsReviewOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-bg text-brand-secondary text-xs font-bold border border-brand-secondary/30 hover:bg-brand-secondary/10 transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <MessageSquarePlus size={15} />
            <span>Review this Service</span>
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">
            No reviews yet. Book an appointment and share your experience!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-brand-bg/50 border border-brand-border space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">{rev.userName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                      Verified Appointment
                    </span>
                  </div>
                  <div className="flex items-center text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-brand-border shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-gray-900 font-poppins">Share Your Feedback</h3>
            <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingVal(star)}
                      className={`p-2 rounded-xl text-xs font-bold border ${
                        ratingVal >= star
                          ? 'bg-amber-100 border-amber-300 text-amber-900'
                          : 'bg-gray-100 border-gray-200 text-gray-400'
                      }`}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Review Comments</label>
                <textarea
                  rows={3}
                  required
                  value={commentVal}
                  onChange={(e) => setCommentVal(e.target.value)}
                  placeholder="Share details regarding punctuality, cleanliness, quality of service..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-4 py-2 rounded-xl bg-brand-secondary text-white font-bold"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        service={service}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
};
