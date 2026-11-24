import React, { useState, useEffect } from 'react';
import { SellerProfile, Product, Service } from '../../types/index.js';
import { api } from '../../services/api.js';
import { ProductCard } from '../../components/marketplace/ProductCard.js';
import { ServiceCard } from '../../components/marketplace/ServiceCard.js';
import { BookingModal } from '../../components/marketplace/BookingModal.js';
import { 
  Store, 
  ShieldCheck, 
  Star, 
  MapPin, 
  ArrowLeft, 
  ShoppingBag, 
  Calendar,
  CheckCircle2 
} from 'lucide-react';

interface SellerStorePageProps {
  slug: string;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SellerStorePage: React.FC<SellerStorePageProps> = ({
  slug,
  onBack,
  onSelectProduct,
}) => {
  const [seller, setSeller] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'SERVICES'>('PRODUCTS');
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingAlert, setBookingAlert] = useState<string | null>(null);

  useEffect(() => {
    const loadSellerStore = async () => {
      try {
        const res: any = await api.get(`/sellers/${slug}`);
        if (res.success && res.data) {
          setSeller(res.data);
          if (res.data.products?.length === 0 && res.data.services?.length > 0) {
            setActiveTab('SERVICES');
          }
        }
      } catch (err) {
        console.error('Failed to load seller storefront', err);
      }
    };

    loadSellerStore();
  }, [slug]);

  if (!seller) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-gray-500 animate-pulse">
        Loading storefront...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn font-nunito">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline"
      >
        <ArrowLeft size={16} />
        <span>Back to Marketplace</span>
      </button>

      {/* Booking Alert */}
      {bookingAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{bookingAlert}</span>
          </div>
          <a href="#/bookings" className="underline">View Bookings</a>
        </div>
      )}

      {/* Store Banner & Bio Header */}
      <div className="bg-white rounded-3xl overflow-hidden border border-brand-border shadow-card">
        <div className="h-44 sm:h-60 w-full overflow-hidden bg-brand-bg relative">
          <img
            src={seller.bannerUrl || 'https://images.unsplash.com/photo-1493106819501-66d381c466f1?auto=format&fit=crop&w=1200&q=80'}
            alt={seller.businessName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="p-6 sm:p-8 relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex items-start sm:items-end gap-4">
            <img
              src={seller.logoUrl || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=200&q=80'}
              alt={seller.businessName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-xl bg-white shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-poppins">
                  {seller.businessName}
                </h1>
                {seller.isVerified && (
                  <ShieldCheck size={20} className="text-brand-growth shrink-0" />
                )}
              </div>
              <span className="text-[11px] font-bold text-brand-secondary uppercase tracking-wider block">
                {seller.businessType.replace(/_/g, ' ')}
              </span>
              <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-brand-primary" />
                  <span>{seller.city}, {seller.state}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <Star size={13} className="fill-amber-500" />
                  <span>{seller.ratingAverage || 4.9}</span>
                  <span className="text-gray-400 font-normal">({seller.totalOrders || 50}+ fulfilled)</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="px-6 sm:px-8 pb-6 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-brand-border/60 pt-4">
          {seller.description}
        </div>
      </div>

      {/* Vertical Switcher Tabs inside Store */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('PRODUCTS')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'PRODUCTS'
              ? 'bg-brand-primary text-white shadow-sm'
              : 'text-gray-600 hover:bg-brand-bg'
          }`}
        >
          <ShoppingBag size={15} />
          <span>Handcrafted Products ({seller.products?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('SERVICES')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'SERVICES'
              ? 'bg-brand-secondary text-white shadow-sm'
              : 'text-gray-600 hover:bg-brand-bg'
          }`}
        >
          <Calendar size={15} />
          <span>Services & Bookings ({seller.services?.length || 0})</span>
        </button>
      </div>

      {/* Catalog */}
      {activeTab === 'PRODUCTS' ? (
        seller.products?.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400 bg-white rounded-3xl border border-brand-border p-6">
            No products currently listed in this storefront.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {seller.products.map((p: any) => (
              <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
            ))}
          </div>
        )
      ) : seller.services?.length === 0 ? (
        <div className="py-16 text-center text-xs text-gray-400 bg-white rounded-3xl border border-brand-border p-6">
          No bookable services currently offered by this provider.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {seller.services.map((s: any) => (
            <ServiceCard
              key={s.id}
              service={s}
              onBook={(service) => {
                setBookingService(service);
                setIsBookingOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        service={bookingService}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={(bk) => {
          setBookingAlert(`Appointment (#${bk.bookingNumber}) scheduled with ${seller.businessName}!`);
          setTimeout(() => setBookingAlert(null), 6000);
        }}
      />
    </div>
  );
};
