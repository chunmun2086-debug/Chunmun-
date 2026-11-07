import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Calendar, Tag, HelpCircle, User, Briefcase, DollarSign } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { role, t, bookings } = useApp();

  const activeBookingsCount = bookings.filter(
    (b) => b.status !== 'completed' && b.status !== 'cancelled'
  ).length;

  if (role === 'admin') {
    // Admin uses its dedicated dashboard navigation
    return null;
  }

  if (role === 'provider') {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-3 items-center h-16 max-w-md mx-auto px-4">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeTab === 'jobs'
                ? 'text-blue-700 dark:text-blue-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">
              {activeBookingsCount > 0 ? `Jobs (${activeBookingsCount})` : 'Jobs'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeTab === 'earnings'
                ? 'text-blue-700 dark:text-blue-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Earnings</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeTab === 'profile'
                ? 'text-blue-700 dark:text-blue-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-tight">Profile & KYC</span>
          </button>
        </div>
      </div>
    );
  }

  // Customer Bottom Navigation
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        <button
          onClick={() => setActiveTab('home')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'home'
              ? 'text-blue-700 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">{t.navHome}</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`min-h-[44px] relative flex flex-col items-center justify-center transition-colors ${
            activeTab === 'bookings'
              ? 'text-blue-700 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <div className="relative">
            <Calendar className="w-5 h-5" />
            {activeBookingsCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-[14px] bg-orange-600 text-[9px] font-bold text-white rounded-full flex items-center justify-center">
                {activeBookingsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">{t.navBookings}</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'offers'
              ? 'text-blue-700 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Tag className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">{t.navOffers}</span>
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'support'
              ? 'text-blue-700 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">{t.navSupport}</span>
        </button>

        <button
          onClick={() => setActiveTab('account')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'account'
              ? 'text-blue-700 dark:text-blue-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">{t.navAccount}</span>
        </button>
      </div>
    </div>
  );
};
