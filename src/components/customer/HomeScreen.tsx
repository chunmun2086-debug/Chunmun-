import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory } from '../../types';
import { ServiceIcon } from '../common/ServiceIcon';
import {
  Search,
  MapPin,
  Flame,
  ShieldCheck,
  Clock,
  Star,
  CheckCircle2,
  ChevronRight,
  PhoneCall,
  Sparkles,
  Zap,
  ArrowRight,
  Copy,
  Check,
  BadgePercent
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    lang,
    t,
    city,
    setCity,
    services,
    providers,
    promos,
    openBookingFlow,
    openServiceDetail
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Live filtered services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchSearch =
        s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nameHi.includes(searchQuery) ||
        s.descEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.descHi.includes(searchQuery);

      if (!matchSearch) return false;
      if (selectedFilter === 'all') return true;
      return s.categoryGroup === selectedFilter;
    });
  }, [services, searchQuery, selectedFilter]);

  // Popular services
  const popularServices = useMemo(() => {
    return services.slice(0, 4);
  }, [services]);

  // Featured pros
  const featuredPros = useMemo(() => {
    return providers.filter((p) => p.isVerified).slice(0, 3);
  }, [providers]);

  // Detect GPS Location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert(lang === 'hi' ? 'आपके ब्राउज़र में जीपीएस समर्थित नहीं है' : 'Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        // Map detected coords to nearest metro or set live pin
        setCity(`${city} (GPS Auto-Detected)`);
      },
      (err) => {
        setIsLocating(false);
        alert(lang === 'hi' ? 'स्थान अनुमति अस्वीकृत हुई। कृपया सूची से शहर चुनें।' : 'Location permission denied. Please pick your city from the list.');
      },
      { timeout: 8000 }
    );
  };

  const copyPromo = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="pb-24 pt-4 space-y-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-xl">
          {/* Subtle background overlay image */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <img
              src="/src/assets/images/hero_home_services_1794051468151.jpg"
              alt="Ghar Seva Professionals"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-300 mb-3 tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>{t.heroKicker}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight">
              {t.heroTitle}
            </h1>

            <p className="mt-3 text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-2xl">
              {t.heroSubtitle}
            </p>

            {/* Emergency Booking Quick Card */}
            <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Zap className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {t.emergencyBannerTitle}
                  </h4>
                  <p className="text-xs text-orange-200 mt-0.5">
                    {lang === 'hi'
                      ? 'बिजली मिस्त्री एवं प्लंबर 15-30 मिनट में आपके घर!'
                      : 'Electricians & Plumbers at your door in 15-30 mins!'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => openBookingFlow(services[0], true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/30 whitespace-nowrap"
              >
                {t.bookEmergencyNow}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Location Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 border border-slate-200 dark:border-slate-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Location Detection Button */}
          <button
            onClick={handleDetectLocation}
            disabled={isLocating}
            className="w-full md:w-auto min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors whitespace-nowrap"
          >
            <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
            <span>{isLocating ? 'Locating GPS...' : t.useCurrentLocation}</span>
          </button>
        </div>
      </section>

      {/* Special Offers Banner Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BadgePercent className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.specialOffers}
            </h2>
          </div>
          <span className="text-xs text-slate-500">{promos.length} Active Offers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {promos.map((p) => (
            <div
              key={p.code}
              className="relative rounded-2xl p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-800/80 border border-orange-200/70 dark:border-slate-700 shadow-xs flex items-center justify-between"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-600 text-white font-mono font-bold text-xs uppercase tracking-wider">
                  {p.code}
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-2 line-clamp-1">
                  {lang === 'hi' ? p.descriptionHi : p.descriptionEn}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  <span>Min ₹{p.minBookingValue}</span>
                  <span>·</span>
                  <span>Max ₹{p.maxDiscount} OFF</span>
                </div>
              </div>

              <button
                onClick={() => copyPromo(p.code)}
                className="shrink-0 p-2.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-orange-50 transition-colors"
                title="Copy Coupon"
              >
                {copiedCode === p.code ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-500" />
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Services Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t.popularServices}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'hi' ? 'सबसे ज्यादा बुक की जाने वाली सेवाएँ' : 'Most frequently booked household solutions'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularServices.map((svc) => (
            <div
              key={svc.id}
              className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-40 overflow-hidden bg-slate-100 dark:bg-slate-700">
                <img
                  src={svc.image}
                  alt={lang === 'hi' ? svc.nameHi : svc.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1 shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{svc.rating}</span>
                  <span className="text-slate-400">({svc.reviewsCount})</span>
                </div>
                {svc.emergencyAvailable && (
                  <div className="absolute top-3 right-3 bg-orange-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    ⚡ 15-30 Min
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 transition-colors">
                    {lang === 'hi' ? svc.nameHi : svc.nameEn}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {lang === 'hi' ? svc.descHi : svc.descEn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                      {t.startingAt}
                    </span>
                    <span className="text-base font-extrabold text-blue-900 dark:text-white font-mono">
                      ₹{svc.basePrice}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openServiceDetail(svc)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      {t.serviceDetails}
                    </button>
                    <button
                      onClick={() => openBookingFlow(svc)}
                      className="px-3.5 py-1.5 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow-xs transition-colors"
                    >
                      {t.bookNow}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All 24 Service Categories with Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t.allCategories} (24)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'hi' ? 'सभी मरम्मत, इंस्टॉलेशन व सफाई सेवाएं' : 'Complete range of verified home maintenance solutions'}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {lang === 'hi' ? 'सभी सेवाएँ' : 'All Services'}
            </button>
            <button
              onClick={() => setSelectedFilter('repair')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedFilter === 'repair'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {lang === 'hi' ? 'मरम्मत व फिटिंग' : 'Quick Repair'}
            </button>
            <button
              onClick={() => setSelectedFilter('cleaning')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedFilter === 'cleaning'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {lang === 'hi' ? 'क्लीनिंग व सफाई' : 'Cleaning'}
            </button>
            <button
              onClick={() => setSelectedFilter('appliance')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedFilter === 'appliance'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {lang === 'hi' ? 'घरेलू उपकरण' : 'Appliances'}
            </button>
            <button
              onClick={() => setSelectedFilter('heavy')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedFilter === 'heavy'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {lang === 'hi' ? 'पेंटिंग व रेनोवेशन' : 'Heavy Works'}
            </button>
          </div>
        </div>

        {/* 24 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredServices.map((svc) => (
            <div
              key={svc.id}
              onClick={() => openServiceDetail(svc)}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-2xs">
                  <ServiceIcon name={svc.icon} className="w-6 h-6" />
                </div>

                <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {lang === 'hi' ? svc.nameHi : svc.nameEn}
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {lang === 'hi' ? svc.descHi : svc.descEn}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                  ₹{svc.basePrice}
                </span>

                <div className="flex items-center text-[10px] text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>{t.bookNow}</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t.featuredPros}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'hi' ? 'सत्यापित आधार व पुलिस क्लीयरेंस प्राप्त कारीगर' : 'Background-verified technicians with 4.8+ customer rating'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredPros.map((pro) => (
            <div
              key={pro.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4"
            >
              <img
                src={pro.avatar}
                alt={pro.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-600"
                referrerPolicy="no-referrer"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                    {pro.name}
                  </h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1 font-semibold text-amber-600">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {pro.rating}
                  </span>
                  <span>·</span>
                  <span>{pro.completedJobsCount}+ {t.jobsDone}</span>
                  <span>·</span>
                  <span>{pro.experienceYears}y {t.experience}</span>
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                    {pro.isOnline ? 'Online Now' : 'Available Soon'}
                  </span>

                  <button
                    onClick={() => {
                      const proSvc = services.find((s) => pro.tradeCategories.includes(s.id)) || services[0];
                      openBookingFlow(proSvc);
                    }}
                    className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline"
                  >
                    {t.bookNow} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Safety Guarantees */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 dark:bg-slate-800/60 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {t.trustSafety}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'hi'
                ? 'हर सेवा में पूरी सुरक्षा, पारदर्शिता और संतुष्टि की गारंटी'
                : 'Highest safety standards, verified staff, and 30-day warranty on every job.'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-blue-700 dark:text-blue-400 mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                100% Verified
              </h5>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {lang === 'hi' ? 'आधार व पुलिस रिकॉर्ड सत्यापित' : 'Aadhaar & Police background checked'}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 mx-auto rounded-xl bg-orange-50 dark:bg-slate-700 flex items-center justify-center text-orange-600 mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                30-Day Warranty
              </h5>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {lang === 'hi' ? 'बिना किसी सवाल के मुफ्त रीवर्क' : 'Free rework if you face issues'}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50 dark:bg-slate-700 flex items-center justify-center text-emerald-600 mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                Transparent Pricing
              </h5>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {lang === 'hi' ? 'कोई अप्रत्याशित छुपा शुल्क नहीं' : 'Standard rate card & GST invoice'}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 mx-auto rounded-xl bg-purple-50 dark:bg-slate-700 flex items-center justify-center text-purple-600 mb-2">
                <Zap className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                15-Min Rapid SOS
              </h5>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {lang === 'hi' ? 'आपातकालीन बिजली व प्लंबिंग सेवा' : 'Urgent electrician & plumber dispatch'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Booking CTA & Helpline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base">
                {lang === 'hi' ? 'व्हाट्सएप या कॉल से तुरंत बुक करें' : 'Prefer WhatsApp or Direct Call?'}
              </h4>
              <p className="text-xs text-emerald-100 mt-0.5">
                {lang === 'hi' ? 'हमारी 24x7 हेल्पलाइन हमेशा आपके सहयोग के लिए तैयार है।' : 'Our 24x7 helpline is ready to assist with your bookings.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href="https://wa.me/919876543210?text=Hi%20Ghar%20Seva,%20I%20need%20home%20service"
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs text-center hover:bg-emerald-50 transition-colors shadow-xs"
            >
              {t.whatsappBooking}
            </a>
            <a
              href="tel:18001234567"
              className="px-4 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs text-center hover:bg-emerald-900 transition-colors border border-white/20"
            >
              1800-123-4567
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
