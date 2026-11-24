import React from 'react';
import { Heart, ShoppingCart, Trash2, Store, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';

export const CustomerWishlistModule: React.FC = () => {
  const { addToCart } = useCart();

  const savedItems = [
    {
      id: 'w-1',
      title: 'Handcrafted Terracotta Painted Jar',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=300&q=80',
      artisanName: 'Saraswati Crafts',
      price: 549,
      originalPrice: 699,
      rating: 4.8,
      inStock: true
    },
    {
      id: 'w-2',
      title: 'Macrame Bohemian Wall Hanging',
      image: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=300&q=80',
      artisanName: 'Divya Home Art',
      price: 1299,
      originalPrice: 1599,
      rating: 4.9,
      inStock: true
    },
    {
      id: 'w-3',
      title: 'Traditional Andhra Gongura Pickle (500g)',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80',
      artisanName: 'Ruchi Foods',
      price: 249,
      originalPrice: 299,
      rating: 4.8,
      inStock: true
    }
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Wishlist & Saved Finds</h2>
          <p className="text-xs text-slate-500">Items you loved and saved for later</p>
        </div>
        <span className="text-xs font-bold text-[#D81B60] bg-pink-50 border border-pink-100 px-3 py-1 rounded-full">
          3 Items Saved
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {savedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
              <button 
                className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-600 shadow-md hover:bg-white transition"
                title="Remove from saved"
              >
                <Heart size={16} fill="currentColor" />
              </button>
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-[#D81B60]">
                  <Store size={12} />
                  <span>{item.artisanName}</span>
                </span>
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star size={12} fill="currentColor" />
                  <span>{item.rating}</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</h3>

              <div className="flex items-baseline gap-2">
                <span className="text-base font-black text-slate-900 font-poppins">₹{item.price}</span>
                <span className="text-xs text-slate-400 line-through">₹{item.originalPrice}</span>
              </div>

              <button
                onClick={() => {
                  addToCart(item.id, 1);
                }}
                className="w-full mt-2 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-950 font-bold text-xs rounded-xl transition shadow-2xs flex items-center justify-center gap-1.5"
              >
                <ShoppingCart size={14} />
                <span>Move to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
