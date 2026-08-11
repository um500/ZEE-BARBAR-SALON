import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, Maximize2, Tag } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/barberData';
import { GalleryItem } from '../types';

export const GallerySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'interior' | 'cuts' | 'beards' | 'tools'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filterTabs = [
    { id: 'all', label: 'All Photos' },
    { id: 'interior', label: 'Shop Atmosphere' },
    { id: 'cuts', label: 'Haircuts & Fades' },
    { id: 'beards', label: 'Beard Artistry' },
    { id: 'tools', label: 'Master Tools' }
  ];

  const filteredItems = activeTab === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeTab);

  return (
    <section id="gallery" className="py-24 bg-[#0d0d11] relative border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#C93B4E] uppercase bg-[#8B1A2B]/15 px-3.5 py-1.5 rounded-full border border-[#8B1A2B]/30">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Craftsmanship</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif-header">
            Inside Zee Barber Shop
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base">
            Take a glimpse into our shop interior, custom leather chairs, precision tool station, and client cuts.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#8B1A2B] text-white shadow-md font-bold border border-[#9A1C2E]'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedImage(item)}
              className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-[#8B1A2B]/60 cursor-pointer shadow-xl aspect-[4/3]"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-[#0a0a0d]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                <span className="text-[10px] font-mono font-bold text-[#C93B4E] uppercase tracking-widest flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>{item.category}</span>
                </span>
                <h3 className="text-base font-bold text-white font-serif-header">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-300 line-clamp-1 mt-0.5">
                  {item.caption}
                </p>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#8B1A2B] text-white flex items-center justify-center shadow-lg border border-[#9A1C2E]">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#121217] rounded-3xl overflow-hidden border border-[#8B1A2B]/40 shadow-2xl space-y-4 p-4 sm:p-6"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-950/80 text-zinc-300 hover:text-white border border-zinc-800"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="rounded-2xl overflow-hidden max-h-[70vh] flex items-center justify-center bg-black">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white font-serif-header">
                  {selectedImage.title}
                </h3>
                <p className="text-sm text-zinc-300">
                  {selectedImage.caption}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

