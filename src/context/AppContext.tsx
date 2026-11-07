import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Language,
  ServiceCategory,
  ServiceProvider,
  PromoCode,
  Booking,
  ComplaintTicket,
  ChatMessage,
  AppNotification,
  CustomerAddress,
  BookingStatus,
  PaymentMethod
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_PROVIDERS,
  INITIAL_PROMOS,
  INITIAL_BOOKINGS,
  INITIAL_COMPLAINTS
} from '../data/mockData';
import { translations } from '../utils/translations';

interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  addresses: CustomerAddress[];
  favoriteProIds: string[];
  referralCode: string;
  credits: number;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: (typeof translations)['en'];
  city: string;
  setCity: (city: string) => void;
  services: ServiceCategory[];
  providers: ServiceProvider[];
  bookings: Booking[];
  promos: PromoCode[];
  complaints: ComplaintTicket[];
  chatMessages: Record<string, ChatMessage[]>;
  notifications: AppNotification[];
  customer: CustomerProfile;
  currentProvider: ServiceProvider;
  setCurrentProviderId: (id: string) => void;
  
  // Modals & Active State
  activeServiceDetail: ServiceCategory | null;
  openServiceDetail: (service: ServiceCategory) => void;
  closeServiceDetail: () => void;
  
  isBookingFlowOpen: boolean;
  bookingInitialService: ServiceCategory | null;
  isEmergencyFlow: boolean;
  openBookingFlow: (service?: ServiceCategory, isEmergency?: boolean) => void;
  closeBookingFlow: () => void;
  
  activeTrackingBooking: Booking | null;
  openTracking: (booking: Booking) => void;
  closeTracking: () => void;
  
  activeInvoiceBooking: Booking | null;
  openInvoice: (booking: Booking) => void;
  closeInvoice: () => void;
  
  activeChatBooking: Booking | null;
  openChat: (booking: Booking) => void;
  closeChat: () => void;

  // Actions
  createBooking: (params: {
    service: ServiceCategory;
    address: CustomerAddress;
    date: string;
    timeSlot: string;
    isEmergency: boolean;
    problemDescription: string;
    problemPhotos: string[];
    preferredProviderId?: string;
    paymentMethod: PaymentMethod;
    couponCode?: string;
  }) => Booking;
  cancelBooking: (bookingId: string, reason: string) => boolean;
  updateBookingStatus: (bookingId: string, status: BookingStatus, otpAttempt?: string) => { success: boolean; message?: string };
  rateBooking: (bookingId: string, rating: number, review: string) => void;
  applyCoupon: (code: string, subtotal: number) => { valid: boolean; discount: number; message: string };
  addCustomerAddress: (address: Omit<CustomerAddress, 'id'>) => void;
  deleteCustomerAddress: (id: string) => void;
  toggleFavoritePro: (proId: string) => void;
  
  // Provider Actions
  toggleProviderOnline: (providerId: string) => void;
  updateProviderBank: (providerId: string, bank: ServiceProvider['bankAccount']) => void;
  requestPayout: (providerId: string, amount: number) => boolean;
  
  // Admin Actions
  verifyProvider: (providerId: string, approved: boolean) => void;
  addService: (service: Omit<ServiceCategory, 'id'>) => void;
  updateService: (service: ServiceCategory) => void;
  deleteService: (serviceId: string) => void;
  addPromo: (promo: PromoCode) => void;
  togglePromoActive: (code: string) => void;
  fileComplaint: (complaint: Omit<ComplaintTicket, 'id' | 'createdAt' | 'status'>) => void;
  resolveComplaint: (complaintId: string, resolutionNotes: string, refundAmount?: number) => void;
  broadcastNotification: (notif: Omit<AppNotification, 'id' | 'createdAt'>) => void;
  sendChatMessage: (bookingId: string, message: string, senderRole: 'customer' | 'provider' | 'support', senderName: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'gharseva_role_v1',
  LANG: 'gharseva_lang_v1',
  CITY: 'gharseva_city_v1',
  SERVICES: 'gharseva_services_v1',
  PROVIDERS: 'gharseva_providers_v1',
  BOOKINGS: 'gharseva_bookings_v1',
  PROMOS: 'gharseva_promos_v1',
  COMPLAINTS: 'gharseva_complaints_v1',
  CHATS: 'gharseva_chats_v1',
  NOTIFICATIONS: 'gharseva_notifs_v1',
  CUSTOMER: 'gharseva_customer_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'customer';
  });

  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'en';
  });

  const [city, setCityState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CITY) || 'Delhi NCR';
  });

  const [services, setServices] = useState<ServiceCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [providers, setProviders] = useState<ServiceProvider[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROVIDERS);
    return saved ? JSON.parse(saved) : INITIAL_PROVIDERS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [promos, setPromos] = useState<PromoCode[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROMOS);
    return saved ? JSON.parse(saved) : INITIAL_PROMOS;
  });

  const [complaints, setComplaints] = useState<ComplaintTicket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHATS);
    return saved
      ? JSON.parse(saved)
      : {
          'GS-8912': [
            {
              id: 'm1',
              bookingId: 'GS-8912',
              senderId: 'pro-1',
              senderName: 'Rajesh Kumar Sharma',
              senderRole: 'provider',
              message: 'Namaste Rohit ji, I am on the way with electrical testing equipment. Will reach in 10 mins.',
              timestamp: '10:15 AM'
            },
            {
              id: 'm2',
              bookingId: 'GS-8912',
              senderId: 'cust-1',
              senderName: 'Rohit Malhotra',
              senderRole: 'customer',
              message: 'Great! Please call once you reach Tower 4 gate.',
              timestamp: '10:17 AM'
            }
          ]
        };
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'n1',
            titleEn: '⚡ Emergency Pro Dispatched',
            titleHi: '⚡ आपातकालीन प्रो रवाना हुआ',
            messageEn: 'Rajesh Kumar (Electrician) is on the way for Booking #GS-8912.',
            messageHi: 'राजेश कुमार (इलेक्ट्रीशियन) बुकिंग #GS-8912 के लिए रवाना हो चुके हैं।',
            targetRole: 'customer',
            type: 'booking',
            createdAt: new Date().toISOString()
          },
          {
            id: 'n2',
            titleEn: '🎉 Special Offer: Flat ₹150 OFF',
            titleHi: '🎉 विशेष छूट: ₹150 की सीधी बचत',
            messageEn: 'Use code GHARFIRST on your first AC or deep cleaning service.',
            messageHi: 'पहली एसी या डीप क्लीनिंग बुकिंग पर कोड GHARFIRST का उपयोग करें।',
            targetRole: 'customer',
            type: 'offer',
            createdAt: new Date().toISOString()
          }
        ];
  });

  const [customer, setCustomer] = useState<CustomerProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMER);
    return saved
      ? JSON.parse(saved)
      : {
          id: 'cust-1',
          name: 'Rohit Malhotra',
          phone: '+91 98111 22334',
          addresses: [
            {
              id: 'addr-1',
              title: 'Home',
              street: 'Tower 4, Apt 802, Gulshan Bellina, Sector 16',
              landmark: 'Near Gaur Chowk',
              city: 'Delhi NCR',
              pincode: '201301'
            },
            {
              id: 'addr-2',
              title: 'Office',
              street: 'Floor 5, Oxygen Business Park, Sector 144',
              landmark: 'Opposite Metro Station',
              city: 'Delhi NCR',
              pincode: '201305'
            }
          ],
          favoriteProIds: ['pro-1', 'pro-3'],
          referralCode: 'ROHIT772',
          credits: 200
        };
  });

  const [currentProviderId, setCurrentProviderId] = useState<string>('pro-1');

  // Modals
  const [activeServiceDetail, setActiveServiceDetail] = useState<ServiceCategory | null>(null);
  const [isBookingFlowOpen, setIsBookingFlowOpen] = useState<boolean>(false);
  const [bookingInitialService, setBookingInitialService] = useState<ServiceCategory | null>(null);
  const [isEmergencyFlow, setIsEmergencyFlow] = useState<boolean>(false);
  const [activeTrackingBooking, setActiveTrackingBooking] = useState<Booking | null>(null);
  const [activeInvoiceBooking, setActiveInvoiceBooking] = useState<Booking | null>(null);
  const [activeChatBooking, setActiveChatBooking] = useState<Booking | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CITY, city);
  }, [city]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(providers));
  }, [providers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROMOS, JSON.stringify(promos));
  }, [promos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(customer));
  }, [customer]);

  const setRole = (newRole: UserRole) => setRoleState(newRole);
  const setLang = (newLang: Language) => setLangState(newLang);
  const setCity = (newCity: string) => setCityState(newCity);

  const t = translations[lang];

  const currentProvider =
    providers.find((p) => p.id === currentProviderId) || providers[0] || INITIAL_PROVIDERS[0];

  // Open / Close Modal Handlers
  const openServiceDetail = (service: ServiceCategory) => setActiveServiceDetail(service);
  const closeServiceDetail = () => setActiveServiceDetail(null);

  const openBookingFlow = (service?: ServiceCategory, isEmergency: boolean = false) => {
    setBookingInitialService(service || services[0]);
    setIsEmergencyFlow(isEmergency);
    setIsBookingFlowOpen(true);
  };
  const closeBookingFlow = () => {
    setIsBookingFlowOpen(false);
    setBookingInitialService(null);
    setIsEmergencyFlow(false);
  };

  const openTracking = (booking: Booking) => setActiveTrackingBooking(booking);
  const closeTracking = () => setActiveTrackingBooking(null);

  const openInvoice = (booking: Booking) => setActiveInvoiceBooking(booking);
  const closeInvoice = () => setActiveInvoiceBooking(null);

  const openChat = (booking: Booking) => setActiveChatBooking(booking);
  const closeChat = () => setActiveChatBooking(null);

  // Apply Coupon
  const applyCoupon = (code: string, subtotal: number) => {
    const cleanCode = code.trim().toUpperCase();
    const found = promos.find((p) => p.code.toUpperCase() === cleanCode && p.isActive);
    if (!found) {
      return { valid: false, discount: 0, message: lang === 'hi' ? 'अमान्य कूपन कोड' : 'Invalid promo code' };
    }
    if (subtotal < found.minBookingValue) {
      return {
        valid: false,
        discount: 0,
        message:
          lang === 'hi'
            ? `न्यूनतम बुकिंग मूल्य ₹${found.minBookingValue} होना चाहिए`
            : `Minimum booking value must be ₹${found.minBookingValue}`
      };
    }
    let calculated = 0;
    if (found.discountType === 'flat') {
      calculated = found.discountValue;
    } else {
      calculated = Math.min((subtotal * found.discountValue) / 100, found.maxDiscount);
    }
    return {
      valid: true,
      discount: Math.round(calculated),
      message: lang === 'hi' ? 'कूपन सफलतापूर्वक लागू हुआ!' : 'Coupon applied successfully!'
    };
  };

  // Create Booking
  const createBooking = (params: {
    service: ServiceCategory;
    address: CustomerAddress;
    date: string;
    timeSlot: string;
    isEmergency: boolean;
    problemDescription: string;
    problemPhotos: string[];
    preferredProviderId?: string;
    paymentMethod: PaymentMethod;
    couponCode?: string;
  }): Booking => {
    const bookingNumber = Math.floor(1000 + Math.random() * 9000);
    const id = `GS-${bookingNumber}`;
    const invoiceNumber = `GS-INV-2026-${bookingNumber}`;

    const baseFare = params.service.basePrice;
    const extraCharges = params.isEmergency ? 149 : 49;
    let discount = 0;
    if (params.couponCode) {
      const couponRes = applyCoupon(params.couponCode, baseFare);
      if (couponRes.valid) {
        discount = couponRes.discount;
      }
    }
    const taxableAmount = Math.max(0, baseFare + extraCharges - discount);
    const gstAmount = Math.round(taxableAmount * 0.18 * 100) / 100;
    const totalAmount = Math.round((taxableAmount + gstAmount) * 100) / 100;

    // Pick provider: preferred or first matching online
    let matchedPro: ServiceProvider | undefined;
    if (params.preferredProviderId) {
      matchedPro = providers.find((p) => p.id === params.preferredProviderId);
    }
    if (!matchedPro) {
      matchedPro = providers.find((p) => p.tradeCategories.includes(params.service.id) && p.isOnline);
    }
    if (!matchedPro) {
      matchedPro = providers[0];
    }

    // 4-digit start OTP
    const startOtp = String(Math.floor(1000 + Math.random() * 9000));

    const newBooking: Booking = {
      id,
      invoiceNumber,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      address: params.address,
      serviceId: params.service.id,
      serviceNameEn: params.service.nameEn,
      serviceNameHi: params.service.nameHi,
      serviceGroup: params.service.categoryGroup,
      serviceImage: params.service.image,
      basePrice: baseFare,
      extraCharges,
      discount,
      couponCode: params.couponCode,
      gstAmount,
      totalAmount,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'cash' ? 'pending' : 'paid',
      paymentTransactionId:
        params.paymentMethod !== 'cash' ? `TXN-${Date.now().toString().slice(-8)}` : undefined,
      bookingDate: params.date,
      bookingTimeSlot: params.timeSlot,
      isEmergency: params.isEmergency,
      problemDescription: params.problemDescription || (lang === 'hi' ? 'सामान्य निरीक्षण व मरम्मत' : 'Standard inspection and repair'),
      problemPhotos: params.problemPhotos,
      status: 'confirmed',
      assignedProviderId: matchedPro?.id,
      assignedProviderName: matchedPro?.name,
      assignedProviderPhone: matchedPro?.phone,
      assignedProviderAvatar: matchedPro?.avatar,
      assignedProviderRating: matchedPro?.rating,
      startOtp,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Send push notification to user
    const newNotif: AppNotification = {
      id: `n-${Date.now()}`,
      titleEn: `Booking Confirmed #${id}`,
      titleHi: `बुकिंग की पुष्टि #${id}`,
      messageEn: `${params.service.nameEn} booked for ${params.date} (${params.timeSlot}). Pro: ${matchedPro?.name}`,
      messageHi: `${params.service.nameHi} की बुकिंग सफल। आपके प्रो: ${matchedPro?.name}`,
      targetRole: 'customer',
      type: 'booking',
      createdAt: new Date().toISOString()
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newBooking;
  };

  // Cancel Booking
  const cancelBooking = (bookingId: string, reason: string): boolean => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'cancelled',
            cancellationReason: reason,
            paymentStatus: b.paymentStatus === 'paid' ? 'refunded' : b.paymentStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return b;
      })
    );
    if (activeTrackingBooking?.id === bookingId) {
      setActiveTrackingBooking((curr) => (curr ? { ...curr, status: 'cancelled' } : null));
    }
    return true;
  };

  // Update Booking Status (for provider / admin)
  const updateBookingStatus = (
    bookingId: string,
    status: BookingStatus,
    otpAttempt?: string
  ): { success: boolean; message?: string } => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return { success: false, message: 'Booking not found' };

    // When moving to 'in_progress', verify 4-digit OTP
    if (status === 'in_progress') {
      if (!otpAttempt || otpAttempt.trim() !== target.startOtp) {
        return {
          success: false,
          message:
            lang === 'hi'
              ? 'अमान्य सुरक्षा OTP! कृपया ग्राहक से 4-अंकीय कोड लें।'
              : 'Invalid Security OTP! Please ask customer for their 4-digit start OTP.'
        };
      }
    }

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const updated: Booking = {
            ...b,
            status,
            paymentStatus: status === 'completed' && b.paymentMethod === 'cash' ? 'paid' : b.paymentStatus,
            updatedAt: new Date().toISOString()
          };
          if (activeTrackingBooking?.id === bookingId) {
            setActiveTrackingBooking(updated);
          }
          return updated;
        }
        return b;
      })
    );

    // If completed, update provider earnings
    if (status === 'completed' && target.assignedProviderId) {
      const netPay = Math.round(target.totalAmount * 0.9); // 10% platform commission
      setProviders((prev) =>
        prev.map((p) => {
          if (p.id === target.assignedProviderId) {
            return {
              ...p,
              earningsToday: p.earningsToday + netPay,
              earningsThisWeek: p.earningsThisWeek + netPay,
              earningsTotal: p.earningsTotal + netPay,
              pendingPayout: p.pendingPayout + netPay,
              completedJobsCount: p.completedJobsCount + 1
            };
          }
          return p;
        })
      );
    }

    return { success: true };
  };

  // Rate Booking
  const rateBooking = (bookingId: string, rating: number, review: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            userRating: rating,
            userReview: review,
            updatedAt: new Date().toISOString()
          };
        }
        return b;
      })
    );
  };

  // Customer Addresses
  const addCustomerAddress = (address: Omit<CustomerAddress, 'id'>) => {
    const id = `addr-${Date.now()}`;
    const newAddr: CustomerAddress = { ...address, id };
    setCustomer((prev) => ({
      ...prev,
      addresses: [...prev.addresses, newAddr]
    }));
  };

  const deleteCustomerAddress = (id: string) => {
    setCustomer((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((a) => a.id !== id)
    }));
  };

  const toggleFavoritePro = (proId: string) => {
    setCustomer((prev) => {
      const exists = prev.favoriteProIds.includes(proId);
      return {
        ...prev,
        favoriteProIds: exists
          ? prev.favoriteProIds.filter((id) => id !== proId)
          : [...prev.favoriteProIds, proId]
      };
    });
  };

  // Provider
  const toggleProviderOnline = (providerId: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, isOnline: !p.isOnline } : p))
    );
  };

  const updateProviderBank = (providerId: string, bank: ServiceProvider['bankAccount']) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, bankAccount: bank } : p))
    );
  };

  const requestPayout = (providerId: string, amount: number) => {
    const pro = providers.find((p) => p.id === providerId);
    if (!pro || pro.pendingPayout < amount) return false;
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId ? { ...p, pendingPayout: p.pendingPayout - amount } : p
      )
    );
    return true;
  };

  // Admin Actions
  const verifyProvider = (providerId: string, approved: boolean) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId
          ? {
              ...p,
              isVerified: approved,
              verificationStatus: approved ? 'approved' : 'rejected'
            }
          : p
      )
    );
  };

  const addService = (newSvc: Omit<ServiceCategory, 'id'>) => {
    const id = `svc-${Date.now()}`;
    const svc: ServiceCategory = { ...newSvc, id };
    setServices((prev) => [svc, ...prev]);
  };

  const updateService = (svc: ServiceCategory) => {
    setServices((prev) => prev.map((s) => (s.id === svc.id ? svc : s)));
  };

  const deleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
  };

  const addPromo = (promo: PromoCode) => {
    setPromos((prev) => [promo, ...prev]);
  };

  const togglePromoActive = (code: string) => {
    setPromos((prev) =>
      prev.map((p) => (p.code === code ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const fileComplaint = (complaint: Omit<ComplaintTicket, 'id' | 'createdAt' | 'status'>) => {
    const id = `CMP-${Math.floor(100 + Math.random() * 900)}`;
    const newComplaint: ComplaintTicket = {
      ...complaint,
      id,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  const resolveComplaint = (
    complaintId: string,
    resolutionNotes: string,
    refundAmount?: number
  ) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status: 'resolved',
              resolutionNotes,
              refundAmount
            }
          : c
      )
    );
  };

  const broadcastNotification = (notif: Omit<AppNotification, 'id' | 'createdAt'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `n-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const sendChatMessage = (
    bookingId: string,
    message: string,
    senderRole: 'customer' | 'provider' | 'support',
    senderName: string
  ) => {
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      bookingId,
      senderId: senderRole === 'customer' ? customer.id : currentProviderId,
      senderName,
      senderRole,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => {
      const existing = prev[bookingId] || [];
      return {
        ...prev,
        [bookingId]: [...existing, newMsg]
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        lang,
        setLang,
        t,
        city,
        setCity,
        services,
        providers,
        bookings,
        promos,
        complaints,
        chatMessages,
        notifications,
        customer,
        currentProvider,
        setCurrentProviderId,
        activeServiceDetail,
        openServiceDetail,
        closeServiceDetail,
        isBookingFlowOpen,
        bookingInitialService,
        isEmergencyFlow,
        openBookingFlow,
        closeBookingFlow,
        activeTrackingBooking,
        openTracking,
        closeTracking,
        activeInvoiceBooking,
        openInvoice,
        closeInvoice,
        activeChatBooking,
        openChat,
        closeChat,
        createBooking,
        cancelBooking,
        updateBookingStatus,
        rateBooking,
        applyCoupon,
        addCustomerAddress,
        deleteCustomerAddress,
        toggleFavoritePro,
        toggleProviderOnline,
        updateProviderBank,
        requestPayout,
        verifyProvider,
        addService,
        updateService,
        deleteService,
        addPromo,
        togglePromoActive,
        fileComplaint,
        resolveComplaint,
        broadcastNotification,
        sendChatMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
