import React from 'react';
import { 
  X, 
  LogOut, 
  Store, 
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Shield,
  Layers
} from 'lucide-react';
import { RoleType, User } from '../../types/index.js';
import { DASHBOARD_CONFIGS, DashboardNavItem } from './dashboardNavConfig.js';

export interface DashboardSidebarProps {
  role: RoleType;
  activeNavId: string;
  onNavChange: (navId: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isDesktopCollapsed?: boolean;
  user?: User | null;
  onLogout?: () => void;
  onRoleChange?: (role: RoleType) => void;
  onBackToStore?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  role,
  activeNavId,
  onNavChange,
  isMobileOpen,
  onCloseMobile,
  isDesktopCollapsed = false,
  user,
  onLogout,
  onRoleChange,
  onBackToStore = () => { window.location.hash = '#/'; }
}) => {
  const config = DASHBOARD_CONFIGS[role] || DASHBOARD_CONFIGS.CUSTOMER;

  const renderBadge = (badge?: string | number, color?: DashboardNavItem['badgeColor']) => {
    if (badge === undefined || badge === null) return null;

    const colorClasses = {
      magenta: 'bg-pink-50 text-[#D81B60] border-pink-200/80',
      amber: 'bg-amber-50 text-amber-700 border-amber-200/80',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
      gray: 'bg-slate-100 text-slate-600 border-slate-200',
    }[color || 'magenta'];

    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${colorClasses}`}>
        {badge}
      </span>
    );
  };

  const navContent = (
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
      {/* Sleek Minimalist Workspace / Role Header (No awkward dark boxes) */}
      {!isDesktopCollapsed && (
        <div className="mx-1 p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#D81B60] to-[#2D0133] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              {role === 'SELLER' ? <Sparkles size={14} /> : role === 'ADMIN' ? <Shield size={14} /> : <ShoppingBag size={14} />}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                {role === 'SELLER' ? 'Artisan Studio' : role === 'ADMIN' ? 'Admin Governance' : 'Shopper Hub'}
              </p>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                {config.badgeLabel}
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Active</span>
          </span>
        </div>
      )}

      {/* Nav Items List */}
      <nav className="space-y-0.5">
        {config.navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNavId === item.id;

          return (
            <React.Fragment key={item.id}>
              {/* Clean Section Header */}
              {item.sectionHeader && !isDesktopCollapsed && (
                <div className="pt-4 pb-1.5 px-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {item.sectionHeader}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  onNavChange(item.id);
                  if (item.routeHash) {
                    window.location.hash = item.routeHash;
                  }
                  onCloseMobile();
                }}
                title={isDesktopCollapsed ? item.label : undefined}
                className={`w-full group relative flex items-center transition-all duration-150 rounded-xl ${
                  isDesktopCollapsed 
                    ? 'justify-center p-3 my-0.5' 
                    : 'justify-between px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-50/90 to-purple-50/40 text-[#2D0133] font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 font-medium'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#D81B60] rounded-r-full" />
                )}

                <div className="flex items-center gap-3">
                  <div
                    className={`transition-colors ${
                      isActive ? 'text-[#D81B60]' : 'text-slate-400 group-hover:text-slate-800'
                    }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.4 : 1.9} />
                  </div>
                  
                  {!isDesktopCollapsed && (
                    <span className="text-xs tracking-tight text-left">
                      {item.label}
                    </span>
                  )}
                </div>

                {!isDesktopCollapsed && item.badge !== undefined && (
                  <div>{renderBadge(item.badge, item.badgeColor)}</div>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* ============================================================== */}
      {/* 1. Mobile Off-Canvas Drawer (Slide-in with Backdrop) */}
      {/* ============================================================== */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Blur */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Canvas */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-50">
            {/* Header: High-contrast light logo only */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div 
                onClick={() => { onBackToStore(); onCloseMobile(); }}
                className="cursor-pointer"
              >
                <img 
                  src="/logo-light.png" 
                  alt="Mahilo Logo" 
                  className="h-8 w-auto object-contain" 
                />
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile Nav Content */}
            {navContent}

            {/* Footer with Role Switcher & Back to Store */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-2">
              {onRoleChange && (
                <div className="bg-white rounded-xl p-2 border border-slate-200/80 shadow-2xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                    Quick Role Switch
                  </p>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => { onRoleChange('CUSTOMER'); onCloseMobile(); }}
                      className={`py-1 text-[11px] font-bold rounded-lg transition-all ${
                        role === 'CUSTOMER' ? 'bg-[#D81B60] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Shopper
                    </button>
                    <button
                      onClick={() => { onRoleChange('SELLER'); onCloseMobile(); }}
                      className={`py-1 text-[11px] font-bold rounded-lg transition-all ${
                        role === 'SELLER' ? 'bg-[#3D0A47] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Seller
                    </button>
                    <button
                      onClick={() => { onRoleChange('ADMIN'); onCloseMobile(); }}
                      className={`py-1 text-[11px] font-bold rounded-lg transition-all ${
                        role === 'ADMIN' ? 'bg-[#1E0524] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Admin
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  onBackToStore();
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-[#2D0133] bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 shadow-2xs"
              >
                <Store size={14} className="text-[#D81B60]" />
                <span>Return to Marketplace</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. Desktop Fixed/Sticky Sidebar (Expanded or Compact Rail) */}
      {/* ============================================================== */}
      <aside
        className={`hidden lg:flex flex-col h-[calc(100vh-64px)] sticky top-16 shrink-0 border-r border-slate-200/80 bg-white transition-all duration-300 z-20 ${
          isDesktopCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Nav items */}
        {navContent}

        {/* Desktop Bottom Section: Clean User Card */}
        <div className="p-3 border-t border-slate-200/70 bg-slate-50/50">
          {!isDesktopCollapsed ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D81B60] to-[#2D0133] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {(user?.fullName || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {user?.fullName || 'Ananya Sharma'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">
                    {config.badgeLabel}
                  </p>
                </div>
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut size={14} />
                </button>
              )}
            </div>
          ) : (
            /* Collapsed rail icons */
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={onBackToStore}
                title="Return to Marketplace Store"
                className="p-2.5 rounded-xl text-slate-500 hover:text-[#D81B60] hover:bg-slate-100 transition-colors"
              >
                <Store size={18} />
              </button>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
