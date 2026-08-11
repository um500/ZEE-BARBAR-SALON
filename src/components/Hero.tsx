import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronDown, Clock, MapPin, Sparkles, Scissors, ArrowRight } from 'lucide-react';
import { getCurrentShopStatus } from '../data/barberData';
import { ZeeBarberLogo } from './ZeeBarberLogo';

interface HeroProps {
  onBookClick: () => void;
  onExploreServicesClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookClick, onExploreServicesClick }) => {
  const shopStatus = getCurrentShopStatus();

  return (
    <section id="home" className="relative min-h-[92vh] pt-28 pb-16 flex flex-col items-center justify-center overflow-hidden bg-[#07070a]">
      
      {/* Background Image Overlay with Dark Gradient Mask */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1920&q=80"
          alt="Zee Barber Shop Interior"
          className="w-full h-full object-cover object-center opacity-15 filter contrast-125 saturate-50 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07070a] via-[#07070a]/90 to-[#07070a]" />
        {/* Subtle grid accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#DC2626_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.08]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6 flex flex-col items-center">
        
        {/* Top Eyebrow Tag */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-black tracking-widest text-[#EAB308] uppercase"
        >
          <span>✦</span>
          <span>DOWNTOWN'S PREMIER BARBERSHOP</span>
          <span>✦</span>
        </motion.div>

        {/* Emblem Logo Badge Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative group cursor-pointer"
          onClick={onBookClick}
        >
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-b from-[#1c080d] via-[#0f0a0d] to-[#07070a] p-3 border-2 border-[#DC2626]/60 shadow-[0_0_40px_rgba(220,38,38,0.25)] flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-105">
            {/* Subtle red corner markers */}
            <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-[#DC2626]" />
            <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-[#DC2626]" />
            <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-[#DC2626]" />
            <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-[#DC2626]" />

            <ZeeBarberLogo className="w-20 h-20 sm:w-28 sm:h-28" />
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-1"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none font-serif-header">
            SHARP CUTS.
          </h1>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#DC2626] leading-none font-serif-header drop-shadow-[0_2px_10px_rgba(220,38,38,0.3)]">
            SHARP CONFIDENCE.
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-zinc-300 text-sm sm:text-base max-w-xl leading-relaxed font-normal"
        >
          Premium grooming for the modern man. Classic barbering heritage meets modern precision at Downtown Kitchener.
        </motion.p>

        {/* Slanted Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md"
        >
          <button
            onClick={onBookClick}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 rounded-md transition-all shadow-lg shadow-[#DC2626]/30 active:scale-95 cursor-pointer -skew-x-6 hover:skew-x-0"
          >
            <Scissors className="w-4 h-4 text-white skew-x-6 hover:skew-x-0" />
            <span className="skew-x-6 hover:skew-x-0">BOOK APPOINTMENT</span>
          </button>

          <button
            onClick={onExploreServicesClick}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#121217] hover:bg-zinc-800 text-zinc-200 font-bold text-xs sm:text-sm uppercase tracking-wider border border-zinc-800 flex items-center justify-center gap-2 rounded-md transition-all cursor-pointer"
          >
            <span>VIEW SERVICES</span>
            <ArrowRight className="w-4 h-4 text-[#DC2626]" />
          </button>
        </motion.div>

        {/* Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121217] border border-zinc-800/80 text-xs text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-[#EAB308]" />
            <span className="font-medium">{shopStatus.message}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </motion.div>

        {/* Bouncing Scroll Down Arrow */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="pt-6 text-zinc-500 hover:text-zinc-300 cursor-pointer"
          onClick={onExploreServicesClick}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>

      </div>
    </section>
  );
};


