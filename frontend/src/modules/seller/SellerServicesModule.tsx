import React, { useState } from 'react';
import { Scissors, Plus, Clock, MapPin, Edit2, Trash2 } from 'lucide-react';

export const SellerServicesModule: React.FC = () => {
  const [services, setServices] = useState([
    {
      id: 'srv-1',
      title: 'Bridal & Party Mehendi Art',
      category: 'Mehendi & Henna',
      price: 1499,
      duration: '90 mins',
      serviceType: 'Home Visit & Studio',
      status: 'ACTIVE'
    },
    {
      id: 'srv-2',
      title: 'Custom Blouse & Dress Alteration',
      category: 'Tailoring',
      price: 499,
      duration: '48h Turnaround',
      serviceType: 'Studio / Workshop',
      status: 'ACTIVE'
    },
    {
      id: 'srv-3',
      title: 'Herbal Organic Facial & Cleanup',
      category: 'Beauty & Wellness',
      price: 699,
      duration: '60 mins',
      serviceType: 'Home Visit',
      status: 'ACTIVE'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState(799);
  const [newDuration, setNewDuration] = useState('60 mins');
  const [newCategory, setNewCategory] = useState('Beauty');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    setServices([
      ...services,
      {
        id: `srv-${Date.now()}`,
        title: newTitle,
        category: newCategory,
        price: Number(newPrice),
        duration: newDuration,
        serviceType: 'Home Visit',
        status: 'ACTIVE'
      }
    ]);
    setNewTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Doorstep & Salon Service Catalog</h2>
          <p className="text-xs text-slate-500">Manage your appointment offerings, slot prices, and service areas</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-1.5 bg-[#D81B60] text-white font-bold text-xs rounded-xl hover:bg-[#C2185B] shadow-2xs transition flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold border border-purple-100 text-[10px]">
                  {srv.category}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ● Active
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{srv.title}</h3>

              <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-slate-400" />
                  <span>{srv.duration}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-slate-400" />
                  <span>{srv.serviceType}</span>
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-base font-black text-slate-900 font-poppins">₹{srv.price}</span>
              <button 
                onClick={() => setServices(services.filter(s => s.id !== srv.id))}
                className="text-slate-400 hover:text-rose-600 p-1"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Service Offering</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Service Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Saree Draping & Styling"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  >
                    <option value="Beauty">Beauty</option>
                    <option value="Tailoring">Tailoring</option>
                    <option value="Mehendi">Mehendi</option>
                    <option value="Catering">Food & Catering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D81B60] text-white rounded-xl font-bold hover:bg-[#C2185B]"
                >
                  Publish Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
