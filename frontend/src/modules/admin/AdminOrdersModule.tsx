import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  MapPin, 
  User, 
  Phone, 
  Copy, 
  Check, 
  Package, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string;
}

interface SellerSubOrder {
  id: string;
  sellerName: string;
  sellerCity: string;
  status: 'PROCESSING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  subTotal: number;
  courierPartner: string;
  trackingNumber: string;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  grossAmount: number;
  netPayable: number;
  status: 'PAID' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
  subOrders: SellerSubOrder[];
}

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'ord-mhl-101',
    orderNumber: 'MHL-20261124-9281',
    customerName: 'Ananya Sharma',
    customerPhone: '9876543210',
    customerEmail: 'ananya@example.com',
    address: 'Flat 402, Sri Sai Nilayam, Benz Circle',
    city: 'Vijayawada',
    grossAmount: 599,
    netPayable: 639,
    status: 'DISPATCHED',
    paymentMethod: 'UPI / Razorpay',
    createdAt: 'Today, 10:30 AM',
    items: [
      {
        id: 'oi-101',
        name: 'Handcrafted Terracotta Diya Set (2 pcs)',
        quantity: 1,
        unitPrice: 599,
        totalPrice: 599,
        imageUrl: '/assets/mockup/handicrafts/terracotta_painted_jar.png'
      }
    ],
    subOrders: [
      {
        id: 'so-101',
        sellerName: 'Saraswati Crafts',
        sellerCity: 'Vijayawada',
        status: 'DISPATCHED',
        subTotal: 599,
        courierPartner: 'Delhivery Surface',
        trackingNumber: 'DLHVY-9821472'
      }
    ]
  },
  {
    id: 'ord-mhl-102',
    orderNumber: 'MHL-20261123-9140',
    customerName: 'Ananya Sharma',
    customerPhone: '9876543210',
    customerEmail: 'ananya@example.com',
    address: 'Flat 402, Sri Sai Nilayam, Benz Circle',
    city: 'Vijayawada',
    grossAmount: 2499,
    netPayable: 2499,
    status: 'PROCESSING',
    paymentMethod: 'Net Banking',
    createdAt: 'Yesterday, 02:15 PM',
    items: [
      {
        id: 'oi-102',
        name: 'Pure Mangalagiri Handloom Cotton Saree',
        quantity: 1,
        unitPrice: 2499,
        totalPrice: 2499,
        imageUrl: '/assets/mockup/fashion/mangalagiri_cotton_saree.png'
      }
    ],
    subOrders: [
      {
        id: 'so-102',
        sellerName: 'Anitha Fashions',
        sellerCity: 'Guntur',
        status: 'PROCESSING',
        subTotal: 2499,
        courierPartner: 'BlueDart Express',
        trackingNumber: 'BLDT-4019283'
      }
    ]
  },
  {
    id: 'ord-mhl-103',
    orderNumber: 'MHL-20261120-8802',
    customerName: 'Kavitha Ramaswamy',
    customerPhone: '9811223344',
    customerEmail: 'kavitha@example.com',
    address: 'Plot 12, Jubilee Hills Road 36',
    city: 'Hyderabad',
    grossAmount: 1299,
    netPayable: 1339,
    status: 'DELIVERED',
    paymentMethod: 'Credit Card',
    createdAt: 'Nov 20, 2026',
    items: [
      {
        id: 'oi-103',
        name: 'Macrame Wall Hanging',
        quantity: 1,
        unitPrice: 1299,
        totalPrice: 1299,
        imageUrl: '/assets/mockup/handicrafts/macrame_wall_hanging.png'
      }
    ],
    subOrders: [
      {
        id: 'so-103',
        sellerName: 'Saraswati Crafts',
        sellerCity: 'Vijayawada',
        status: 'DELIVERED',
        subTotal: 1299,
        courierPartner: 'Delhivery Surface',
        trackingNumber: 'DLHVY-8802914'
      }
    ]
  }
];

export const AdminOrdersModule: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleUpdateStatus = (orderId: string, newStatus: AdminOrder['status']) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: newStatus,
              subOrders: ord.subOrders.map((so) => ({
                ...so,
                status: newStatus as any
              }))
            }
          : ord
      )
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (statusFilter !== 'ALL' && ord.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        ord.orderNumber.toLowerCase().includes(q) ||
        ord.customerName.toLowerCase().includes(q) ||
        ord.city.toLowerCase().includes(q) ||
        ord.customerPhone.includes(q)
      );
    }
    return true;
  });

  const totalGMV = orders.reduce((sum, o) => sum + o.netPayable, 0);
  const activeShipments = orders.filter((o) => o.status === 'PROCESSING' || o.status === 'DISPATCHED').length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Header Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Orders Value</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">₹{totalGMV.toLocaleString('en-IN')}</span>
            <span className="text-[11px] font-semibold text-emerald-600">100% captured</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Shipments</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">{activeShipments}</span>
            <span className="text-[11px] font-medium text-amber-600">in transit or packing</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivered Successfully</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-800">{deliveredCount}</span>
            <span className="text-[11px] font-semibold text-emerald-600">0% return rate</span>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          {(['ALL', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                statusFilter === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Orders' : st}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order #, customer or city..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2D0133]/10 focus:border-[#2D0133]"
          />
        </div>
      </div>

      {/* 3. Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Items & Artisans</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-3">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <ShoppingBag size={32} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-semibold text-slate-600">No customer orders found</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50 transition">
                    {/* Order ID & Date */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-900">{ord.orderNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(ord.id, ord.orderNumber)}
                          className="p-1 text-slate-400 hover:text-slate-600 rounded transition"
                          title="Copy Order ID"
                        >
                          {copiedId === ord.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{ord.createdAt}</div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">{ord.customerName}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} />
                        <span>{ord.city}</span>
                      </div>
                    </td>

                    {/* Items & Artisans */}
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-800 truncate max-w-[200px]">
                        {ord.items[0]?.name}
                        {ord.items.length > 1 && ` + ${ord.items.length - 1} more`}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Artisan: {ord.subOrders[0]?.sellerName}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-3">
                      <div className="font-black text-slate-900">₹{ord.netPayable.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{ord.paymentMethod}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      {ord.status === 'PROCESSING' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock size={11} className="text-amber-600" />
                          <span>Processing</span>
                        </span>
                      )}
                      {ord.status === 'DISPATCHED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          <Truck size={11} className="text-purple-600" />
                          <span>In Transit</span>
                        </span>
                      )}
                      {ord.status === 'DELIVERED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={11} className="text-emerald-600" />
                          <span>Delivered</span>
                        </span>
                      )}
                      {ord.status === 'CANCELLED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle size={11} className="text-rose-600" />
                          <span>Cancelled</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(ord)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-lg transition"
                      >
                        <span>Details</span>
                        <ArrowUpRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Order Detail Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order Oversight</span>
                <h3 className="text-base font-black text-slate-900 font-mono mt-0.5">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Customer & Shipping info */}
            <div className="py-4 space-y-3 border-b border-slate-100 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#D81B60] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">{selectedOrder.customerName} • {selectedOrder.customerPhone}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{selectedOrder.address}, {selectedOrder.city}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="py-4 space-y-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Items in Order</span>
              {selectedOrder.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={it.imageUrl || '/logo-light.png'}
                      alt={it.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{it.name}</p>
                      <p className="text-[11px] text-slate-400">Qty: {it.quantity} × ₹{it.unitPrice}</p>
                    </div>
                  </div>
                  <div className="font-black text-slate-900">₹{it.totalPrice}</div>
                </div>
              ))}
            </div>

            {/* Sub-order & Courier info */}
            <div className="py-4 space-y-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Artisan Fulfillment</span>
              {selectedOrder.subOrders.map((so) => (
                <div key={so.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{so.sellerName}</span>
                    <span className="text-[11px] text-slate-600">₹{so.subTotal}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Carrier: {so.courierPartner}</span>
                    <span className="font-mono text-purple-700 font-semibold">{so.trackingNumber}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Admin Override Actions */}
            <div className="pt-4 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Platform Admin Action
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'DISPATCHED')}
                  className="py-2 px-3 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl border border-purple-200 transition"
                >
                  Mark as Dispatched
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'DELIVERED')}
                  className="py-2 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition"
                >
                  Mark as Delivered
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'CANCELLED')}
                  className="col-span-2 py-2 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl border border-rose-200 transition"
                >
                  Cancel Order & Trigger Buyer Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
