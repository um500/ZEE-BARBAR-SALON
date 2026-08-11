import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, User, Scissors, CheckCircle2, Send, ChevronRight, ChevronLeft, Phone, ShieldCheck, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';
import { SERVICES, BARBERS, TIME_SLOTS, WHATSAPP_NUMBER, DISPLAY_PHONE, BUSINESS_HOURS } from '../data/barberData';
import { BookingData } from '../types';
import { getAvailabilityForDate, confirmBookingSlot, SlotStatus, isTodayDate, isTimeSlotPast, getTodayDateString } from '../lib/bookingStore';

interface BookingSectionProps {
  preselectedServiceId?: string;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ preselectedServiceId }) => {
  const [step, setStep] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [slotStatuses, setSlotStatuses] = useState<Record<string, SlotStatus>>({});

  // Get today's date YYYY-MM-DD
  const todayStr = getTodayDateString();

  const [bookingData, setBookingData] = useState<BookingData>({
    serviceId: preselectedServiceId || SERVICES[0].id,
    barberId: BARBERS[0].id,
    date: todayStr,
    timeSlot: TIME_SLOTS[0],
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    notes: ''
  });

  // Sync if parent preselects service
  useEffect(() => {
    if (preselectedServiceId) {
      setBookingData(prev => ({ ...prev, serviceId: preselectedServiceId }));
    }
  }, [preselectedServiceId]);

  // Load live availability when date changes
  const loadAvailability = async (dateStr: string) => {
    const map = await getAvailabilityForDate(dateStr);
    setSlotStatuses(map);

    // Auto select first available slot if current selected slot is past or full
    const currentStatus = map[bookingData.timeSlot];
    if (!currentStatus || !currentStatus.isAvailable) {
      const firstAvailable = TIME_SLOTS.find(s => map[s]?.isAvailable);
      if (firstAvailable) {
        setBookingData(prev => ({ ...prev, timeSlot: firstAvailable }));
      }
    }
  };

  useEffect(() => {
    loadAvailability(bookingData.date);
  }, [bookingData.date]);

  const selectedService = SERVICES.find(s => s.id === bookingData.serviceId) || SERVICES[0];
  const selectedBarber = BARBERS.find(b => b.id === bookingData.barberId) || BARBERS[0];

  // Check if selected date is a Sunday or closed day
  const isDateClosed = (dateString: string): boolean => {
    if (!dateString) return false;
    const dateObj = new Date(dateString + 'T00:00:00');
    const dayIndex = dateObj.getDay(); // 0 = Sunday
    const dayConfig = BUSINESS_HOURS.find(b => b.dayIndex === dayIndex);
    return dayConfig ? !dayConfig.isOpen : false;
  };

  const handleNextStep = () => {
    if (step === 3) {
      if (!bookingData.clientName.trim() || !bookingData.clientPhone.trim()) {
        alert('Please enter your Name and Phone Number to continue.');
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Confirm booking and update count
    const result = await confirmBookingSlot(
      bookingData.date,
      bookingData.timeSlot,
      bookingData.clientName,
      bookingData.clientPhone,
      selectedService.name
    );

    if (!result.success) {
      alert(result.message);
      loadAvailability(bookingData.date);
      return;
    }

    const ref = 'ZEE-' + Math.floor(100000 + Math.random() * 900000);
    setBookingReference(ref);
    setBookingSubmitted(true);

    // Re-fetch availability map so UI is instantly updated
    loadAvailability(bookingData.date);

    // Trigger WhatsApp deep link in new tab
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=` + encodeURIComponent(
      `💈 *ZEE BARBER SHOP - APPOINTMENT REQUEST* 💈\n\n` +
      `*Booking Ref:* ${ref}\n` +
      `*Service:* ${selectedService.name} ($${selectedService.price})\n` +
      `*Date:* ${bookingData.date}\n` +
      `*Time:* ${bookingData.timeSlot}\n\n` +
      `*Client Name:* ${bookingData.clientName}\n` +
      `*Phone:* ${bookingData.clientPhone}\n` +
      (bookingData.notes ? `*Notes:* ${bookingData.notes}\n` : '') +
      `\nPlease confirm my appointment slot. Thank you!`
    );

    window.open(url, '_blank');
  };

  const copySummaryText = () => {
    const text = `Zee Barber Shop Appointment\nRef: ${bookingReference}\nService: ${selectedService.name} ($${selectedService.price})\nDate: ${bookingData.date} at ${bookingData.timeSlot}\nName: ${bookingData.clientName}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setBookingSubmitted(false);
    setStep(1);
  };

  return (
    <section id="booking" className="py-24 bg-[#0d0d11] border-t border-zinc-800 relative overflow-hidden">
      
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B1A2B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-block">
            <span className="text-xs font-black tracking-widest text-[#EAB308] uppercase border border-[#EAB308]/30 px-3.5 py-1 rounded bg-[#EAB308]/10">
              RESERVE YOUR SPOT
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-serif-header tracking-tight">
            BOOK <span className="text-[#DC2626]">APPOINTMENT</span>
          </h2>

          {/* Red underline bar */}
          <div className="w-16 h-1 bg-[#DC2626] mx-auto rounded-full" />

          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto pt-1">
            Three simple steps. Confirmed instantly via WhatsApp with zero wait time.
          </p>

          {/* Open 7 Days Notice Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B1A2B]/15 border border-[#8B1A2B]/30 text-xs text-zinc-300 mt-2">
            <Sparkles className="w-4 h-4 text-[#C93B4E]" />
            <span><strong className="text-white font-bold">Open 7 Days a Week:</strong> Mon–Sat: 9:00 AM – 7:00 PM | Sun: 9:00 AM – 5:00 PM</span>
          </div>
        </div>

        {/* Success Screen State */}
        {bookingSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-[#121217] border border-[#8B1A2B]/40 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-[#8B1A2B]/20 border-2 border-[#8B1A2B] flex items-center justify-center text-[#C93B4E]">
              <Sparkles className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold tracking-widest text-[#C93B4E] uppercase">
                ✦ Booking Request Sent ✦
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-serif-header">
                We're Preparing Your Chair!
              </h3>
              <p className="text-zinc-300 text-sm max-w-md mx-auto">
                Your appointment request has been dispatched to WhatsApp. Our team will confirm your slot shortly.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="max-w-md mx-auto bg-[#0a0a0d] rounded-2xl border border-zinc-800 p-6 text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-mono text-zinc-400">
                <span>CONFIRMATION REF:</span>
                <span className="font-bold text-[#C93B4E]">{bookingReference}</span>
              </div>

              <div className="space-y-2 text-sm text-zinc-200">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Service:</span>
                  <span className="font-semibold text-white">{selectedService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Date & Time:</span>
                  <span className="font-semibold text-[#C93B4E]">{bookingData.date} at {bookingData.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Client:</span>
                  <span className="font-semibold text-white">{bookingData.clientName} ({bookingData.clientPhone})</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-800 font-bold text-base">
                  <span>Total Amount:</span>
                  <span className="text-[#C93B4E]">${selectedService.price}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={copySummaryText}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 border border-zinc-700 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Details!' : 'Copy Summary'}</span>
              </button>

              <button
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#8B1A2B] hover:bg-[#A32034] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md border border-[#9A1C2E]"
              >
                <span>Book Another Appointment</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="bg-[#121217] rounded-3xl border border-zinc-800 p-6 sm:p-10 shadow-2xl space-y-8">
            
            {/* Multi-Step Wizard Progress Bar */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 relative pb-6 border-b border-zinc-800">
              {[
                { number: 1, label: 'Service' },
                { number: 2, label: 'Date & Time' },
                { number: 3, label: 'Your Info' },
                { number: 4, label: 'Confirm' }
              ].map((s) => (
                <div key={s.number} className="flex flex-col items-center text-center space-y-1">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${
                      step === s.number
                        ? 'bg-[#8B1A2B] text-white ring-4 ring-[#8B1A2B]/20 shadow-md scale-110 border border-[#9A1C2E]'
                        : step > s.number
                        ? 'bg-[#8B1A2B]/20 text-[#C93B4E] border border-[#8B1A2B]/40'
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                    }`}
                  >
                    {step > s.number ? <CheckCircle2 className="w-4 h-4 text-[#C93B4E]" /> : s.number}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-semibold ${step === s.number ? 'text-[#C93B4E]' : 'text-zinc-400'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              
              {/* STEP 1: CHOOSE SERVICE */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white font-serif-header">
                      Step 1: Choose Your Service
                    </h3>
                    <span className="text-xs text-zinc-400">Select one service</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                    {SERVICES.map((srv) => {
                      const isSelected = bookingData.serviceId === srv.id;
                      return (
                        <div
                          key={srv.id}
                          onClick={() => setBookingData({ ...bookingData, serviceId: srv.id })}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                            isSelected
                              ? 'bg-[#8B1A2B]/20 border-[#8B1A2B] shadow-md ring-1 ring-[#8B1A2B]/50'
                              : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40'
                          }`}
                        >
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-white font-serif-header">
                              {srv.name}
                            </h4>
                            <p className="text-xs text-zinc-400 line-clamp-2">
                              {srv.description}
                            </p>
                            <span className="inline-block text-[10px] text-[#C93B4E] font-mono mt-1">
                              ⏱ {srv.durationMin} minutes
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-lg font-extrabold font-serif-header text-[#C93B4E]">
                              ${srv.price}
                            </span>
                            <div className={`mt-2 w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#8B1A2B] bg-[#8B1A2B] text-white' : 'border-zinc-700'}`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: CHOOSE DATE & TIME */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-white font-serif-header">
                    Step 2: Choose Date & Time Slot
                  </h3>

                  {/* Date Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                      Select Date:
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-[#8B1A2B] focus:outline-none"
                    />
                    
                    {/* Closed Day Notice */}
                    {isDateClosed(bookingData.date) && (
                      <div className="p-3 rounded-xl bg-[#8B1A2B]/15 border border-[#8B1A2B]/30 text-xs text-zinc-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-[#C93B4E] shrink-0" />
                        <span>Zee Barber Shop is closed on this date. Please select another date.</span>
                      </div>
                    )}
                  </div>

                  {/* Time Slot Picker */}
                  {!isDateClosed(bookingData.date) && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                        Select Available Time Slot:
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {TIME_SLOTS.map((slot) => {
                          const status = slotStatuses[slot] || {
                            timeSlot: slot,
                            count: 0,
                            isPast: isTimeSlotPast(bookingData.date, slot),
                            isFull: false,
                            isAvailable: true
                          };

                          // Rule 1: Do not show time slots that are in the past or after shop closing time (e.g. Sunday 5 PM)
                          if (status.isPast) {
                            return null;
                          }

                          const isSelected = bookingData.timeSlot === slot;
                          const isFull = status.isFull;

                          if (isFull) {
                            return (
                              <button
                                key={slot}
                                type="button"
                                disabled
                                title="This time slot is fully booked (maximum 2 bookings reached)"
                                className="py-2 px-3 rounded-lg text-xs font-mono font-semibold bg-zinc-900/60 text-zinc-600 border border-zinc-800/80 cursor-not-allowed opacity-60 flex flex-col items-center justify-center gap-0.5"
                              >
                                <span>{slot}</span>
                                <span className="text-[9px] font-bold text-red-400/90 uppercase tracking-tight">FULL (2/2)</span>
                              </button>
                            );
                          }

                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setBookingData({ ...bookingData, timeSlot: slot })}
                              className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                                isSelected
                                  ? 'bg-[#8B1A2B] text-white font-bold shadow-md scale-105 border border-[#9A1C2E]'
                                  : 'bg-zinc-950 text-[#C93B4E] hover:text-white border border-zinc-800 hover:border-[#8B1A2B]/40'
                              }`}
                            >
                              <span>{slot}</span>
                              {status.count > 0 && (
                                <span className="text-[9px] font-sans text-amber-300/80">1/2 booked</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Notice if no slots available for today */}
                      {isTodayDate(bookingData.date) && TIME_SLOTS.every(s => slotStatuses[s]?.isPast || slotStatuses[s]?.isFull) && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 mt-2">
                          All time slots for today have either passed or reached maximum booking capacity. Please select tomorrow or another upcoming date.
                        </div>
                      )}
                    </div>
                  )}

                </motion.div>
              )}

              {/* STEP 3: CONTACT DETAILS */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-white font-serif-header">
                    Step 3: Enter Your Client Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. David Vance"
                        value={bookingData.clientName}
                        onChange={(e) => setBookingData({ ...bookingData, clientName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-[#8B1A2B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                        Phone Number (Mobile) *
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. (555) 019-2831"
                        value={bookingData.clientPhone}
                        onChange={(e) => setBookingData({ ...bookingData, clientPhone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-[#8B1A2B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. david@example.com"
                        value={bookingData.clientEmail}
                        onChange={(e) => setBookingData({ ...bookingData, clientEmail: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-[#8B1A2B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                        Special Instructions / Haircut Notes (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Prefer low skin taper fade, light beard line up..."
                        value={bookingData.notes}
                        onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:border-[#8B1A2B] focus:outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: REVIEW & CONFIRM */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-white font-serif-header">
                    Step 4: Review & Send Booking
                  </h3>

                  <div className="bg-zinc-950/90 rounded-2xl border border-[#8B1A2B]/40 p-6 space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                      <span className="text-xs text-zinc-400 font-mono">SELECTED SERVICE:</span>
                      <span className="text-base font-bold text-[#C93B4E]">{selectedService.name} (${selectedService.price})</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-xs text-zinc-400 block">ESTIMATED DURATION:</span>
                        <span className="font-semibold text-white">{selectedService.durationMin} Mins</span>
                      </div>
                      <div>
                        <span className="text-xs text-zinc-400 block">DATE:</span>
                        <span className="font-semibold text-white">{bookingData.date}</span>
                      </div>
                      <div>
                        <span className="text-xs text-zinc-400 block">TIME SLOT:</span>
                        <span className="font-semibold text-[#C93B4E]">{bookingData.timeSlot}</span>
                      </div>
                      <div>
                        <span className="text-xs text-zinc-400 block">CLIENT NAME:</span>
                        <span className="font-semibold text-white">{bookingData.clientName}</span>
                      </div>
                      <div>
                        <span className="text-xs text-zinc-400 block">PHONE:</span>
                        <span className="font-semibold text-white">{bookingData.clientPhone}</span>
                      </div>
                    </div>

                    {bookingData.notes && (
                      <div className="pt-2 border-t border-zinc-800">
                        <span className="text-xs text-zinc-400 block">NOTES:</span>
                        <p className="text-xs text-zinc-300 italic">{bookingData.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Submitting will open WhatsApp with your pre-filled booking details for instant confirmation with Zee Barber Shop!</span>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Navigation Buttons between Steps */}
            <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : <div />}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={step === 2 && isDateClosed(bookingData.date)}
                  className={`px-7 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all ${
                    step === 2 && isDateClosed(bookingData.date)
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-[#8B1A2B] hover:bg-[#A32034] text-white shadow-md border border-[#9A1C2E]'
                  }`}
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-8 py-3.5 rounded-xl bg-[#8B1A2B] hover:bg-[#A32034] text-white font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-[#8B1A2B]/30 active:scale-95 border border-[#9A1C2E]"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm & Send via WhatsApp</span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </section>
  );
};

