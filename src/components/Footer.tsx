import React from 'react';
import { Truck, ShieldCheck, PhoneCall, Mail, MapPin, Sparkles, PackageCheck, HelpCircle, Lock } from 'lucide-react';

interface FooterProps {
  onOpenTracker: () => void;
  onOpenEmbossingStudio: () => void;
  onOpenAiAdvisor: () => void;
  onOpenAuthenticity: () => void;
  onOpenAdminPanel?: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTracker,
  onOpenEmbossingStudio,
  onOpenAiAdvisor,
  onOpenAuthenticity,
  onOpenAdminPanel,
  onSelectCategory
}) => {
  return (
    <footer id="store-footer" className="bg-zinc-950 text-amber-50 border-t border-amber-900/40 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Top 4 Value Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-zinc-800">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-amber-950 border border-amber-700/40 text-amber-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-amber-200">Nationwide COD</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Cash on Delivery in Karachi, Lahore, Islamabad & 200+ cities in Pakistan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-amber-950 border border-amber-700/40 text-amber-400 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-amber-200">Free Hot Foil Monogram</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Custom 24K Gold or Silver initial debossing on all full-grain wallets.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-amber-950 border border-amber-700/40 text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-amber-200">1-Year Leather Warranty</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Guaranteed 100% genuine top-grain cowhide leather with certificate.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-amber-950 border border-amber-700/40 text-amber-400 shrink-0">
              <PhoneCall className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-amber-200">WhatsApp Support</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Instant order help & custom corporate inquiries via +92 313 7777344.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand & Address */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center font-serif text-lg font-bold text-amber-100">
                LC
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-amber-100">
                LEATHERCRAFT<span className="text-amber-500 font-sans text-xs ml-1">PK</span>
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Pakistan’s premier online store for handcrafted full-grain leather wallets, RFID smart cardholders, and bespoke gift boxes. Hand-stitched with German thread in Sialkot ateliers.
            </p>

            <div className="space-y-1.5 text-xs text-zinc-400 pt-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Atelier: Main Small Industrial Estate, Sialkot & Lahore, Pakistan</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>support@leathercraft.pk</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase text-amber-300 tracking-wider">
              Popular Collections
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-medium">
              <li>
                <button onClick={() => onSelectCategory('Bifold Wallets')} className="hover:text-amber-300">
                  Italian Bifold Wallets (PKR Sized)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Minimalist Cardholders')} className="hover:text-amber-300">
                  Slim Minimalist Cardholders
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('RFID Smart Wallets')} className="hover:text-amber-300">
                  Pop-Up RFID Aluminum Vaults
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Executive & Passport')} className="hover:text-amber-300">
                  Executive Passport Travel Organizers
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Services */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase text-amber-300 tracking-wider">
              Customer Services
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-medium">
              <li>
                <button onClick={onOpenTracker} className="hover:text-amber-300 flex items-center gap-1.5">
                  <PackageCheck className="w-3.5 h-3.5 text-emerald-400" /> Track My Package (TCS / PostEx)
                </button>
              </li>
              <li>
                <button onClick={onOpenAiAdvisor} className="hover:text-amber-300 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> AI Leather Gift Advisor
                </button>
              </li>
              <li>
                <button onClick={onOpenAuthenticity} className="hover:text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Verify Warranty Card
                </button>
              </li>
              {onOpenAdminPanel && (
                <li>
                  <button onClick={onOpenAdminPanel} className="hover:text-amber-300 flex items-center gap-1.5 text-amber-400 font-bold mt-2">
                    <Lock className="w-3.5 h-3.5 text-amber-400" /> Store Admin Orders Panel
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Payment Badges & Copyright */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} LeatherCraft PK. Handcrafted Luxury Leather Wallets in Pakistan.</p>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-zinc-900 px-2.5 py-1 rounded text-[10px] font-bold text-amber-300 border border-amber-800/40">
              Cash on Delivery (COD)
            </span>
            <span className="bg-zinc-900 px-2.5 py-1 rounded text-[10px] font-bold text-amber-300 border border-amber-800/40">
              JazzCash
            </span>
            <span className="bg-zinc-900 px-2.5 py-1 rounded text-[10px] font-bold text-amber-300 border border-amber-800/40">
              EasyPaisa
            </span>
            <span className="bg-zinc-900 px-2.5 py-1 rounded text-[10px] font-bold text-amber-300 border border-amber-800/40">
              Meezan / HBL Bank Transfer
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
