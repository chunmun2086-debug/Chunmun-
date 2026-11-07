import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  FileText,
  Navigation,
  MessageSquare,
  Repeat,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

export const MyBookingsView: React.FC = () => {
  const {
    bookings,
    openTracking,
    openInvoice,
    openChat,
    openBookingFlow,
    services,
    lang,
    t
  } = useApp();

  const [filterTab, setFilterTab] = useState<'active' | 'history'>('active');

  const activeBookings = bookings.filter(
    (b) => b.status !== 'completed' && b.status !== 'cancelled'
  );

  const historyBookings = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  );

  const displayedList = filterTab === 'active' ? activeBookings : historyBookings;

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'on_the_way':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 animate-spin" />
            {t.statusOnWay}
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            {t.statusInProgress}
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t.statusConfirmed}
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t.statusCompleted}
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/60 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            {t.statusCancelled}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
            {t.statusPending}
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.navBookings}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'hi'
              ? 'अपनी सभी सक्रिय और पूर्ण सेवाओं की जानकारी देखें'
              : 'Track active appointments, view invoices and manage your schedule'}
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setFilterTab('active')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              filterTab === 'active'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {lang === 'hi' ? `सक्रिय (${activeBookings.length})` : `Active (${activeBookings.length})`}
          </button>
          <button
            onClick={() => setFilterTab('history')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              filterTab === 'history'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {lang === 'hi' ? `इतिहास (${historyBookings.length})` : `Past History (${historyBookings.length})`}
          </button>
        </div>
      </div>

      {displayedList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-slate-700 text-blue-600 flex items-center justify-center mb-3">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {lang === 'hi' ? 'कोई बुकिंग उपलब्ध नहीं है' : 'No bookings found in this section'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {lang === 'hi'
              ? 'अपनी घरेलू मरम्मत या सफाई के लिए अभी आसानी से सेवा बुक करें।'
              : 'Explore our 24 service categories and book a background-checked professional.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedList.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700 gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md">
                    #{b.id}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {b.bookingDate} · {b.bookingTimeSlot}
                  </span>
                  {b.isEmergency && (
                    <span className="px-2 py-0.5 rounded-md bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      ⚡ Urgent
                    </span>
                  )}
                </div>

                <div>{getStatusBadge(b.status)}</div>
              </div>

              {/* Service & Pro Details */}
              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={b.serviceImage}
                    alt={b.serviceNameEn}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {lang === 'hi' ? b.serviceNameHi : b.serviceNameEn}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-600" />
                      <span>{b.address.street}, {b.address.city}</span>
                    </p>
                    {b.assignedProviderName && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pro: {b.assignedProviderName}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Amount & OTP */}
                <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                      Total Amount
                    </span>
                    <span className="text-lg font-black text-blue-900 dark:text-white font-mono">
                      ₹{b.totalAmount}
                    </span>
                  </div>

                  {b.status !== 'completed' && b.status !== 'cancelled' && (
                    <div className="mt-2 text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-lg border border-amber-200">
                      OTP: <span className="font-mono text-sm tracking-wider">{b.startOtp}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openTracking(b)}
                    className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{t.trackBooking}</span>
                  </button>

                  <button
                    onClick={() => openInvoice(b)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Invoice</span>
                  </button>

                  {b.assignedProviderName && b.status !== 'completed' && b.status !== 'cancelled' && (
                    <button
                      onClick={() => openChat(b)}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>Chat</span>
                    </button>
                  )}
                </div>

                {b.status === 'completed' && (
                  <button
                    onClick={() => {
                      const svc = services.find((s) => s.id === b.serviceId) || services[0];
                      openBookingFlow(svc);
                    }}
                    className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-orange-700 transition-colors"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'फिर से बुक करें' : 'Book Again'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
