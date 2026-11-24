import React from 'react';
import { Service } from '../../types/index.js';
import { Clock, Home, Building2, Star, CheckCircle, Calendar } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onBook: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook }) => {
  const getDeliveryModeBadge = () => {
    switch (service.deliveryMode) {
      case 'AT_CLIENT_LOCATION':
        return {
          label: 'At Home Service',
          icon: <Home size={12} />,
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'AT_SELLER_STUDIO':
        return {
          label: 'At Studio / Salon',
          icon: <Building2 size={12} />,
          classes: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'ONLINE':
        return {
          label: 'Online Consultation',
          icon: <Clock size={12} />,
          classes: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      default:
        return { label: 'Service', icon: null, classes: '' };
    }
  };

  const badge = getDeliveryModeBadge();

  return (
    <div 
      onClick={() => { window.location.hash = `#/service/${service.slug || service.id}`; }}
      className="group bg-white rounded-2xl border border-brand-border hover:border-brand-secondary/40 shadow-card hover:shadow-soft transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Service Portfolio Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-bg">
        <img
          src={service.imageUrl}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Mode Pill */}
        <div className={`absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-sm ${badge.classes}`}>
          {badge.icon}
          <span>{badge.label}</span>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-gray-800 text-[11px] font-bold shadow-sm">
          <Clock size={12} className="text-brand-secondary" />
          <span>{service.durationMinutes} mins</span>
        </div>

        {/* Rating */}
        {service.ratingAverage > 0 && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-gray-800 text-[11px] font-bold shadow-sm">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span>{service.ratingAverage}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Seller details */}
          {service.seller && (
            <div className="flex items-center gap-1.5 text-xs text-brand-secondary font-semibold mb-1">
              <span className="truncate">{service.seller.businessName}</span>
              {service.seller.isVerified && (
                <CheckCircle size={13} className="text-brand-growth shrink-0" />
              )}
            </div>
          )}

          <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-brand-secondary transition-colors">
            {service.name}
          </h3>

          <p className="mt-1 text-xs text-gray-500 line-clamp-2 font-nunito leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Pricing and Book CTA */}
        <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between">
          <div>
            <div className="text-base font-extrabold text-brand-dark">
              ₹{service.price.toLocaleString('en-IN')}
            </div>
            {service.advanceAmount > 0 && (
              <div className="text-[10px] text-gray-500 font-medium">
                ₹{service.advanceAmount} advance deposit
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onBook(service);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-secondary to-brand-primary hover:opacity-95 shadow-sm active:scale-95 flex items-center gap-1.5 transition"
          >
            <Calendar size={13} />
            <span>Book Slot</span>
          </button>
        </div>
      </div>
    </div>
  );
};
