import React, { useState } from 'react';
import { WalletProduct, FoilType } from '../types';
import { WALLET_PRODUCTS } from '../data/walletsData';
import { Sparkles, X, Check, ShoppingBag, ShieldCheck } from 'lucide-react';

interface CustomEmbossingStudioProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    product: WalletProduct,
    selectedColor: { name: string; hex: string; image: string },
    customInitials?: string,
    foilType?: FoilType
  ) => void;
}

export const CustomEmbossingStudio: React.FC<CustomEmbossingStudioProps> = ({
  isOpen,
  onClose,
  onAddToCart
}) => {
  if (!isOpen) return null;

  const [selectedProduct, setSelectedProduct] = useState<WalletProduct>(WALLET_PRODUCTS[0]);
  const [selectedColor, setSelectedColor] = useState(selectedProduct.colors[0]);
  const [monogramText, setMonogramText] = useState('M.R.K');
  const [foilStyle, setFoilStyle] = useState<FoilType>('Gold Foil');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleProductChange = (prod: WalletProduct) => {
    setSelectedProduct(prod);
    setSelectedColor(prod.colors[0]);
  };

  const handleApplyCustomization = () => {
    onAddToCart(
      selectedProduct,
      selectedColor,
      monogramText.trim().toUpperCase() || 'L.C',
      foilStyle
    );
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div id="embossing-studio-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-zinc-900 border border-amber-700/50 rounded-2xl max-w-4xl w-full text-amber-50 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-950/80 text-zinc-400 hover:text-amber-300 border border-amber-800/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-950 p-6 border-b border-amber-800/30 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-extrabold text-amber-100">
              Bespespoke Monogram Hot-Foil Studio
            </h2>
            <p className="text-xs text-amber-300/80 font-sans">
              Personalize your leather wallet with custom initials stamped by hand in our Lahore atelier.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 p-6 gap-8">
          {/* Left Canvas Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square sm:aspect-[4/3] bg-zinc-950 rounded-xl overflow-hidden border border-amber-800/40 shadow-2xl flex items-center justify-center p-4 group">
              <img
                src={selectedColor.image || selectedProduct.images[0]}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-lg shadow-2xl filter contrast-105"
              />

              {/* Monogram Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent flex items-center justify-center">
                <div className="bg-zinc-950/85 backdrop-blur-md px-6 py-3 rounded-xl border border-amber-500/40 shadow-2xl text-center transform scale-110">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400/80 block mb-1">
                    24K Brass Heat Stamping
                  </span>
                  <span
                    className={`font-serif font-extrabold text-3xl sm:text-4xl tracking-widest select-none ${
                      foilStyle === 'Gold Foil'
                        ? 'text-amber-300 drop-shadow-[0_4px_10px_rgba(234,179,8,0.7)]'
                        : foilStyle === 'Silver Foil'
                        ? 'text-slate-100 drop-shadow-[0_4px_10px_rgba(226,232,240,0.7)]'
                        : 'text-amber-950 opacity-90 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]'
                    }`}
                  >
                    {monogramText.toUpperCase() || 'YOUR INITIALS'}
                  </span>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 bg-zinc-950/90 px-3 py-1 rounded-full text-[11px] text-amber-300 border border-amber-800/40 font-bold">
                Live Embossing Preview
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 text-center font-sans">
              ✨ Free of charge on all full-grain wallet orders in Pakistan.
            </p>
          </div>

          {/* Right Controls */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. Choose Product */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
                1. Select Wallet Model:
              </label>
              <select
                value={selectedProduct.id}
                onChange={(e) => {
                  const p = WALLET_PRODUCTS.find((w) => w.id === e.target.value);
                  if (p) handleProductChange(p);
                }}
                className="w-full bg-zinc-950 border border-amber-800/50 rounded-lg px-3 py-2.5 text-xs font-serif font-bold text-amber-100 focus:outline-none focus:border-amber-400"
              >
                {WALLET_PRODUCTS.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name} - Rs. {prod.price.toLocaleString('en-PK')}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Choose Color */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
                2. Select Leather Tone:
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      selectedColor.name === c.name
                        ? 'bg-amber-950 border-amber-400 text-amber-200'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                    <span>{c.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Enter Initials */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
                3. Your Custom Initials or Name:
              </label>
              <input
                type="text"
                maxLength={6}
                value={monogramText}
                onChange={(e) => setMonogramText(e.target.value.toUpperCase())}
                placeholder="e.g. A.K.R"
                className="w-full bg-zinc-950 border border-amber-700/60 rounded-lg px-4 py-3 text-base font-serif font-bold text-amber-200 focus:outline-none focus:border-amber-400 tracking-widest uppercase"
              />
            </div>

            {/* 4. Foil Style */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
                4. Select Stamping Foil Style:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Gold Foil', 'Silver Foil', 'Deep Blind Deboss'] as FoilType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFoilStyle(f)}
                    className={`p-2 rounded-lg border text-[11px] font-bold text-center transition-all ${
                      foilStyle === f
                        ? 'bg-amber-950 border-amber-400 text-amber-300 ring-1 ring-amber-400'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-amber-800'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="p-3 bg-zinc-950 rounded-xl border border-amber-800/30 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Total Price (Inc. Free Embossing & COD):</span>
              <span className="font-serif font-extrabold text-lg text-amber-300">
                Rs. {selectedProduct.price.toLocaleString('en-PK')}
              </span>
            </div>

            {/* Apply & Add to Bag */}
            <button
              onClick={handleApplyCustomization}
              className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl ${
                isSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-amber-700 text-zinc-950 hover:from-amber-400 hover:to-amber-600 border border-amber-300'
              }`}
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Custom Monogram Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-zinc-950" />
                  <span>Order Custom Monogram Wallet (COD)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
