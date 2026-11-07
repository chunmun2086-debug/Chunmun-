import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  ShieldCheck,
  MapPin,
  Globe,
  Bell,
  User,
  Briefcase,
  Sliders,
  ChevronDown,
  X
} from 'lucide-react';
import { CITIES } from '../../data/mockData';

interface HeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab = 'home', setActiveTab }) => {
  const { role, setRole, lang, setLang, t, city, setCity, notifications } = useApp();
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (setActiveTab) setActiveTab('home');
              }}
              className="flex items-center gap-2 group text-left focus-visible:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-blue-900/10 transition-transform group-hover:scale-105">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-blue-900 dark:text-white flex items-center gap-1.5">
                  GHAR <span className="text-orange-600 dark:text-orange-500">SEVA</span>
                </span>
                <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">
                  {lang === 'hi' ? 'घर सेवा · विश्वसनीय' : 'Trusted Home Services'}
                </span>
              </div>
            </button>

            {/* City Selector */}
            <div className="relative hidden sm:block ml-2">
              <button
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                <span className="truncate max-w-[110px]">{city}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showCityDropdown && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t.selectLocation}
                  </div>
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCity(c);
                        setShowCityDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                        city === c
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Zone 2: Navigation Links for Desktop */}
          {role === 'customer' && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
              <button
                onClick={() => setActiveTab && setActiveTab('home')}
                className={`transition-colors whitespace-nowrap ${
                  activeTab === 'home'
                    ? 'text-blue-700 dark:text-blue-400 font-semibold'
                    : 'hover:text-blue-700 dark:hover:text-white'
                }`}
              >
                {t.navHome}
              </button>
              <button
                onClick={() => setActiveTab && setActiveTab('bookings')}
                className={`transition-colors whitespace-nowrap ${
                  activeTab === 'bookings'
                    ? 'text-blue-700 dark:text-blue-400 font-semibold'
                    : 'hover:text-blue-700 dark:hover:text-white'
                }`}
              >
                {t.navBookings}
              </button>
              <button
                onClick={() => setActiveTab && setActiveTab('offers')}
                className={`transition-colors whitespace-nowrap ${
                  activeTab === 'offers'
                    ? 'text-blue-700 dark:text-blue-400 font-semibold'
                    : 'hover:text-blue-700 dark:hover:text-white'
                }`}
              >
                {t.navOffers}
              </button>
              <button
                onClick={() => setActiveTab && setActiveTab('support')}
                className={`transition-colors whitespace-nowrap ${
                  activeTab === 'support'
                    ? 'text-blue-700 dark:text-blue-400 font-semibold'
                    : 'hover:text-blue-700 dark:hover:text-white'
                }`}
              >
                {t.navSupport}
              </button>
              <button
                onClick={() => setActiveTab && setActiveTab('account')}
                className={`transition-colors whitespace-nowrap ${
                  activeTab === 'account'
                    ? 'text-blue-700 dark:text-blue-400 font-semibold'
                    : 'hover:text-blue-700 dark:hover:text-white'
                }`}
              >
                {t.navAccount}
              </button>
            </nav>
          )}

          {/* Zone 3: Role Switcher, Language & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Toggle: English <-> हिन्दी */}
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 hover:bg-orange-100 transition-colors border border-orange-200/80 dark:border-orange-900/50"
              title="Change Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Role Switcher Pill Bar */}
            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setRole('customer')}
                className={`px-2.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  role === 'customer'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Customer Portal"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'hi' ? 'ग्राहक' : 'Customer'}</span>
              </button>

              <button
                onClick={() => setRole('provider')}
                className={`px-2.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  role === 'provider'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Service Provider Portal"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'hi' ? 'कारीगर प्रो' : 'Partner Pro'}</span>
              </button>

              <button
                onClick={() => setRole('admin')}
                className={`px-2.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  role === 'admin'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Admin Dashboard"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'hi' ? 'एडमिन' : 'Admin'}</span>
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-600"></span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {lang === 'hi' ? 'सूचनाएं' : 'Notifications'}
                    </h4>
                    <button
                      onClick={() => setShowNotifs(false)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-left border border-slate-100 dark:border-slate-700"
                      >
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {lang === 'hi' ? n.titleHi : n.titleEn}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                          {lang === 'hi' ? n.messageHi : n.messageEn}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
