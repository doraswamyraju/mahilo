import React, { useState, useEffect } from 'react';
import { Product } from '../../types/index.js';
import { useCart } from '../../context/CartContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../services/api.js';
import { 
  ShoppingBag, 
  Star, 
  CheckCircle, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  Store, 
  Sparkles, 
  MessageSquarePlus,
  Plus,
  Minus 
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
  onBack: () => void;
  onVisitStore?: (sellerSlug: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ 
  slug, 
  onBack, 
  onVisitStore 
}) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);

  // Write a review modal / form
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [ratingVal, setRatingVal] = useState(5);
  const [commentVal, setCommentVal] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [pinCodeCheck, setPinCodeCheck] = useState('400053');
  const [pinStatus, setPinStatus] = useState<string | null>('Delivery available in 3-4 business days');

  const loadProduct = async () => {
    try {
      const res: any = await api.get(`/products/${slug}`);
      if (res.success && res.data) {
        setProduct(res.data);
      }
      const revRes: any = await api.get(`/reviews?productId=${res.data.id}`);
      if (revRes.success) {
        setReviews(revRes.data);
      }
    } catch (err) {
      console.error('Failed to load product details', err);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [slug]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-gray-500 animate-pulse">
        Loading product details...
      </div>
    );
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = async (buyNow: boolean = false) => {
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
      if (buyNow) {
        window.location.hash = '#/cart';
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to share a product review.');
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res: any = await api.post('/reviews', {
        productId: product.id,
        rating: ratingVal,
        comment: commentVal,
      });
      if (res.success) {
        setIsReviewOpen(false);
        setCommentVal('');
        loadProduct();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn font-nunito">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline"
      >
        <ArrowLeft size={16} />
        <span>Back to Marketplace</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full rounded-3xl overflow-hidden bg-brand-bg border border-brand-border shadow-card relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discountPercent && discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-brand-secondary text-white text-xs font-extrabold shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Pricing & Purchasing */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            {/* Category & Rating */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-secondary">
                {product.category?.name || 'Handcrafted'}
              </span>
              {product.ratingAverage > 0 && (
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                  <Star size={13} className="text-amber-500 fill-amber-500" />
                  <span>{product.ratingAverage}</span>
                  <span className="text-gray-400">({product.totalRatings} ratings)</span>
                </div>
              )}
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-brand-dark font-poppins leading-tight">
              {product.name}
            </h1>

            {/* Seller profile strip */}
            {product.seller && (
              <div className="pt-1 flex items-center gap-2">
                <span className="text-xs text-gray-500">Crafted by:</span>
                <span className="text-xs font-bold text-brand-primary flex items-center gap-1">
                  <span>{product.seller.businessName}</span>
                  {product.seller.isVerified && (
                    <CheckCircle size={14} className="text-brand-growth shrink-0" />
                  )}
                </span>
                <span className="text-gray-400 text-xs">•</span>
                <span className="text-xs text-gray-500">{product.seller.city}, {product.seller.state}</span>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="p-4 bg-brand-bg rounded-2xl border border-brand-border/80 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-black text-brand-dark font-poppins">
              ₹{product.basePrice.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-sm sm:text-base text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs font-bold text-brand-growth">
              Inclusive of all taxes
            </span>
          </div>

          {/* Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Key Highlights
              </span>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {product.highlights.map((h: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5 pt-2 border-t border-brand-border">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Artisan Story & Details
            </span>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity & Actions */}
          <div className="pt-4 border-t border-brand-border space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 px-3 hover:bg-gray-100 text-gray-600 transition"
                >
                  <Minus size={13} />
                </button>
                <span className="px-4 text-xs font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity || 99, quantity + 1))}
                  className="p-2 px-3 hover:bg-gray-100 text-gray-600 transition"
                >
                  <Plus size={13} />
                </button>
              </div>

              <span className="text-xs text-emerald-600 font-semibold">
                {product.stockQuantity > 0 ? `${product.stockQuantity} units available in workshop` : 'Out of Stock'}
              </span>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleAddToCart(false)}
                disabled={isAdding || product.stockQuantity <= 0}
                className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-white text-brand-primary border-2 border-brand-primary hover:bg-brand-primary/5 transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                <ShoppingBag size={16} />
                <span>{addedSuccess ? 'Added to Bag!' : 'Add to Bag'}</span>
              </button>

              <button
                onClick={() => handleAddToCart(true)}
                disabled={isAdding || product.stockQuantity <= 0}
                className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-brand-primary to-brand-secondary text-white hover:opacity-95 shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles size={16} />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Pin code delivery check */}
          <div className="p-4 bg-white rounded-2xl border border-brand-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
              <Truck size={16} className="text-brand-growth" />
              <span>Delivery Pincode Check</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={pinCodeCheck}
                onChange={(e) => setPinCodeCheck(e.target.value)}
                maxLength={6}
                className="w-32 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setPinStatus('Standard Delivery in 3-4 business days by DTDC Express')}
                className="px-3 py-1.5 bg-brand-bg border border-brand-border rounded-lg text-xs font-bold text-brand-primary"
              >
                Check
              </button>
            </div>
            {pinStatus && (
              <p className="text-[11px] text-emerald-700 font-medium">{pinStatus}</p>
            )}
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-brand-border shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-gray-900 font-poppins">
              Verified Buyer Reviews ({reviews.length})
            </h3>
            <p className="text-xs text-gray-500">Real feedback from genuine customers</p>
          </div>

          <button
            onClick={() => setIsReviewOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-bg text-brand-primary text-xs font-bold border border-brand-primary/30 hover:bg-brand-primary/10 transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <MessageSquarePlus size={15} />
            <span>Write a Review</span>
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">
            Be the first customer to share a review for this handcrafted piece!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-brand-bg/50 border border-brand-border space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">{rev.userName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                      Verified Buyer
                    </span>
                  </div>
                  <div className="flex items-center text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>

                {rev.sellerReply && (
                  <div className="mt-2 p-3 rounded-xl bg-white border border-brand-border text-xs space-y-1">
                    <span className="font-bold text-brand-secondary text-[11px] block">Artisan Store Response:</span>
                    <p className="text-gray-600">{rev.sellerReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-brand-border shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-gray-900 font-poppins">Share Your Verified Experience</h3>
            <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Your Rating</label>
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
                <label className="block font-bold text-gray-700 mb-1">Feedback Comments</label>
                <textarea
                  rows={3}
                  required
                  value={commentVal}
                  onChange={(e) => setCommentVal(e.target.value)}
                  placeholder="Share details regarding packaging, quality of materials, finish..."
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
                  className="px-4 py-2 rounded-xl bg-brand-primary text-white font-bold"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
