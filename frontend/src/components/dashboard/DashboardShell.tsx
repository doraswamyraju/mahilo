import React, { useState } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { RoleType, User } from '../../types/index.js';
import { DashboardTopBar } from './DashboardTopBar.js';
import { DashboardSidebar } from './DashboardSidebar.js';
import { DASHBOARD_CONFIGS } from './dashboardNavConfig.js';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface DashboardShellProps {
  role: RoleType;
  onRoleChange?: (role: RoleType) => void;
  activeNavId: string;
  onNavChange: (id: string) => void;
  title?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  user?: User | null;
  onLogout?: () => void;
  onBackToStore?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  role,
  onRoleChange,
  activeNavId,
  onNavChange,
  title,
  subtitle,
  breadcrumbs,
  actions,
  user,
  onLogout,
  onBackToStore = () => { window.location.hash = '#/'; },
  searchQuery = '',
  onSearchChange,
  children
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(() => {
    return localStorage.getItem('mahilo_sidebar_collapsed') === 'true';
  });

  const toggleDesktopCollapse = () => {
    setIsDesktopCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('mahilo_sidebar_collapsed', String(next));
      return next;
    });
  };

  const config = DASHBOARD_CONFIGS[role] || DASHBOARD_CONFIGS.CUSTOMER;
  const pageTitle = title || (role === 'CUSTOMER' ? `Welcome back, ${user?.fullName?.split(' ')[0] || 'Ananya'} 👋` : config.title);
  const pageSubtitle = subtitle || config.subtitle;

  return (
    <div className="min-h-screen bg-[#F8FAFC] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(216,27,96,0.04),rgba(255,255,255,0))] text-slate-900 flex flex-col font-inter antialiased selection:bg-pink-100 selection:text-[#D81B60]">
      {/* 1. Global Standalone Dashboard Topbar */}
      <DashboardTopBar
        role={role}
        onRoleChange={onRoleChange}
        isDesktopCollapsed={isDesktopCollapsed}
        onToggleDesktopCollapse={toggleDesktopCollapse}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onBackToStore={onBackToStore}
        userName={user?.fullName || 'Ananya Sharma'}
        userEmail={user?.phone || user?.email || 'ananya@mahilo.in'}
        onLogout={onLogout}
      />

      {/* 2. Main Workspace (Sidebar + Responsive Content Area) */}
      <div className="flex-1 flex w-full">
        {/* Reusable Sidebar (Desktop Rail/Drawer + Mobile Off-canvas) */}
        <DashboardSidebar
          role={role}
          activeNavId={activeNavId}
          onNavChange={onNavChange}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isDesktopCollapsed={isDesktopCollapsed}
          user={user}
          onLogout={onLogout}
          onRoleChange={onRoleChange}
          onBackToStore={onBackToStore}
        />

        {/* Dynamic Page Canvas */}
        <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
          {/* Streamlined Header Banner */}
          <div className="px-5 sm:px-8 pt-6 pb-5 bg-white/80 backdrop-blur-sm border-b border-slate-200/80 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="max-w-7xl mx-auto">
              {/* Breadcrumb line */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5 overflow-x-auto whitespace-nowrap py-0.5">
                <button 
                  onClick={onBackToStore} 
                  className="flex items-center gap-1 hover:text-[#D81B60] transition-colors font-medium text-slate-500"
                >
                  <Home size={12} />
                  <span>Marketplace</span>
                </button>
                <ChevronRight size={11} className="text-slate-300" />
                <span className="font-semibold text-slate-700">
                  {config.badgeLabel}
                </span>
                {breadcrumbs?.map((bc, idx) => (
                  <React.Fragment key={idx}>
                    <ChevronRight size={11} className="text-slate-300" />
                    {bc.onClick || bc.href ? (
                      <button
                        onClick={bc.onClick || (() => { if (bc.href) window.location.hash = bc.href; })}
                        className="hover:text-[#D81B60] font-medium text-slate-500"
                      >
                        {bc.label}
                      </button>
                    ) : (
                      <span className="font-semibold text-slate-900">{bc.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Title & Action Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-poppins tracking-tight">
                    {pageTitle}
                  </h1>
                  {pageSubtitle && (
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal">
                      {pageSubtitle}
                    </p>
                  )}
                </div>

                {actions && (
                  <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Child Page Content Slot */}
          <div className="flex-1 p-5 sm:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
