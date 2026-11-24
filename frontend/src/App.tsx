import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext.js';
import { Navbar } from './components/common/Navbar.js';
import { Footer } from './components/common/Footer.js';
import { HomePage } from './pages/customer/HomePage.js';
import { ProductDetailPage } from './pages/customer/ProductDetailPage.js';
import { ServiceDetailPage } from './pages/customer/ServiceDetailPage.js';
import { SellerStorePage } from './pages/customer/SellerStorePage.js';
import { CartPage } from './pages/customer/CartPage.js';
import { OrdersPage } from './pages/customer/OrdersPage.js';
import { BookingsPage } from './pages/customer/BookingsPage.js';
import { SellerDashboardPage } from './pages/seller/SellerDashboardPage.js';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';
import { SellerOnboardingModal } from './components/seller/SellerOnboardingModal.js';
import { DashboardDemoHub } from './components/dashboard/index.js';
import { CustomerHubPage } from './modules/customer/index.js';
import { SellerHubPage } from './modules/seller/index.js';
import { AdminHubPage } from './modules/admin/index.js';
import { Product } from './types/index.js';

export function App() {
  const { activeRole } = useAuth();
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All India');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isSellerOnboardOpen, setIsSellerOnboardOpen] = useState(false);

  // Simple hash route listener
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectCategory = (cat: string) => {
    setCategoryFilter(cat);
    if (window.location.hash !== '#/') {
      window.location.hash = '#/';
    }
  };

  const handleSelectProduct = (product: Product) => {
    window.location.hash = `#/product/${product.slug || product.id}`;
  };

  // Dedicated Hub Pages for Each User Role
  if (currentRoute === '#/orders') {
    return <CustomerHubPage initialNavId="orders" />;
  }

  if (currentRoute === '#/bookings') {
    return <CustomerHubPage initialNavId="bookings" />;
  }

  if (currentRoute === '#/account') {
    return <CustomerHubPage initialNavId="overview" />;
  }

  if (currentRoute === '#/seller' || activeRole === 'SELLER') {
    return <SellerHubPage />;
  }

  if (currentRoute === '#/admin' || activeRole === 'ADMIN') {
    return <AdminHubPage />;
  }

  if (currentRoute === '#/dashboard') {
    return <DashboardDemoHub />;
  }

  const renderContent = () => {
    // Dynamic Route Parsers
    if (currentRoute.startsWith('#/product/')) {
      const slug = currentRoute.replace('#/product/', '');
      return (
        <ProductDetailPage
          slug={slug}
          onBack={() => { window.location.hash = '#/'; }}
          onVisitStore={(sellerSlug) => { window.location.hash = `#/store/${sellerSlug}`; }}
        />
      );
    }

    if (currentRoute.startsWith('#/service/')) {
      const slug = currentRoute.replace('#/service/', '');
      return (
        <ServiceDetailPage
          slug={slug}
          onBack={() => { window.location.hash = '#/'; }}
          onVisitStore={(sellerSlug) => { window.location.hash = `#/store/${sellerSlug}`; }}
        />
      );
    }

    if (currentRoute.startsWith('#/store/')) {
      const slug = currentRoute.replace('#/store/', '');
      return (
        <SellerStorePage
          slug={slug}
          onBack={() => { window.location.hash = '#/'; }}
          onSelectProduct={handleSelectProduct}
        />
      );
    }

    if (currentRoute === '#/cart') {
      return <CartPage />;
    }

    if (currentRoute === '#/orders') {
      return <OrdersPage />;
    }

    if (currentRoute === '#/bookings') {
      return <BookingsPage />;
    }

    // Default Home
    return (
      <HomePage 
        searchTerm={searchTerm} 
        selectedCity={selectedCity} 
        categoryFilter={categoryFilter}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-dark">
      <Navbar
        onOpenSellerOnboard={() => setIsSellerOnboardOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        onSelectCategory={handleSelectCategory}
      />

      <main className="flex-1">
        {renderContent()}
      </main>

      <Footer />

      {/* Seller Onboarding Wizard */}
      <SellerOnboardingModal
        isOpen={isSellerOnboardOpen}
        onClose={() => setIsSellerOnboardOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}

export default App;
