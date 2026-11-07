import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Headphones,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  FileQuestion
} from 'lucide-react';

export const SupportView: React.FC = () => {
  const { customer, fileComplaint, lang, t } = useApp();
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      qEn: 'What is the Ghar Seva 30-Day Guarantee?',
      qHi: 'घर सेवा 30-दिन वारंटी क्या है?',
      aEn: 'Every repair and servicing job completed through Ghar Seva includes an automatic 30-day rework warranty. If the exact same issue reoccurs, we send a technician for a complimentary rework with zero inspection fee.',
      aHi: 'घर सेवा के माध्यम से की गई प्रत्येक मरम्मत में 30 दिन की निःशुल्क रीवर्क वारंटी शामिल है। यदि समस्या दोबारा होती है तो हमारी टीम निःशुल्क पुनः निरीक्षण एवं समाधान करेगी।'
    },
    {
      qEn: 'How does the 15-30 minute emergency booking work?',
      qHi: '15-30 मिनट की आपातकालीन बुकिंग कैसे काम करती है?',
      aEn: 'When you choose Emergency booking, our geo-routing algorithm alerts all active, verified electricians or plumbers within 5km of your address. The first responder is dispatched immediately with rapid priority.',
      aHi: 'इमरजेंसी बुकिंग चुनने पर आपके 5 किमी दायरे में मौजूद निकटतम प्रमाणित इलेक्ट्रीशियन या प्लंबर को तुरंत भेजा जाता है।'
    },
    {
      qEn: 'Why do I need to share the 4-digit start OTP?',
      qHi: 'काम शुरू करने के लिए 4-अंकीय OTP क्यों जरूरी है?',
      aEn: 'The security OTP ensures that the professional who arrived at your doorstep is indeed the verified person assigned by Ghar Seva. Only share it when they arrive with ID.',
      aHi: 'सुरक्षा OTP यह सुनिश्चित करता है कि आपके दरवाजे पर आया व्यक्ति वही है जिसे घर सेवा ने अधिकृत किया है। उसके आने पर ही कोड बताएं।'
    },
    {
      qEn: 'Can I pay in cash after the service is completed?',
      qHi: 'क्या मैं काम पूरा होने के बाद नकद भुगतान कर सकता हूँ?',
      aEn: 'Yes! We support Cash on Service (COS) alongside UPI (GPay, PhonePe, Paytm), and Credit/Debit Cards. A digital GST invoice will be automatically updated upon payment.',
      aHi: 'हाँ! आप काम पूरा होने पर सीधे कारीगर को नकद भुगतान कर सकते हैं। इसके अलावा UPI और कार्ड से भी भुगतान संभव है।'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintSubject || !complaintDesc) return;

    fileComplaint({
      bookingId: 'GS-8912',
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      serviceName: 'Customer Support Request',
      subject: complaintSubject,
      description: complaintDesc
    });

    setComplaintSubject('');
    setComplaintDesc('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.support247}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {lang === 'hi'
            ? 'हम आपकी सेवा और संतुष्टि के लिए 24 घंटे उपलब्ध हैं'
            : 'Round-the-clock customer assistance, warranty claims and resolution desk'}
        </p>
      </div>

      {/* Contact Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-3">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Direct Phone Call
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Speak directly with an escalation manager for urgent booking support.
            </p>
          </div>
          <a
            href="tel:18001234567"
            className="mt-4 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs text-center block transition-colors"
          >
            Call 1800-123-4567
          </a>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-slate-700 text-emerald-600 flex items-center justify-center mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              WhatsApp Concierge
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Send photos, voice notes or share live location on WhatsApp.
            </p>
          </div>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center block transition-colors"
          >
            {t.whatsappBooking}
          </a>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-slate-700 text-orange-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              30-Day Free Rework
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              File a warranty claim if the repair issue recurs within 30 days.
            </p>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('complaint-box');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs text-center transition-colors"
          >
            Claim Warranty
          </button>
        </div>
      </div>

      {/* File Complaint Form */}
      <div id="complaint-box" className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {lang === 'hi' ? 'शिकायत या वारंटी क्लेम दर्ज करें' : 'Submit Issue or Warranty Claim'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Every ticket is assigned to a dedicated service manager with a resolution commitment in 2 hours.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Ticket registered successfully! Our team will contact you shortly.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              required
              value={complaintSubject}
              onChange={(e) => setComplaintSubject(e.target.value)}
              placeholder="Subject (e.g. AC cooling leak after service, plumber arrived late)"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border text-slate-900 dark:text-white"
            />
            <textarea
              rows={3}
              required
              value={complaintDesc}
              onChange={(e) => setComplaintDesc(e.target.value)}
              placeholder="Describe what happened in detail..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors"
            >
              Submit Support Ticket
            </button>
          </form>
        )}
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          {lang === 'hi' ? 'अक्सर पूछे जाने वाले सवाल (FAQs)' : 'Frequently Asked Questions'}
        </h3>

        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <span>{lang === 'hi' ? faq.qHi : faq.qEn}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700">
                  {lang === 'hi' ? faq.aHi : faq.aEn}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
