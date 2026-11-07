import React from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceIcon } from '../common/ServiceIcon';
import {
  X,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Zap,
  ArrowRight
} from 'lucide-react';

export const ServiceDetailModal: React.FC = () => {
  const {
    activeServiceDetail,
    closeServiceDetail,
    openBookingFlow,
    lang,
    t
  } = useApp();

  if (!activeServiceDetail) return null;

  const svc = activeServiceDetail;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Header Image & Close */}
        <div className="relative h-56 sm:h-64 bg-slate-900 overflow-hidden">
          <img
            src={svc.image}
            alt={lang === 'hi' ? svc.nameHi : svc.nameEn}
            className="w-full h-full object-cover opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={closeServiceDetail}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Service Title on Scrim */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider">
                {svc.categoryGroup.toUpperCase()}
              </span>
              {svc.emergencyAvailable && (
                <span className="px-2.5 py-0.5 rounded-md bg-orange-600 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  15-30 Min Rapid
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'hi' ? svc.nameHi : svc.nameEn}
            </h2>

            <div className="flex items-center gap-4 text-xs text-white/90 mt-1 font-medium">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold">{svc.rating}</span>
                <span>({svc.reviewsCount} {t.ratings})</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{svc.durationMinutes} mins</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{svc.warrantyDays} {t.days} {t.warranty}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              {lang === 'hi' ? 'सेवा का अवलोकन' : 'Service Overview'}
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {lang === 'hi' ? svc.descHi : svc.descEn}
            </p>
          </div>

          {/* Key Features & What's Included */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t.whatsIncluded}</span>
            </h4>
            <div className="space-y-2">
              {(lang === 'hi' ? svc.featuresHi : svc.featuresEn).map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {lang === 'hi'
                    ? 'कार्य समाप्ति के बाद पूर्ण सफाई एवं उपकरण परीक्षण'
                    : 'Post-service cleanup and multi-point functional test'}
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {lang === 'hi'
                    ? `घर सेवा ${svc.warrantyDays} दिन की रीवर्क वारंटी और जीएसटी बिल`
                    : `Ghar Seva ${svc.warrantyDays}-day rework warranty with official GST tax invoice`}
                </span>
              </div>
            </div>
          </div>

          {/* What's Excluded */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1.5 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-slate-400" />
              <span>{t.whatsExcluded}</span>
            </h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
              <li>{lang === 'hi' ? 'अतिरिक्त स्पेयर पार्ट्स की लागत (बिल के अनुसार अलग)' : 'Cost of spare parts or replacement hardware (charged at MRP)'}</li>
              <li>{lang === 'hi' ? 'सीढ़ी या भारी मचान की व्यवस्था ग्राहक को करनी होगी यदि आवश्यक हो' : 'Scaffolding or extreme height access ladder (if required)'}</li>
            </ul>
          </div>

          {/* Pricing Highlight Card */}
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200/80 dark:border-blue-900/60">
            <div>
              <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                {t.totalPayable} {t.startingAt}
              </span>
              <div className="text-2xl font-black text-blue-950 dark:text-white font-mono">
                ₹{svc.basePrice}
                <span className="text-xs font-normal text-slate-500 ml-1.5">+ 18% GST</span>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                {lang === 'hi' ? 'सर्वश्रेष्ठ मूल्य गारंटी' : 'Best Rate Assured'}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                {lang === 'hi' ? 'कैश या ऑनलाइन भुगतान' : 'Pay via UPI, Cards, or Cash'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
          <button
            onClick={closeServiceDetail}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {lang === 'hi' ? 'बंद करें' : 'Close'}
          </button>

          <button
            onClick={() => {
              closeServiceDetail();
              openBookingFlow(svc);
            }}
            className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-700/20 flex items-center justify-center gap-2"
          >
            <span>{t.bookNow}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
