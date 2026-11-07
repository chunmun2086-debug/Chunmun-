import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerAddress } from '../../types';
import {
  User,
  Phone,
  MapPin,
  Heart,
  Gift,
  HelpCircle,
  FileQuestion,
  Plus,
  Trash2,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Headphones,
  Lock,
  ChevronRight
} from 'lucide-react';

export const CustomerAccountView: React.FC = () => {
  const {
    customer,
    providers,
    addCustomerAddress,
    deleteCustomerAddress,
    fileComplaint,
    promos,
    openBookingFlow,
    services,
    lang,
    t
  } = useApp();

  const [activeSection, setActiveSection] = useState<'profile' | 'addresses' | 'favorites' | 'referral' | 'support'>('profile');

  // Address Form state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newTitle, setNewTitle] = useState('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newCity, setNewCity] = useState('Delhi NCR');
  const [newPincode, setNewPincode] = useState('');

  // Referral copy state
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Complaint form state
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);

  // Mobile OTP simulation modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPhone, setLoginPhone] = useState('+91 98111 22334');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newPincode) return;

    addCustomerAddress({
      title: newTitle,
      street: newStreet,
      landmark: newLandmark,
      city: newCity,
      pincode: newPincode
    });

    setNewStreet('');
    setNewLandmark('');
    setNewPincode('');
    setShowAddAddress(false);
  };

  const handleFileComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintSubject || !complaintDesc) return;

    fileComplaint({
      bookingId: 'GS-8912',
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      serviceName: 'General Home Service',
      subject: complaintSubject,
      description: complaintDesc
    });

    setComplaintSubject('');
    setComplaintDesc('');
    setComplaintSubmitted(true);
    setTimeout(() => setComplaintSubmitted(false), 4000);
  };

  const copyRefCode = () => {
    navigator.clipboard?.writeText(customer.referralCode);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const favoritePros = providers.filter((p) =>
    customer.favoriteProIds.includes(p.id)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6">
      
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl font-black border border-white/30 shadow-md">
              {customer.name[0]}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{customer.name}</h2>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider">
                  Verified User
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>{customer.phone}</span>
              </p>
              <p className="text-[11px] text-blue-300 mt-1">
                Ghar Seva Credits: <span className="font-bold text-white font-mono">₹{customer.credits}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLoginModal(true)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            {lang === 'hi' ? 'फोन / OTP सत्यापन' : 'Manage Login / OTP'}
          </button>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'profile', labelEn: 'Overview', labelHi: 'विवरण', icon: User },
          { key: 'addresses', labelEn: 'Saved Addresses', labelHi: 'सहेजे गए पते', icon: MapPin },
          { key: 'favorites', labelEn: 'Favorite Pros', labelHi: 'पसंदीदा प्रो', icon: Heart },
          { key: 'referral', labelEn: 'Refer & Earn', labelHi: 'रेफरल इनाम', icon: Gift },
          { key: 'support', labelEn: '24x7 Support', labelHi: 'हेल्पलाइन', icon: Headphones }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? tab.labelHi : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: OVERVIEW */}
      {activeSection === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              {lang === 'hi' ? 'त्वरित सारांश' : 'Account Summary'}
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Member Since:</span>
                <span className="font-bold">January 2026</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Saved Addresses:</span>
                <span className="font-bold">{customer.addresses.length}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Favorite Professionals:</span>
                <span className="font-bold">{customer.favoriteProIds.length}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Referral Wallet Balance:</span>
                <span className="font-bold text-emerald-600 font-mono">₹{customer.credits}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-800/80 rounded-3xl p-5 border border-orange-200/80 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider mb-2">
                <Gift className="w-4 h-4" />
                <span>{lang === 'hi' ? 'मित्रों को आमंत्रित करें' : 'Invite Friends & Family'}</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Earn ₹200 on Every Referral
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Share your referral code. When your friend completes their first service, both get ₹200 Ghar Seva credits.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-orange-200/60 dark:border-slate-700 flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-orange-950 dark:text-orange-400">
                {customer.referralCode}
              </span>
              <button
                onClick={copyRefCode}
                className="px-3 py-1.5 rounded-lg bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition-colors"
              >
                {copiedReferral ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: SAVED ADDRESSES */}
      {activeSection === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {lang === 'hi' ? 'सहेजे गए पते' : 'Saved Addresses'}
            </h3>
            <button
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-blue-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'hi' ? 'नया पता जोड़ें' : 'Add Address'}</span>
            </button>
          </div>

          {/* Add Address Form */}
          {showAddAddress && (
            <form
              onSubmit={handleSaveAddress}
              className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-blue-200 dark:border-blue-900 shadow-sm space-y-3"
            >
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {lang === 'hi' ? 'नया पता विवरण दर्ज करें' : 'Enter New Address Details'}
              </h4>

              <div className="grid grid-cols-3 gap-2">
                {['Home', 'Office', 'Parents'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setNewTitle(t)}
                    className={`py-1.5 text-xs font-bold rounded-lg border ${
                      newTitle === t ? 'bg-blue-700 text-white border-blue-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div>
                <input
                  type="text"
                  required
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="Flat No, Floor, Building / Society Name"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newLandmark}
                  onChange={(e) => setNewLandmark(e.target.value)}
                  placeholder="Landmark (Optional)"
                  className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="City"
                  className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  required
                  value={newPincode}
                  onChange={(e) => setNewPincode(e.target.value)}
                  placeholder="PIN Code"
                  className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 text-white font-bold text-xs hover:bg-blue-800"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {/* Saved List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {customer.addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      {addr.title}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {addr.street}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {addr.landmark ? `${addr.landmark}, ` : ''}{addr.city} - {addr.pincode}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => deleteCustomerAddress(addr.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                  title="Delete Address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: FAVORITE PROS */}
      {activeSection === 'favorites' && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {lang === 'hi' ? 'सहेजे गए पसंदीदा कारीगर' : 'Favorite Professionals'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favoritePros.map((pro) => (
              <div
                key={pro.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4"
              >
                <img
                  src={pro.avatar}
                  alt={pro.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {pro.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-semibold text-amber-600">★ {pro.rating}</span>
                    <span>·</span>
                    <span>{pro.completedJobsCount} jobs</span>
                  </div>
                  <button
                    onClick={() => {
                      const svc = services.find((s) => pro.tradeCategories.includes(s.id)) || services[0];
                      openBookingFlow(svc);
                    }}
                    className="mt-2 text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline"
                  >
                    {t.bookNow} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: REFERRAL REWARDS */}
      {activeSection === 'referral' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
          <div className="text-center max-w-md mx-auto space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center">
              <Gift className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Refer Friends, Earn Ghar Seva Cash
            </h3>
            <p className="text-xs text-slate-500">
              Give your friends ₹150 OFF on their first home repair booking, and you get ₹200 wallet balance when the job is completed!
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-between max-w-sm mx-auto">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Your Unique Code
              </span>
              <span className="text-lg font-mono font-black text-slate-900 dark:text-white">
                {customer.referralCode}
              </span>
            </div>
            <button
              onClick={copyRefCode}
              className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              {copiedReferral ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedReferral ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 5: CUSTOMER SUPPORT & COMPLAINTS */}
      {activeSection === 'support' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <Headphones className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                Toll-Free Helpline
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">24 Hours / 7 Days</p>
              <a href="tel:18001234567" className="mt-2 inline-block text-xs font-bold text-blue-700 hover:underline">
                1800-123-4567
              </a>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <Phone className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                WhatsApp Desk
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Quick Resolution</p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-xs font-bold text-emerald-600 hover:underline"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <ShieldCheck className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                Warranty Claim
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">30 Days Guarantee</p>
              <span className="mt-2 inline-block text-xs font-bold text-orange-600">
                100% Free Rework
              </span>
            </div>
          </div>

          {/* File Complaint Form */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              {lang === 'hi' ? 'शिकायत या फीडबैक दर्ज करें' : 'File a Complaint / Report an Issue'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Our escalation manager reviews complaints within 2 hours and issues prompt resolution or warranty rework.
            </p>

            {complaintSubmitted ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Ticket submitted successfully! Ticket ID #CMP-{Math.floor(100 + Math.random() * 900)}. An executive will call you shortly.
                </span>
              </div>
            ) : (
              <form onSubmit={handleFileComplaint} className="space-y-3">
                <input
                  type="text"
                  required
                  value={complaintSubject}
                  onChange={(e) => setComplaintSubject(e.target.value)}
                  placeholder="Subject (e.g. Technician delayed, improper repair, billing issue)"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border text-slate-900 dark:text-white"
                />

                <textarea
                  rows={3}
                  required
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  placeholder="Explain the issue in detail..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border text-slate-900 dark:text-white"
                />

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                >
                  Submit Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Simulated Mobile OTP Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>{t.loginSignup}</span>
              </h3>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setOtpSent(false);
                  setEnteredOtp('');
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Enter your mobile number to receive a 4-digit verification code.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  {t.mobileNumber}
                </label>
                <input
                  type="text"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-mono"
                />
              </div>

              {otpSent && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-semibold text-slate-400">
                      {t.enterOtp}
                    </label>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      Demo OTP: 1234
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={4}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="1234"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-mono text-center tracking-widest text-lg font-bold"
                  />
                </div>
              )}

              {!otpSent ? (
                <button
                  type="button"
                  onClick={() => setOtpSent(true)}
                  className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs"
                >
                  Send OTP SMS
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setOtpSent(false);
                    alert('OTP Verified! Logged in as Rohit Malhotra.');
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  {t.verifyOtp}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
