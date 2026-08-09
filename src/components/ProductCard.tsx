import React, { useState } from 'react';
import { WalletProduct } from '../types';
import { Star, ShieldCheck, Sparkles, ShoppingBag, Eye, Check, Zap } from 'lucide-react';

interface ProductCardProps {
  product: WalletProduct;
  onQuickView: (product: WalletProduct) => void;
  onAddToCart: (product: WalletProduct, selectedColor: { name: string; hex: string; image: string }, customInitials?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart
}) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const discountAmount = product.originalPrice - product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onQuickView(product)}
      className="group bg-zinc-900/90 rounded-xl border border-amber-900/30 hover:border-amber-600/60 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-950/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative bg-zinc-950 aspect-[4/3] overflow-hidden">
        {/* Main Image */}
        <img
          src={selectedColor?.image || product.images[currentImageIndex] || product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-gradient-to-r from-amber-500 to-amber-700 text-amber-950 font-bold text-[10px] uppercase px-2.5 py-1 rounded-md shadow-md tracking-wider border border-amber-300">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-emerald-950 text-emerald-300 font-bold text-[10px] uppercase px-2.5 py-1 rounded-md border border-emerald-700/60 shadow-md">
              New Release
            </span>
          )}
          {discountAmount > 0 && (
            <span className="bg-rose-950 text-rose-300 font-bold text-[10px] uppercase px-2 py-0.5 rounded border border-rose-800">
              Save Rs. {discountAmount.toLocaleString('en-PK')}
            </span>
          )}
        </div>

        {/* RFID Shielding Badge */}
        {product.hasRfidProtection && (
          <div className="absolute top-3 right-3 z-10 bg-zinc-950/80 backdrop-blur-md p-1.5 rounded-full border border-amber-700/40 text-amber-400" title="13.56 MHz RFID Protected">
            <ShieldCheck className="w-4 h-4" />
          </div>
        )}

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            id={`quick-view-${product.id}`}
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            className="bg-zinc-900/90 hover:bg-amber-600 text-amber-200 hover:text-amber-950 font-bold text-xs px-4 py-2 rounded-full border border-amber-500/50 flex items-center gap-1.5 shadow-xl transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick Inspect</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Rating & Reviews */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-amber-400/90 font-medium tracking-wide uppercase text-[10px]">
              {product.leatherType}
            </span>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= Math.round(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-zinc-700 text-zinc-700'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-amber-200 text-xs ml-0.5">{product.rating}</span>
              <span className="text-zinc-500 text-[10px]">({product.reviewsCount} reviews)</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-serif font-bold text-lg text-amber-100 group-hover:text-amber-300 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Features highlight */}
          <div className="flex items-center gap-2 text-[11px] text-amber-300/80 mt-2">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span>100% Genuine Full-Grain Leather</span>
          </div>
        </div>

        {/* Color Palette Selector */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
          <div className="flex items-center gap-1.5">
            {product.colors.map((col, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(col);
                }}
                className={`w-4 h-4 rounded-full border transition-all ${
                  selectedColor.name === col.name
                    ? 'ring-2 ring-amber-400 border-zinc-950 scale-110'
                    : 'border-zinc-700 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
            <span className="text-[10px] text-zinc-400 ml-1 font-sans">
              {selectedColor.name.split(' ')[0]}
            </span>
          </div>

          <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            COD Available
          </span>
        </div>

        {/* Pricing & Action Buttons Footer */}
        <div className="pt-2 flex items-center justify-between gap-1.5">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="font-serif font-extrabold text-base sm:text-lg text-amber-300">
                Rs. {product.price.toLocaleString('en-PK')}
              </span>
            </div>
            {product.originalPrice > product.price && (
              <span className="text-[10px] text-zinc-500 line-through">
                Rs. {product.originalPrice.toLocaleString('en-PK')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id={`add-to-cart-${product.id}`}
              onClick={handleAddToCart}
              title="Add to Shopping Bag"
              className={`p-2.5 rounded-lg font-bold text-xs flex items-center justify-center transition-all shadow-md ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-amber-200 border border-amber-800/60'
              }`}
            >
              {isAdded ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <ShoppingBag className="w-4 h-4 text-amber-400" />
              )}
            </button>

            <button
              id={`buy-now-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-md bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-zinc-950 border border-amber-300"
            >
              <Zap className="w-3.5 h-3.5 fill-zinc-950 text-zinc-950" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
