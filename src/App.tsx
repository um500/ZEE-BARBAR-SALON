import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutStrip } from './components/AboutStrip';
import { ServicesSection } from './components/ServicesSection';
import { BookingSection } from './components/BookingSection';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { LocationHoursSection } from './components/LocationHoursSection';
import { Footer } from './components/Footer';
import { AiBookingChat } from './components/AiBookingChat';

export default function App() {
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | undefined>(undefined);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceForBooking = (serviceId: string) => {
    setSelectedServiceForBooking(serviceId);
    scrollToSection('booking');
  };

  const handleGeneralBookClick = () => {
    scrollToSection('booking');
  };

  const handleExploreServicesClick = () => {
    scrollToSection('services');
  };

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-zinc-100 font-sans antialiased selection:bg-amber-400 selection:text-zinc-950">
      
      {/* Sticky Top Navbar */}
      <Navbar onBookClick={handleGeneralBookClick} />

      {/* Main Single Page Sections */}
      <main>
        {/* 1. Hero Section */}
        <Hero
          onBookClick={handleGeneralBookClick}
          onExploreServicesClick={handleExploreServicesClick}
        />

        {/* 2. Experience & Trust Strip */}
        <AboutStrip />

        {/* 3. Services & Pricing */}
        <ServicesSection onSelectServiceForBooking={handleSelectServiceForBooking} />

        {/* 4. Multi-Step Online Booking */}
        <BookingSection preselectedServiceId={selectedServiceForBooking} />

        {/* 5. Gallery / "Inside Zee Barber Shop" */}
        <GallerySection />

        {/* 6. Client Testimonials */}
        <TestimonialsSection />

        {/* 7. Location & Operating Hours */}
        <LocationHoursSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating AI Chat Assistant */}
      <AiBookingChat />

    </div>
  );
}
