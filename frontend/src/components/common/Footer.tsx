import React from 'react';
import { Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-brand-border mt-auto font-nunito">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info with Official Logo */}
          <div className="space-y-3">
            <a href="#/" className="inline-block">
              <img
                src="/logo-horizontal.jpg"
                alt="Mahilo Logo"
                className="h-12 w-auto object-contain"
              />
            </a>
            <p className="text-xs text-gray-500 leading-relaxed">
              India's dedicated digital marketplace designed to empower women entrepreneurs, independent artisans, home-based businesses, and service providers.
            </p>
            <div className="text-[11px] font-bold text-brand-secondary tracking-wider uppercase">
              Shop • Book • Learn • Empower
            </div>
          </div>

          {/* Product Marketplace */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-poppins mb-3">
              Shop Products
            </h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><a href="#/" className="hover:text-brand-primary">Handcrafted Terracotta & Pottery</a></li>
              <li><a href="#/" className="hover:text-brand-primary">Paithani & Handloom Sarees</a></li>
              <li><a href="#/" className="hover:text-brand-primary">Organic Ayurvedic Skincare</a></li>
              <li><a href="#/" className="hover:text-brand-primary">Handmade Jewellery & Accessories</a></li>
              <li><a href="#/" className="hover:text-brand-primary">Home Decor & Artisanal Gifts</a></li>
            </ul>
          </div>

          {/* Service Marketplace */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-poppins mb-3">
              Book Local Services
            </h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><a href="#/" className="hover:text-brand-secondary">Bridal & HD Makeup Packages</a></li>
              <li><a href="#/" className="hover:text-brand-secondary">Herbal Facials & Head Massages</a></li>
              <li><a href="#/" className="hover:text-brand-secondary">Bridal Mehendi & Henna Art</a></li>
              <li><a href="#/" className="hover:text-brand-secondary">Custom Tailoring & Stitching</a></li>
              <li><a href="#/" className="hover:text-brand-secondary">Home Catering & Food Orders</a></li>
            </ul>
          </div>

          {/* Trust & Direct Payouts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-poppins mb-1">
              Safety & Verification
            </h4>
            <div className="flex items-center gap-2 text-xs text-brand-growth font-bold">
              <ShieldCheck size={16} />
              <span>100% Verified Women Sellers</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Escrow-protected payments with Razorpay. Sellers receive payouts upon verified fulfillment.
            </p>
            <div className="pt-2 text-[11px] text-gray-500 space-y-1 font-mono">
              <div>support@mahilo.in</div>
              <div>+91 98765 43200</div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-3">
          <div>
            © {new Date().getFullYear()} MAHILO Marketplace. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <span>Crafted with</span>
            <Heart size={13} className="text-brand-secondary fill-brand-secondary" />
            <span className="font-semibold text-gray-700">for the Women Entrepreneurs of India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
