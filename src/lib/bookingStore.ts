import { TIME_SLOTS } from '../data/barberData';

export interface SlotStatus {
  timeSlot: string;
  count: number;
  isPast: boolean;
  isFull: boolean;
  isAvailable: boolean;
}

/**
 * Parses time string like "09:00 AM", "03:15 PM", "12:30 PM", "9:00 AM" into total minutes from midnight.
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim().toUpperCase();
  const match = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3];

  if (period === 'PM' && hours < 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  return hours * 60 + minutes;
}

/**
 * Returns today's date in local YYYY-MM-DD format.
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Normalizes input date strings into standard YYYY-MM-DD or 'Today' / relative format.
 */
export function normalizeDateString(dateStr: string): string {
  if (!dateStr) return getTodayDateString();
  const lower = dateStr.toLowerCase().trim();
  if (lower === 'today' || lower === 'aaj') {
    return getTodayDateString();
  }
  if (lower === 'tomorrow' || lower === 'kal') {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Handle YYYY-MM-DD or DD-MM-YYYY or MM/DD/YYYY
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3 && parts[2].length === 4) {
      return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
    }
  } else if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      } else if (parts[2].length === 4) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
  }

  return dateStr;
}

/**
 * Gets day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday) for any date string.
 */
export function getDayOfWeek(dateStr: string): number {
  if (!dateStr) return new Date().getDay();
  const norm = normalizeDateString(dateStr);
  const parts = norm.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const dateObj = new Date(year, month, day);
    return dateObj.getDay();
  }
  return new Date().getDay();
}

/**
 * Checks if the given date string falls on a Sunday.
 */
export function isSundayDate(dateStr: string): boolean {
  return getDayOfWeek(dateStr) === 0;
}

/**
 * Checks if the given date string is today.
 */
export function isTodayDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const lower = dateStr.toLowerCase().trim();
  if (lower === 'today' || lower === 'aaj') return true;

  const todayStr = getTodayDateString();
  const normalized = normalizeDateString(dateStr);
  return normalized === todayStr;
}

/**
 * Determines if a time slot on a specific date is in the past or after shop closing time.
 * On Sunday (closing 5:00 PM), slots > 04:00 PM (960 mins) are invalid.
 * On Saturday (closing 6:00 PM), slots > 04:45 PM (1005 mins) are invalid.
 * For today's date, slots past current local time are invalid.
 */
export function isTimeSlotPast(dateStr: string, timeSlot: string): boolean {
  const normDate = normalizeDateString(dateStr);
  const slotMinutes = parseTimeToMinutes(timeSlot);
  const dayIndex = getDayOfWeek(normDate);

  // Sunday (0): Shop closes at 5:00 PM (17:00 / 1020 mins), last 45-min appointment slot starts at 04:00 PM (960 mins)
  if (dayIndex === 0 && slotMinutes > 960) {
    return true;
  }

  // Saturday (6): Shop closes at 6:00 PM (18:00 / 1080 mins), last 45-min appointment slot starts at 04:45 PM (1005 mins)
  if (dayIndex === 6 && slotMinutes > 1005) {
    return true;
  }

  if (isTodayDate(normDate)) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return slotMinutes <= currentMinutes;
  }

  return false;
}

// In-memory fallback booking count store for client-side session sync
const LOCAL_BOOKING_STORE_KEY = 'zee_booking_counts_v1';

export function getLocalBookingCounts(): Record<string, number> {
  try {
    const stored = localStorage.getItem(LOCAL_BOOKING_STORE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    return {};
  }
}

export function saveLocalBookingCounts(counts: Record<string, number>): void {
  try {
    localStorage.setItem(LOCAL_BOOKING_STORE_KEY, JSON.stringify(counts));
  } catch (e) {
    // ignore
  }
}

/**
 * Fetches slot availability for a date from the backend API,
 * falling back to local storage sync if needed.
 */
export async function getAvailabilityForDate(dateStr: string): Promise<Record<string, SlotStatus>> {
  const normDate = normalizeDateString(dateStr);
  const isToday = isTodayDate(normDate);

  let serverCounts: Record<string, number> = {};

  try {
    const res = await fetch(`/api/bookings/availability?date=${encodeURIComponent(normDate)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.counts) {
        serverCounts = data.counts;
      }
    }
  } catch (err) {
    // Fallback to localStorage
    serverCounts = getLocalBookingCounts();
  }

  const localCounts = getLocalBookingCounts();
  const mergedCounts = { ...localCounts, ...serverCounts };

  const result: Record<string, SlotStatus> = {};

  TIME_SLOTS.forEach(slot => {
    const key = `${normDate}_${slot}`;
    const count = mergedCounts[key] || 0;
    const isPast = isTimeSlotPast(normDate, slot);
    const isFull = count >= 2;
    const isAvailable = !isPast && !isFull;

    result[slot] = {
      timeSlot: slot,
      count,
      isPast,
      isFull,
      isAvailable
    };
  });

  return result;
}

/**
 * Confirms a booking for a specific date and time slot.
 * Increments count by 1 in backend & local store.
 */
export async function confirmBookingSlot(
  dateStr: string,
  timeSlot: string,
  clientName?: string,
  clientPhone?: string,
  serviceName?: string
): Promise<{ success: boolean; message: string; count?: number; reason?: 'PAST' | 'FULL' }> {
  const normDate = normalizeDateString(dateStr);

  try {
    const res = await fetch('/api/bookings/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: normDate,
        timeSlot,
        clientName,
        clientPhone,
        serviceName
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        // Also sync local storage
        const local = getLocalBookingCounts();
        const key = `${normDate}_${timeSlot}`;
        local[key] = (local[key] || 0) + 1;
        saveLocalBookingCounts(local);

        return { success: true, message: 'Booking confirmed!', count: data.count };
      } else {
        return { success: false, message: data.message, reason: data.reason };
      }
    }
  } catch (err) {
    console.warn("Server book API unreachable, applying local store sync:", err);
  }

  // Fallback offline / local handling
  const key = `${normDate}_${timeSlot}`;
  if (isTimeSlotPast(normDate, timeSlot)) {
    return { success: false, message: 'This time slot has already passed for today.', reason: 'PAST' };
  }

  const localCounts = getLocalBookingCounts();
  const currentCount = localCounts[key] || 0;

  if (currentCount >= 2) {
    return { success: false, message: 'This time slot is fully booked (max 2 bookings per slot).', reason: 'FULL' };
  }

  localCounts[key] = currentCount + 1;
  saveLocalBookingCounts(localCounts);

  return { success: true, message: 'Booking confirmed locally!', count: localCounts[key] };
}

/**
 * Finds the nearest available time slot on the same date (or next open day if all today's slots are full/past).
 */
export async function findNextAvailableSlot(
  dateStr: string,
  requestedSlot?: string
): Promise<{ date: string; timeSlot: string | null; allFullOrPast: boolean }> {
  const normDate = normalizeDateString(dateStr);
  const availability = await getAvailabilityForDate(normDate);

  const availableList = TIME_SLOTS.filter(slot => availability[slot]?.isAvailable);

  if (availableList.length > 0) {
    if (requestedSlot) {
      const reqMins = parseTimeToMinutes(requestedSlot);
      // Find the slot closest to requestedSlot in time
      let closest = availableList[0];
      let minDiff = Math.abs(parseTimeToMinutes(closest) - reqMins);

      for (const slot of availableList) {
        const diff = Math.abs(parseTimeToMinutes(slot) - reqMins);
        if (diff < minDiff) {
          minDiff = diff;
          closest = slot;
        }
      }
      return { date: normDate, timeSlot: closest, allFullOrPast: false };
    } else {
      return { date: normDate, timeSlot: availableList[0], allFullOrPast: false };
    }
  }

  // If all full or past on requested date, check tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  const tomAvailability = await getAvailabilityForDate(tomStr);
  const tomAvailable = TIME_SLOTS.filter(slot => tomAvailability[slot]?.isAvailable);

  if (tomAvailable.length > 0) {
    return { date: tomStr, timeSlot: tomAvailable[0], allFullOrPast: true };
  }

  return { date: normDate, timeSlot: null, allFullOrPast: true };
}
