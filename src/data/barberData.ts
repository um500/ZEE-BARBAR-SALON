import { Service, Barber, Testimonial, GalleryItem, LoyaltyReward, BusinessDay } from '../types';

export const WHATSAPP_NUMBER = '8969457707'; // Phone number for wa.me deep links
export const DISPLAY_PHONE = '+1 (896) 945-7707';
export const DISPLAY_ADDRESS = '742 Craftsmanship Way, Suite 100, Downtown';
export const DISPLAY_EMAIL = 'booking@zeebarbershop.com';

export const SERVICES: Service[] = [
  {
    id: 'signature-haircut',
    name: 'Zee Signature Haircut',
    category: 'haircuts',
    price: 38,
    durationMin: 35,
    description: 'Precision tailored haircut tailored to your head shape, completed with a straight-razor hot towel neck shave and styling.',
    isPopular: true,
    features: ['Consultation & Hair Analysis', 'Hot Towel Neck Shave', 'Blow-dry & Premium Matte/Pomade Styling']
  },
  {
    id: 'skin-fade',
    name: 'Precision Skin & Taper Fade',
    category: 'haircuts',
    price: 42,
    durationMin: 40,
    description: 'Seamless low, mid, or high zero-fade or skin taper crafted with precision foil clippers and crisp razor edge finish.',
    isPopular: true,
    features: ['Zero / Foil Shave Transition', 'Razor Crisp Hairline & Edges', 'Scalp Tonic Massage']
  },
  {
    id: 'beard-sculpt',
    name: 'Beard Sculpt & Razor Shape',
    category: 'beards',
    price: 26,
    durationMin: 25,
    description: 'Detailed beard sculpting, hot oil conditioning, foil detail, and hot towel straight-razor cheek & neck lining.',
    features: ['Custom Length Sculpting', 'Hot Towel Steamer', 'Hydrating Beard Oil Treatment']
  },
  {
    id: 'combo-master',
    name: 'The Master Combo (Cut + Beard)',
    category: 'combos',
    price: 60,
    durationMin: 60,
    description: 'The ultimate grooming overhaul: full signature haircut, beard sculpt or full clean shave, and double hot towel relaxation.',
    isPopular: true,
    features: ['Complete Haircut & Fade', 'Beard Trim & Razor Edging', 'Double Hot Towel Experience', 'Free Hair Wash']
  },
  {
    id: 'royal-hot-towel',
    name: 'Royal Hot Towel Straight Razor Shave',
    category: 'specialty',
    price: 45,
    durationMin: 45,
    description: 'Traditional multi-step hot towel shave with pre-shave essential oils, rich lather, double-pass razor shave, and cold cooling mask.',
    features: ['Essential Pre-Shave Oil', 'Rich Lather Warm Cream', 'Straight Razor Precision', 'Aftershave Balm & Face Massage']
  },
  {
    id: 'kids-gentleman',
    name: 'Young Gentleman Cut (Under 12)',
    category: 'haircuts',
    price: 28,
    durationMin: 30,
    description: 'Patient, styled haircut for boys under 12, crafted with care and styled with kid-safe premium products.',
    features: ['Gentle Clipper Work', 'Fun Styling', 'Complimentary Treat']
  },
  {
    id: 'senior-classic',
    name: 'Distinguished Senior Cut (65+)',
    category: 'haircuts',
    price: 28,
    durationMin: 30,
    description: 'Classic barber haircut for distinguished gentlemen 65 and over, including eyebrow and ear trim.',
    features: ['Traditional Scissors/Clipper', 'Eyebrow & Ear Cleanup', 'Neck Duster Finish']
  },
  {
    id: 'head-shave',
    name: 'Full Head Razor Shave',
    category: 'specialty',
    price: 38,
    durationMin: 35,
    description: 'Smooth full head straight-razor shave with warm steam towels, scalp exfoliation, and soothing hydrating moisturizer.',
    features: ['Warm Steam Towels', 'Scalp Exfoliation', 'Razor Smooth Finish']
  },
  {
    id: 'grey-blending',
    name: 'Beard or Hair Grey Camo / Color',
    category: 'specialty',
    price: 45,
    durationMin: 35,
    description: 'Subtle 10-minute grey blending or natural full coverage color treatment that looks effortless and natural.',
    features: ['Subtle Natural Tones', 'Ammonia-Free Formula', 'Wash & Style Included']
  }
];

export const BARBERS: Barber[] = [
  {
    id: 'zee-master',
    name: 'Zee',
    role: 'Founder & Master Barber',
    experienceYears: 15,
    specialty: 'Signature Scissors Cuts, Skin Fades & Royal Shaves',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bio: 'Founder of Zee Barber Shop. 15 years mastering old-school blade discipline and modern texturized styling. Built his shop on handshake trust and word of mouth.'
  },
  {
    id: 'alex-fade',
    name: 'Alex "The Blade"',
    role: 'Senior Barber & Fade Specialist',
    experienceYears: 9,
    specialty: 'High & Low Fades, Hair Art & Sharp Edge Lines',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: 'Precision perfectionist who treats every hairline like architecture. Known for seamless skin blends and razor-sharp outlines.'
  },
  {
    id: 'marcus-beard',
    name: 'Marcus',
    role: 'Beard Artisan & Shave Specialist',
    experienceYears: 11,
    specialty: 'Beard Sculpting, Straight Razor Shaves & Hot Towel Facials',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    bio: 'Master of facial hair symmetry and traditional lather shaves. Believes every beard tells a story and deserves royal care.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    author: 'David Vance',
    tenure: 'Customer for 11 Years',
    rating: 5,
    comment: 'I followed Zee from his early days when he was operating a single chair. 11 years later, I still wouldn’t let anyone else touch my hair or beard. Consistent excellence every single time.',
    cutType: 'Skin Fade + Beard Trim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 't2',
    author: 'Marcus Sterling',
    tenure: 'Customer for 6 Years',
    rating: 5,
    comment: 'The hot towel royal shave is an absolute religious experience. The atmosphere in Zee’s shop is top tier — respectful, classic, and spotless. You walk out feeling like a million bucks.',
    cutType: 'Royal Hot Towel Shave',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 't3',
    author: 'Julian Thorne',
    tenure: 'Customer for 8 Years',
    rating: 5,
    comment: 'Brought my 7-year-old son here for his first real barbershop cut, and Zee treated him like a young king. That level of patient craftsmanship is rare these days.',
    cutType: 'Father & Son Combo',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 't4',
    author: 'Robert Grayson',
    tenure: 'Customer for 14 Years',
    rating: 5,
    comment: '15 years in business and they haven’t lost an ounce of attention to detail. Every cut comes with a hot towel neck shave that resets your whole week.',
    cutType: 'Zee Signature Haircut',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Vintage Leather Barber Chairs',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80',
    caption: 'Classic hand-stitched leather chairs with polished chrome accents'
  },
  {
    id: 'g2',
    title: 'Razor Edge Skin Fade',
    category: 'cuts',
    imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1000&q=80',
    caption: 'Seamless taper fade with razor-crisp hairline detailing'
  },
  {
    id: 'g3',
    title: 'Hot Towel Beard Treatment',
    category: 'beards',
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1000&q=80',
    caption: 'Steamed hot towel application preparing skin for precision razor sculpt'
  },
  {
    id: 'g4',
    title: 'Craftsman Tools & Razors',
    category: 'tools',
    imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=80',
    caption: 'Japanese steel shears, badger hair brushes, and straight razors'
  },
  {
    id: 'g5',
    title: 'Zee Barber Shop Interior',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1000&q=80',
    caption: 'Warm ambient lighting and mahogany wood styling stations'
  },
  {
    id: 'g6',
    title: 'Beard Sculpting & Foil Line',
    category: 'beards',
    imageUrl: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1000&q=80',
    caption: 'Precise beard contouring with organic beard balm finish'
  }
];

export const LOYALTY_REWARDS: LoyaltyReward[] = [
  {
    visitNumber: 3,
    rewardTitle: '20% OFF Any Service',
    discountText: '20% OFF',
    description: 'Welcome to the inner circle! Get 20% off your choice of haircut or beard sculpt on your 3rd visit.'
  },
  {
    visitNumber: 6,
    rewardTitle: '50% OFF Hair & Beard Combo',
    discountText: '50% OFF',
    description: 'Halfway to perfection! Treat yourself to a 50% discount on any full grooming package.'
  },
  {
    visitNumber: 9,
    rewardTitle: '75% OFF Royal Shave or Beard Trim',
    discountText: '75% OFF',
    description: 'Steamed towels on us. Enjoy 75% off a straight-razor shave or beard sculpting.'
  },
  {
    visitNumber: 10,
    rewardTitle: 'FREE Signature Haircut & Hot Towel',
    discountText: '100% FREE',
    description: '10th visit on the house! Complete signature cut, wash, and double hot towel treatment FREE.',
    isHighlight: true
  }
];

export const BUSINESS_HOURS: BusinessDay[] = [
  { dayName: 'Monday', dayIndex: 1, openTime: '09:00', closeTime: '19:00', isOpen: true, formattedHours: '9:00 AM – 7:00 PM' },
  { dayName: 'Tuesday', dayIndex: 2, openTime: '09:00', closeTime: '19:00', isOpen: true, formattedHours: '9:00 AM – 7:00 PM' },
  { dayName: 'Wednesday', dayIndex: 3, openTime: '09:00', closeTime: '19:00', isOpen: true, formattedHours: '9:00 AM – 7:00 PM' },
  { dayName: 'Thursday', dayIndex: 4, openTime: '09:00', closeTime: '19:00', isOpen: true, formattedHours: '9:00 AM – 7:00 PM' },
  { dayName: 'Friday', dayIndex: 5, openTime: '09:00', closeTime: '19:00', isOpen: true, formattedHours: '9:00 AM – 7:00 PM' },
  { dayName: 'Saturday', dayIndex: 6, openTime: '08:00', closeTime: '18:00', isOpen: true, formattedHours: '8:00 AM – 6:00 PM' },
  { dayName: 'Sunday', dayIndex: 0, openTime: '09:00', closeTime: '17:00', isOpen: true, formattedHours: '9:00 AM – 5:00 PM' }
];

export const TIME_SLOTS = [
  '09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM',
  '12:00 PM', '01:00 PM', '01:45 PM', '02:30 PM',
  '03:15 PM', '04:00 PM', '04:45 PM', '05:30 PM', '06:15 PM'
];

/**
 * Calculates if shop is currently open based on user's current local date & time
 */
export function getCurrentShopStatus(): { isOpenNow: boolean; message: string; closingOrOpeningText: string } {
  const now = new Date();
  const currentDayIndex = now.getDay(); // 0 = Sun, 1 = Mon ...
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todayConfig = BUSINESS_HOURS.find(b => b.dayIndex === currentDayIndex);

  if (!todayConfig || !todayConfig.isOpen) {
    return {
      isOpenNow: false,
      message: 'Closed Today',
      closingOrOpeningText: 'Opens Monday at 9:00 AM'
    };
  }

  const [openH, openM] = todayConfig.openTime.split(':').map(Number);
  const [closeH, closeM] = todayConfig.closeTime.split(':').map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    const formatCloseTime = closeH > 12 ? `${closeH - 12}:${closeM === 0 ? '00' : closeM} PM` : `${closeH}:${closeM} PM`;
    return {
      isOpenNow: true,
      message: `Open Today Until ${formatCloseTime}`,
      closingOrOpeningText: `Open now • Closes at ${formatCloseTime}`
    };
  } else if (currentMinutes < openMinutes) {
    const formatOpenTime = openH > 12 ? `${openH - 12}:${openM === 0 ? '00' : openM} PM` : `${openH}:${openM} AM`;
    return {
      isOpenNow: false,
      message: `Opens Today at ${formatOpenTime}`,
      closingOrOpeningText: `Closed now • Opens at ${formatOpenTime}`
    };
  } else {
    // Already closed for the day
    return {
      isOpenNow: false,
      message: 'Closed for the Evening',
      closingOrOpeningText: 'Closed now • Opens tomorrow morning'
    };
  }
}
