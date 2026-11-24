import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  Search, 
  ChevronDown, 
  Store, 
  Shield, 
  ShoppingBag, 
  User, 
  LogOut, 
  Settings, 
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { RoleType } from '../../types/index.js';
import { DASHBOARD_CONFIGS } from './dashboardNavConfig.js';

export interface DashboardTopBarProps {
  role: RoleType;
  onRoleChange?: (role: RoleType) => void;
  isDesktopCollapsed?: boolean;
  onToggleDesktopCollapse?: () => void;
  onToggleMobileSidebar: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onBackToStore?: () => void;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

export const DashboardTopBar: React.FC<DashboardTopBarProps> = ({
  role,
  onRoleChange,
  isDesktopCollapsed = false,
  onToggleDesktopCollapse,
  onToggleMobileSidebar,
  searchQuery = '',
  onSearchChange,
  onBackToStore = () => { window.location.hash = '#/'; },
  userName = 'Ananya Sharma',
  userEmail = 'ananya@mahilo.in',
  userAvatar,
  onLogout
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const config = DASHBOARD_CONFIGS[role] || DASHBOARD_CONFIGS.CUSTOMER;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left Section: Menu Toggle, High-Contrast Light Brand Logo, Sidebar Collapse Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Menu */}
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            aria-label="Open navigation sidebar"
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-[#D81B60] hover:bg-slate-100 transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* High-Contrast Light Logo (Dark purple/magenta on transparent) */}
          <div 
            onClick={onBackToStore}
            className="flex items-center cursor-pointer select-none py-1 hover:opacity-90 transition-opacity shrink-0"
            title="Return to Marketplace Store"
          >
            <img 
              src="/logo-light.png" 
              alt="Mahilo - Shop Book Empower" 
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </div>

          {/* Desktop Rail Collapse Toggle - Moved to the Right Side of the Logo */}
          {onToggleDesktopCollapse && (
            <button
              type="button"
              onClick={onToggleDesktopCollapse}
              aria-label={isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden lg:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title={isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isDesktopCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
            </button>
          )}
        </div>

        {/* Center: Command-Style Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={
                role === 'SELLER'
                  ? 'Search inventory, orders, customers...'
                  : role === 'ADMIN'
                  ? 'Search verification queue, disputes...'
                  : 'Search your orders, bookings, artisans...'
              }
              className="w-full pl-9 pr-12 py-2 text-xs bg-slate-100/70 hover:bg-slate-100/90 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200/70 focus:border-[#D81B60] focus:ring-2 focus:ring-[#D81B60]/15 transition-all outline-hidden font-medium"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
              ⌘K
            </span>
          </div>
        </div>

        {/* Right Section: Notifications, User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Notifications Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                if (!isNotificationsOpen) setUnreadCount(0);
              }}
              aria-label="View notifications"
              className="relative p-2 rounded-xl text-slate-600 hover:text-[#D81B60] hover:bg-slate-100 transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D81B60] ring-2 ring-white animate-pulse" />
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in duration-150">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                  <span className="font-bold text-xs text-slate-900">Notifications</span>
                  <button 
                    onClick={() => setUnreadCount(0)}
                    className="text-[11px] font-semibold text-[#D81B60] hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="p-4 space-y-3 max-h-72 overflow-y-auto text-xs">
                  <div className="p-3 bg-pink-50/40 rounded-xl border border-pink-100/60">
                    <p className="font-bold text-slate-900">
                      {role === 'SELLER' ? 'New Order #MHL-8942 received' : 'Your order is Out for Delivery'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {role === 'SELLER' ? 'Terracotta Vase Set · ₹1,299' : 'Handloom Cotton Saree arrives today by 5 PM'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <p className="font-bold text-slate-900">Appointment Confirmed</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Bridal Mehendi Session on Saturday at 2:00 PM</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D81B60] to-[#2D0133] text-white font-black text-xs flex items-center justify-center shadow-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                  {userName}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {config.badgeLabel}
                </span>
              </div>
              <ChevronDown size={13} className="text-slate-400 hidden sm:block" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in duration-150">
                <div className="p-4 border-b border-slate-100 bg-slate-50/60">
                  <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-[#D81B60] bg-pink-100 px-2 py-0.5 rounded-full">
                    {config.badgeLabel}
                  </span>
                </div>

                <div className="p-2 space-y-0.5 text-xs font-medium text-slate-700">
                  <button
                    onClick={onBackToStore}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
                  >
                    <Store size={14} className="text-slate-400" />
                    <span>Marketplace Store</span>
                  </button>
                  <button
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
                  >
                    <Settings size={14} className="text-slate-400" />
                    <span>Settings</span>
                  </button>
                </div>

                <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout?.();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors text-xs font-bold text-left"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
