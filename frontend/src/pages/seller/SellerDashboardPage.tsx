import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../services/api.js';
import { 
  ShoppingBag, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  AlertCircle,
  Landmark,
  X 
} from 'lucide-react';

export const SellerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ORDERS' | 'BOOKINGS' | 'PRODUCTS' | 'SERVICES' | 'LEDGER'>('OVERVIEW');

  // Ledger summary & stats
  const [summary, setSummary] = useState<any | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [settlements, setSettlements] = useState<any[]>([]);

  // Orders & Bookings
  const [sellerOrders, setSellerOrders] = useState<any[]>([]);
  const [sellerBookings, setSellerBookings] = useState<any[]>([]);

  // Products & Services
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [myServices, setMyServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [serviceCategories, setServiceCategories] = useState<any[]>([]);

  // Add Product Modal
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(499);
  const [newProdStock, setNewProdStock] = useState(25);
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=500&q=80');
  const [newProdDesc, setNewProdDesc] = useState('');

  // Add Service Modal
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newSrvName, setNewSrvName] = useState('');
  const [newSrvCategory, setNewSrvCategory] = useState('');
  const [newSrvPrice, setNewSrvPrice] = useState(999);
  const [newSrvDuration, setNewSrvDuration] = useState(60);
  const [newSrvMode, setNewSrvMode] = useState('AT_CLIENT_LOCATION');
  const [newSrvAdvance, setNewSrvAdvance] = useState(200);
  const [newSrvImage, setNewSrvImage] = useState('https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=500&q=80');
  const [newSrvDesc, setNewSrvDesc] = useState('');

  // Order Fulfillment Status Update Modal
  const [updatingOrder, setUpdatingOrder] = useState<any | null>(null);
  const [orderStatusVal, setOrderStatusVal] = useState('SHIPPED');
  const [trackingNumberVal, setTrackingNumberVal] = useState('');
  const [courierPartnerVal, setCourierPartnerVal] = useState('DTDC Express');

  const [isLoading, setIsLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadSellerData = async () => {
    setIsLoading(true);
    try {
      const [sumRes, txRes, stlRes, ordRes, bkRes, prodRes, srvRes, catRes, srvCatRes]: any = await Promise.all([
        api.get('/ledger/summary'),
        api.get('/ledger/transactions'),
        api.get('/ledger/settlements'),
        api.get('/orders/seller/my-orders'),
        api.get('/bookings/seller/my-bookings'),
        api.get(`/products?sellerId=${user?.sellerId}`),
        api.get(`/services?sellerId=${user?.sellerId}`),
        api.get('/products/categories'),
        api.get('/services/categories'),
      ]);

      if (sumRes.success) setSummary(sumRes.data);
      if (txRes.success) setTransactions(txRes.data);
      if (stlRes.success) setSettlements(stlRes.data);
      if (ordRes.success) setSellerOrders(ordRes.data);
      if (bkRes.success) setSellerBookings(bkRes.data);
      if (prodRes.success) setMyProducts(prodRes.data);
      if (srvRes.success) setMyServices(srvRes.data);
      if (catRes.success) {
        setCategories(catRes.data);
        if (catRes.data[0]) setNewProdCategory(catRes.data[0].id);
      }
      if (srvCatRes.success) {
        setServiceCategories(srvCatRes.data);
        if (srvCatRes.data[0]) setNewSrvCategory(srvCatRes.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load seller dashboard', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSellerData();
  }, [user]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await api.post('/products', {
        name: newProdName,
        categoryId: newProdCategory,
        basePrice: Number(newProdPrice),
        stockQuantity: Number(newProdStock),
        imageUrl: newProdImage,
        description: newProdDesc,
        highlights: ['Handmade with organic materials', 'Authentic traditional technique'],
      });
      if (res.success) {
        setIsAddProductOpen(false);
        setActionSuccess('New product listed in your store!');
        loadSellerData();
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await api.post('/services', {
        name: newSrvName,
        categoryId: newSrvCategory,
        price: Number(newSrvPrice),
        durationMinutes: Number(newSrvDuration),
        deliveryMode: newSrvMode,
        advanceAmount: Number(newSrvAdvance),
        imageUrl: newSrvImage,
        description: newSrvDesc,
      });
      if (res.success) {
        setIsAddServiceOpen(false);
        setActionSuccess('New bookable service launched!');
        loadSellerData();
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingOrder) return;
    try {
      const res: any = await api.put(`/orders/seller/${updatingOrder.id}/status`, {
        status: orderStatusVal,
        trackingNumber: trackingNumberVal || undefined,
        courierPartner: courierPartnerVal || undefined,
      });
      if (res.success) {
        setUpdatingOrder(null);
        setActionSuccess(`Sub-order ${updatingOrder.sellerOrderNumber} updated to ${orderStatusVal}`);
        loadSellerData();
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const res: any = await api.put(`/bookings/seller/${bookingId}/status`, { status });
      if (res.success) {
        setActionSuccess(`Appointment status updated to ${status}`);
        loadSellerData();
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRequestPayout = async () => {
    try {
      const res: any = await api.post('/ledger/seller/request-payout');
      if (res.success) {
        setActionSuccess('Payout request submitted to Mahilo finance team.');
        loadSellerData();
        setTimeout(() => setActionSuccess(null), 5000);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Alert toast */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-semibold shadow-sm">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-primary via-brand-primary-dark to-brand-secondary p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
            Seller Business Command Center
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold font-poppins">
            {user?.sellerBusinessName || 'My Entrepreneur Store'}
          </h1>
          <p className="text-xs text-white/90 font-nunito mt-0.5">
            Manage your physical products, client appointments, fulfillment, and bank payouts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="px-4 py-2 rounded-xl bg-white text-brand-primary text-xs font-bold hover:bg-white/95 shadow-sm transition flex items-center gap-1.5"
          >
            <Plus size={15} />
            <span>Add Product</span>
          </button>
          <button
            onClick={() => setIsAddServiceOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-accent text-white text-xs font-bold hover:opacity-95 shadow-sm transition flex items-center gap-1.5"
          >
            <Plus size={15} />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-brand-border text-xs font-bold">
        {[
          { key: 'OVERVIEW', label: 'Store Overview' },
          { key: 'ORDERS', label: `Orders (${sellerOrders.length})` },
          { key: 'BOOKINGS', label: `Appointments (${sellerBookings.length})` },
          { key: 'PRODUCTS', label: `Products (${myProducts.length})` },
          { key: 'SERVICES', label: `Services (${myServices.length})` },
          { key: 'LEDGER', label: 'Financial Ledger & Payouts' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition ${
              activeTab === tab.key
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-gray-600 hover:text-brand-primary hover:bg-brand-bg'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-card">
              <span className="text-[11px] font-semibold text-gray-500 block">Gross Sales</span>
              <div className="text-xl font-extrabold text-brand-dark mt-1 font-poppins">
                ₹{summary?.grossSales || 0}
              </div>
              <span className="text-[10px] text-brand-growth font-bold mt-1 block">Lifetime volume</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-card">
              <span className="text-[11px] font-semibold text-gray-500 block">Available Settlement</span>
              <div className="text-xl font-extrabold text-emerald-600 mt-1 font-poppins">
                ₹{summary?.availableBalance || 0}
              </div>
              <span className="text-[10px] text-gray-400 font-medium mt-1 block">Net of commissions</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-card">
              <span className="text-[11px] font-semibold text-gray-500 block">Active Product Orders</span>
              <div className="text-xl font-extrabold text-brand-primary mt-1 font-poppins">
                {summary?.stats?.activeOrders || 0}
              </div>
              <span className="text-[10px] text-gray-400 font-medium mt-1 block">Requires fulfillment</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-brand-border shadow-card">
              <span className="text-[11px] font-semibold text-gray-500 block">Upcoming Appointments</span>
              <div className="text-xl font-extrabold text-brand-secondary mt-1 font-poppins">
                {summary?.stats?.activeBookings || 0}
              </div>
              <span className="text-[10px] text-gray-400 font-medium mt-1 block">Booked service slots</span>
            </div>
          </div>

          {/* Quick Action Queue */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders Queue */}
            <div className="bg-white rounded-3xl p-5 border border-brand-border shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900 font-poppins flex items-center gap-1.5">
                  <Package size={15} className="text-brand-primary" />
                  <span>Incoming Product Orders</span>
                </h3>
                <button
                  onClick={() => setActiveTab('ORDERS')}
                  className="text-[11px] font-bold text-brand-primary hover:underline"
                >
                  View All
                </button>
              </div>

              {sellerOrders.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">No customer orders yet.</div>
              ) : (
                <div className="divide-y divide-brand-border text-xs space-y-2">
                  {sellerOrders.slice(0, 3).map((ord) => (
                    <div key={ord.id} className="pt-2 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-gray-900">{ord.sellerOrderNumber}</div>
                        <div className="text-[10px] text-gray-500">{ord.items?.length || 1} items • ₹{ord.subTotal}</div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {ord.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Appointments Queue */}
            <div className="bg-white rounded-3xl p-5 border border-brand-border shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900 font-poppins flex items-center gap-1.5">
                  <Calendar size={15} className="text-brand-secondary" />
                  <span>Upcoming Service Appointments</span>
                </h3>
                <button
                  onClick={() => setActiveTab('BOOKINGS')}
                  className="text-[11px] font-bold text-brand-secondary hover:underline"
                >
                  View All
                </button>
              </div>

              {sellerBookings.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">No appointment bookings yet.</div>
              ) : (
                <div className="divide-y divide-brand-border text-xs space-y-2">
                  {sellerBookings.slice(0, 3).map((bk) => (
                    <div key={bk.id} className="pt-2 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-gray-900">{bk.serviceName}</div>
                        <div className="text-[10px] text-gray-500">
                          {bk.bookingDate} at {bk.startTime} • Client: {bk.customerName}
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                        {bk.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS */}
      {activeTab === 'ORDERS' && (
        <div className="bg-white rounded-3xl p-5 border border-brand-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 font-poppins">Customer Order Fulfillment Queue</h2>
            <span className="text-xs text-gray-500">Only orders containing products from your store</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-bg text-gray-600 font-bold border-b border-brand-border">
                <tr>
                  <th className="p-3">Sub-Order #</th>
                  <th className="p-3">Customer & Destination</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Commission Deducted</th>
                  <th className="p-3">Net Payout</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {sellerOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-brand-bg/40">
                    <td className="p-3 font-bold text-gray-900">{ord.sellerOrderNumber}</td>
                    <td className="p-3">
                      <div className="font-semibold text-gray-800">{ord.shippingAddress?.name || 'Customer'}</div>
                      <div className="text-[10px] text-gray-500">{ord.shippingAddress?.city}, {ord.shippingAddress?.pincode}</div>
                    </td>
                    <td className="p-3 font-semibold text-gray-900">₹{ord.subTotal}</td>
                    <td className="p-3 text-red-600 font-medium">-₹{ord.platformFee}</td>
                    <td className="p-3 font-bold text-emerald-600">₹{ord.sellerPayout}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setUpdatingOrder(ord);
                          setOrderStatusVal(ord.status);
                          setTrackingNumberVal(ord.trackingNumber || '');
                        }}
                        className="px-3 py-1 rounded-lg bg-brand-primary text-white text-[11px] font-bold hover:bg-brand-primary-dark transition"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BOOKINGS */}
      {activeTab === 'BOOKINGS' && (
        <div className="bg-white rounded-3xl p-5 border border-brand-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 font-poppins">Client Service Appointments</h2>
            <span className="text-xs text-gray-500">Protected against double-bookings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-bg text-gray-600 font-bold border-b border-brand-border">
                <tr>
                  <th className="p-3">Booking #</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Date & Time Slot</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Fee / Advance</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {sellerBookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-brand-bg/40">
                    <td className="p-3 font-bold text-gray-900">#{bk.bookingNumber}</td>
                    <td className="p-3 font-semibold text-brand-primary">{bk.serviceName}</td>
                    <td className="p-3">
                      <div className="font-bold text-gray-900">{bk.bookingDate}</div>
                      <div className="text-[10px] text-gray-500">{bk.startTime} - {bk.endTime}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-gray-800">{bk.customerName}</div>
                      <div className="text-[10px] text-gray-500">{bk.customerPhone}</div>
                    </td>
                    <td className="p-3 font-bold text-gray-900">
                      ₹{bk.totalPrice}
                      {bk.advancePaid > 0 && (
                        <span className="block text-[10px] text-emerald-600 font-normal">
                          (₹{bk.advancePaid} advance)
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                        {bk.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        {bk.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(bk.id, 'IN_PROGRESS')}
                            className="px-2.5 py-1 rounded bg-blue-600 text-white text-[10px] font-bold"
                          >
                            Start
                          </button>
                        )}
                        {bk.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(bk.id, 'COMPLETED')}
                            className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[10px] font-bold"
                          >
                            Complete
                          </button>
                        )}
                        {bk.status !== 'CANCELLED' && bk.status !== 'COMPLETED' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(bk.id, 'CANCELLED')}
                            className="px-2.5 py-1 rounded bg-red-100 text-red-700 text-[10px] font-bold hover:bg-red-200"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCTS */}
      {activeTab === 'PRODUCTS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 font-poppins">Product Inventory Management</h2>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-brand-primary text-white text-xs font-bold flex items-center gap-1"
            >
              <Plus size={14} />
              <span>List New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myProducts.map((p) => (
              <div key={p.id} className="p-4 bg-white rounded-2xl border border-brand-border flex gap-3.5 shadow-sm">
                <img src={p.imageUrl} alt={p.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">{p.name}</h4>
                  <p className="text-xs font-extrabold text-brand-dark mt-0.5">₹{p.basePrice}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Stock: <b className="text-gray-800">{p.stockQuantity}</b></span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      {p.moderationStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SERVICES */}
      {activeTab === 'SERVICES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 font-poppins">Service Catalog & Slots</h2>
            <button
              onClick={() => setIsAddServiceOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-brand-secondary text-white text-xs font-bold flex items-center gap-1"
            >
              <Plus size={14} />
              <span>Add New Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myServices.map((s) => (
              <div key={s.id} className="p-4 bg-white rounded-2xl border border-brand-border space-y-2 shadow-sm">
                <img src={s.imageUrl} alt={s.name} className="w-full h-28 rounded-xl object-cover" />
                <h4 className="text-xs font-bold text-gray-900 truncate">{s.name}</h4>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-brand-dark">₹{s.price}</span>
                  <span className="text-gray-500">{s.durationMinutes} mins</span>
                </div>
                <div className="text-[10px] text-gray-500 font-semibold">{s.deliveryMode}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: FINANCIAL LEDGER */}
      {activeTab === 'LEDGER' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase text-gray-500">Settlement Balance</span>
              <div className="text-3xl font-extrabold text-emerald-700 font-poppins mt-1">
                ₹{summary?.availableBalance || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Disbursements transferred directly to registered bank account via NEFT/IMPS
              </p>
            </div>

            <button
              onClick={handleRequestPayout}
              disabled={(summary?.availableBalance || 0) < 100}
              className="px-6 py-3 rounded-2xl bg-brand-growth text-white text-xs font-extrabold shadow-md hover:opacity-95 transition disabled:opacity-40 flex items-center gap-2"
            >
              <Landmark size={16} />
              <span>Request Direct Bank Payout</span>
            </button>
          </div>

          {/* Double-entry Ledger Table */}
          <div className="bg-white rounded-3xl p-5 border border-brand-border shadow-card space-y-4">
            <h3 className="text-xs font-bold text-gray-900 font-poppins">
              Double-Entry Transaction Ledger
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-bg text-gray-600 font-bold border-b border-brand-border">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Type</th>
                    <th className="p-3 text-right">Debit / Credit</th>
                    <th className="p-3 text-right">Running Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-brand-bg/40 font-mono">
                      <td className="p-3 text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="p-3 font-sans font-semibold text-gray-800">{tx.description}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.type === 'SALE_CREDIT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tx.type === 'COMMISSION_DEBIT'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className={`p-3 text-right font-bold ${tx.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {tx.amount >= 0 ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                      </td>
                      <td className="p-3 text-right font-bold text-gray-900">₹{tx.balanceAfter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-brand-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-brand-border">
              <h3 className="text-sm font-bold text-gray-900">List New Artisan Product</h3>
              <button onClick={() => setIsAddProductOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Handmade Terracotta Diya Set"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Category</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Details about craftsmanship, materials, dimensions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary-dark transition"
              >
                Publish to Marketplace
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {isAddServiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-brand-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-brand-border">
              <h3 className="text-sm font-bold text-gray-900">Publish Bookable Service</h3>
              <button onClick={() => setIsAddServiceOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={newSrvName}
                  onChange={(e) => setNewSrvName(e.target.value)}
                  placeholder="e.g. Bridal Mehendi Full Arms"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Service Category</label>
                <select
                  value={newSrvCategory}
                  onChange={(e) => setNewSrvCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white"
                >
                  {serviceCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Total Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={newSrvPrice}
                    onChange={(e) => setNewSrvPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    required
                    value={newSrvDuration}
                    onChange={(e) => setNewSrvDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Delivery Mode</label>
                <select
                  value={newSrvMode}
                  onChange={(e) => setNewSrvMode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white"
                >
                  <option value="AT_CLIENT_LOCATION">At Client Home</option>
                  <option value="AT_SELLER_STUDIO">At Studio / Salon</option>
                  <option value="ONLINE">Virtual Consultation</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Portfolio Image URL</label>
                <input
                  type="url"
                  required
                  value={newSrvImage}
                  onChange={(e) => setNewSrvImage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newSrvDesc}
                  onChange={(e) => setNewSrvDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brand-secondary text-white font-bold hover:opacity-95 transition"
              >
                Create Service & Availability Slots
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Status Update Modal */}
      {updatingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 border border-brand-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-brand-border">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Update Order Status</h3>
                <p className="text-[10px] text-gray-500">{updatingOrder.sellerOrderNumber}</p>
              </div>
              <button onClick={() => setUpdatingOrder(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateOrderStatus} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Fulfillment Status</label>
                <select
                  value={orderStatusVal}
                  onChange={(e) => setOrderStatusVal(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white"
                >
                  <option value="ACCEPTED">ACCEPTED (Order confirmed)</option>
                  <option value="PROCESSING">PROCESSING (Crafting/Packaging)</option>
                  <option value="READY_TO_SHIP">READY_TO_SHIP</option>
                  <option value="SHIPPED">SHIPPED (With courier)</option>
                  <option value="DELIVERED">DELIVERED (Fulfilled)</option>
                </select>
              </div>

              {orderStatusVal === 'SHIPPED' && (
                <>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Courier Partner</label>
                    <input
                      type="text"
                      value={courierPartnerVal}
                      onChange={(e) => setCourierPartnerVal(e.target.value)}
                      placeholder="e.g. DTDC, Delhivery, BlueDart"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Tracking Number / AWB</label>
                    <input
                      type="text"
                      value={trackingNumberVal}
                      onChange={(e) => setTrackingNumberVal(e.target.value)}
                      placeholder="e.g. DTDC-IND-991823"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary-dark transition"
              >
                Save & Notify Buyer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
