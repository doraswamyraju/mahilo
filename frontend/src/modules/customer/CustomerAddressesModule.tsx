import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

export const CustomerAddressesModule: React.FC = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      tag: 'Home',
      fullName: 'Ananya Sharma',
      phone: '+91 98480 12345',
      addressLine: 'Flat 402, Sai Residency, Benz Circle',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      pincode: '520010',
      isDefault: true
    },
    {
      id: 'addr-2',
      tag: 'Office / Studio',
      fullName: 'Ananya Sharma',
      phone: '+91 98480 12345',
      addressLine: 'Plot 45, High-Tech City Road, Madhapur',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      isDefault: false
    }
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTag, setNewTag] = useState('Home');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Vijayawada');
  const [newPincode, setNewPincode] = useState('520010');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress) return;
    const newAddr = {
      id: `addr-${Date.now()}`,
      tag: newTag,
      fullName: 'Ananya Sharma',
      phone: '+91 98480 12345',
      addressLine: newAddress,
      city: newCity,
      state: 'Andhra Pradesh',
      pincode: newPincode,
      isDefault: false
    };
    setAddresses([...addresses, newAddr]);
    setNewAddress('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Saved Addresses</h2>
          <p className="text-xs text-slate-500">Manage shipping addresses and doorstep service locations</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-3.5 py-1.5 bg-[#D81B60] text-white font-bold text-xs rounded-xl hover:bg-[#C2185B] shadow-2xs transition flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>Add New Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-5 rounded-2xl border transition-all ${
              addr.isDefault 
                ? 'bg-white border-[#D81B60]/40 shadow-sm ring-1 ring-[#D81B60]/20' 
                : 'bg-white border-slate-200/80 shadow-2xs hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                {addr.tag}
              </span>
              {addr.isDefault && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#D81B60]">
                  <CheckCircle2 size={13} />
                  <span>Default Address</span>
                </span>
              )}
            </div>

            <p className="text-sm font-bold text-slate-900">{addr.fullName}</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {addr.addressLine}, {addr.city}, {addr.state} - <strong className="text-slate-700">{addr.pincode}</strong>
            </p>
            <p className="text-xs text-slate-600 mt-1 font-medium">Contact: {addr.phone}</p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              {!addr.isDefault ? (
                <button 
                  onClick={() => {
                    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === addr.id })));
                  }}
                  className="font-bold text-[#D81B60] hover:underline"
                >
                  Set as Default
                </button>
              ) : <span className="text-slate-400 text-[11px]">Primary delivery address</span>}
              
              <button 
                onClick={() => setAddresses(addresses.filter(a => a.id !== addr.id))}
                className="text-slate-400 hover:text-rose-600 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Delivery Address</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Address Label</label>
                <select 
                  value={newTag} 
                  onChange={(e) => setNewTag(e.target.value)} 
                  className="w-full p-2 rounded-xl border border-slate-200"
                >
                  <option value="Home">Home</option>
                  <option value="Office / Studio">Office / Studio</option>
                  <option value="Parent's House">Parent's House</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Full Street Address</label>
                <textarea
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="House/Flat No, Apartment, Landmark..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">City</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Pincode</label>
                  <input
                    type="text"
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D81B60] text-white rounded-xl font-bold hover:bg-[#C2185B]"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
