import React, { useState, useEffect } from 'react';
import { Calendar, Menu, X, Phone } from 'lucide-react';
import { getCurrentShopStatus, DISPLAY_PHONE } from '../data/barberData';
import { ZeeBarberLogo } from './ZeeBarberLogo';

interface NavbarProps {
  onBookClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onBookClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shopStatus = getCurrentShopStatus();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Booking', href: '#booking' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Location', href: '#location' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0d0d11]/95 backdrop-blur-md border-b border-[#8B1A2B]/30 py-3 shadow-2xl'
          : 'bg-gradient-to-b from-[#0a0a0d] via-[#0a0a0d]/90 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo — Single Logo Image Only */}
          <a href="#home" className="flex items-center group cursor-pointer" aria-label="Zee Barber Shop Home">
            <ZeeBarberLogo className="h-9 sm:h-10 w-auto transition-transform group-hover:scale-105" />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C93B4E] hover:after:w-full after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action: Book Appointment Button */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={onBookClick}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-[#8B1A2B] hover:bg-[#A32034] border border-[#9A1C2E] transition-all shadow-lg shadow-[#8B1A2B]/20 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Actions: Book & Hamburger Menu */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <button
              onClick={onBookClick}
              className="sm:hidden px-3.5 py-1.5 text-xs font-bold rounded-lg text-white bg-[#8B1A2B] hover:bg-[#A32034] border border-[#9A1C2E] flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              Book
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#14141c] text-zinc-300 hover:text-white border border-zinc-800 focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d0d11]/98 border-b border-[#8B1A2B]/30 px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#14141a] border border-zinc-800 text-xs text-zinc-300">
            <span className={`w-2 h-2 rounded-full ${shopStatus.isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-[#8B1A2B]'}`} />
            <span>{shopStatus.closingOrOpeningText}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-[#181216] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onBookClick();
              }}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-[#8B1A2B] hover:bg-[#A32034] border border-[#9A1C2E] transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment Online
            </button>

            <a
              href={`tel:${DISPLAY_PHONE}`}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-zinc-300 bg-[#14141c] border border-zinc-800 flex items-center justify-center gap-2 hover:border-[#8B1A2B]/50"
            >
              <Phone className="w-3.5 h-3.5 text-[#C93B4E]" />
              Call {DISPLAY_PHONE}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
