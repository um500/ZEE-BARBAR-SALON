import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gift, Scissors, RefreshCw, Sparkles, Check, Star } from 'lucide-react';

export const LoyaltySection: React.FC = () => {
  const [stampCount, setStampCount] = useState<number>(3);

  const handleAddStamp = () => {
    setStampCount(prev => (prev >= 10 ? 1 : prev + 1));
  };

  const handleResetStamps = () => {
    setStampCount(0);
  };

  const rewardTierCards = [
    { visit: '3RD VISIT', reward: '20% OFF', desc: 'Applies to any signature haircut or beard sculpting service.' },
    { visit: '6TH VISIT', reward: '50% OFF', desc: 'Half price on your regular cut or signature master package.' },
    { visit: '9TH VISIT', reward: '75% OFF', desc: 'Deep discount reward right before your milestone cut.' },
    { visit: '10TH VISIT', reward: 'FREE CUT', desc: 'Complimentary signature haircut with hot towel finish.', isGrand: true },
  ];

  return (
    <section id="loyalty" className="py-20 bg-[#07070a] relative border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="text-xs font-black tracking-widest text-[#EAB308] uppercase border border-[#EAB308]/30 px-3.5 py-1 rounded bg-[#EAB308]/10">
              FOR OUR REGULARS
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black uppercase text-white font-serif-header tracking-tight"
          >
            LOYAL CUSTOMERS <span className="text-[#DC2626]">GET REWARDED.</span>
          </motion.h2>

          {/* Red underline bar */}
          <div className="w-16 h-1 bg-[#DC2626] mx-auto rounded-full" />

          <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed pt-1">
            We value your loyalty. Ask for a card on your next visit and unlock discounts every time you return.
          </p>
        </div>

        {/* 10-Stamp Visual Bar (Matches Reference Image Stamps Bar) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-12 bg-[#0c0c10] border border-zinc-800 rounded-2xl p-6 shadow-2xl relative"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6 text-xs font-bold text-zinc-300">
            <span className="flex items-center gap-2 text-[#EAB308] font-mono">
              <Gift className="w-4 h-4 text-[#DC2626]" />
              <span>LOVALTY STAMP TRACKER</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddStamp}
                className="px-3 py-1 rounded bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[11px] font-black uppercase tracking-wider cursor-pointer transition-colors"
              >
                + Stamp Visit
              </button>
              <button
                onClick={handleResetStamps}
                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs cursor-pointer"
                title="Reset stamps"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Stamps Bar Row */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3">
            {Array.from({ length: 10 }).map((_, index) => {
              const visitNum = index + 1;
              const isStamped = visitNum <= stampCount;

              let badgeText = '';
              if (visitNum === 3) badgeText = '20%';
              if (visitNum === 6) badgeText = '50%';
              if (visitNum === 9) badgeText = '75%';
              if (visitNum === 10) badgeText = 'Free';

              return (
                <div
                  key={visitNum}
                  onClick={() => setStampCount(visitNum)}
                  className={`relative aspect-square rounded-full border-2 flex flex-col items-center justify-center p-1 cursor-pointer transition-all ${
                    isStamped
                      ? 'bg-[#DC2626]/20 border-[#DC2626] text-white shadow-lg shadow-[#DC2626]/20 scale-105'
                      : badgeText
                      ? 'bg-zinc-900 border-[#EAB308] text-[#EAB308]'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-600'
                  }`}
                >
                  {badgeText ? (
                    <span className="text-[10px] font-black uppercase font-mono tracking-tighter">
                      {badgeText}
                    </span>
                  ) : isStamped ? (
                    <Scissors className="w-4 h-4 text-[#DC2626]" />
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-zinc-600">
                      #{visitNum}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* 4 Reward Tier Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rewardTierCards.map((card, idx) => (
            <motion.div
              key={card.visit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-xl p-6 border flex flex-col justify-between transition-all relative ${
                card.isGrand
                  ? 'bg-gradient-to-b from-[#180a0d] via-[#100d14] to-[#0a0a0e] border-[#DC2626] shadow-xl shadow-[#DC2626]/20'
                  : 'bg-[#0c0c10] border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* Top Accent Line */}
              <div className={`w-full h-1 rounded-full mb-4 ${card.isGrand ? 'bg-[#DC2626]' : 'bg-[#EAB308]'}`} />

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-zinc-400 block tracking-wider uppercase">
                  {card.visit}
                </span>

                <h3 className={`text-2xl font-black uppercase font-serif-header ${card.isGrand ? 'text-[#DC2626]' : 'text-white'}`}>
                  {card.reward}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed pt-2">
                  {card.desc}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold font-mono">
                <span className={card.isGrand ? 'text-[#DC2626]' : 'text-[#EAB308]'}>
                  {card.isGrand ? '✦ GRAND MILESTONE' : 'DISCOUNT PERK'}
                </span>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

