import React from 'react';
import { Sparkles, Shield, Truck, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import heroImg from '../assets/images/luxury_wallet_hero_1786252882190.jpg';

interface HeroProps {
  onExploreClick: () => void;
  onEmbossingClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onEmbossingClick }) => {
  return (
    <div id="hero-section" className="relative bg-zinc-950 text-amber-50 overflow-hidden border-b border-amber-900/30">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Luxury Handcrafted Leather Wallet Pakistan"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/40" />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Copy & Actions */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-950/90 to-zinc-900 border border-amber-500/40 text-amber-300 text-xs font-semibold tracking-wider uppercase shadow-xl backdrop-blur-md">
            <Award className="w-4 h-4 text-amber-400" />
            <span>100% Full-Grain Cowhide • Handcrafted in Pakistan</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-amber-100 leading-[1.12]">
            Timeless Leather Craftsmanship for <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">Pakistan's Modern Gentleman</span>
          </h1>

          {/* Description */}
          <p className="text-zinc-300 text-base sm:text-lg max-w-2xl leading-relaxed font-sans">
            Elevate your everyday carry with bespoke Italian & full-grain leather wallets. Tailored specifically with extra-wide compartments for Pakistani Rupee currency notes, RFID digital shielding, and complimentary 24K gold foil initial embossing.
          </p>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-xl mx-auto lg:mx-0 text-left">
            <div className="flex items-center gap-2 text-xs text-amber-200/90 bg-zinc-900/80 p-2.5 rounded-lg border border-amber-900/40">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-amber-100">Nationwide COD</p>
                <p className="text-[10px] text-zinc-400">Karachi, LHR, ISB & All PK</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-amber-200/90 bg-zinc-900/80 p-2.5 rounded-lg border border-amber-900/40">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-amber-100">Free Initials</p>
                <p className="text-[10px] text-zinc-400">24K Gold Foil Stamping</p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center gap-2 text-xs text-amber-200/90 bg-zinc-900/80 p-2.5 rounded-lg border border-amber-900/40">
              <Shield className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-amber-100">1-Year Warranty</p>
                <p className="text-[10px] text-zinc-400">100% Genuine Guarantee</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button
              id="hero-explore-catalog-btn"
              onClick={onExploreClick}
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-zinc-950 font-bold text-sm tracking-wider uppercase shadow-xl shadow-amber-900/40 border border-amber-300 transition-all hover:scale-105 flex items-center justify-center gap-2 group"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 text-zinc-950 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Feature Card Visual */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl p-1 bg-gradient-to-b from-amber-500/30 via-amber-700/20 to-zinc-900 shadow-2xl shadow-amber-950">
            <div className="bg-zinc-900/95 backdrop-blur-xl rounded-xl p-6 border border-amber-800/30 space-y-6">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-amber-900/30 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                  <span className="text-xs font-serif font-bold text-amber-300 uppercase tracking-widest">
                    Craft Spotlight
                  </span>
                </div>
                <span className="text-[11px] bg-amber-950 text-amber-300 px-2.5 py-1 rounded-full font-bold border border-amber-700/40">
                  Rs. 5,499 PKR
                </span>
              </div>

              {/* Showcase Mini Image */}
              <div className="relative rounded-lg overflow-hidden group border border-amber-900/40">
                <img
                  src={heroImg}
                  alt="Sovereign Italian Bifold Open View"
                  referrerPolicy="no-referrer"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-amber-100">
                  <span className="font-semibold font-serif text-sm">The Sovereign Bifold</span>
                  <span className="bg-emerald-950/90 text-emerald-300 px-2 py-0.5 rounded text-[10px] border border-emerald-700/50 font-bold">
                    In Stock • Fast COD
                  </span>
                </div>
              </div>

              {/* Quick Feature Checklist */}
              <div className="space-y-2 text-xs text-zinc-300 font-sans">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Sized for PKR 5,000, 1,000 & 500 currency bundles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>13.56 MHz RFID Anti-Theft Signal Blocking Shield</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Delivered in Matte Presentation Gift Box + Dust Bag</span>
                </div>
              </div>

              {/* Bottom CTAs */}
              <div className="pt-2">
                <button
                  onClick={onExploreClick}
                  className="w-full py-2.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 text-xs font-bold border border-amber-700/40 transition-colors text-center"
                >
                  View Sovereign Bifold Specifications →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
