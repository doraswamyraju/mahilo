import React, { useState } from 'react';
import { useCart } from '../../context/CartContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../services/api.js';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Store, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight,
  AlertCircle 
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, isLoading, updateQuantity, removeItem, refreshCart } = useCart();
  const { user } = useAuth();

  const [name, setName] = useState(user?.fullName || 'Ananya Sharma');
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [addressLine1, setAddressLine1] = useState('Flat 402, Lotus Orchid Apts');
  const [addressLine2, setAddressLine2] = useState('Near Central Garden, Andheri West');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400053');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to proceed with checkout.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res: any = await api.post('/orders/checkout', {
        shippingAddress: {
          name,
          phone,
          addressLine1,
          addressLine2,
          city,
          state,
          pincode,
        },
      });

      if (res.success && res.data) {
        setOrderSuccess(res.data);
        await refreshCart();
      }
    } catch (err: any) {
      setError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    const parentOrder = orderSuccess.parentOrder;
    const subOrders = orderSuccess.sellerOrders || [];

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-fadeIn">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-brand-growth/15 text-brand-growth flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>

          <div>
            <span className="text-xs font-bold text-brand-growth uppercase tracking-wider">
              Payment Confirmed (Razorpay Escrow)
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark font-poppins mt-1">
              Order Placed Successfully!
            </h1>
            <p className="text-xs text-gray-500 font-nunito mt-1">
              Order ID: <span className="font-bold text-gray-800">{parentOrder.orderNumber}</span> • Net Paid: ₹{parentOrder.netPayable}
            </p>
          </div>

          {/* Multi-Vendor Sub-Orders Breakdown */}
          <div className="p-4 bg-brand-bg rounded-2xl border border-brand-border text-left space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-primary">
              <Store size={14} />
              <span>Multi-Vendor Order Routing Breakdown ({subOrders.length} Sellers)</span>
            </div>
            <div className="divide-y divide-brand-border text-xs">
              {subOrders.map((so: any) => (
                <div key={so.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-800">{so.sellerOrderNumber}</div>
                    <div className="text-[11px] text-gray-500">
                      {so.items?.length || 1} items • ₹{so.subTotal} + ₹{so.shippingCharge} shipping
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                    {so.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#/orders"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-dark transition shadow-md"
            >
              Track Order Progression
            </a>
            <a
              href="#/"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-bg text-brand-dark text-xs font-semibold hover:bg-brand-border transition border border-brand-border"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-xl font-bold text-brand-dark font-poppins">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-gray-500 font-nunito max-w-sm mx-auto">
          Discover unique handcrafted creations from women artisans across India and fill your bag!
        </p>
        <div className="pt-2">
          <a
            href="#/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-xs font-bold hover:opacity-95 shadow-md transition"
          >
            <span>Explore Marketplace</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-brand-dark font-poppins">
          Shopping Cart & Checkout
        </h1>
        <p className="text-xs text-gray-500 font-nunito">
          Review items, select shipping destination, and complete multi-seller order
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Grouped by Seller */}
        <div className="lg:col-span-7 space-y-6">
          {cart.sellerGroups.map((group) => (
            <div
              key={group.sellerId}
              className="bg-white rounded-3xl p-5 border border-brand-border shadow-card space-y-4"
            >
              {/* Seller Header */}
              <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                    <Store size={15} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900">{group.businessName}</h3>
                    <p className="text-[10px] text-gray-500">Ships directly from artisan workshop</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-gray-500">Seller Shipping:</span>
                  <span className="text-xs font-bold text-gray-900 ml-1">₹{group.shippingCharge}</span>
                </div>
              </div>

              {/* Items for this Seller */}
              <div className="divide-y divide-brand-border/60">
                {group.items.map((item) => (
                  <div key={item.productId} className="py-3.5 flex items-center gap-3.5">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-brand-bg shrink-0 border border-brand-border"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                      <p className="text-xs font-extrabold text-brand-dark mt-0.5">
                        ₹{item.unitPrice}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 px-2 hover:bg-gray-100 text-gray-600 transition"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 px-2 hover:bg-gray-100 text-gray-600 transition"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition rounded-lg hover:bg-red-50"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Group Sub-total */}
              <div className="pt-2 flex justify-between text-xs font-semibold text-gray-700 bg-brand-bg/50 p-2.5 rounded-xl">
                <span>Items Subtotal:</span>
                <span className="font-extrabold text-brand-dark">₹{group.subTotal}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Shipping & Payment Summary */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handleCheckout}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-brand-border shadow-card space-y-5"
          >
            <h2 className="text-sm font-bold text-brand-dark font-poppins flex items-center gap-1.5">
              <Truck size={16} className="text-brand-primary" />
              <span>Shipping Address Details</span>
            </h2>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-2.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-2.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Address Line 1</label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Flat/House, Apartment or Street"
                  className="w-full px-2.5 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-2.5 py-2 border border-gray-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-2.5 py-2 border border-gray-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">PIN</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-2.5 py-2 border border-gray-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-brand-border space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Items Gross Total:</span>
                <span className="font-semibold text-gray-900">₹{cart.summary.grossTotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Combined Delivery Charges:</span>
                <span className="font-semibold text-gray-900">₹{cart.summary.totalShipping}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-brand-dark pt-2 border-t border-brand-border">
                <span>Total Net Payable:</span>
                <span className="text-brand-primary font-poppins">₹{cart.summary.netPayable}</span>
              </div>
            </div>

            {/* Razorpay Trust Strip */}
            <div className="p-3 bg-brand-bg rounded-xl border border-brand-border flex items-center gap-2 text-[11px] text-gray-600">
              <ShieldCheck size={18} className="text-brand-growth shrink-0" />
              <span>Protected by Razorpay 256-bit SSL encryption. Auto-split seller payouts.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl text-white font-extrabold text-xs sm:text-sm bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-95 shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CreditCard size={16} />
              <span>{isSubmitting ? 'Processing Payment...' : `Pay ₹${cart.summary.netPayable} & Place Order`}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
