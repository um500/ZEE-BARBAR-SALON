import React from 'react';
import { motion } from 'motion/react';
import { Award, Users, Scissors, ShieldCheck, HeartHandshake, History } from 'lucide-react';
import { BARBERS } from '../data/barberData';

export const AboutStrip: React.FC = () => {
  const stats = [
    {
      icon: History,
      value: '15+',
      label: 'Years of Experience',
      subtext: 'Mastering the blade since 2011'
    },
    {
      icon: Users,
      value: '5,000+',
      label: 'Happy Clients',
      subtext: 'Built on repeat trust & word-of-mouth'
    },
    {
      icon: Scissors,
      value: '3',
      label: 'Certified Master Barbers',
      subtext: 'Precision trained & licensed experts'
    }
  ];

  return (
    <section id="about" className="py-20 bg-[#0d0d11] border-y border-zinc-800/80 relative overflow-hidden">
      
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B1A2B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8B1A2B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="group relative p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-[#8B1A2B]/50 transition-all hover:bg-[#141217] shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-4xl sm:text-5xl font-black font-serif-header wine-gradient-text tracking-tight block">
                      {stat.value}
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-white">
                      {stat.label}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400">
                      {stat.subtext}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#8B1A2B]/20 border border-[#8B1A2B]/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-[#C93B4E]" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Narrative Story Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-[#121217]/90 rounded-3xl border border-zinc-800/80 p-8 sm:p-12">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#C93B4E] uppercase">
              <HeartHandshake className="w-4 h-4" />
              <span>The Zee Barber Story</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-header">
              From a Single Barber Chair to Downtown’s Most Trusted Grooming Salon
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-normal">
              What started fifteen years ago as a single barber chair and a relentless commitment to razor discipline has grown into a cornerstone for classic men’s grooming. Built entirely on handshake trust, repeat customers, and word of mouth, Zee Barber Shop brings together traditional barbershop craftsmanship with refined modern fade techniques. Here, every appointment is a ritual — taking the time for precise hair analysis, crisp edge-work, and hot towel finishes that leave you looking sharp and feeling confident.
            </p>

            <div className="pt-2 flex flex-wrap gap-3 text-xs font-semibold text-zinc-300">
              <span className="px-3 py-1.5 rounded-lg bg-[#1a141a] border border-[#8B1A2B]/40 text-[#C93B4E]">
                ✓ No Rush Policy
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#1a141a] border border-[#8B1A2B]/40 text-[#C93B4E]">
                ✓ Hot Towel Standard
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#1a141a] border border-[#8B1A2B]/40 text-[#C93B4E]">
                ✓ Japanese Steel Shears
              </span>
            </div>
          </div>

          {/* Barbers Showcase Snippet */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-2">
              Meet Our Certified Master Barbers
            </h3>
            
            <div className="space-y-3">
              {BARBERS.map((barber) => (
                <div
                  key={barber.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800/80 hover:border-[#8B1A2B]/40 transition-colors"
                >
                  <img
                    src={barber.avatar}
                    alt={barber.name}
                    className="w-12 h-12 rounded-lg object-cover border border-[#8B1A2B]/40"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {barber.name}
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#8B1A2B]/20 text-[#C93B4E] font-mono">
                        {barber.experienceYears} yrs
                      </span>
                    </h4>
                    <p className="text-xs text-zinc-400">{barber.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

