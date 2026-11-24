import React, { useState } from 'react';
import { Product } from '../../types/index.js';
import { useCart } from '../../context/CartContext.js';
import { ShoppingBag, Star, CheckCircle, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      onClick={() => {
        if (onSelect) onSelect(product);
        else window.location.hash = `#/product/${product.slug || product.id}`;
      }}
      className="group bg-white rounded-2xl border border-brand-border hover:border-brand-primary/40 shadow-card hover:shadow-soft transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-brand-bg">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercent && discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-brand-secondary text-white text-[10px] font-bold tracking-wider shadow-sm">
            {discountPercent}% OFF
          </div>
        )}

        {/* Rating Badge */}
        {product.ratingAverage > 0 && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 text-[11px] font-bold shadow-sm">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span>{product.ratingAverage}</span>
            <span className="text-gray-400 font-normal text-[10px]">({product.totalRatings})</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Seller Store Link */}
          {product.seller && (
            <div className="flex items-center gap-1 text-[11px] text-brand-primary font-semibold truncate mb-1">
              <span className="truncate">{product.seller.businessName}</span>
              {product.seller.isVerified && (
                <CheckCircle size={12} className="text-brand-growth shrink-0 fill-brand-growth/20" />
              )}
            </div>
          )}

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="mt-3 pt-2.5 border-t border-brand-border/60 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-extrabold text-brand-dark">
                ₹{product.basePrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-[11px] text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <div className="text-[10px] text-brand-growth font-medium">Free delivery over ₹999</div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stockQuantity <= 0}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              added
                ? 'bg-brand-growth text-white'
                : 'bg-brand-primary text-white hover:bg-brand-primary-dark active:scale-95'
            } disabled:opacity-50`}
          >
            {added ? (
              <>
                <Sparkles size={14} />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
