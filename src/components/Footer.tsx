import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Clock, ArrowUp } from 'lucide-react';
import { DISPLAY_ADDRESS, DISPLAY_PHONE, DISPLAY_EMAIL } from '../data/barberData';
import { ZeeBarberLogo } from './ZeeBarberLogo';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050507] text-zinc-400 border-t border-zinc-800/80 pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <ZeeBarberLogo className="h-12 w-auto" />

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
              Fifteen years of mastering the blade, the fade, and the finish. Built on handshake trust, precision craftsmanship, and repeat clientele since 2011.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#C93B4E] hover:border-[#8B1A2B]/40 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#C93B4E] hover:border-[#8B1A2B]/40 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-serif-header">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" className="hover:text-[#C93B4E] transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-[#C93B4E] transition-colors">15+ Years Story</a></li>
              <li><a href="#services" className="hover:text-[#C93B4E] transition-colors">Services & Pricing</a></li>
              <li><a href="#booking" className="hover:text-[#C93B4E] transition-colors">Book Appointment</a></li>
              <li><a href="#gallery" className="hover:text-[#C93B4E] transition-colors">Shop Gallery</a></li>
              <li><a href="#location" className="hover:text-[#C93B4E] transition-colors">Location & Hours</a></li>
            </ul>
          </div>

          {/* Top Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-serif-header">
              Signature Cuts
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#services" className="hover:text-[#C93B4E] transition-colors">Zee Signature Haircut</a></li>
              <li><a href="#services" className="hover:text-[#C93B4E] transition-colors">Skin & Taper Fades</a></li>
              <li><a href="#services" className="hover:text-[#C93B4E] transition-colors">Beard Sculpt & Razor Shape</a></li>
              <li><a href="#services" className="hover:text-[#C93B4E] transition-colors">The Master Combo</a></li>
              <li><a href="#services" className="hover:text-[#C93B4E] transition-colors">Royal Hot Towel Shave</a></li>
              <li><a href="#services" className="hover:text-[#C93B4E] transition-colors">Young Gentleman Cut</a></li>
            </ul>
          </div>

          {/* Contact & Hours Summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-serif-header">
              Shop Info
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C93B4E] shrink-0 mt-0.5" />
                <span>{DISPLAY_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C93B4E] shrink-0" />
                <span>{DISPLAY_PHONE}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C93B4E] shrink-0" />
                <span>Mon–Sat: 9:00 AM – 7:00 PM (Sun Closed)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© Zee Barber Shop. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5 text-[#C93B4E]" />
            <span>Back to Top</span>
          </button>
        </div>

      </div>
    </footer>
  );
};

