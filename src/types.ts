export interface Service {
  id: string;
  name: string;
  category: 'haircuts' | 'beards' | 'combos' | 'specialty';
  price: number;
  durationMin: number;
  description: string;
  isPopular?: boolean;
  features?: string[];
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  specialty: string;
  avatar: string;
  bio: string;
}

export interface BookingData {
  serviceId: string;
  barberId: string;
  date: string;
  timeSlot: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  notes?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  tenure: string; // e.g., "Customer for 8 years"
  rating: number;
  comment: string;
  cutType: string;
  avatar?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'all' | 'interior' | 'cuts' | 'beards' | 'tools';
  imageUrl: string;
  aspectRatio?: string;
  caption: string;
}

export interface LoyaltyReward {
  visitNumber: number;
  rewardTitle: string;
  discountText: string;
  description: string;
  isHighlight?: boolean;
}

export interface BusinessDay {
  dayName: string; // "Monday", etc.
  dayIndex: number; // 0 = Sun, 1 = Mon ...
  openTime: string; // "09:00"
  closeTime: string; // "19:00"
  isOpen: boolean;
  formattedHours: string;
}
