import React, { useState, useEffect } from 'react';
import { WalletProduct, CartItem, FoilType, Order } from './types';
import { WALLET_PRODUCTS } from './data/walletsData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AiGiftAdvisorModal } from './components/AiGiftAdvisorModal';
import { AuthenticityCheckerModal } from './components/AuthenticityCheckerModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { LeatherCareSection } from './components/LeatherCareSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { MessageCircle } from 'lucide-react';

export default function App() {
  // Cart state persisted to localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('lc_pk_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('lc_pk_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to sync cart', e);
    }
  }, [cartItems]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [inspectProduct, setInspectProduct] = useState<WalletProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [isAuthenticityOpen, setIsAuthenticityOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Cart operations
  const handleAddToCart = (
    product: WalletProduct,
    selectedColor: { name: string; hex: string; image: string },
    customInitials?: string,
    foilType?: FoilType,
    isGiftWrapped?: boolean
  ) => {
    setCartItems((prev) => {
      // Check if identical item already exists
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor.name === selectedColor.name &&
          item.customInitials === customInitials &&
          item.isGiftWrapped === isGiftWrapped
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }

      return [
        ...prev,
        {
          product,
          selectedColor,
          customInitials,
          foilType: foilType || 'Gold Foil',
          isGiftWrapped: !!isGiftWrapped,
          quantity: 1
        }
      ];
    });
  };

  const handleBuyNow = (
    product: WalletProduct,
    selectedColor: { name: string; hex: string; image: string },
    customInitials?: string,
    foilType?: FoilType,
    isGiftWrapped?: boolean
  ) => {
    handleAddToCart(product, selectedColor, customInitials, foilType, isGiftWrapped);
    setInspectProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProceedToCheckout = (discount: number) => {
    setAppliedDiscount(discount);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setConfirmedOrder(order);
    setCartItems([]);
    setIsCheckoutOpen(false);
  };

  return (
    <div id="app-root" className="min-h-screen bg-zinc-950 font-sans text-amber-50 selection:bg-amber-500 selection:text-zinc-950">
      {/* Navbar */}
      <Header
        cartCount={cartItems.reduce((acc, b) => acc + b.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenEmbossingStudio={() => {}}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        onOpenAuthenticity={() => setIsAuthenticityOpen(true)}
        onOpenAdminPanel={() => setIsAdminOpen(true)}
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Hero Section */}
      <Hero
        onExploreClick={() => {
          setSelectedCategory('All');
          const elem = document.getElementById('catalog-section');
          elem?.scrollIntoView({ behavior: 'smooth' });
        }}
        onEmbossingClick={() => {}}
      />

      {/* Catalog Grid */}
      <ProductCatalog
        products={WALLET_PRODUCTS}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onQuickView={(prod) => setInspectProduct(prod)}
        onAddToCart={handleAddToCart}
      />

      {/* Leather Care Tips */}
      <LeatherCareSection />

      {/* Verified Reviews */}
      <ReviewsSection />

      {/* Footer */}
      <Footer
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenEmbossingStudio={() => {}}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        onOpenAuthenticity={() => setIsAuthenticityOpen(true)}
        onOpenAdminPanel={() => setIsAdminOpen(true)}
        onSelectCategory={setSelectedCategory}
      />

      {/* Modals & Overlays */}
      <ProductDetailModal
        product={inspectProduct}
        onClose={() => setInspectProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        discount={appliedDiscount}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

      <AiGiftAdvisorModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        onSelectProductByName={(pName) => {
          const found = WALLET_PRODUCTS.find((p) => p.name.includes(pName));
          if (found) setInspectProduct(found);
          setIsAiAdvisorOpen(false);
        }}
      />

      <AuthenticityCheckerModal
        isOpen={isAuthenticityOpen}
        onClose={() => setIsAuthenticityOpen(false)}
      />

      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Floating WhatsApp Quick Contact Button */}
      <a
        id="floating-whatsapp-btn"
        href="https://wa.me/923137777344?text=Assalam%20o%20Alaikum!%20I%20have%20an%20inquiry%20about%20LeatherCraft%20PK%20wallets."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 p-3.5 rounded-full shadow-2xl flex items-center gap-2 font-bold text-xs transition-all hover:scale-110 border-2 border-emerald-300 group"
        title="Chat on WhatsApp +92 313 7777344"
      >
        <MessageCircle className="w-6 h-6 text-zinc-950 fill-zinc-950" />
        <span className="hidden sm:inline font-sans text-xs font-extrabold text-zinc-950 pr-1">
          WhatsApp Support
        </span>
      </a>
    </div>
  );
}
