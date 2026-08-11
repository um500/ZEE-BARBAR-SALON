import React from 'react';
import { MapPin, Clock, Phone, Mail, Navigation, Car, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { BUSINESS_HOURS, getCurrentShopStatus, DISPLAY_ADDRESS, DISPLAY_PHONE, DISPLAY_EMAIL } from '../data/barberData';

export const LocationHoursSection: React.FC = () => {
  const shopStatus = getCurrentShopStatus();
  const currentDayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday...

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(DISPLAY_ADDRESS)}`;

  return (
    <section id="location" className="py-24 bg-[#0d0d11] relative border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-block">
            <span className="text-xs font-black tracking-widest text-[#EAB308] uppercase border border-[#EAB308]/30 px-3.5 py-1 rounded bg-[#EAB308]/10">
              FIND OUR SHOP
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-serif-header tracking-tight">
            LOCATION <span className="text-[#DC2626]">&amp; HOURS</span>
          </h2>

          {/* Red underline bar */}
          <div className="w-16 h-1 bg-[#DC2626] mx-auto rounded-full" />

          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed pt-1">
            Located in the heart of Downtown with dedicated client parking and complimentary espresso bar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Business Hours Table & Live Status */}
          <div className="lg:col-span-5 rounded-3xl bg-[#121217] border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            
            {/* Live Status Badge Header */}
            <div className="p-4 rounded-2xl bg-[#0a0a0d] border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${shopStatus.isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-[#C93B4E]'}`} />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {shopStatus.message}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    {shopStatus.closingOrOpeningText}
                  </p>
                </div>
              </div>
              <Clock className="w-5 h-5 text-[#C93B4E]" />
            </div>

            {/* Weekly Hours Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2">
                Weekly Operating Hours
              </h4>

              <div className="space-y-2">
                {BUSINESS_HOURS.map((b) => {
                  const isToday = b.dayIndex === currentDayIndex;
                  return (
                    <div
                      key={b.dayName}
                      className={`flex items-center justify-between py-2 px-3 rounded-xl text-xs transition-colors ${
                        isToday
                          ? 'bg-[#8B1A2B]/20 border border-[#8B1A2B]/40 text-white font-bold'
                          : 'text-zinc-300'
                      }`}
                    >
                      <span className="flex items-center gap-2 font-medium">
                        {b.dayName}
                        {isToday && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#8B1A2B] text-white font-mono font-bold uppercase">
                            Today
                          </span>
                        )}
                      </span>
                      <span className={`font-mono ${b.isOpen ? 'text-zinc-200' : 'text-zinc-500 italic'}`}>
                        {b.formattedHours}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Walk-in note */}
            <div className="p-4 rounded-2xl bg-[#8B1A2B]/15 border border-[#8B1A2B]/30 space-y-1 text-xs text-zinc-200">
              <div className="font-bold flex items-center gap-1.5 text-[#C93B4E]">
                <ShieldAlert className="w-4 h-4" />
                <span>Walk-Ins Always Welcomed</span>
              </div>
              <p className="text-zinc-300 text-[11px]">
                Have 15 minutes? Drop in for an express line-up or beard sculpt. For full cuts and zero waiting, book online!
              </p>
            </div>

          </div>

          {/* Right Column: Location Details & Embedded Map View */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-2xl bg-[#121217] border border-zinc-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#8B1A2B]/20 flex items-center justify-center text-[#C93B4E]">
                  <MapPin className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Address</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {DISPLAY_ADDRESS}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#121217] border border-zinc-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#8B1A2B]/20 flex items-center justify-center text-[#C93B4E]">
                  <Phone className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Phone & Contact</h4>
                <p className="text-xs text-zinc-300">
                  {DISPLAY_PHONE}
                </p>
                <p className="text-[11px] text-zinc-400 truncate">
                  {DISPLAY_EMAIL}
                </p>
              </div>

            </div>

            {/* Simulated Map Visual Box with Direct Link */}
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
              <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-zinc-900 flex items-center justify-center">
                {/* Map background graphic */}
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80"
                  alt="Zee Barber Shop Map View"
                  className="w-full h-full object-cover filter brightness-50 contrast-125"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e] via-transparent to-black/40" />

                {/* Map Pin Marker Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
                  <div className="p-3 rounded-full bg-[#8B1A2B] text-white shadow-2xl border-2 border-white animate-bounce">
                    <MapPin className="w-6 h-6 fill-white" />
                  </div>
                  <div className="mt-2 px-3 py-1 rounded-lg bg-zinc-950/90 text-white text-xs font-bold font-serif-header border border-[#8B1A2B] shadow-xl">
                    ZEE BARBER SHOP
                  </div>
                </div>

                {/* Get Directions Floating CTA Button */}
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 px-5 py-2.5 rounded-xl bg-[#8B1A2B] hover:bg-[#A32034] text-white font-bold text-xs flex items-center gap-2 shadow-xl cursor-pointer transition-transform hover:scale-105 border border-[#9A1C2E]"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions on Google Maps</span>
                </a>
              </div>

              <div className="p-4 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-[#C93B4E]" />
                  <span>Free Client Parking Available in Rear</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Complimentary Espresso & Refreshments</span>
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

