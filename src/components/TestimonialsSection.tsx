import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, ShieldCheck, ThumbsUp } from 'lucide-react';
import { TESTIMONIALS } from '../data/barberData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#0a0a0d] relative border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#C93B4E] uppercase bg-[#8B1A2B]/15 px-3.5 py-1.5 rounded-full border border-[#8B1A2B]/30">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Decade-Long Relationships</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif-header">
            15+ Years of Client Word-of-Mouth
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base">
            We don't rely on flashy marketing. Our shop was built entirely on repeat clients who have trusted us with their hair and beard for over a decade.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-2xl bg-[#0f0f14] border border-zinc-800 p-6 flex flex-col justify-between hover:border-[#8B1A2B]/40 transition-all hover:bg-[#141217] shadow-xl"
            >
              <div className="space-y-4">
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#C93B4E]">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C93B4E]" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#8B1A2B]/40" />
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              {/* Author & Tenure Info */}
              <div className="pt-6 mt-4 border-t border-zinc-800/80 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-10 h-10 rounded-full object-cover border border-[#8B1A2B]/40 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-white font-serif-header">
                    {t.author}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#C93B4E] font-medium">
                    <ShieldCheck className="w-3 h-3 text-[#C93B4E]" />
                    <span>{t.tenure}</span>
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

