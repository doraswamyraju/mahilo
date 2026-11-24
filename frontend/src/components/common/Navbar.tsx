import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useCart } from '../../context/CartContext.js';
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  User as UserIcon, 
  Store, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Package, 
  ArrowLeftRight,
  ChevronDown,
  ShoppingCart,
  LayoutDashboard
} from 'lucide-react';
import { AuthModal } from './AuthModal.js';

interface NavbarProps {
  onOpenSellerOnboard: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedCity: string;
  onCityChange: (val: string) => void;
  onSelectCategory?: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSellerOnboard,
  searchTerm,
  onSearchChange,
  selectedCity,
  onCityChange,
  onSelectCategory,
}) => {
  const { user, activeRole, switchRole, logout, isSellerApproved, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState('All Categories');

  const cities = ['Vijayawada', 'Hyderabad', 'Visakhapatnam', 'Mumbai', 'Bengaluru', 'Chennai', 'All India'];

  const subNavLinks = [
    { label: "Today's Deals", value: 'deals' },
    { label: 'Handicrafts', value: 'cat-p-1' },
    { label: 'Fashion', value: 'cat-p-2' },
    { label: 'Beauty & Wellness', value: 'cat-p-4' },
    { label: 'Home & Living', value: 'cat-p-6' },
    { label: 'Food', value: 'cat-p-5' },
    { label: 'Services', value: 'services-all' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 shadow-md">
        {/* Main Header Bar (Amazon / Marketplace Style Deep Purple) */}
        <div className="bg-[#2D0133] text-white px-3 sm:px-6 py-2.5">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3 sm:gap-5">
            
            {/* Logo */}
            <a href="#/" className="shrink-0 flex items-center mr-1">
              <img
                src="/logo-navbar-v2.png"
                alt="Mahilo Logo"
                className="h-8 sm:h-9 w-auto object-contain hover:opacity-95 transition"
              />
            </a>

            {/* Deliver to Location Selector */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:outline hover:outline-1 hover:outline-white/40 cursor-pointer transition text-left">
              <MapPin size={17} className="text-white shrink-0 -mt-2" />
              <div className="leading-tight">
                <div className="text-[11px] text-gray-300 font-medium">Deliver to</div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{selectedCity}</span>
                  <ChevronDown size={12} className="text-gray-300" />
                </div>
              </div>
            </div>

            {/* High-Visibility Search Bar */}
            <div className="flex-1 max-w-3xl mx-1 sm:mx-3">
              <div className="flex items-center rounded-lg overflow-hidden bg-white shadow-inner">
                {/* Category select dropdown */}
                <div className="hidden sm:flex items-center bg-[#F3F4F6] border-r border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition shrink-0">
                  <select
                    value={searchCategory}
                    onChange={(e) => {
                      setSearchCategory(e.target.value);
                      if (onSelectCategory && e.target.value !== 'All Categories') {
                        onSelectCategory(e.target.value);
                      }
                    }}
                    className="bg-transparent focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="All Categories">All Categories</option>
                    <option value="cat-p-1">Handicrafts</option>
                    <option value="cat-p-2">Fashion</option>
                    <option value="cat-p-4">Beauty & Wellness</option>
                    <option value="cat-p-6">Home & Living</option>
                    <option value="cat-p-5">Food</option>
                    <option value="services-all">Services</option>
                  </select>
                </div>

                {/* Input */}
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search products, services and women sellers"
                  className="w-full px-3 py-2 text-xs font-semibold text-gray-950 placeholder:text-gray-600 focus:outline-none bg-white"
                />

                {/* Orange Search Button */}
                <button
                  type="button"
                  className="bg-[#FF9900] hover:bg-[#E68A00] text-gray-900 px-4 py-2 flex items-center justify-center transition shrink-0"
                >
                  <Search size={17} className="stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3 sm:gap-5 shrink-0 text-xs">
              {/* Language Selector */}
              <div className="hidden xl:flex items-center gap-1 font-bold px-2 py-1 rounded hover:outline hover:outline-1 hover:outline-white/40 cursor-pointer">
                <span className="text-sm">🇮🇳</span>
                <span>EN</span>
                <ChevronDown size={11} className="text-gray-300" />
              </div>

              {/* Mode Switcher for Approved Sellers / Admins */}
              {user && (isSellerApproved || isAdmin) && (
                <div className="hidden sm:flex items-center gap-1.5">
                  {isSellerApproved && (
                    <button
                      onClick={() => switchRole(activeRole === 'SELLER' ? 'CUSTOMER' : 'SELLER')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition border ${
                        activeRole === 'SELLER'
                          ? 'bg-[#E91E63] text-white border-[#E91E63]'
                          : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                      }`}
                    >
                      <ArrowLeftRight size={12} />
                      <span>{activeRole === 'SELLER' ? 'Seller Mode' : 'Switch to Seller'}</span>
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => switchRole(activeRole === 'ADMIN' ? 'CUSTOMER' : 'ADMIN')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition border ${
                        activeRole === 'ADMIN'
                          ? 'bg-amber-400 text-gray-900 border-amber-400'
                          : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                      }`}
                    >
                      <ShieldCheck size={12} />
                      <span>Admin</span>
                    </button>
                  )}
                </div>
              )}

              {/* Account & Lists */}
              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="leading-tight text-left px-2 py-1 rounded hover:outline hover:outline-1 hover:outline-white/40"
                  >
                    <div className="text-[11px] text-gray-300">Hello, {user.fullName.split(' ')[0]}</div>
                    <div className="font-bold flex items-center gap-0.5">
                      <span>Account & Lists</span>
                      <ChevronDown size={12} className="text-gray-300" />
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="leading-tight text-left px-2 py-1 rounded hover:outline hover:outline-1 hover:outline-white/40"
                  >
                    <div className="text-[11px] text-gray-300">Hello, Sign in</div>
                    <div className="font-bold flex items-center gap-0.5">
                      <span>Account & Lists</span>
                      <ChevronDown size={12} className="text-gray-300" />
                    </div>
                  </button>
                )}

                {/* Profile Menu Dropdown */}
                {isProfileMenuOpen && user && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 text-gray-800 animate-fadeIn">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <div className="font-bold text-xs text-gray-900">{user.fullName}</div>
                      <div className="text-[11px] text-gray-500 font-mono truncate">{user.phone || user.email}</div>
                    </div>
                    <div className="py-1">
                      <a href="#/dashboard" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 hover:bg-pink-50 text-xs font-bold text-brand-primary">
                        Dashboard Hub (All Users)
                      </a>
                      <a href="#/orders" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 text-xs">
                        My Orders
                      </a>
                      <a href="#/bookings" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 text-xs">
                        My Service Bookings
                      </a>
                    </div>
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 font-semibold hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Orders */}
              <a
                href="#/orders"
                className="hidden sm:flex flex-col leading-tight px-2 py-1 rounded hover:outline hover:outline-1 hover:outline-white/40"
              >
                <div className="text-[11px] text-gray-300">Returns</div>
                <div className="font-bold flex items-center gap-1">
                  <Package size={13} className="text-gray-300" />
                  <span>& Orders</span>
                </div>
              </a>

              {/* Shopping Cart with Badge */}
              <a
                href="#/cart"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white/40 font-bold"
              >
                <div className="relative flex items-center">
                  <ShoppingCart size={24} className="text-white" />
                  <span className="absolute -top-1.5 -right-1 bg-[#FFA41C] text-gray-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-[#2D0133]">
                    {itemCount || 3}
                  </span>
                </div>
                <span className="hidden sm:inline text-xs font-extrabold ml-1">Cart</span>
              </a>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1 text-white"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Ribbon (White with Gray/Purple accents) */}
        <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-2 text-xs">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            
            {/* Left Nav links */}
            <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none font-semibold text-gray-700">
              <button
                onClick={() => onSelectCategory && onSelectCategory('all')}
                className="flex items-center gap-1.5 text-gray-900 font-bold hover:text-brand-primary whitespace-nowrap"
              >
                <Menu size={15} />
                <span>All Categories</span>
              </button>

              {subNavLinks.map((link) => (
                <button
                  key={link.value}
                  onClick={() => onSelectCategory && onSelectCategory(link.value)}
                  className="hover:text-[#4E0C54] whitespace-nowrap transition"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right: Sell on Mahilo CTA & Dashboard Link */}
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-300 shrink-0">
              <a
                href="#/dashboard"
                className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-brand-primary transition"
              >
                <LayoutDashboard size={14} />
                <span>Dashboard Hub</span>
              </a>
              <button
                onClick={onOpenSellerOnboard}
                className="flex items-center gap-1.5 text-xs font-bold text-[#C2185B] hover:text-[#9C27B0] transition"
              >
                <Store size={15} />
                <span>Sell on Mahilo</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};
