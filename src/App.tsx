import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomeScreen } from './components/customer/HomeScreen';
import { MyBookingsView } from './components/customer/MyBookingsView';
import { OffersView } from './components/customer/OffersView';
import { SupportView } from './components/customer/SupportView';
import { CustomerAccountView } from './components/customer/CustomerAccountView';
import { ServiceDetailModal } from './components/customer/ServiceDetailModal';
import { BookingFlowModal } from './components/customer/BookingFlowModal';
import { BookingTrackerModal } from './components/customer/BookingTrackerModal';
import { InvoiceModal } from './components/customer/InvoiceModal';
import { ChatModal } from './components/common/ChatModal';
import { ProviderPortal } from './components/provider/ProviderPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ShieldCheck, PhoneCall, Heart, Wrench, Sparkles, Zap } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { role, lang, t, setRole } = useApp();
  const [activeCustomerTab, setActiveCustomerTab] = useState<string>('home');
  const [activeProviderTab, setActiveProviderTab] = useState<string>('jobs');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Navigation Bar */}
      <Header
        activeTab={role === 'customer' ? activeCustomerTab : activeProviderTab}
        setActiveTab={role === 'customer' ? setActiveCustomerTab : setActiveProviderTab}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* CUSTOMER PORTAL */}
        {role === 'customer' && (
          <>
            {activeCustomerTab === 'home' && <HomeScreen />}
            {activeCustomerTab === 'bookings' && <MyBookingsView />}
            {activeCustomerTab === 'offers' && <OffersView />}
            {activeCustomerTab === 'support' && <SupportView />}
            {activeCustomerTab === 'account' && <CustomerAccountView />}
          </>
        )}

        {/* SERVICE PROVIDER APP */}
        {role === 'provider' && <ProviderPortal />}

        {/* ADMIN DASHBOARD */}
        {role === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Interactive Modals */}
      <ServiceDetailModal />
      <BookingFlowModal />
      <BookingTrackerModal />
      <InvoiceModal />
      <ChatModal />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={role === 'customer' ? activeCustomerTab : activeProviderTab}
        setActiveTab={role === 'customer' ? setActiveCustomerTab : setActiveProviderTab}
      />

      {/* Clean Informative Footer */}
      <footer className="hidden md:block bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-500 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="text-lg font-black tracking-tight text-blue-900 dark:text-white">
                  GHAR <span className="text-orange-600">SEVA</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {lang === 'hi'
                  ? 'भारत का प्रमुख भरोसेमंद होम सर्विस बुकिंग प्लेटफॉर्म। सभी प्रकार की घरेलू मरम्मत, सफाई व इंस्टॉलेशन सेवाएँ।'
                  : "India's premier trusted home services booking platform. Verified background-checked professionals with 30-day rework warranty."}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Quick Services
              </h4>
              <ul className="text-xs space-y-2">
                <li>Electrician & Wiring</li>
                <li>Plumbing & Leak Repairs</li>
                <li>AC Jet Foam Wash</li>
                <li>Complete Deep Cleaning</li>
                <li>Carpentry & Locks</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Platform Portals
              </h4>
              <ul className="text-xs space-y-2">
                <li>
                  <button onClick={() => setRole('customer')} className="hover:text-blue-600 transition-colors">
                    Customer Booking App
                  </button>
                </li>
                <li>
                  <button onClick={() => setRole('provider')} className="hover:text-blue-600 transition-colors">
                    Service Provider (Partner Pro) App
                  </button>
                </li>
                <li>
                  <button onClick={() => setRole('admin')} className="hover:text-blue-600 transition-colors">
                    Admin Command Dashboard
                  </button>
                </li>
                <li>
                  <a href="#terms" className="hover:text-blue-600 transition-colors">GST Invoices & Terms</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Emergency Helpline
              </h4>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                1800-123-4567
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                24x7 Rapid Electrician & Plumber Dispatch
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Background Verified Pros</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <div>
              © 2026 GHAR SEVA Technologies India Pvt. Ltd. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>·</span>
              <span>Terms of Service</span>
              <span>·</span>
              <span>GSTIN: 29AAACG8912P1ZK</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
