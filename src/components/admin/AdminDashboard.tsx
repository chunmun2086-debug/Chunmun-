import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory, Booking, PromoCode, ComplaintTicket } from '../../types';
import {
  Sliders,
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Bell,
  Search,
  FileText,
  Calendar,
  Zap,
  Tag
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    services,
    addService,
    updateService,
    deleteService,
    providers,
    verifyProvider,
    bookings,
    updateBookingStatus,
    openInvoice,
    promos,
    addPromo,
    togglePromoActive,
    complaints,
    resolveComplaint,
    broadcastNotification,
    lang,
    t
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'analytics' | 'bookings' | 'services' | 'providers' | 'coupons' | 'complaints'
  >('analytics');

  // Service Edit/Add modal state
  const [editingService, setEditingService] = useState<ServiceCategory | null>(null);
  const [showAddService, setShowAddService] = useState(false);
  const [newSvcNameEn, setNewSvcNameEn] = useState('');
  const [newSvcNameHi, setNewSvcNameHi] = useState('');
  const [newSvcPrice, setNewSvcPrice] = useState(299);
  const [newSvcCategory, setNewSvcCategory] = useState<'repair' | 'cleaning' | 'heavy' | 'appliance' | 'special'>('repair');
  const [newSvcEmergency, setNewSvcEmergency] = useState(false);

  // Promo code form state
  const [showAddPromo, setShowAddPromo] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoType, setNewPromoType] = useState<'percentage' | 'flat'>('flat');
  const [newPromoVal, setNewPromoVal] = useState(100);
  const [newPromoMin, setNewPromoMin] = useState(500);

  // Broadcast modal state
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'customer' | 'provider'>('all');

  // Revenue analytics calculations
  const totalGMV = bookings.reduce((sum, b) => (b.status !== 'cancelled' ? sum + b.totalAmount : sum), 0);
  const totalPlatformCut = Math.round(totalGMV * 0.1);
  const totalBookingsCount = bookings.length;
  const verifiedProsCount = providers.filter((p) => p.isVerified).length;
  const openComplaintsCount = complaints.filter((c) => c.status !== 'resolved').length;

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSvcNameEn) return;

    addService({
      nameEn: newSvcNameEn,
      nameHi: newSvcNameHi || newSvcNameEn,
      descEn: 'Comprehensive inspection, repair and maintenance with 30-day warranty.',
      descHi: '30 दिन की वारंटी के साथ व्यापक निरीक्षण, मरम्मत एवं रखरखाव।',
      icon: 'Wrench',
      categoryGroup: newSvcCategory,
      basePrice: Number(newSvcPrice),
      durationMinutes: 60,
      emergencyAvailable: newSvcEmergency,
      rating: 4.85,
      reviewsCount: 1,
      image: '/src/assets/images/hero_home_services_1794051468151.jpg',
      warrantyDays: 30,
      featuresEn: ['Certified professional', 'Safety standard check', 'GST invoice'],
      featuresHi: ['प्रमाणित कारीगर', 'सुरक्षा जांच', 'जीएसटी बिल']
    });

    setNewSvcNameEn('');
    setNewSvcNameHi('');
    setShowAddService(false);
  };

  const handleSaveEditService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    updateService(editingService);
    setEditingService(null);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode) return;

    addPromo({
      code: newPromoCode.trim().toUpperCase(),
      discountType: newPromoType,
      discountValue: Number(newPromoVal),
      minBookingValue: Number(newPromoMin),
      maxDiscount: newPromoType === 'flat' ? Number(newPromoVal) : 300,
      descriptionEn: `${newPromoType === 'flat' ? `₹${newPromoVal}` : `${newPromoVal}%`} OFF on booking`,
      descriptionHi: `बुकिंग पर ${newPromoType === 'flat' ? `₹${newPromoVal}` : `${newPromoVal}%`} की छूट`,
      validTill: '2026-12-31',
      isActive: true
    });

    setNewPromoCode('');
    setShowAddPromo(false);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) return;

    broadcastNotification({
      titleEn: broadcastTitle,
      titleHi: broadcastTitle,
      messageEn: broadcastMsg,
      messageHi: broadcastMsg,
      targetRole: broadcastTarget,
      type: 'info'
    });

    setBroadcastTitle('');
    setBroadcastMsg('');
    setShowBroadcastModal(false);
    alert('Broadcast notification pushed successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6">
      
      {/* Admin Command Header */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-orange-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
              Control Panel
            </span>
            <span className="text-xs text-slate-400">Ghar Seva Platform v2.4</span>
          </div>
          <h1 className="text-2xl font-black mt-1">
            {t.adminDashboardTitle}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational governance, partner KYC verification, commission tracking & catalog management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span>{t.sendBroadcast}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
            {t.totalRevenue}
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
            ₹{totalGMV.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +18.4% this mo
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
            Platform Cut (10%)
          </span>
          <span className="text-lg font-black text-blue-700 dark:text-blue-400 font-mono mt-0.5 block">
            ₹{totalPlatformCut.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Net Revenue</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
            {t.totalBookings}
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
            {totalBookingsCount}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">Lifetime Orders</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
            {t.activePros}
          </span>
          <span className="text-lg font-black text-emerald-600 font-mono mt-0.5 block">
            {verifiedProsCount}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">KYC Verified</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
            {t.openComplaints}
          </span>
          <span className="text-lg font-black text-orange-600 font-mono mt-0.5 block">
            {openComplaintsCount}
          </span>
          <span className="text-[10px] text-orange-600 mt-1 block">Requires Action</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto text-xs font-bold">
        {[
          { key: 'analytics', label: 'Overview & Revenue' },
          { key: 'bookings', label: `Bookings (${bookings.length})` },
          { key: 'services', label: `Catalog (${services.length})` },
          { key: 'providers', label: `Service Pros (${providers.length})` },
          { key: 'coupons', label: `Coupons (${promos.length})` },
          { key: 'complaints', label: `Helpdesk (${complaints.length})` }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveAdminTab(tab.key as any)}
            className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeAdminTab === tab.key
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ANALYTICS & REVENUE BREAKDOWN */}
      {activeAdminTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Revenue Breakdown by Timeframe
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Today's Estimated GMV:</span>
                  <span className="font-bold font-mono">₹4,340</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[45%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">This Week's GMV:</span>
                  <span className="font-bold font-mono">₹38,200</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full w-[70%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">This Month's GMV:</span>
                  <span className="font-bold font-mono">₹1,42,800</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[88%]" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 flex justify-between">
              <span>Platform Take Rate:</span>
              <span className="font-bold text-slate-900 dark:text-white">10.0% Standard Service Fee</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Top Service Categories by Volume
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">AC Repair & Service</span>
                <span className="font-mono font-bold text-blue-600">38% Share</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">Electrician (Wiring & MCB)</span>
                <span className="font-mono font-bold text-blue-600">26% Share</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">Deep Cleaning & Sanitization</span>
                <span className="font-mono font-bold text-blue-600">21% Share</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">Plumbing & RO Service</span>
                <span className="font-mono font-bold text-blue-600">15% Share</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS MANAGEMENT */}
      {activeAdminTab === 'bookings' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              All Platform Bookings
            </h3>
            <span className="text-xs text-slate-500">{bookings.length} Total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-700/50 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="p-3">Booking ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Assigned Pro</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                    <td className="p-3 font-mono font-bold text-blue-600">
                      #{b.id}
                      {b.isEmergency && <span className="text-orange-600 ml-1">⚡</span>}
                    </td>
                    <td className="p-3">
                      <span className="font-bold block text-slate-900 dark:text-white">{b.customerName}</span>
                      <span className="text-[11px] text-slate-500">{b.customerPhone}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{b.serviceNameEn}</span>
                      <span className="text-[10px] text-slate-400 block">{b.bookingDate}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-slate-700 dark:text-slate-300">
                        {b.assignedProviderName || 'Auto-Dispatch'}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold">₹{b.totalAmount}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {b.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => openInvoice(b)}
                        className="px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-400 hover:underline"
                      >
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES CATALOG MANAGEMENT */}
      {activeAdminTab === 'services' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Service Catalog & Pricing Engine ({services.length})
              </h3>
              <p className="text-xs text-slate-500">
                Configure services, modify base rate cards, and toggle emergency availability
              </p>
            </div>

            <button
              onClick={() => setShowAddService(!showAddService)}
              className="px-4 py-2 rounded-xl bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-blue-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addNewService}</span>
            </button>
          </div>

          {/* Add New Service Form */}
          {showAddService && (
            <form
              onSubmit={handleCreateService}
              className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-blue-200 dark:border-blue-900 shadow-sm space-y-3"
            >
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Add New Home Service
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={newSvcNameEn}
                  onChange={(e) => setNewSvcNameEn(e.target.value)}
                  placeholder="Service Name (English) e.g. Solar Panel Cleaning"
                  className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  value={newSvcNameHi}
                  onChange={(e) => setNewSvcNameHi(e.target.value)}
                  placeholder="Service Name (Hindi) e.g. सोलर पैनल सफाई"
                  className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newSvcPrice}
                    onChange={(e) => setNewSvcPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Category Group</label>
                  <select
                    value={newSvcCategory}
                    onChange={(e) => setNewSvcCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border text-slate-900 dark:text-white"
                  >
                    <option value="repair">Quick Repair</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="appliance">Appliance</option>
                    <option value="heavy">Heavy Works</option>
                    <option value="special">Special</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="emergencyCheck"
                    checked={newSvcEmergency}
                    onChange={(e) => setNewSvcEmergency(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="emergencyCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Emergency 15-Min Available
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddService(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 text-white font-bold text-xs"
                >
                  Create Service
                </button>
              </div>
            </form>
          )}

          {/* Edit Service Modal */}
          {editingService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <form
                onSubmit={handleSaveEditService}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl"
              >
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Edit Service: {editingService.nameEn}
                </h3>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Base Fare (₹)</label>
                  <input
                    type="number"
                    value={editingService.basePrice}
                    onChange={(e) =>
                      setEditingService({ ...editingService, basePrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Warranty (Days)</label>
                  <input
                    type="number"
                    value={editingService.warrantyDays}
                    onChange={(e) =>
                      setEditingService({ ...editingService, warrantyDays: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editEmergency"
                    checked={editingService.emergencyAvailable}
                    onChange={(e) =>
                      setEditingService({ ...editingService, emergencyAvailable: e.target.checked })
                    }
                  />
                  <label htmlFor="editEmergency" className="text-xs font-semibold">
                    15-30 Min Emergency Service Available
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-700 text-white font-bold text-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {svc.nameEn}
                    </h4>
                    {svc.emergencyAvailable && (
                      <span className="text-[9px] bg-orange-600 text-white px-1.5 py-0.2 rounded font-bold uppercase">
                        ⚡ SOS
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 mt-0.5 block">
                    ₹{svc.basePrice} · {svc.warrantyDays}d Warranty
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingService(svc)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 transition-colors"
                    title="Edit Service"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteService(svc.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SERVICE PROVIDERS & KYC APPROVAL */}
      {activeAdminTab === 'providers' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Service Provider Fleet & KYC Approvals
            </h3>
            <span className="text-xs text-slate-500">{providers.length} Registered Pros</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-700/50 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="p-3">Professional</th>
                  <th className="p-3">Trade Categories</th>
                  <th className="p-3">Aadhaar UID</th>
                  <th className="p-3">Rating & Jobs</th>
                  <th className="p-3">KYC Status</th>
                  <th className="p-3 text-right">Approve / Reject</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {providers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-8 h-8 rounded-lg object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-bold block text-slate-900 dark:text-white">{p.name}</span>
                          <span className="text-[10px] text-slate-500">{p.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                        {p.tradeCategories.join(', ')}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">
                      {p.aadhaarNumber}
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-amber-600">★ {p.rating}</span>
                      <span className="text-[11px] text-slate-400 ml-1">({p.completedJobsCount} jobs)</span>
                    </td>
                    <td className="p-3">
                      {p.isVerified ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {p.isVerified ? (
                        <button
                          onClick={() => verifyProvider(p.id, false)}
                          className="px-2.5 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Revoke
                        </button>
                      ) : (
                        <button
                          onClick={() => verifyProvider(p.id, true)}
                          className="px-3 py-1 text-[11px] font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          {t.approvePartner}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PROMO CODES */}
      {activeAdminTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Promotional Coupons & Discounts
            </h3>
            <button
              onClick={() => setShowAddPromo(!showAddPromo)}
              className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Coupon</span>
            </button>
          </div>

          {showAddPromo && (
            <form
              onSubmit={handleCreatePromo}
              className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-orange-200 shadow-sm space-y-3"
            >
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Create New Promotional Code
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value)}
                  placeholder="Code (e.g. SUMMER30)"
                  className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border font-mono uppercase"
                />
                <select
                  value={newPromoType}
                  onChange={(e) => setNewPromoType(e.target.value as any)}
                  className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border"
                >
                  <option value="flat">Flat ₹ Discount</option>
                  <option value="percentage">% Percentage Discount</option>
                </select>
                <input
                  type="number"
                  required
                  value={newPromoVal}
                  onChange={(e) => setNewPromoVal(Number(e.target.value))}
                  placeholder="Value (e.g. 150)"
                  className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border font-mono"
                />
                <input
                  type="number"
                  required
                  value={newPromoMin}
                  onChange={(e) => setNewPromoMin(Number(e.target.value))}
                  placeholder="Min Order (e.g. 400)"
                  className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPromo(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {promos.map((p) => (
              <div
                key={p.code}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-orange-600 text-white font-mono font-bold text-xs uppercase">
                    {p.code}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1.5">
                    {p.descriptionEn}
                  </p>
                  <span className="text-[10px] text-slate-400">Min Order: ₹{p.minBookingValue}</span>
                </div>

                <button
                  onClick={() => togglePromoActive(p.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    p.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {p.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CUSTOMER COMPLAINTS */}
      {activeAdminTab === 'complaints' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-700">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Customer Escalations & Helpdesk Tickets
              </h3>
              <p className="text-xs text-slate-500">
                Resolve quality issues, warranty rework requests, or issue direct refunds
              </p>
            </div>
            <span className="text-xs font-bold text-orange-600">
              {complaints.filter((c) => c.status !== 'resolved').length} Open
            </span>
          </div>

          <div className="space-y-3">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-red-600">#{c.id}</span>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {c.subject}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        c.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    "{c.description}"
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span>Customer: {c.customerName} ({c.customerPhone})</span>
                    <span>·</span>
                    <span>Booking: {c.bookingId}</span>
                  </div>
                </div>

                {c.status !== 'resolved' && (
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => resolveComplaint(c.id, 'Warranty rework scheduled with senior technician', 0)}
                      className="px-3 py-1.5 rounded-xl bg-blue-700 text-white font-bold text-xs hover:bg-blue-800"
                    >
                      Assign Free Rework
                    </button>
                    <button
                      onClick={() => resolveComplaint(c.id, 'Full refund approved', 299)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                    >
                      Issue Refund
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Broadcast Notification Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleBroadcast}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl"
          >
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-orange-600" />
              <span>Broadcast Push Notification</span>
            </h3>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Target Audience</label>
              <select
                value={broadcastTarget}
                onChange={(e) => setBroadcastTarget(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
              >
                <option value="all">All Users (Customers & Pros)</option>
                <option value="customer">Customers Only</option>
                <option value="provider">Service Providers Only</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Title</label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. Diwali Cleaning Rush: 25% OFF!"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Message Content</label>
              <textarea
                rows={3}
                required
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="Notification message body..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-700 text-white font-bold text-xs hover:bg-blue-800"
              >
                Send Broadcast
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
