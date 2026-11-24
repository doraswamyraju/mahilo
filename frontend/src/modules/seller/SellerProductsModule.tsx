import React, { useState } from 'react';
import { Package, Plus, Search, Edit2, Trash2, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  status: 'ACTIVE' | 'DRAFT' | 'OUT_OF_STOCK';
}

export const SellerProductsModule: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: 'p-1',
      name: 'Handcrafted Terracotta Diya Set (2 pcs)',
      category: 'Handicrafts',
      price: 599,
      stock: 18,
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=120&q=80',
      status: 'ACTIVE'
    },
    {
      id: 'p-2',
      name: 'Handwoven Pochampally Cotton Dupatta',
      category: 'Fashion',
      price: 1850,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=120&q=80',
      status: 'ACTIVE'
    },
    {
      id: 'p-3',
      name: 'Cold-Pressed Rose & Sandalwood Soap (Pack of 3)',
      category: 'Beauty',
      price: 299,
      stock: 2,
      image: 'https://images.unsplash.com/photo-1607006314605-feed797f1fbc?auto=format&fit=crop&w=120&q=80',
      status: 'ACTIVE'
    }
  ]);

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Handicrafts');
  const [newPrice, setNewPrice] = useState(499);
  const [newStock, setNewStock] = useState(20);
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=200&q=80');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const item: ProductItem = {
      id: `p-${Date.now()}`,
      name: newName,
      category: newCategory,
      price: Number(newPrice),
      stock: Number(newStock),
      image: newImage,
      status: 'ACTIVE'
    };
    setProducts([item, ...products]);
    setNewName('');
    setIsModalOpen(false);
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Product Inventory & Catalog</h2>
          <p className="text-xs text-slate-500">Manage your active digital storefront listings and workshop stock</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pl-8 pr-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200 outline-hidden w-44 sm:w-56"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#D81B60] text-white font-bold text-xs rounded-xl hover:bg-[#C2185B] shadow-2xs transition flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4 sm:px-6">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 sm:px-6 flex items-center gap-3">
                    <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900 line-clamp-1">{prod.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{prod.id}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {prod.category}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-900 font-poppins">₹{prod.price}</td>
                  <td className="p-4">
                    <span className={`font-bold ${prod.stock <= 5 ? 'text-amber-600' : 'text-slate-800'}`}>
                      {prod.stock} units
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Live</span>
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 text-right space-x-2">
                    <button className="text-slate-400 hover:text-slate-700 p-1">
                      <Edit2 size={13} />
                    </button>
                    <button 
                      onClick={() => setProducts(products.filter(p => p.id !== prod.id))}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Handmade Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Product Title</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Handwoven Mangalagiri Cotton Saree"
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="Handicrafts">Handicrafts</option>
                    <option value="Fashion">Fashion & Sarees</option>
                    <option value="Beauty">Beauty & Wellness</option>
                    <option value="Food">Food & Pickles</option>
                    <option value="Home Decor">Home Decor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Image URL</label>
                  <input
                    type="text"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
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
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
