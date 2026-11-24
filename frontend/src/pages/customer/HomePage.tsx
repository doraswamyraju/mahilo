import React, { useState, useEffect } from 'react';
import { Product, Service, SellerProfile } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useCart } from '../../context/CartContext.js';
import { BookingModal } from '../../components/marketplace/BookingModal.js';
import { 
  ShoppingBag, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  ShoppingCart, 
  ArrowRight
} from 'lucide-react';

interface HomePageProps {
  searchTerm: string;
  selectedCity: string;
  categoryFilter?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  searchTerm: _searchTerm, 
  selectedCity = 'Vijayawada', 
  categoryFilter: _categoryFilter = 'all' 
}) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [addingId, setAddingId] = useState<string | null>(null);

  // Booking modal state
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingAlert, setBookingAlert] = useState<string | null>(null);

  useEffect(() => {
    const loadMarketplaceData = async () => {
      try {
        const [prodRes, srvRes, sellersRes]: any = await Promise.all([
          api.get('/products'),
          api.get('/services'),
          api.get('/sellers'),
        ]);

        if (prodRes?.success && Array.isArray(prodRes.data)) setProducts(prodRes.data);
        if (srvRes?.success && Array.isArray(srvRes.data)) setServices(srvRes.data);
        if (sellersRes?.success && Array.isArray(sellersRes.data)) setSellers(sellersRes.data);
      } catch (err) {
        console.error('Failed to load marketplace data', err);
      }
    };

    loadMarketplaceData();
  }, []);

  const handleAddToCart = async (product: any) => {
    setAddingId(product.id);
    try {
      await addToCart(product.id, 1);
    } finally {
      setTimeout(() => setAddingId(null), 1200);
    }
  };

  const handleOpenBooking = (service: any) => {
    setBookingService(service);
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = (booking: any) => {
    setBookingAlert(`Your appointment (#${booking.bookingNumber}) is confirmed for ${booking.bookingDate} at ${booking.startTime}!`);
    setTimeout(() => setBookingAlert(null), 6000);
  };

  // 1. Top Category Tiles (8 rounded cards with local cutout imagery)
  const categoryTiles = [
    { id: 'cat-p-1', name: 'Handicrafts', img: '/assets/mockup/categories/handicrafts.png' },
    { id: 'cat-p-2', name: 'Fashion', img: '/assets/mockup/categories/fashion.png' },
    { id: 'cat-p-3', name: 'Jewellery', img: '/assets/mockup/categories/jewellery.png' },
    { id: 'cat-p-4', name: 'Beauty', img: '/assets/mockup/categories/beauty.png' },
    { id: 'cat-p-5', name: 'Food', img: '/assets/mockup/categories/food.png' },
    { id: 'cat-p-6', name: 'Home Decor', img: '/assets/mockup/categories/home_decor.png' },
    { id: 'cat-s-3', name: 'Tailoring', img: '/assets/mockup/categories/tailoring.png' },
    { id: 'cat-p-8', name: 'Gifts', img: '/assets/mockup/categories/gifts.png' },
  ];

  // 2. Fallback / Mock Data matching mockup exactly
  const defaultHandicrafts = [
    {
      id: 'prod-h-1',
      name: 'Handwoven Jute Handbag',
      basePrice: 799,
      originalPrice: 999,
      discount: '20% off',
      ratingAverage: 4.8,
      totalRatings: 126,
      imageUrl: '/assets/mockup/handicrafts/handwoven_jute_handbag.png',
      slug: 'handwoven-jute-handbag'
    },
    {
      id: 'prod-h-2',
      name: 'Terracotta Painted Jar',
      basePrice: 549,
      originalPrice: 699,
      discount: '21% off',
      ratingAverage: 4.7,
      totalRatings: 89,
      imageUrl: '/assets/mockup/handicrafts/terracotta_painted_jar.png',
      slug: 'terracotta-painted-jar'
    },
    {
      id: 'prod-h-3',
      name: 'Macrame Wall Hanging',
      basePrice: 1299,
      originalPrice: 1599,
      discount: '19% off',
      ratingAverage: 4.9,
      totalRatings: 56,
      imageUrl: '/assets/mockup/handicrafts/macrame_wall_hanging.png',
      slug: 'macrame-wall-hanging'
    },
    {
      id: 'prod-h-4',
      name: 'Brass Diya Set (2 pcs)',
      basePrice: 599,
      originalPrice: 749,
      discount: '20% off',
      ratingAverage: 4.8,
      totalRatings: 102,
      imageUrl: '/assets/mockup/handicrafts/brass_diya_set.png',
      slug: 'brass-diya-set'
    },
    {
      id: 'prod-h-5',
      name: 'Handpainted Coasters (Set of 6)',
      basePrice: 349,
      originalPrice: 449,
      discount: '22% off',
      ratingAverage: 4.6,
      totalRatings: 73,
      imageUrl: '/assets/mockup/handicrafts/handpainted_coasters.png',
      slug: 'handpainted-coasters'
    },
    {
      id: 'prod-h-6',
      name: 'Wooden Jewellery Box',
      basePrice: 899,
      originalPrice: 1199,
      discount: '25% off',
      ratingAverage: 4.8,
      totalRatings: 41,
      imageUrl: '/assets/mockup/handicrafts/wooden_jewellery_box.png',
      slug: 'wooden-jewellery-box'
    },
  ];

  const defaultHomePicks = [
    {
      id: 'prod-hm-1',
      name: 'Cushion Cover (Set of 2)',
      basePrice: 499,
      originalPrice: 649,
      discount: '23% off',
      ratingAverage: 4.7,
      totalRatings: 214,
      imageUrl: '/assets/mockup/home/cushion_cover.png',
      slug: 'cushion-cover'
    },
    {
      id: 'prod-hm-2',
      name: 'Table Runner (Handloom)',
      basePrice: 699,
      originalPrice: 899,
      discount: '22% off',
      ratingAverage: 4.6,
      totalRatings: 98,
      imageUrl: '/assets/mockup/home/table_runner.png',
      slug: 'table-runner'
    },
    {
      id: 'prod-hm-3',
      name: 'Indoor Ceramic Planter',
      basePrice: 399,
      originalPrice: 499,
      discount: '20% off',
      ratingAverage: 4.8,
      totalRatings: 167,
      imageUrl: '/assets/mockup/home/indoor_ceramic_planter.png',
      slug: 'indoor-ceramic-planter'
    },
    {
      id: 'prod-hm-4',
      name: 'Aroma Candle (Soy Wax)',
      basePrice: 349,
      originalPrice: 449,
      discount: '22% off',
      ratingAverage: 4.7,
      totalRatings: 305,
      imageUrl: '/assets/mockup/home/aroma_candle.png',
      slug: 'aroma-candle'
    },
    {
      id: 'prod-hm-5',
      name: 'Pickle Combo (3 Jars)',
      basePrice: 599,
      originalPrice: 749,
      discount: '20% off',
      ratingAverage: 4.8,
      totalRatings: 122,
      imageUrl: '/assets/mockup/home/pickle_combo.png',
      slug: 'pickle-combo'
    },
    {
      id: 'prod-hm-6',
      name: 'Herbal Bath Soap (Pack of 3)',
      basePrice: 299,
      originalPrice: 399,
      discount: '25% off',
      ratingAverage: 4.6,
      totalRatings: 188,
      imageUrl: '/assets/mockup/home/herbal_bath_soap.png',
      slug: 'herbal-bath-soap'
    },
  ];

  const defaultServices = [
    {
      id: 'srv-1',
      name: 'Salon & Beauty Services',
      price: 299,
      ratingAverage: 4.8,
      totalRatings: '1,240',
      imageUrl: '/assets/mockup/services/salon_services.png',
      slug: 'salon-beauty-services'
    },
    {
      id: 'srv-2',
      name: 'Bridal Makeup',
      price: '4,999',
      ratingAverage: 4.9,
      totalRatings: 420,
      imageUrl: '/assets/mockup/services/bridal_makeup.png',
      slug: 'bridal-makeup'
    },
    {
      id: 'srv-3',
      name: 'Tailoring & Stitching',
      price: 199,
      ratingAverage: 4.8,
      totalRatings: 880,
      imageUrl: '/assets/mockup/services/tailoring_stitching.png',
      slug: 'tailoring-stitching'
    },
    {
      id: 'srv-4',
      name: 'Mehendi (Henna) Art',
      price: 399,
      ratingAverage: 4.8,
      totalRatings: 764,
      imageUrl: '/assets/mockup/services/mehendi_art.png',
      slug: 'mehendi-art'
    },
    {
      id: 'srv-5',
      name: 'Home Catering',
      price: '1,499',
      ratingAverage: 4.7,
      totalRatings: 312,
      imageUrl: '/assets/mockup/services/home_catering.png',
      slug: 'home-catering'
    },
    {
      id: 'srv-6',
      name: 'Event Decoration',
      price: '2,999',
      ratingAverage: 4.8,
      totalRatings: 196,
      imageUrl: '/assets/mockup/services/event_decoration.png',
      slug: 'event-decoration'
    },
  ];

  const defaultStores = [
    {
      name: 'Saraswati Crafts',
      cat: 'Handicrafts & Décor',
      rating: '4.9',
      count: '250+ products',
      img: '/assets/mockup/stores/saraswati_crafts.png',
      slug: 'saraswati-crafts'
    },
    {
      name: 'Anitha Fashions',
      cat: 'Sarees & Apparels',
      rating: '4.8',
      count: '420+ products',
      img: '/assets/mockup/stores/anitha_fashions.png',
      slug: 'anitha-fashions'
    },
    {
      name: 'Lakshmi Naturals',
      cat: 'Beauty & Wellness',
      rating: '4.8',
      count: '180+ products',
      img: '/assets/mockup/stores/lakshmi_naturals.png',
      slug: 'lakshmi-naturals'
    },
    {
      name: 'Divya Home Art',
      cat: 'Home Decor & Living',
      rating: '4.7',
      count: '310+ products',
      img: '/assets/mockup/stores/divya_home_art.png',
      slug: 'divya-home-art'
    },
    {
      name: 'Ruchi Foods',
      cat: 'Homemade Food',
      rating: '4.8',
      count: '160+ products',
      img: '/assets/mockup/stores/ruchi_foods.png',
      slug: 'ruchi-foods'
    },
    {
      name: 'Siri Tailoring',
      cat: 'Stitching & Custom Wear',
      rating: '4.8',
      count: '95+ services',
      img: '/assets/mockup/stores/siri_tailoring.png',
      slug: 'siri-tailoring'
    },
  ];

  const exploreThumbs = [
    '/assets/mockup/explore/item_1.png',
    '/assets/mockup/explore/item_2.png',
    '/assets/mockup/explore/item_3.png',
    '/assets/mockup/explore/item_4.png',
    '/assets/mockup/explore/item_5.png',
    '/assets/mockup/explore/item_6.png',
    '/assets/mockup/explore/item_7.png',
    '/assets/mockup/explore/item_8.png',
  ];

  // Merge loaded products with defaults to guarantee 1:1 display
  const handicraftList = products.filter(p => p.categoryId === 'cat-p-1').length >= 6
    ? products.filter(p => p.categoryId === 'cat-p-1').slice(0, 6)
    : defaultHandicrafts;

  const homeList = products.filter(p => p.categoryId === 'cat-p-6' || p.categoryId === 'cat-p-4' || p.categoryId === 'cat-p-5').length >= 6
    ? products.filter(p => p.categoryId === 'cat-p-6' || p.categoryId === 'cat-p-4' || p.categoryId === 'cat-p-5').slice(0, 6)
    : defaultHomePicks;

  const serviceList = services.length >= 6 ? services.slice(0, 6) : defaultServices;
  const storeList = sellers.length >= 6 ? sellers.slice(0, 6).map((s: any) => ({
    name: s.businessName,
    cat: s.categoryName || 'Women Artisan',
    rating: String(s.ratingAverage || 4.8),
    count: s.productCount || '100+ items',
    img: s.logoUrl || '/assets/mockup/stores/saraswati_crafts.png',
    slug: s.slug || 'saraswati-crafts'
  })) : defaultStores;

  return (
    <div className="pb-16 bg-[#F8F9FA] font-nunito text-gray-900 animate-fadeIn">
      
      {/* Alert toast if booking confirmed */}
      {bookingAlert && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-3">
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>{bookingAlert}</span>
            </div>
            <a href="#/bookings" className="underline">View in My Bookings</a>
          </div>
        </div>
      )}

      {/* 1. Promotional Ticker Strip with subtle background flowers */}
      <div className="bg-[#FAF0F7] border-b border-[#F2DEEE] py-2 px-4 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-3 text-xs sm:text-sm text-gray-800 font-semibold text-center">
          <div className="flex items-center gap-2 text-[#4E0C54]">
            <ShoppingBag size={18} className="text-[#D81B60]" />
            <span className="font-bold text-gray-900">Discover products made by women entrepreneurs</span>
          </div>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <a
            href="#/"
            className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full border border-[#D81B60] text-[#D81B60] hover:bg-[#D81B60] hover:text-white transition font-bold text-xs"
          >
            <span>Explore the collection</span>
            <ArrowRight size={13} />
          </a>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 space-y-6 pt-4">

        {/* 2. Category Tiles Bar (8 rounded cards with clean cutout imagery) */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3">
          {categoryTiles.map((tile) => (
            <div
              key={tile.id}
              onClick={() => { window.location.hash = '#/'; }}
              className="bg-white rounded-2xl p-2.5 sm:p-3 border border-gray-100 shadow-2xs hover:shadow-md hover:border-[#D81B60]/40 transition-all cursor-pointer flex flex-col items-center justify-between h-28 group text-center"
            >
              <div className="w-full h-16 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img
                  src={tile.img}
                  alt={tile.name}
                  className="max-h-14 max-w-full object-contain"
                />
              </div>
              <span className="text-xs font-bold text-gray-800 group-hover:text-[#4E0C54] transition">
                {tile.name}
              </span>
            </div>
          ))}
        </div>

        {/* 3. Split Hero Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          
          {/* Left Large Banner (approx 66% width) */}
          <div className="lg:col-span-8 bg-gradient-to-r from-[#FEE5E1] via-[#FAF2EE] to-[#F5ECE4] rounded-3xl p-6 sm:p-7 border border-[#EEDECE] shadow-2xs relative overflow-hidden flex flex-col justify-between min-h-[240px] sm:min-h-[270px]">
            
            {/* Left/Right carousel arrows */}
            <button className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-white z-10">
              <ChevronLeft size={16} />
            </button>
            <button className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-white z-10">
              <ChevronRight size={16} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-6 space-y-1.5 text-left z-10 pl-3 sm:pl-5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3B0764] font-poppins leading-tight">
                  Handmade Finds
                </h2>
                <div className="text-3xl sm:text-5xl font-black text-[#D81B60] tracking-tight font-poppins">
                  Under ₹499
                </div>
                <p className="text-xs sm:text-sm text-gray-700 font-semibold pt-1">
                  Crafts • Décor • Accessories
                </p>
                <div className="pt-3">
                  <a
                    href="#/"
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#4A0E4E] text-white text-xs font-bold hover:bg-[#38093B] shadow-md transition"
                  >
                    <span>Shop Now</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>

              {/* Artisan Products Showcase Image */}
              <div className="sm:col-span-6 flex justify-center sm:justify-end pr-1 sm:pr-3">
                <img
                  src="/assets/mockup/hero/hero_handmade.png"
                  alt="Handmade Finds"
                  className="h-44 sm:h-52 w-auto object-contain drop-shadow-md rounded-xl"
                />
              </div>
            </div>

            {/* Pagination dots */}
            <div className="flex items-center justify-center gap-1.5 pt-2">
              <span className="w-2.5 h-1.5 rounded-full bg-[#4E0C54]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            </div>
          </div>

          {/* Right Banner (approx 34% width) */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#FDE9F4] to-[#F6EDF8] rounded-3xl p-5 sm:p-6 border border-[#E9D6EB] shadow-2xs flex flex-col justify-between relative overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              
              <div className="sm:col-span-7 space-y-2 text-left">
                <h3 className="text-base sm:text-lg font-extrabold text-[#3B0764] font-poppins leading-tight">
                  Book Trusted Services Near You
                </h3>
                
                <ul className="space-y-1 text-xs font-bold text-gray-700 pt-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-[#D81B60] shrink-0" />
                    <span>Beauty & Wellness</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-[#D81B60] shrink-0" />
                    <span>Tailoring & Stitching</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-[#D81B60] shrink-0" />
                    <span>Mehendi & More</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <a
                    href="#/"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#D81B60] text-white text-xs font-bold hover:bg-[#C2185B] shadow-xs transition"
                  >
                    <span>Book a Service</span>
                    <ArrowRight size={12} />
                  </a>
                </div>
              </div>

              {/* Smiling Indian woman tailor image */}
              <div className="sm:col-span-5 flex justify-center sm:justify-end">
                <img
                  src="/assets/mockup/hero/hero_tailor.png"
                  alt="Tailoring & Services"
                  className="h-36 sm:h-44 w-auto object-cover rounded-xl shadow-xs"
                />
              </div>

            </div>
          </div>

        </div>

        {/* 4. Section 1: "Popular in Handicrafts" (Horizontal Carousel) */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-2xs relative">
          
          {/* Arrow buttons on left and right */}
          <button className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 z-10">
            <ChevronLeft size={16} />
          </button>
          <button className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 z-10">
            <ChevronRight size={16} />
          </button>

          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins tracking-tight">
              Popular in Handicrafts
            </h2>
            <a href="#/" className="text-xs font-bold text-[#D81B60] hover:text-[#4E0C54] flex items-center gap-0.5">
              <span>See All Handicrafts</span>
              <ChevronRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 px-1">
            {handicraftList.map((p: any) => {
              const discount = p.discount || (p.originalPrice
                ? `${Math.round(((p.originalPrice - p.basePrice) / p.originalPrice) * 100)}% off`
                : '20% off');

              return (
                <div
                  key={p.id}
                  onClick={() => { window.location.hash = `#/product/${p.slug || p.id}`; }}
                  className="bg-white rounded-2xl p-2.5 border border-gray-100 hover:border-[#D81B60]/50 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    {/* Photo */}
                    <div className="w-full h-24 sm:h-28 rounded-xl overflow-hidden bg-[#FAF7FA] flex items-center justify-center p-1.5 mb-2 group-hover:scale-102 transition">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-[#4E0C54]">
                      {p.name}
                    </h3>

                    {/* Price with discount */}
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xs sm:text-sm font-black text-gray-950 font-poppins">
                        ₹{typeof p.basePrice === 'number' ? p.basePrice.toLocaleString('en-IN') : p.basePrice}
                      </span>
                      {p.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through">
                          ₹{typeof p.originalPrice === 'number' ? p.originalPrice.toLocaleString('en-IN') : p.originalPrice}
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-emerald-600">
                        {discount}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-500 font-semibold mt-1">
                      <span className="text-amber-500 font-bold">★ {p.ratingAverage || 4.8}</span>
                      <span>({p.totalRatings || 89})</span>
                    </div>
                  </div>

                  {/* Amazon-style Yellow Add to Cart Button */}
                  <div className="pt-2.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(p);
                      }}
                      className="w-full py-1.5 px-2 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-950 font-bold text-xs rounded-xl shadow-2xs transition active:scale-95 flex items-center justify-center gap-1"
                    >
                      <ShoppingCart size={13} className="text-gray-900" />
                      <span>{addingId === p.id ? 'Added!' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Section 2: "Best picks for your home" (Horizontal Carousel) */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-2xs relative">
          
          {/* Arrow buttons on left and right */}
          <button className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 z-10">
            <ChevronLeft size={16} />
          </button>
          <button className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 z-10">
            <ChevronRight size={16} />
          </button>

          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins tracking-tight">
              Best picks for your home
            </h2>
            <a href="#/" className="text-xs font-bold text-[#D81B60] hover:text-[#4E0C54] flex items-center gap-0.5">
              <span>See All Home & Living</span>
              <ChevronRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 px-1">
            {homeList.map((p: any) => {
              const discount = p.discount || (p.originalPrice
                ? `${Math.round(((p.originalPrice - p.basePrice) / p.originalPrice) * 100)}% off`
                : '22% off');

              return (
                <div
                  key={p.id}
                  onClick={() => { window.location.hash = `#/product/${p.slug || p.id}`; }}
                  className="bg-white rounded-2xl p-2.5 border border-gray-100 hover:border-[#D81B60]/50 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    {/* Photo */}
                    <div className="w-full h-24 sm:h-28 rounded-xl overflow-hidden bg-[#FAF7FA] flex items-center justify-center p-1.5 mb-2 group-hover:scale-102 transition">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-[#4E0C54]">
                      {p.name}
                    </h3>

                    {/* Price with discount */}
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xs sm:text-sm font-black text-gray-950 font-poppins">
                        ₹{typeof p.basePrice === 'number' ? p.basePrice.toLocaleString('en-IN') : p.basePrice}
                      </span>
                      {p.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through">
                          ₹{typeof p.originalPrice === 'number' ? p.originalPrice.toLocaleString('en-IN') : p.originalPrice}
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-emerald-600">
                        {discount}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-500 font-semibold mt-1">
                      <span className="text-amber-500 font-bold">★ {p.ratingAverage || 4.7}</span>
                      <span>({p.totalRatings || 160})</span>
                    </div>
                  </div>

                  {/* Add to Cart button */}
                  <div className="pt-2.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(p);
                      }}
                      className="w-full py-1.5 px-2 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-950 font-bold text-xs rounded-xl shadow-2xs transition active:scale-95 flex items-center justify-center gap-1"
                    >
                      <ShoppingCart size={13} className="text-gray-900" />
                      <span>{addingId === p.id ? 'Added!' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Section 3: "Beauty services near you" (Services Carousel) */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-2xs relative">
          
          {/* Arrow buttons on left and right */}
          <button className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 z-10">
            <ChevronLeft size={16} />
          </button>
          <button className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 z-10">
            <ChevronRight size={16} />
          </button>

          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins tracking-tight">
              Beauty services near you
            </h2>
            <a href="#/" className="text-xs font-bold text-[#D81B60] hover:text-[#4E0C54] flex items-center gap-0.5">
              <span>See All Services</span>
              <ChevronRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 px-1">
            {serviceList.map((s: any) => (
              <div
                key={s.id}
                onClick={() => { window.location.hash = `#/service/${s.slug || s.id}`; }}
                className="bg-white rounded-2xl p-2.5 border border-gray-100 hover:border-[#4E0C54]/50 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Photo */}
                  <div className="w-full h-24 sm:h-28 rounded-xl overflow-hidden bg-[#FAF7FA] mb-2 group-hover:scale-102 transition flex items-center justify-center">
                    <img
                      src={s.imageUrl}
                      alt={s.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-[#4E0C54]">
                    {s.name}
                  </h3>

                  {/* Price */}
                  <div className="text-xs font-extrabold text-gray-900 mt-1">
                    Starting at <span className="text-[#3B0764]">₹{s.price}</span>
                  </div>

                  {/* Rating & City */}
                  <div className="text-[10px] sm:text-[11px] text-gray-500 font-medium mt-1 truncate">
                    <span className="text-amber-500 font-bold">★ {s.ratingAverage || 4.8}</span>{' '}
                    <span>({s.totalRatings || 400}) • {selectedCity}</span>
                  </div>
                </div>

                {/* Book Now Button (White with purple border) */}
                <div className="pt-2.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenBooking(s);
                    }}
                    className="w-full py-1.5 px-2 bg-white hover:bg-purple-50 text-[#4E0C54] font-bold text-xs rounded-xl border border-[#4E0C54] transition active:scale-95 flex items-center justify-center gap-1"
                  >
                    <Calendar size={13} className="text-[#4E0C54]" />
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Section 4: "Featured women-owned stores" (Horizontal Pill Cards) */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="text-base sm:text-lg font-black text-gray-900 font-poppins tracking-tight">
              Featured women-owned stores
            </h2>
            <a href="#/" className="text-xs font-bold text-[#D81B60] hover:text-[#4E0C54] flex items-center gap-0.5">
              <span>See All Stores</span>
              <ChevronRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {storeList.map((st: any, idx: number) => (
              <div
                key={idx}
                onClick={() => { window.location.hash = `#/store/${st.slug || 'saraswati-crafts'}`; }}
                className="py-2.5 px-3 rounded-full bg-white border border-gray-200/90 hover:border-[#D81B60] hover:shadow-xs transition cursor-pointer flex items-center gap-2.5 group shadow-2xs"
              >
                <img
                  src={st.img}
                  alt={st.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200 shadow-2xs group-hover:scale-105 transition"
                />
                <div className="overflow-hidden text-left flex-1 min-w-0">
                  <h4 className="text-xs font-black text-gray-950 truncate group-hover:text-[#4E0C54]">
                    {st.name}
                  </h4>
                  <p className="text-[10px] text-gray-500 font-semibold truncate leading-tight">
                    {st.cat}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-700 leading-tight pt-0.5">
                    <span className="text-amber-500 font-black">★ {st.rating}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-600 font-medium">{st.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Section 5: "Continue exploring" (Horizontal Gallery with left title) */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 sm:gap-6">
            
            {/* Left title & subtext */}
            <div className="shrink-0 lg:w-48 text-left">
              <h2 className="text-sm sm:text-base font-black text-gray-900 font-poppins leading-tight">
                Continue exploring
              </h2>
              <p className="text-[11px] text-gray-500 font-medium pt-0.5">Based on your recent activity</p>
            </div>

            {/* 8 thumbnails horizontally */}
            <div className="flex-1 grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
              {exploreThumbs.map((thumb, idx) => (
                <div
                  key={idx}
                  onClick={() => { window.location.hash = '#/'; }}
                  className="aspect-square rounded-2xl bg-[#FAF7FA] border border-gray-200/80 hover:border-[#D81B60] p-2 flex items-center justify-center cursor-pointer transition hover:scale-105 shadow-2xs"
                >
                  <img
                    src={thumb}
                    alt={`Activity item ${idx + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Service Booking Modal */}
      <BookingModal
        service={bookingService}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
};
