import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingStatus } from '../../types';
import {
  X,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  MapPin,
  Clock,
  Star,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  KeyRound
} from 'lucide-react';

export const BookingTrackerModal: React.FC = () => {
  const {
    activeTrackingBooking,
    closeTracking,
    cancelBooking,
    openInvoice,
    openChat,
    rateBooking,
    lang,
    t
  } = useApp();

  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [cancelReason, setCancelReason] = useState('Found another alternative');
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!activeTrackingBooking) return null;

  const b = activeTrackingBooking;

  const steps: { key: BookingStatus; labelEn: string; labelHi: string }[] = [
    { key: 'confirmed', labelEn: 'Booking Confirmed', labelHi: 'बुकिंग पुष्ट' },
    { key: 'on_the_way', labelEn: 'Pro On The Way', labelHi: 'प्रो रास्ते में है' },
    { key: 'in_progress', labelEn: 'Service In Progress', labelHi: 'काम चालू है' },
    { key: 'completed', labelEn: 'Completed', labelHi: 'पूर्ण हुआ' }
  ];

  const getStepIndex = (status: BookingStatus) => {
    switch (status) {
      case 'pending_acceptance':
        return 0;
      case 'confirmed':
        return 1;
      case 'on_the_way':
        return 2;
      case 'in_progress':
        return 3;
      case 'completed':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 1;
    }
  };

  const currentIdx = getStepIndex(b.status);

  const handleCancel = () => {
    cancelBooking(b.id, cancelReason);
    setShowCancelPrompt(false);
  };

  const handleRate = () => {
    rateBooking(b.id, ratingVal, reviewComment);
    setReviewSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white/20">
                #{b.id}
              </span>
              {b.isEmergency && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-500 uppercase tracking-wider">
                  ⚡ Urgent 15-30 Min
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold mt-1">
              {lang === 'hi' ? b.serviceNameHi : b.serviceNameEn}
            </h3>
            <p className="text-xs text-blue-200 mt-0.5">
              {b.bookingDate} · {b.bookingTimeSlot}
            </p>
          </div>

          <button
            onClick={closeTracking}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Cancelled Notice */}
          {b.status === 'cancelled' && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>{lang === 'hi' ? 'यह बुकिंग रद्द कर दी गई है' : 'This booking has been cancelled'}</span>
              </div>
              <p className="text-xs mt-1 text-red-700 dark:text-red-300">
                {b.cancellationReason || 'Cancelled by customer'}
              </p>
              {b.paymentStatus === 'refunded' && (
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1">
                  ✓ Refund of ₹{b.totalAmount} initiated to original payment method.
                </p>
              )}
            </div>
          )}

          {/* Stepper Progress */}
          {b.status !== 'cancelled' && (
            <div className="py-2">
              <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 dark:bg-slate-700 -z-0" />
                <div
                  className="absolute top-4 left-6 h-0.5 bg-blue-600 transition-all duration-500 -z-0"
                  style={{
                    width: `${Math.min(100, Math.max(0, ((currentIdx - 1) / 3) * 100))}%`
                  }}
                />

                {steps.map((st, i) => {
                  const stepNum = i + 1;
                  const isDone = currentIdx >= stepNum;
                  const isCurrent = currentIdx === stepNum;

                  return (
                    <div key={st.key} className="flex flex-col items-center text-center z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-4 ring-white dark:ring-slate-900'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500 ring-4 ring-white dark:ring-slate-900'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                      </div>
                      <span
                        className={`text-[10px] mt-1.5 font-semibold max-w-[70px] leading-tight ${
                          isCurrent
                            ? 'text-blue-600 dark:text-blue-400 font-bold'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {lang === 'hi' ? st.labelHi : st.labelEn}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Live Simulated Map & ETA (When on the way) */}
          {b.status === 'on_the_way' && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-blue-600 animate-spin" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {lang === 'hi' ? 'कारीगर रास्ते में है · आगमन 12 मिनट' : 'Pro En Route · Arriving in ~12 mins'}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Live GPS
                </span>
              </div>

              {/* Graphical stylized route vector */}
              <div className="h-28 rounded-xl bg-gradient-to-br from-blue-900/10 via-slate-200/50 to-orange-100/40 dark:from-slate-800 dark:to-slate-700/60 flex items-center justify-around relative p-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md animate-bounce">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-1">
                    {b.assignedProviderName?.split(' ')[0]}
                  </span>
                </div>

                {/* Animated dash line */}
                <div className="flex-1 mx-3 border-t-2 border-dashed border-blue-500 animate-pulse" />

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-md">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-1">
                    {b.address.title}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 4-Digit Security OTP Card */}
          {b.status !== 'completed' && b.status !== 'cancelled' && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  {t.startOtpLabel}
                </span>
                <p className="text-xs text-amber-900 dark:text-amber-200 mt-0.5 max-w-xs">
                  {t.startOtpDesc}
                </p>
              </div>

              <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-amber-300 dark:border-amber-800 shadow-sm text-center">
                <span className="text-2xl font-black font-mono tracking-widest text-slate-900 dark:text-white">
                  {b.startOtp}
                </span>
              </div>
            </div>
          )}

          {/* Assigned Professional Profile Card */}
          {b.assignedProviderName && (
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      b.assignedProviderAvatar ||
                      'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'
                    }
                    alt={b.assignedProviderName}
                    className="w-12 h-12 rounded-xl object-cover border"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {b.assignedProviderName}
                      </h4>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {b.assignedProviderRating || 4.9}
                      </span>
                      <span>·</span>
                      <span>{lang === 'hi' ? 'सत्यापित प्रो' : 'Verified Partner Pro'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${b.assignedProviderPhone || '+919876543210'}`}
                    className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400 hover:bg-blue-100 flex items-center justify-center transition-colors"
                    title={t.callPro}
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => openChat(b)}
                    className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-slate-700 text-orange-600 dark:text-orange-400 hover:bg-orange-100 flex items-center justify-center transition-colors"
                    title={t.chatWithPro}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Service Address & Problem Info */}
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">{b.address.title}: </span>
                <span>{b.address.street}, {b.address.landmark}, {b.address.city} - {b.address.pincode}</span>
              </div>
            </div>

            {b.problemDescription && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
                <span className="font-semibold block text-[11px] text-slate-400 mb-0.5 uppercase tracking-wider">
                  {lang === 'hi' ? 'समस्या का विवरण' : 'Issue Description'}
                </span>
                {b.problemDescription}
              </div>
            )}
          </div>

          {/* Rate & Review section (if completed) */}
          {b.status === 'completed' && !b.userRating && !reviewSubmitted && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {t.rateService}
                </h4>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatingVal(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= ratingVal
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={2}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder={lang === 'hi' ? 'सेवा कैसी लगी? अपना अनुभव साझा करें...' : 'How was the service experience? Leave a review...'}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />

              <button
                onClick={handleRate}
                className="w-full py-2 rounded-xl bg-blue-700 text-white font-bold text-xs hover:bg-blue-800 transition-colors"
              >
                {lang === 'hi' ? 'समीक्षा सबमिट करें' : 'Submit Review'}
              </button>
            </div>
          )}

          {(b.userRating || reviewSubmitted) && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {lang === 'hi' ? 'समीक्षा दर्ज करने के लिए धन्यवाद!' : 'Thank you for rating this service!'}
              </span>
            </div>
          )}

          {/* Cancel Prompt Modal/Box */}
          {showCancelPrompt && (
            <div className="p-4 bg-red-50 dark:bg-red-950/50 rounded-2xl border border-red-200 space-y-3">
              <h4 className="text-xs font-bold text-red-900 dark:text-red-200 uppercase tracking-wider">
                {lang === 'hi' ? 'रद्द करने का कारण चुनें' : 'Select Cancellation Reason'}
              </h4>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border text-slate-900 dark:text-white"
              >
                <option value="Issue resolved on my own">Issue resolved on my own</option>
                <option value="Pro delayed / took too long">Pro delayed / took too long</option>
                <option value="Booked by mistake">Booked by mistake</option>
                <option value="Change of plans">Change of plans</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowCancelPrompt(false)}
                  className="flex-1 py-1.5 rounded-lg border text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
          <button
            onClick={() => openInvoice(b)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>{t.downloadInvoice}</span>
          </button>

          {b.status !== 'completed' && b.status !== 'cancelled' && (
            <button
              onClick={() => setShowCancelPrompt(true)}
              className="px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
            >
              {t.cancelBooking}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
