import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Scissors, Clock, Check, Sparkles, ArrowRight, ShieldAlert, FileText } from 'lucide-react';
import { SERVICES } from '../data/barberData';
import { ZeeBarberLogo } from './ZeeBarberLogo';

interface ServicesSectionProps {
  onSelectServiceForBooking: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForBooking }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'haircuts' | 'beards' | 'combos' | 'specialty'>('all');

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'haircuts', label: 'Haircuts & Fades' },
    { id: 'beards', label: 'Beard & Razor' },
    { id: 'combos', label: 'Signature Packages' },
    { id: 'specialty', label: 'Specialty Care' },
  ];

  const filteredServices = activeCategory === 'all'
    ? SERVICES
    : SERVICES.filter(s => s.category === activeCategory);

  // Reference quick price list items
  const quickPriceList = [
    { name: 'HAIRCUT', price: '$25' },
    { name: 'ZERO FADE', price: '$30' },
    { name: 'SHAVER FADE', price: '$35' },
    { name: 'KIDS (10 & UNDER)', price: '$20' },
    { name: 'SENIOR CUT', price: '$20' },
    { name: 'STUDENT CUT (ID REQUIRED)', price: '$20' },
    { name: 'BUZZ CUT', price: '$20' },
    { name: 'BEARD TRIM', price: '$10' },
    { name: 'HAIRCUT + BEARD', price: '$40' },
  ];

  return (
    <section id="services" className="py-20 bg-[#07070a] relative border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="text-xs font-black tracking-widest text-[#EAB308] uppercase border border-[#EAB308]/30 px-3.5 py-1 rounded bg-[#EAB308]/10">
              WHAT WE OFFER
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black uppercase text-white font-serif-header tracking-tight"
          >
            SERVICES <span className="text-[#DC2626]">&amp; PRICING</span>
          </motion.h2>

          {/* Red underline accent bar */}
          <div className="w-16 h-1 bg-[#DC2626] mx-auto rounded-full" />

          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed pt-2">
            Every haircut &amp; beard sculpt is executed with Japanese steel shears, razor discipline, and our hot towel finish.
          </p>
        </div>

        {/* Dotted Leader Price Menu & Poster Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-20">
          
          {/* Column 1: Dotted Price List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-[#0b0b0f] border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative"
          >
            {/* Red Corner Accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#DC2626]" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#DC2626]" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#DC2626]" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#DC2626]" />

            <div>
              <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#DC2626] font-bold uppercase tracking-widest border-b border-zinc-800 pb-3">
                <Scissors className="w-4 h-4" />
                <span>EXPRESS MENU &amp; TRANSPARENT RATES</span>
              </div>

              <div className="space-y-4">
                {quickPriceList.map((item) => (
                  <div key={item.name} className="flex items-baseline text-xs sm:text-sm font-bold tracking-wide">
                    <span className="text-zinc-200 font-mono uppercase">{item.name}</span>
                    <span className="flex-1 border-b border-dotted border-zinc-700/80 mx-2 sm:mx-3 relative top-[-3px]" />
                    <span className="text-[#EAB308] font-black text-sm sm:text-base font-mono">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-zinc-400">
                * All cuts include consultation &amp; hot towel finish.
              </p>
              <button
                onClick={() => onSelectServiceForBooking('s1')}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider rounded transition-colors -skew-x-6 hover:skew-x-0 cursor-pointer"
              >
                <span>BOOK EXPRESS CUT</span>
              </button>
            </div>
          </motion.div>

          {/* Column 2: Visual Price List Poster Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 bg-gradient-to-b from-[#EAB308]/20 via-[#120a0d] to-[#0a0a0e] p-1.5 rounded-2xl border border-[#DC2626]/40 shadow-2xl relative flex flex-col"
          >
            {/* Poster Inner Card */}
            <div className="bg-[#121218] rounded-xl p-6 flex-1 flex flex-col justify-between border border-zinc-800/90 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DC2626] via-[#EAB308] to-[#DC2626]" />

              <div className="space-y-4 pt-2">
                <div className="flex justify-center">
                  <ZeeBarberLogo className="h-16 w-auto" />
                </div>

                <div className="border-t border-b border-zinc-700/80 py-2">
                  <h3 className="text-lg font-black uppercase text-amber-400 font-serif-header tracking-wider">
                    PRICE LIST
                  </h3>
                </div>

                <div className="space-y-2 text-xs font-bold text-zinc-300 font-mono py-2">
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span>HAIRCUT</span>
                    <span className="text-white">$25</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span>ZERO FADE</span>
                    <span className="text-white">$30</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span>SHAVER FADE</span>
                    <span className="text-white">$35</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span>KIDS (10 &amp; UNDER)</span>
                    <span className="text-white">$20</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span>SENIOR CUT</span>
                    <span className="text-white">$20</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span>STUDENT CUT (ID REQ)</span>
                    <span className="text-white">$20</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span>BEARD TRIM</span>
                    <span className="text-white">$10</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 text-[11px] text-zinc-400 font-medium">
                ✦ WALK-INS &amp; APPOINTMENTS WELCOME ✦
              </div>
            </div>
          </motion.div>

        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#DC2626] text-white shadow-lg font-black border border-[#DC2626]'
                  : 'bg-[#121217] text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Detailed Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`relative rounded-xl bg-[#0e0e13] border transition-all hover:bg-[#121218] p-6 flex flex-col justify-between group ${
                service.isPopular
                  ? 'border-[#DC2626] shadow-xl shadow-[#DC2626]/10'
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* Popular Badge */}
              {service.isPopular && (
                <div className="absolute -top-3 right-6 px-3 py-0.5 rounded bg-[#DC2626] text-[10px] font-black text-white tracking-widest uppercase flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3 text-[#EAB308]" />
                  <span>MOST POPULAR</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black uppercase text-white group-hover:text-[#DC2626] transition-colors font-serif-header">
                      {service.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400 font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#DC2626]" />
                      <span>{service.durationMin} Mins</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black font-mono text-[#EAB308]">
                      ${service.price}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {service.description}
                </p>

                {service.features && (
                  <ul className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-zinc-400">
                        <Check className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-6 mt-4 border-t border-zinc-800/60">
                <button
                  onClick={() => onSelectServiceForBooking(service.id)}
                  className={`w-full py-2.5 px-4 rounded font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    service.isPopular
                      ? 'bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-md'
                      : 'bg-zinc-800 hover:bg-[#DC2626] text-zinc-200 hover:text-white border border-zinc-700'
                  }`}
                >
                  <span>SELECT &amp; BOOK</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Walk-in note */}
        <div className="mt-12 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#DC2626]" />
          <span>Walk-ins welcomed on daily availability. Online reservation secures your exact time slot.</span>
        </div>

      </div>
    </section>
  );
};


