export type UserRole = 'customer' | 'provider' | 'admin';
export type Language = 'en' | 'hi';

export interface ServiceCategory {
  id: string;
  nameEn: string;
  nameHi: string;
  descEn: string;
  descHi: string;
  icon: string;
  categoryGroup: 'repair' | 'cleaning' | 'heavy' | 'appliance' | 'special';
  basePrice: number;
  durationMinutes: number;
  emergencyAvailable: boolean;
  rating: number;
  reviewsCount: number;
  image: string;
  warrantyDays: number;
  featuresEn: string[];
  featuresHi: string[];
}

export type BookingStatus =
  | 'pending_acceptance'
  | 'confirmed'
  | 'on_the_way'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'upi' | 'gpay' | 'phonepe' | 'card' | 'cash';
export type PaymentStatus = 'paid' | 'pending' | 'refunded';

export interface CustomerAddress {
  id: string;
  title: string; // 'Home', 'Office', 'Other'
  street: string;
  landmark: string;
  city: string;
  pincode: string;
  lat?: number;
  lng?: number;
}

export interface Booking {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  address: CustomerAddress;
  serviceId: string;
  serviceNameEn: string;
  serviceNameHi: string;
  serviceGroup: string;
  serviceImage: string;
  basePrice: number;
  extraCharges: number;
  discount: number;
  couponCode?: string;
  gstAmount: number; // 18%
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  bookingDate: string;
  bookingTimeSlot: string;
  isEmergency: boolean;
  problemDescription: string;
  problemPhotos: string[];
  status: BookingStatus;
  assignedProviderId?: string;
  assignedProviderName?: string;
  assignedProviderPhone?: string;
  assignedProviderAvatar?: string;
  assignedProviderRating?: number;
  startOtp: string; // 4-digit OTP provided to customer for provider verification
  cancellationReason?: string;
  userRating?: number;
  userReview?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  tradeCategories: string[]; // e.g. ['electrician', 'ac_repair']
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  isOnline: boolean;
  isVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  aadhaarNumber: string;
  aadhaarDocUrl?: string;
  policeVerificationUrl?: string;
  city: string;
  serviceRadiusKm: number;
  activeBookingId?: string;
  earningsToday: number;
  earningsThisWeek: number;
  earningsTotal: number;
  pendingPayout: number;
  completedJobsCount: number;
  bankAccount: {
    accountHolder: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
  };
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minBookingValue: number;
  maxDiscount: number;
  descriptionEn: string;
  descriptionHi: string;
  validTill: string;
  isActive: boolean;
}

export interface ComplaintTicket {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  providerName?: string;
  subject: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  resolutionNotes?: string;
  refundAmount?: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'provider' | 'support';
  message: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  titleEn: string;
  titleHi: string;
  messageEn: string;
  messageHi: string;
  targetRole: 'all' | 'customer' | 'provider';
  type: 'info' | 'booking' | 'offer' | 'safety';
  createdAt: string;
}
