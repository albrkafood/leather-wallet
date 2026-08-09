import React, { useState, useMemo } from 'react';
import { WalletProduct, WalletCategory } from '../types';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, Search, Filter, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

interface ProductCatalogProps {
  products: WalletProduct[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onQuickView: (product: WalletProduct) => void;
  onAddToCart: (product: WalletProduct, selectedColor: { name: string; hex: string; image: string }, customInitials?: string) => void;
}

const CATEGORIES: WalletCategory[] = [
  'All',
  'Designer Inspired',
  'Bifold Wallets',
  'Minimalist Cardholders',
  'Executive & Passport',
  'RFID Smart Wallets',
  'Personalized Editions'
];

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onQuickView,
  onAddToCart
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [onlyRfid, setOnlyRfid] = useState(false);
  const [priceMax, setPriceMax] = useState<number>(10000);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch =
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.leatherType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRfid = !onlyRfid || p.hasRfidProtection;
        const matchesPrice = p.price <= priceMax;

        return matchesCategory && matchesSearch && matchesRfid && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // default featured (bestsellers first)
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, onlyRfid, priceMax, sortBy]);

  return (
    <section id="catalog-section" className="py-16 bg-zinc-950 text-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Curated Full-Grain Leather Collections</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-amber-100">
            Handcrafted Luxury Wallets in Pakistan
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-sans">
            Every piece is forged from full-grain top-tier cowhide leather with specialized PKR currency height, RFID shielding, and option for complimentary initial embossing.
          </p>
        </div>

        {/* Categories Tabs Navigation */}
        <div className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar gap-2 pb-2 border-b border-amber-900/30">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-amber-950 font-bold border-amber-400 shadow-md scale-105'
                  : 'bg-zinc-900/80 text-zinc-300 hover:text-amber-300 border-zinc-800 hover:border-amber-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-zinc-900/80 rounded-xl p-4 border border-amber-900/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          {/* Left search & counts */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <span className="text-amber-200 font-serif font-bold text-sm">
              Showing <span className="text-amber-400 font-sans">{filteredProducts.length}</span> luxury designs
            </span>

            {/* Quick RFID Toggle */}
            <label className="flex items-center gap-2 cursor-pointer bg-zinc-950 px-3 py-1.5 rounded-lg border border-amber-800/30 text-amber-200">
              <input
                type="checkbox"
                checked={onlyRfid}
                onChange={(e) => setOnlyRfid(e.target.checked)}
                className="accent-amber-500 rounded"
              />
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>RFID Protected Only</span>
            </label>
          </div>

          {/* Right Sort & Price Slider */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            {/* Price Max Slider */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-[11px]">Max: Rs. {priceMax.toLocaleString('en-PK')}</span>
              <input
                type="range"
                min="2000"
                max="10000"
                step="500"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-24 accent-amber-500"
              />
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-zinc-950 text-amber-100 border border-amber-800/40 rounded-lg px-3 py-1.5 focus:outline-none text-xs font-semibold"
              >
                <option value="featured">Featured / Bestsellers</option>
                <option value="price-low">Price: Low to High (PKR)</option>
                <option value="price-high">Price: High to Low (PKR)</option>
                <option value="rating">Highest Customer Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="py-16 text-center space-y-4 bg-zinc-900/50 rounded-2xl border border-amber-900/20 p-8">
            <Search className="w-12 h-12 text-amber-500/50 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-amber-100">
              No matching luxury wallets found
            </h3>
            <p className="text-zinc-400 text-xs max-w-md mx-auto font-sans">
              We couldn't find any wallets matching "{searchQuery}". Try broadening your category or resetting price filters.
            </p>
            <button
              onClick={() => {
                onSelectCategory('All');
                onSearchChange('');
                setOnlyRfid(false);
                setPriceMax(10000);
              }}
              className="px-5 py-2.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700/50 hover:border-amber-400 text-xs font-bold inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
