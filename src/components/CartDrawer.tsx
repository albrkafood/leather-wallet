import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag, Gift, MessageCircle } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: (appliedDiscount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  const subtotal = items.reduce((acc, item) => {
    let itemPrice = item.product.price;
    if (item.isGiftWrapped) itemPrice += 350;
    return acc + itemPrice * item.quantity;
  }, 0);

  const deliveryFee = subtotal > 3000 ? 0 : 250;
  const finalTotal = Math.max(0, subtotal + deliveryFee - promoDiscount);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'EIDGIFT' || code === 'WELCOME10' || code === 'LUXE500') {
      setPromoDiscount(500);
      setPromoMessage('🎉 Promo code applied! Rs. 500 Discount');
    } else {
      setPromoMessage('❌ Invalid Promo Code. Try "WELCOME10" or "EIDGIFT"');
    }
  };

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex justify-end">
      <div className="bg-zinc-900 border-l border-amber-800/40 w-full max-w-md h-full flex flex-col justify-between text-amber-50 shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-amber-900/30 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-extrabold text-lg text-amber-100">
              Shopping Bag ({items.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>

          <button
            id="close-cart-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-amber-300 hover:bg-zinc-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Items List */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <ShoppingBag className="w-16 h-16 text-zinc-700 mx-auto" />
              <p className="font-serif text-lg text-zinc-300">Your bag is currently empty</p>
              <p className="text-xs text-zinc-500 font-sans max-w-xs mx-auto">
                Discover our handcrafted full-grain leather wallets and enjoy Free Cash on Delivery across Pakistan!
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700/50 hover:border-amber-400 text-xs font-bold"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={index}
                className="p-3.5 bg-zinc-950 rounded-xl border border-amber-900/30 flex gap-3.5 items-start relative group"
              >
                {/* Thumb */}
                <img
                  src={item.selectedColor.image || item.product.images[0]}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-lg object-cover border border-amber-900/40 shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between">
                    <h4 className="font-serif font-bold text-xs text-amber-100 truncate">
                      {item.product.name}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-zinc-500 hover:text-rose-400 p-0.5"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[10px] text-zinc-400">
                    Tone: <span className="text-amber-300 font-medium">{item.selectedColor.name}</span>
                  </p>

                  {/* Monogram Badge */}
                  {item.customInitials && (
                    <div className="inline-flex items-center gap-1 text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-700/40">
                      <span>Monogram:</span>
                      <strong className="font-serif font-bold tracking-wider">{item.customInitials}</strong>
                      <span className="text-zinc-400">({item.foilType || 'Gold'})</span>
                    </div>
                  )}

                  {item.isGiftWrapped && (
                    <div className="text-[10px] text-amber-400 flex items-center gap-1">
                      <Gift className="w-3 h-3 text-amber-400" />
                      <span>Gift Box Packaging (+ Rs. 350)</span>
                    </div>
                  )}

                  {/* Price & Quantity Controls */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-serif font-bold text-sm text-amber-300">
                      Rs. {((item.product.price + (item.isGiftWrapped ? 350 : 0)) * item.quantity).toLocaleString('en-PK')}
                    </span>

                    <div className="flex items-center border border-zinc-800 rounded bg-zinc-900 text-xs">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="p-1 text-zinc-400 hover:text-amber-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold text-amber-200">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="p-1 text-zinc-400 hover:text-amber-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-5 bg-zinc-950 border-t border-amber-900/40 space-y-3">
            {/* Promo Code Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo Code (e.g. WELCOME10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="bg-zinc-900 border border-amber-800/40 rounded-lg px-3 py-1.5 text-xs text-amber-200 placeholder-zinc-600 focus:outline-none flex-1 uppercase"
              />
              <button
                onClick={handleApplyPromo}
                className="bg-amber-950 hover:bg-amber-900 text-amber-300 font-bold text-xs px-3 py-1.5 rounded-lg border border-amber-700/50"
              >
                Apply
              </button>
            </div>
            {promoMessage && (
              <p className="text-[10px] font-semibold text-amber-300">{promoMessage}</p>
            )}

            {/* Subtotal Calculation Breakdown */}
            <div className="space-y-1.5 text-xs text-zinc-400 font-sans border-t border-zinc-900 pt-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-amber-200 font-serif font-bold">Rs. {subtotal.toLocaleString('en-PK')}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery across Pakistan:</span>
                <span className={deliveryFee === 0 ? 'text-emerald-400 font-bold' : 'text-amber-200'}>
                  {deliveryFee === 0 ? 'FREE (Orders > Rs. 3,000)' : `Rs. ${deliveryFee}`}
                </span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount Code:</span>
                  <span>- Rs. {promoDiscount.toLocaleString('en-PK')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-amber-100 pt-2 border-t border-zinc-800">
                <span>Total Amount:</span>
                <span className="font-serif text-lg text-amber-300">
                  Rs. {finalTotal.toLocaleString('en-PK')}
                </span>
              </div>
            </div>

            {/* Checkout Action Buttons */}
            <div className="space-y-2">
              <button
                id="proceed-checkout-btn"
                onClick={() => onProceedToCheckout(promoDiscount)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-950 border border-amber-300 transition-transform active:scale-95"
              >
                <span>Proceed to Cash on Delivery</span>
                <ArrowRight className="w-4 h-4 text-zinc-950" />
              </button>

              <a
                id="cart-whatsapp-checkout-btn"
                href={`https://wa.me/923137777344?text=${encodeURIComponent(
                  `Assalam o Alaikum LeatherCraft PK!\nI want to place my order directly via WhatsApp:\n\n` +
                  items.map((item, idx) => `${idx + 1}. *${item.product.name}* (${item.selectedColor.name}) x${item.quantity} - Rs. ${(item.product.price * item.quantity).toLocaleString('en-PK')}`).join('\n') +
                  `\n\n💰 *Total Amount:* Rs. ${finalTotal.toLocaleString('en-PK')}\n🚚 *Payment:* Cash on Delivery\n\nPlease confirm my order!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-zinc-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md border border-emerald-400 transition-all active:scale-95 font-sans"
              >
                <MessageCircle className="w-4 h-4 fill-zinc-950 text-[#25D366]" />
                <span>Order Direct on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
