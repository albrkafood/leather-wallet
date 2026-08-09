import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Truck, 
  Sparkles, 
  PackageCheck, 
  ShieldCheck, 
  Menu, 
  X,
  Phone,
  HelpCircle,
  Lock
} from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracker: () => void;
  onOpenEmbossingStudio: () => void;
  onOpenAiAdvisor: () => void;
  onOpenAuthenticity: () => void;
  onOpenAdminPanel?: () => void;
  onSelectCategory: (cat: string) => void;
  selectedCategory: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenTracker,
  onOpenEmbossingStudio,
  onOpenAiAdvisor,
  onOpenAuthenticity,
  onOpenAdminPanel,
  onSelectCategory,
  selectedCategory,
  searchQuery,
  onSearchChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header id="store-header" className="sticky top-0 z-40 bg-zinc-950 text-amber-50 shadow-xl border-b border-amber-900/30">
      {/* Announcement Bar */}
      <div id="announcement-bar" className="bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-950 text-amber-200/90 py-2 px-4 text-xs font-medium tracking-wider text-center border-b border-amber-800/20 flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] uppercase font-bold border border-amber-500/30">
          <Truck className="w-3 h-3 text-amber-400" /> Free Shipping
        </span>
        <span>Nationwide Cash on Delivery (COD) across Pakistan on orders above Rs. 3,000</span>
        <span className="hidden md:inline text-amber-600">•</span>
        <span className="hidden md:inline text-amber-300 font-semibold">Free 24K Gold Foil Monogram Engraving</span>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left Mobile Menu Toggle / Brand Title */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-300 hover:text-amber-400 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center shadow-lg shadow-amber-900/30 border border-amber-500/40 group-hover:scale-105 transition-transform">
              <span className="font-serif text-xl font-bold text-amber-100 tracking-tighter">LC</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-amber-100 group-hover:text-amber-300 transition-colors">
                LEATHERCRAFT<span className="text-amber-500 font-sans text-xs ml-1 font-semibold tracking-wider">PK</span>
              </span>
              <span className="text-[10px] text-amber-400/80 uppercase tracking-widest -mt-1 font-sans">
                Full-Grain Luxury
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium tracking-wide">
          <button
            id="nav-catalog-btn"
            onClick={() => { onSelectCategory('All'); window.scrollTo({ top: 800, behavior: 'smooth' }); }}
            className={`hover:text-amber-400 transition-colors ${selectedCategory === 'All' ? 'text-amber-400 font-semibold' : 'text-zinc-300'}`}
          >
            All Collections
          </button>

          <button
            id="nav-designer-btn"
            onClick={() => { onSelectCategory('Designer Inspired'); window.scrollTo({ top: 800, behavior: 'smooth' }); }}
            className={`hover:text-amber-400 transition-colors flex items-center gap-1 ${selectedCategory === 'Designer Inspired' ? 'text-amber-400 font-semibold' : 'text-amber-300/90'}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>Designer Series</span>
          </button>
          
          <button
            id="nav-ai-advisor-btn"
            onClick={onOpenAiAdvisor}
            className="flex items-center gap-1.5 text-zinc-300 hover:text-amber-300 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>Gift Advisor</span>
          </button>

          <button
            id="nav-track-order-btn"
            onClick={onOpenTracker}
            className="flex items-center gap-1.5 text-zinc-300 hover:text-amber-400 transition-colors"
          >
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <span>Track Order</span>
          </button>

          <button
            id="nav-verify-auth-btn"
            onClick={onOpenAuthenticity}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-300 transition-colors text-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Verify Guarantee</span>
          </button>

          {onOpenAdminPanel && (
            <button
              id="nav-admin-panel-btn"
              onClick={onOpenAdminPanel}
              className="flex items-center gap-1.5 text-amber-400/90 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-900/60 px-2.5 py-1 rounded-lg border border-amber-800/40 transition-colors text-xs font-semibold"
              title="Store Owner Admin Panel"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Panel</span>
            </button>
          )}
        </nav>

        {/* Right Actions (Search & Cart) */}
        <div className="flex items-center gap-3">
          {/* Search Toggle */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center bg-zinc-900 border border-amber-700/50 rounded-full px-3 py-1.5 w-48 sm:w-64 transition-all">
                <Search className="w-4 h-4 text-amber-400 shrink-0 mr-2" />
                <input
                  id="header-search-input"
                  type="text"
                  placeholder="Search wallets, bifold..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="bg-transparent text-xs text-amber-100 placeholder-zinc-500 focus:outline-none w-full"
                  autoFocus
                />
                <button 
                  onClick={() => { setSearchOpen(false); onSearchChange(''); }}
                  className="text-zinc-500 hover:text-amber-300 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="search-toggle-btn"
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-full text-zinc-300 hover:text-amber-400 hover:bg-zinc-900 transition-colors"
                title="Search wallets"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Cart Button */}
          <button
            id="cart-btn"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-semibold px-4 py-2.5 rounded-full shadow-lg shadow-amber-900/40 border border-amber-400/40 transition-all hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-amber-950" />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-amber-950">
              Bag
            </span>
            {cartCount > 0 && (
              <span id="cart-badge" className="bg-amber-950 text-amber-300 text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border border-amber-400 shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div id="mobile-drawer" className="md:hidden bg-zinc-900 border-b border-amber-900/40 px-6 py-5 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3 font-medium text-sm">
            <button
              onClick={() => { onSelectCategory('All'); setMobileMenuOpen(false); }}
              className="text-left text-zinc-200 hover:text-amber-400 py-1"
            >
              All Wallet Collections
            </button>
            <button
              onClick={() => { onOpenAiAdvisor(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 text-zinc-200 py-1"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" /> Gift Advisor AI
            </button>
            <button
              onClick={() => { onOpenTracker(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 text-zinc-200 py-1"
            >
              <PackageCheck className="w-4 h-4 text-emerald-400" /> Track My Order (PKR)
            </button>
            <button
              onClick={() => { onOpenAuthenticity(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 text-zinc-400 py-1 text-xs"
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" /> Verify Leather Certificate
            </button>
            {onOpenAdminPanel && (
              <button
                onClick={() => { onOpenAdminPanel(); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-amber-300 font-bold py-1 text-xs bg-amber-950/80 px-3 py-2 rounded-lg border border-amber-800/50"
              >
                <Lock className="w-4 h-4 text-amber-400" /> Store Admin Orders Panel
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-amber-400/80">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> Support: +92 313 7777344
            </span>
            <span className="bg-amber-950 text-amber-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-amber-700/50">
              COD Pakistan
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
