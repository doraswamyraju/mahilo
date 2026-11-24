import React, { useState } from 'react';
import { 
  FileText, 
  Image, 
  Plus, 
  Check, 
  X, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  Tag, 
  Eye, 
  Trash2,
  FolderKanban
} from 'lucide-react';

interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  targetUrl: string;
  imageUrl: string;
  isActive: boolean;
  displayOrder: number;
}

interface CategoryTaxonomy {
  id: string;
  name: string;
  slug: string;
  vertical: 'PRODUCT' | 'SERVICE';
  itemCount: number;
  isActive: boolean;
}

const INITIAL_BANNERS: HeroBanner[] = [
  {
    id: 'bnr-1',
    title: 'Handcrafted Heritage by Indian Women Artisans',
    subtitle: 'Shop pure handloom sarees, eco jute bags & terracotta decor',
    badge: 'WOMEN EMPOWERMENT',
    targetUrl: '#/category/cat-p-1',
    imageUrl: '/assets/mockup/handicrafts/handwoven_jute_handbag.png',
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'bnr-2',
    title: 'Doorstep Beauty & Bridal Services',
    subtitle: 'Verified women beauticians & certified henna artists at home',
    badge: 'POPULAR IN VIJAYAWADA',
    targetUrl: '#/services',
    imageUrl: '/assets/mockup/services/salon_services.png',
    isActive: true,
    displayOrder: 2,
  }
];

const INITIAL_CATEGORIES: CategoryTaxonomy[] = [
  { id: 'cat-p-1', name: 'Handicrafts', slug: 'handicrafts', vertical: 'PRODUCT', itemCount: 6, isActive: true },
  { id: 'cat-p-2', name: 'Fashion & Handlooms', slug: 'fashion', vertical: 'PRODUCT', itemCount: 4, isActive: true },
  { id: 'cat-p-3', name: 'Jewellery & Accessories', slug: 'jewellery', vertical: 'PRODUCT', itemCount: 2, isActive: true },
  { id: 'cat-p-4', name: 'Beauty & Skincare', slug: 'beauty', vertical: 'PRODUCT', itemCount: 3, isActive: true },
  { id: 'cat-p-5', name: 'Homemade Food & Pickles', slug: 'food', vertical: 'PRODUCT', itemCount: 5, isActive: true },
  { id: 'cat-p-6', name: 'Home & Living', slug: 'home-living', vertical: 'PRODUCT', itemCount: 4, isActive: true },
  { id: 'cat-s-1', name: 'Salon & Beauty Services', slug: 'beauty-services', vertical: 'SERVICE', itemCount: 4, isActive: true },
  { id: 'cat-s-2', name: 'Bridal Makeup', slug: 'bridal-makeup', vertical: 'SERVICE', itemCount: 2, isActive: true },
  { id: 'cat-s-3', name: 'Tailoring & Stitching', slug: 'tailoring', vertical: 'SERVICE', itemCount: 3, isActive: true },
  { id: 'cat-s-4', name: 'Mehendi (Henna) Art', slug: 'mehendi-art', vertical: 'SERVICE', itemCount: 3, isActive: true },
];

export const AdminCategoriesModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'BANNERS' | 'CATEGORIES'>('BANNERS');
  const [banners, setBanners] = useState<HeroBanner[]>(INITIAL_BANNERS);
  const [categories, setCategories] = useState<CategoryTaxonomy[]>(INITIAL_CATEGORIES);

  // New Category Modal
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatVertical, setNewCatVertical] = useState<'PRODUCT' | 'SERVICE'>('PRODUCT');

  const handleToggleBanner = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  const handleToggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const slug = newCatName.toLowerCase().replace(/\s+/g, '-');
    const newCat: CategoryTaxonomy = {
      id: `cat-${newCatVertical === 'PRODUCT' ? 'p' : 's'}-${Date.now().toString().slice(-4)}`,
      name: newCatName,
      slug,
      vertical: newCatVertical,
      itemCount: 0,
      isActive: true,
    };
    setCategories((prev) => [...prev, newCat]);
    setNewCatName('');
    setIsAddCatOpen(false);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Sub Tabs & Header */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          <button
            onClick={() => setActiveTab('BANNERS')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'BANNERS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Image size={14} className="text-[#D81B60]" />
            <span>Hero Promotional Banners</span>
          </button>
          <button
            onClick={() => setActiveTab('CATEGORIES')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'CATEGORIES' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers size={14} className="text-purple-700" />
            <span>Category Taxonomy ({categories.length})</span>
          </button>
        </div>

        {activeTab === 'CATEGORIES' && (
          <button
            onClick={() => setIsAddCatOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#2D0133] hover:bg-[#3D0A47] text-white text-xs font-bold rounded-xl shadow-2xs transition"
          >
            <Plus size={13} />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {/* 2. Banners View */}
      {activeTab === 'BANNERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
              <div className="h-32 bg-slate-100 relative overflow-hidden">
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/logo-light.png'; }}
                />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-black/70 text-white backdrop-blur-xs">
                  {b.badge}
                </span>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/90 text-slate-800">
                  Order #{b.displayOrder}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{b.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{b.subtitle}</p>
                  <p className="text-[10px] font-mono text-purple-700 mt-2">Target: {b.targetUrl}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                    b.isActive ? 'text-emerald-700' : 'text-slate-400'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${b.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span>{b.isActive ? 'Published on Homepage' : 'Hidden'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleBanner(b.id)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border transition ${
                      b.isActive 
                        ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700' 
                        : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    {b.isActive ? 'Pause Banner' : 'Activate Banner'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Categories View */}
      {activeTab === 'CATEGORIES' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Category Name</th>
                  <th className="py-3 px-3">Vertical</th>
                  <th className="py-3 px-3">URL Slug</th>
                  <th className="py-3 px-3">Live Listings</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Visibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        c.vertical === 'PRODUCT' ? 'bg-pink-50 text-[#D81B60]' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {c.vertical}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-500 text-[11px]">/{c.slug}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-800">{c.itemCount} items</td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span>{c.isActive ? 'Visible' : 'Hidden'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleCategory(c.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                      >
                        {c.isActive ? 'Hide' : 'Show'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Add Category Modal */}
      {isAddCatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900">Add New Category</h3>
            <p className="text-xs text-slate-500 mt-0.5">Define category for products or services</p>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Title</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Terracotta & Clay"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vertical Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCatVertical('PRODUCT')}
                    className={`py-2 px-3 rounded-xl font-bold border transition ${
                      newCatVertical === 'PRODUCT'
                        ? 'bg-pink-50 border-[#D81B60] text-[#D81B60]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Physical Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCatVertical('SERVICE')}
                    className={`py-2 px-3 rounded-xl font-bold border transition ${
                      newCatVertical === 'SERVICE'
                        ? 'bg-purple-50 border-purple-600 text-purple-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Home Service
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddCatOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-1.5 text-xs font-bold bg-[#D81B60] hover:bg-[#C2185B] text-white rounded-lg shadow-2xs"
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
