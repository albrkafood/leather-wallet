import React from 'react';
import { Droplets, Sun, Sparkles, ShieldCheck, Heart } from 'lucide-react';

export const LeatherCareSection: React.FC = () => {
  return (
    <section id="care-section" className="py-16 bg-zinc-900 border-t border-b border-amber-900/30 text-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-amber-400" />
            <span>Patina & Preservation</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-amber-100">
            Caring for Your Full-Grain Leather in Pakistan
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-sans">
            Full-grain cowhide leather matures over time, absorbing natural oils to build a rich patina unique to your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-zinc-950 rounded-xl border border-amber-900/30 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-amber-200">1. Moisture & Water Protection</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              If caught in heavy monsoons in Karachi or Lahore, let your wallet air dry naturally at room temperature. Never use direct heat dry hair-dryers.
            </p>
          </div>

          <div className="p-6 bg-zinc-950 rounded-xl border border-amber-900/30 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-amber-200">2. Natural Leather Conditioning</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Apply a tiny pea-sized dab of organic beeswax or natural leather balm once every 6 months to maintain supple elasticity and deep color tones.
            </p>
          </div>

          <div className="p-6 bg-zinc-950 rounded-xl border border-amber-900/30 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-amber-200">3. Avoid Prolonged Direct Sun</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Avoid leaving your wallet on car dashboards in extreme summer heat. Store in our satin dust pouch when not carrying in your pocket.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
