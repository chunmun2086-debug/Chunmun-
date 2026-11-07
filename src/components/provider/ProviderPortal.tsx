import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingStatus, ServiceProvider } from '../../types';
import {
  Briefcase,
  Power,
  ShieldCheck,
  MapPin,
  Clock,
  PhoneCall,
  MessageSquare,
  DollarSign,
  Star,
  CheckCircle2,
  XCircle,
  FileCheck,
  AlertTriangle,
  Building,
  KeyRound,
  Navigation,
  ArrowRight
} from 'lucide-react';

export const ProviderPortal: React.FC = () => {
  const {
    currentProvider,
    providers,
    setCurrentProviderId,
    toggleProviderOnline,
    bookings,
    updateBookingStatus,
    openChat,
    requestPayout,
    lang,
    t
  } = useApp();

  const pro = currentProvider;
  const [activeTab, setActiveTab] = useState<'jobs' | 'earnings' | 'kyc'>('jobs');
  const [otpInput, setOtpInput] = useState<{ [bookingId: string]: string }>({});
  const [otpError, setOtpError] = useState<{ [bookingId: string]: string }>({});
  const [payoutRequested, setPayoutRequested] = useState(false);

  // Filter bookings assigned to this pro, or pending nearby bookings matching this pro's categories
  const proAssignedBookings = bookings.filter(
    (b) => b.assignedProviderId === pro.id || (!b.assignedProviderId && pro.tradeCategories.includes(b.serviceId))
  );

  const activeJobs = proAssignedBookings.filter(
    (b) => b.status !== 'completed' && b.status !== 'cancelled'
  );

  const completedJobs = proAssignedBookings.filter(
    (b) => b.status === 'completed'
  );

  // Handle status progress
  const handleNextStatus = (bookingId: string, currentStatus: BookingStatus) => {
    let nextStatus: BookingStatus = 'confirmed';
    if (currentStatus === 'confirmed') nextStatus = 'on_the_way';
    else if (currentStatus === 'on_the_way') nextStatus = 'in_progress';
    else if (currentStatus === 'in_progress') nextStatus = 'completed';

    const otpAttempt = otpInput[bookingId];
    const res = updateBookingStatus(bookingId, nextStatus, otpAttempt);

    if (!res.success) {
      setOtpError({ ...otpError, [bookingId]: res.message || 'OTP verification failed' });
    } else {
      setOtpError({ ...otpError, [bookingId]: '' });
      setOtpInput({ ...otpInput, [bookingId]: '' });
    }
  };

  const handleWithdraw = () => {
    if (pro.pendingPayout <= 0) return;
    requestPayout(pro.id, pro.pendingPayout);
    setPayoutRequested(true);
    setTimeout(() => setPayoutRequested(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6">
      
      {/* Top Pro Banner & Status Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={pro.avatar}
                alt={pro.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30"
                referrerPolicy="no-referrer"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                  pro.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{pro.name}</h2>
                {pro.isVerified ? (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    KYC Verified
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                    Pending Verification
                  </span>
                )}
              </div>

              <p className="text-xs text-blue-200 mt-0.5">
                {pro.tradeCategories.join(', ').replace(/_/g, ' ').toUpperCase()} · {pro.city} ({pro.serviceRadiusKm} km radius)
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                <span className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {pro.rating} ({pro.reviewsCount} reviews)
                </span>
                <span>·</span>
                <span>{pro.completedJobsCount} jobs completed</span>
              </div>
            </div>
          </div>

          {/* Online/Offline Toggle */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
            <button
              onClick={() => toggleProviderOnline(pro.id)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                pro.isOnline
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{pro.isOnline ? t.proStatusOnline : t.proStatusOffline}</span>
            </button>

            {/* Quick Pro Switcher (for testing multiple technicians) */}
            <div className="flex items-center gap-1.5 text-[11px] text-blue-200">
              <span>Switch Pro:</span>
              <select
                value={pro.id}
                onChange={(e) => setCurrentProviderId(e.target.value)}
                className="bg-white/10 text-white rounded-lg px-2 py-1 text-xs border border-white/20 focus:outline-hidden"
              >
                {providers.map((p) => (
                  <option key={p.id} value={p.id} className="text-slate-900">
                    {p.name} ({p.tradeCategories[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'jobs'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          {lang === 'hi' ? `सक्रिय कार्य (${activeJobs.length})` : `Active Jobs (${activeJobs.length})`}
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'earnings'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          {lang === 'hi' ? 'कमाई डैशबोर्ड' : 'Earnings & Payouts'}
        </button>

        <button
          onClick={() => setActiveTab('kyc')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'kyc'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          {lang === 'hi' ? 'दस्तावेज़ एवं केवाईसी' : 'KYC & Verification'}
        </button>
      </div>

      {/* TAB 1: ACTIVE JOBS PIPELINE */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {activeJobs.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 dark:bg-slate-700 text-blue-600 flex items-center justify-center mb-2">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {lang === 'hi' ? 'कोई नया काम लंबित नहीं है' : 'No active jobs assigned at the moment'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {pro.isOnline
                  ? 'Keep app online. Incoming leads in your service radius will appear here instantly.'
                  : 'You are currently offline. Turn online toggle ON to receive leads.'}
              </p>
            </div>
          ) : (
            activeJobs.map((b) => (
              <div
                key={b.id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-2.5 py-0.5 rounded-md">
                      #{b.id}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {b.serviceNameEn}
                    </span>
                    {b.isEmergency && (
                      <span className="px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                        ⚡ Urgent 15-30 Min
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                    Payout: ₹{Math.round(b.totalAmount * 0.9)} (after 10% fee)
                  </span>
                </div>

                {/* Customer Address & Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">
                      {t.customerDetails}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {b.customerName}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                      <span>{b.address.street}, {b.address.landmark}, {b.address.city} - {b.address.pincode}</span>
                    </p>
                    {b.problemDescription && (
                      <p className="text-slate-500 mt-1 italic">
                        "{b.problemDescription}"
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">
                        Current Job Status
                      </span>
                      <div className="inline-block px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold uppercase text-xs">
                        {b.status.replace(/_/g, ' ')}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Schedule: {b.bookingDate} ({b.bookingTimeSlot})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <a
                        href={`tel:${b.customerPhone}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                        <span>Call Customer</span>
                      </a>
                      <button
                        onClick={() => openChat(b)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
                        <span>Chat</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Action Workflow with Security OTP */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-3">
                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => handleNextStatus(b.id, b.status)}
                      className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>{t.markOnWay}</span>
                    </button>
                  )}

                  {b.status === 'on_the_way' && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                          <KeyRound className="w-4 h-4 text-amber-600" />
                          <span>{t.enterStartOtp}</span>
                        </span>
                        <span className="text-[10px] text-slate-500">
                          (Ask customer for 4-digit code)
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={otpInput[b.id] || ''}
                          onChange={(e) =>
                            setOtpInput({ ...otpInput, [b.id]: e.target.value })
                          }
                          placeholder="4-digit OTP"
                          className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border font-mono text-center tracking-widest font-bold"
                        />
                        <button
                          onClick={() => handleNextStatus(b.id, b.status)}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                        >
                          {t.verifyOtpAndStart}
                        </button>
                      </div>

                      {otpError[b.id] && (
                        <p className="text-[11px] font-semibold text-red-600 mt-1">
                          {otpError[b.id]}
                        </p>
                      )}
                    </div>
                  )}

                  {b.status === 'in_progress' && (
                    <button
                      onClick={() => handleNextStatus(b.id, b.status)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.markCompleted}</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: EARNINGS & PAYOUTS */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">
                {t.todayEarnings}
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono mt-1 block">
                ₹{pro.earningsToday}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">
                {t.weeklyEarnings}
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono mt-1 block">
                ₹{pro.earningsThisWeek}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">
                {t.totalEarnings}
              </span>
              <span className="text-xl font-black text-blue-700 dark:text-blue-400 font-mono mt-1 block">
                ₹{pro.earningsTotal}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">
                {t.pendingPayout}
              </span>
              <span className="text-xl font-black text-emerald-600 font-mono mt-1 block">
                ₹{pro.pendingPayout}
              </span>
            </div>
          </div>

          {/* Bank Details & Payout Request */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Direct Bank Account Payout
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {pro.bankAccount.bankName}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Account Holder</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{pro.bankAccount.accountHolder}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Account Number</span>
                <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{pro.bankAccount.accountNumber}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">IFSC Code</span>
                <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{pro.bankAccount.ifsc}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Available for withdrawal: </span>
                <span className="font-bold font-mono text-emerald-600 text-sm">
                  ₹{pro.pendingPayout}
                </span>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={pro.pendingPayout <= 0}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                {payoutRequested ? 'Withdrawal Initiated!' : 'Request Bank Transfer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KYC & VERIFICATION */}
      {activeTab === 'kyc' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {t.partnerKyc}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Government verification ensures safety and unlocks higher service rates.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    Aadhaar Identity Card
                  </h4>
                  <p className="text-[11px] font-mono text-slate-500">
                    UID: {pro.aadhaarNumber}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold">
                ✓ Verified
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    Police Verification Certificate
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Clear criminal background record verified
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold">
                ✓ Approved
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
