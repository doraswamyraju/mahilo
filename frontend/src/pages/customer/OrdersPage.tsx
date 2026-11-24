import React, { useState, useEffect } from 'react';
import { Order } from '../../types/index.js';
import { api } from '../../services/api.js';
import { Package, Truck, CheckCircle, Clock, Store } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res: any = await api.get('/orders/my-orders');
        if (res.success && res.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-brand-dark font-poppins">
          My Product Orders
        </h1>
        <p className="text-xs text-gray-500 font-nunito">
          Track fulfillment status across your artisan and creator orders
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-400 animate-pulse">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-brand-border text-center space-y-3">
          <Package size={36} className="text-gray-300 mx-auto" />
          <h3 className="text-sm font-bold text-gray-700">No orders placed yet</h3>
          <p className="text-xs text-gray-500 font-nunito">Browse handcrafted products made with love by women entrepreneurs.</p>
          <a href="#/" className="inline-block mt-2 px-5 py-2 rounded-full bg-brand-primary text-white text-xs font-bold">
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-brand-border shadow-card space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-brand-border text-xs">
                <div>
                  <span className="font-bold text-brand-dark">{order.orderNumber}</span>
                  <span className="text-gray-400 mx-1.5">•</span>
                  <span className="text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {order.status}
                  </span>
                  <span className="text-sm font-extrabold text-brand-primary">₹{order.netPayable}</span>
                </div>
              </div>

              {/* Sub-orders / Seller Shipments */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Seller Shipments ({order.subOrders?.length || 0})
                </div>

                {order.subOrders?.map((so) => (
                  <div
                    key={so.id}
                    className="p-3.5 rounded-2xl bg-brand-bg/50 border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                        <Store size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">
                          {so.seller?.businessName || 'Mahilo Seller'}
                        </div>
                        <div className="text-[10px] text-gray-500 font-nunito">
                          Sub-order: {so.sellerOrderNumber} • {so.items?.length || 1} items
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {so.trackingNumber && (
                        <div className="text-[11px] text-gray-600 font-mono bg-white px-2.5 py-1 rounded-lg border border-brand-border">
                          {so.courierPartner || 'Courier'}: {so.trackingNumber}
                        </div>
                      )}
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white text-brand-primary border border-brand-border shadow-xs">
                        {so.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
