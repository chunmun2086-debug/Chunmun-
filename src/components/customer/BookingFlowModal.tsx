import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory, CustomerAddress, PaymentMethod, ServiceProvider } from '../../types';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Camera,
  Upload,
  UserCheck,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  ArrowLeft,
  Star,
  Check
} from 'lucide-react';

export const BookingFlowModal: React.FC = () => {
  const {
    isBookingFlowOpen,
    bookingInitialService,
    isEmergencyFlow,
    closeBookingFlow,
    customer,
    providers,
    services,
    city,
    applyCoupon,
    createBooking,
    openTracking,
    lang,
    t
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<ServiceCategory>(
    bookingInitialService || services[0]
  );
  const [isEmergency, setIsEmergency] = useState<boolean>(isEmergencyFlow);

  // Date & Time
  const [selectedDate, setSelectedDate] = useState<string>('Today');
  const [selectedSlot, setSelectedSlot] = useState<string>(
    isEmergencyFlow
      ? 'Urgent / Immediate (Within 30 Mins)'
      : 'Morning (08:00 AM - 12:00 PM)'
  );

  // Address
  const [addressTitle, setAddressTitle] = useState<string>('Home');
  const [flatNo, setFlatNo] = useState<string>(customer.addresses[0]?.street.split(',')[0] || 'Flat 402, Tower B');
  const [streetLandmark, setStreetLandmark] = useState<string>(
    customer.addresses[0]?.landmark || 'Near Main Market, Sector 15'
  );
  const [addrCity, setAddrCity] = useState<string>(city);
  const [pincode, setPincode] = useState<string>(customer.addresses[0]?.pincode || '110001');

  // Problem description & photo
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [problemPhotos, setProblemPhotos] = useState<string[]>([]);

  // Pro selection
  const [selectedProId, setSelectedProId] = useState<string>('auto');

  // Coupon
  const [couponCode, setCouponCode] = useState<string>('GHARFIRST');
  const [couponFeedback, setCouponFeedback] = useState<{ valid: boolean; discount: number; message: string } | null>(null);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Reset when opening
  React.useEffect(() => {
    if (bookingInitialService) {
      setSelectedService(bookingInitialService);
    }
    setIsEmergency(isEmergencyFlow);
    if (isEmergencyFlow) {
      setSelectedDate('Today');
      setSelectedSlot('Urgent / Immediate (Within 30 Mins)');
    }
  }, [bookingInitialService, isEmergencyFlow]);

  if (!isBookingFlowOpen) return null;

  // Matching Pros for trade
  const availablePros = providers.filter((p) =>
    p.tradeCategories.includes(selectedService.id)
  );

  // Pricing Calculation
  const baseFare = selectedService.basePrice;
  const extraFee = isEmergency ? 149 : 49;
  let promoDiscount = 0;
  if (couponFeedback?.valid) {
    promoDiscount = couponFeedback.discount;
  }
  const taxable = Math.max(0, baseFare + extraFee - promoDiscount);
  const gstAmount = Math.round(taxable * 0.18 * 100) / 100;
  const finalTotal = Math.round((taxable + gstAmount) * 100) / 100;

  // Handle coupon check
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode, baseFare);
    setCouponFeedback(res);
  };

  // Add dummy photo preview
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProblemPhotos((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Simulate snapshot
      setProblemPhotos((prev) => [
        ...prev,
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop&q=80'
      ]);
    }
  };

  // Confirm booking
  const handleConfirmBooking = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const targetAddress: CustomerAddress = {
        id: `addr-${Date.now()}`,
        title: addressTitle,
        street: `${flatNo}, ${streetLandmark}`,
        landmark: streetLandmark,
        city: addrCity,
        pincode
      };

      const newBooking = createBooking({
        service: selectedService,
        address: targetAddress,
        date: selectedDate,
        timeSlot: selectedSlot,
        isEmergency,
        problemDescription,
        problemPhotos,
        preferredProviderId: selectedProId !== 'auto' ? selectedProId : undefined,
        paymentMethod,
        couponCode: couponFeedback?.valid ? couponCode : undefined
      });

      setIsProcessing(false);
      closeBookingFlow();
      openTracking(newBooking);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        
        {/* Wizard Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-300"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{lang === 'hi' ? 'सेवा बुकिंग' : 'Book Home Service'}</span>
                {isEmergency && (
                  <span className="px-2 py-0.5 rounded-md bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    ⚡ 15-30 Min Rapid
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500">
                {step === 1 && (lang === 'hi' ? 'चरण 1: सेवा व समय' : 'Step 1: Service & Schedule')}
                {step === 2 && (lang === 'hi' ? 'चरण 2: पता एवं समस्या' : 'Step 2: Address & Problem Info')}
                {step === 3 && (lang === 'hi' ? 'चरण 3: प्रो एवं भुगतान' : 'Step 3: Professional & Payment')}
              </p>
            </div>
          </div>

          <button
            onClick={closeBookingFlow}
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Step Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1">
          <div
            className="bg-blue-600 h-1 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Wizard Step Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">

          {/* STEP 1: SERVICE, DATE & TIME */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Selected Service Card */}
              <div className="flex items-center gap-3 p-3.5 bg-blue-50/80 dark:bg-blue-950/40 rounded-2xl border border-blue-200/80 dark:border-blue-900/60">
                <img
                  src={selectedService.image}
                  alt={selectedService.nameEn}
                  className="w-14 h-14 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {lang === 'hi' ? selectedService.nameHi : selectedService.nameEn}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-bold text-blue-900 dark:text-blue-300 font-mono">
                      ₹{selectedService.basePrice}
                    </span>
                    <span>·</span>
                    <span>{selectedService.durationMinutes} mins</span>
                    <span>·</span>
                    <span>{selectedService.warrantyDays}d Warranty</span>
                  </div>
                </div>
              </div>

              {/* Emergency Toggle */}
              <div
                onClick={() => {
                  const nextEmergency = !isEmergency;
                  setIsEmergency(nextEmergency);
                  if (nextEmergency) {
                    setSelectedSlot('Urgent / Immediate (Within 30 Mins)');
                    setSelectedDate('Today');
                  }
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isEmergency
                    ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-400 text-orange-950 dark:text-orange-200'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold">
                      {lang === 'hi' ? 'आपातकालीन त्वरित सेवा (15-30 मिनट)' : 'Emergency 15-30 Min Rapid Booking'}
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {lang === 'hi' ? 'तुरंत नजदीकी उपलब्ध प्रो को भेजा जाएगा (+₹100)' : 'Priority dispatch to nearest available verified pro (+₹100)'}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                    isEmergency ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-400'
                  }`}
                >
                  {isEmergency && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                  {t.selectDateTime}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Today', 'Tomorrow', 'In 2 Days'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                        selectedDate === d
                          ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {d === 'Today' && (lang === 'hi' ? 'आज' : 'Today')}
                      {d === 'Tomorrow' && (lang === 'hi' ? 'कल' : 'Tomorrow')}
                      {d === 'In 2 Days' && (lang === 'hi' ? 'परसों' : 'In 2 Days')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Selection */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                  {lang === 'hi' ? 'समय स्लॉट' : 'Preferred Time Slot'}
                </label>
                <div className="space-y-2">
                  {[
                    t.timeSlotMorning,
                    t.timeSlotAfternoon,
                    t.timeSlotEvening,
                    t.timeSlotUrgent
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`w-full text-left p-3 rounded-xl text-xs font-medium border flex items-center justify-between transition-colors ${
                        selectedSlot === slot
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 border-blue-500 font-semibold'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{slot}</span>
                      </div>
                      {selectedSlot === slot && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ADDRESS & PROBLEM DESCRIPTION */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>{t.serviceAddress}</span>
                </label>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {['Home', 'Office', 'Other'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAddressTitle(type)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        addressTitle === type
                          ? 'bg-blue-700 text-white border-blue-700'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">
                      {t.flatHouseNo}
                    </label>
                    <input
                      type="text"
                      value={flatNo}
                      onChange={(e) => setFlatNo(e.target.value)}
                      placeholder="e.g. Flat 301, Tower A, Sunshine Residency"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">
                      {t.streetLandmark}
                    </label>
                    <input
                      type="text"
                      value={streetLandmark}
                      onChange={(e) => setStreetLandmark(e.target.value)}
                      placeholder="e.g. Near Metro Station / Apollo Pharmacy"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-1">
                        {t.city}
                      </label>
                      <input
                        type="text"
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-1">
                        {t.pincode}
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="e.g. 201301"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-1.5">
                  {t.problemDesc}
                </label>
                <textarea
                  rows={2}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder={t.problemDescPlaceholder}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Photos of the problem */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-1.5">
                  {t.uploadPhotos}
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer border border-dashed border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors">
                    <Camera className="w-4 h-4 text-blue-600" />
                    <span>{lang === 'hi' ? 'फोटो खींचें या अपलोड करें' : 'Upload Problem Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setProblemPhotos((prev) => [
                        ...prev,
                        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop&q=80'
                      ])
                    }
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    + Add Sample Pic
                  </button>
                </div>

                {problemPhotos.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    {problemPhotos.map((p, idx) => (
                      <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border">
                        <img src={p} alt="Problem Preview" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setProblemPhotos(problemPhotos.filter((_, i) => i !== idx))}
                          className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white text-[9px] flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: PRO SELECTION, COUPON & PAYMENT */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Pro Selection */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>{t.selectProPref}</span>
                </label>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProId('auto')}
                    className={`w-full text-left p-3 rounded-xl text-xs border flex items-center justify-between transition-colors ${
                      selectedProId === 'auto'
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 border-blue-500 font-semibold'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-bold block">{t.autoAssignPro}</span>
                      <span className="text-[11px] text-slate-500">
                        {lang === 'hi' ? 'उच्चतम रेटिंग वाला निकटतम कारीगर' : 'Highest rated pro within 5km radius'}
                      </span>
                    </div>
                    {selectedProId === 'auto' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>

                  {availablePros.map((pro) => (
                    <button
                      key={pro.id}
                      type="button"
                      onClick={() => setSelectedProId(pro.id)}
                      className={`w-full text-left p-3 rounded-xl text-xs border flex items-center justify-between transition-colors ${
                        selectedProId === pro.id
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 border-blue-500 font-semibold'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={pro.avatar}
                          alt={pro.name}
                          className="w-8 h-8 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-bold block">{pro.name}</span>
                          <span className="text-[10px] text-slate-500">
                            ★ {pro.rating} · {pro.completedJobsCount} jobs · {pro.experienceYears}y exp
                          </span>
                        </div>
                      </div>
                      {selectedProId === pro.id && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Promo Code Input */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-1.5">
                  {t.applyCoupon}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={t.couponPlaceholder}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono uppercase focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                  >
                    {t.apply}
                  </button>
                </div>
                {couponFeedback && (
                  <p
                    className={`text-[11px] font-semibold mt-1 ${
                      couponFeedback.valid ? 'text-emerald-600' : 'text-red-500'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{t.baseFare}</span>
                  <span className="font-mono">₹{baseFare}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{isEmergency ? t.emergencyFee : t.extraFee}</span>
                  <span className="font-mono">₹{extraFee}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>{t.promoDiscount}</span>
                    <span className="font-mono">-₹{promoDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{t.gstTax}</span>
                  <span className="font-mono">₹{gstAmount}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white text-sm">
                  <span>{t.totalPayable}</span>
                  <span className="font-mono text-blue-700 dark:text-blue-400">
                    ₹{finalTotal}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block mb-2">
                  {t.paymentMethod}
                </label>

                <div className="space-y-2">
                  {/* UPI */}
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'upi'
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-orange-600" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {t.payUpi}
                        </span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'upi' ? 'border-blue-600 bg-blue-600' : 'border-slate-400'
                        }`}
                      >
                        {paymentMethod === 'upi' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="mt-3 pt-2.5 border-t border-blue-200/50 dark:border-blue-900/40 grid grid-cols-4 gap-2">
                        {['gpay', 'phonepe', 'paytm', 'qr'].map((app) => (
                          <button
                            key={app}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUpiApp(app as any);
                            }}
                            className={`py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border text-center transition-colors ${
                              upiApp === app
                                ? 'bg-blue-700 text-white border-blue-700'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {app}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'card'
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {t.payCard}
                        </span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'card' ? 'border-blue-600 bg-blue-600' : 'border-slate-400'
                        }`}
                      >
                        {paymentMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="mt-3 pt-2.5 border-t border-blue-200/50 dark:border-blue-900/40 space-y-2">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="Card Number (4312 XXXX XXXX 8912)"
                          className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                          />
                          <input
                            type="password"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="CVV"
                            className="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cash on Service */}
                  <div
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'cash'
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {t.payCash}
                        </span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'cash' ? 'border-blue-600 bg-blue-600' : 'border-slate-400'
                        }`}
                      >
                        {paymentMethod === 'cash' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
              {t.totalPayable}
            </span>
            <span className="text-lg font-black text-blue-900 dark:text-white font-mono">
              ₹{finalTotal}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-700/20 flex items-center gap-1.5"
              >
                <span>{lang === 'hi' ? 'अगला कदम' : 'Next Step'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-600/30 flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>{lang === 'hi' ? 'पुष्टि हो रही है...' : 'Confirming...'}</span>
                ) : (
                  <>
                    <span>{t.confirmBooking}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
