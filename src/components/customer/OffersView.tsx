import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tag, Copy, Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const OffersView: React.FC = () => {
  const { promos, openBookingFlow, services, lang, t } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.specialOffers}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {lang === 'hi'
            ? 'अपनी पसंदीदा घरेलू सेवाओं पर सर्वोत्तम छूट और बचत कूपन'
            : 'Exclusive discounts, festival deals, and voucher codes for your household maintenance'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promos.map((p) => (
          <div
            key={p.code}
            className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-orange-600 text-white font-mono font-bold text-xs uppercase tracking-wider">
                  {p.code}
                </span>

                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white mt-3">
                {lang === 'hi' ? p.descriptionHi : p.descriptionEn}
              </h3>

              <div className="mt-2 space-y-1 text-xs text-slate-500">
                <p>• Minimum Booking Value: ₹{p.minBookingValue}</p>
                <p>• Maximum Discount Cap: ₹{p.maxDiscount}</p>
                <p>• Valid till: {p.validTill}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
              <button
                onClick={() => handleCopy(p.code)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                {copiedCode === p.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === p.code ? 'Copied' : 'Copy Code'}</span>
              </button>

              <button
                onClick={() => openBookingFlow(services[0])}
                className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>{lang === 'hi' ? 'अभी लागू करें' : 'Book with Code'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Promotional Package Banners */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-blue-200 font-bold text-[10px] uppercase tracking-wider">
            Mega Home Care Bundle
          </span>
          <h3 className="text-xl font-bold mt-1.5">
            Full Home Deep Cleaning + 2 AC Service Package
          </h3>
          <p className="text-xs text-blue-200 mt-1 max-w-lg">
            Save ₹800 on comprehensive seasonal care. Includes steam sanitation, chemical jet foam AC wash, and sofa shampoo.
          </p>
        </div>

        <button
          onClick={() => openBookingFlow(services.find((s) => s.id === 'deep_cleaning') || services[0])}
          className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg whitespace-nowrap"
        >
          {t.bookNow}
        </button>
      </div>
    </div>
  );
};
