import React, { useState } from 'react';
import { ShoppingBag, Truck, CheckCircle2, Clock, Printer, Filter } from 'lucide-react';

export const SellerOrdersModule: React.FC = () => {
  const [tab, setTab] = useState<'PENDING' | 'DISPATCHED' | 'ALL'>('PENDING');

  const [orders, setOrders] = useState([
    {
      id: 'ORD-5012',
      customer: 'Pooja Reddy',
      phone: '+91 98490 55555',
      city: 'Hyderabad',
      item: 'Terracotta Handpainted Vase (Set of 2)',
      amount: '₹1,299',
      status: 'PENDING_LABEL',
      statusLabel: 'Pending Label',
      date: 'Today, 10:20 AM'
    },
    {
      id: 'ORD-5009',
      customer: 'Sunita Sharma',
      phone: '+91 97000 44444',
      city: 'Bengaluru',
      item: 'Handloom Pochampally Silk Dupatta',
      amount: '₹1,850',
      status: 'READY_PICKUP',
      statusLabel: 'Ready for Pickup',
      date: 'Yesterday'
    },
    {
      id: 'ORD-4982',
      customer: 'Deepa Verma',
      phone: '+91 99888 33333',
      city: 'Chennai',
      item: 'Herbal Rose Water Facial Mist 200ml',
      amount: '₹450',
      status: 'DISPATCHED',
      statusLabel: 'Dispatched',
      date: 'Nov 20, 2026'
    }
  ]);

  const handleMarkDispatched = (id: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'DISPATCHED', statusLabel: 'Dispatched' } : o));
  };

  const filtered = orders.filter(o => {
    if (tab === 'PENDING') return o.status !== 'DISPATCHED';
    if (tab === 'DISPATCHED') return o.status === 'DISPATCHED';
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Order Fulfillment & Shipping</h2>
          <p className="text-xs text-slate-500">Generate shipping slips, pack items, and dispatch via courier partners</p>
        </div>

        <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200/70">
          <button
            onClick={() => setTab('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === 'PENDING' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pending Shipments (2)
          </button>
          <button
            onClick={() => setTab('DISPATCHED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === 'DISPATCHED' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Dispatched (1)
          </button>
          <button
            onClick={() => setTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All (3)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4 sm:px-6">Order ID</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Product Ordered</th>
                <th className="p-4">Payout Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 sm:px-6 font-mono font-bold text-slate-900">{order.id}</td>
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{order.customer}</p>
                    <p className="text-[11px] text-slate-400">{order.city} · {order.phone}</p>
                  </td>
                  <td className="p-4 max-w-[220px] truncate font-medium text-slate-800">{order.item}</td>
                  <td className="p-4 font-bold text-slate-900 font-poppins">{order.amount}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      order.status === 'DISPATCHED' 
                        ? 'bg-purple-50 text-purple-700 border-purple-200' 
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {order.statusLabel}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 text-right space-x-2">
                    {order.status !== 'DISPATCHED' ? (
                      <button
                        onClick={() => handleMarkDispatched(order.id)}
                        className="px-3.5 py-1.5 bg-[#D81B60] text-white font-bold text-xs rounded-xl hover:bg-[#C2185B] shadow-2xs transition-all inline-flex items-center gap-1"
                      >
                        <Truck size={12} />
                        <span>Dispatch</span>
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-bold text-xs inline-flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        <span>In Transit</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
