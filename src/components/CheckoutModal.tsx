import React, { useState } from 'react';
import { CartItem, PaymentMethod, ShippingDetails } from '../types';
import { PAKISTAN_CITIES } from '../data/walletsData';
import { X, Truck, ShieldCheck, CreditCard, Building, Smartphone, CheckCircle, Lock } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discount: number;
  onOrderSuccess: (orderData: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discount,
  onOrderSuccess
}) => {
  if (!isOpen) return null;

  const [shipping, setShipping] = useState<ShippingDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Lahore',
    province: 'Punjab',
    postalCode: '',
    deliveryNotes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [txnRef, setTxnRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto detect province based on city
  const handleCityChange = (city: string) => {
    let prov = 'Punjab';
    const c = city.toLowerCase();
    if (c === 'karachi' || c === 'hyderabad' || c === 'sukkur') prov = 'Sindh';
    else if (c === 'peshawar' || c === 'mardan' || c === 'abbottabad') prov = 'KPK';
    else if (c === 'quetta') prov = 'Balochistan';
    else if (c === 'islamabad') prov = 'Islamabad Capital Territory';
    else if (c === 'gilgit') prov = 'Gilgit-Baltistan';
    else if (c.includes('mirpur')) prov = 'Azad Jammu & Kashmir';

    setShipping({ ...shipping, city, province: prov });
  };

  const subtotal = items.reduce((acc, item) => {
    let itemPrice = item.product.price;
    if (item.isGiftWrapped) itemPrice += 350;
    return acc + itemPrice * item.quantity;
  }, 0);

  const deliveryFee = subtotal > 3000 ? 0 : 250;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping.fullName || !shipping.phone || !shipping.address) {
      setErrorMessage('Please fill in your Full Name, Phone Number, and Delivery Address.');
      return;
    }

    if (shipping.phone.replace(/[^0-9]/g, '').length < 10) {
      setErrorMessage('Please enter a valid Pakistani mobile number e.g. 03001234567');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shipping,
          paymentMethod,
          subtotal,
          discount,
          deliveryFee,
          total: grandTotal,
          txnRef: txnRef || undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onOrderSuccess(data.order);
      } else {
        setErrorMessage(data.error || 'Failed to submit order. Please try again.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      // Fallback local generated order if offline
      const mockOrder = {
        id: `LCPK-${Math.floor(10000 + Math.random() * 90000)}`,
        trackingNumber: `LCPK-${Math.floor(10000 + Math.random() * 90000)}`,
        createdAt: new Date().toISOString(),
        items,
        shipping,
        paymentMethod,
        subtotal,
        discount,
        deliveryFee,
        total: grandTotal,
        status: 'Order Placed',
        estimatedDeliveryDate: 'In 2 Business Days',
        courierName: 'TCS Express Pakistan'
      };
      onOrderSuccess(mockOrder);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="checkout-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-zinc-900 border border-amber-800/40 rounded-2xl max-w-3xl w-full text-amber-50 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-zinc-950 to-amber-950 p-5 border-b border-amber-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-extrabold text-xl text-amber-100">
              Checkout & Cash on Delivery
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-amber-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-lg text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Section 1: Shipping Address */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-sm text-amber-300 border-b border-amber-900/30 pb-1 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              1. Delivery Address in Pakistan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Muhammad Hamza"
                  value={shipping.fullName}
                  onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                  className="w-full bg-zinc-950 border border-amber-800/40 rounded-lg p-2.5 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Mobile Phone (for COD SMS) *</label>
                <input
                  required
                  type="tel"
                  placeholder="e.g. 0300 1234567"
                  value={shipping.phone}
                  onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                  className="w-full bg-zinc-950 border border-amber-800/40 rounded-lg p-2.5 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-400 mb-1">Complete Street Address (House/Apartment #, Sector) *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. House 12-A, Street 4, Sector F-7/2"
                  value={shipping.address}
                  onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  className="w-full bg-zinc-950 border border-amber-800/40 rounded-lg p-2.5 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">City *</label>
                <select
                  value={shipping.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full bg-zinc-950 border border-amber-800/40 rounded-lg p-2.5 text-amber-100 focus:outline-none focus:border-amber-400 font-semibold"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Province / Region</label>
                <input
                  type="text"
                  readOnly
                  value={shipping.province}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-zinc-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-amber-300 border-b border-amber-900/30 pb-1 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              2. Select Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`p-3.5 rounded-xl border cursor-pointer text-xs flex flex-col justify-between space-y-2 transition-all ${
                  paymentMethod === 'COD'
                    ? 'bg-amber-950/80 border-amber-400 ring-1 ring-amber-400 text-amber-200'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-amber-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-100">Cash on Delivery</span>
                  <Truck className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[10px] text-zinc-400">Pay cash directly to courier rider upon inspection</p>
              </label>

              <label
                onClick={() => setPaymentMethod('JazzCash')}
                className={`p-3.5 rounded-xl border cursor-pointer text-xs flex flex-col justify-between space-y-2 transition-all ${
                  paymentMethod === 'JazzCash' || paymentMethod === 'EasyPaisa'
                    ? 'bg-amber-950/80 border-amber-400 ring-1 ring-amber-400 text-amber-200'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-amber-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-100">JazzCash / EasyPaisa</span>
                  <Smartphone className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-[10px] text-zinc-400">Instant mobile wallet QR transfer</p>
              </label>

              <label
                onClick={() => setPaymentMethod('BankTransfer')}
                className={`p-3.5 rounded-xl border cursor-pointer text-xs flex flex-col justify-between space-y-2 transition-all ${
                  paymentMethod === 'BankTransfer'
                    ? 'bg-amber-950/80 border-amber-400 ring-1 ring-amber-400 text-amber-200'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-amber-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-100">Bank Transfer</span>
                  <Building className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-[10px] text-zinc-400">Meezan / HBL Online Transfer</p>
              </label>
            </div>

            {/* Account Details if Mobile or Bank */}
            {(paymentMethod === 'JazzCash' || paymentMethod === 'EasyPaisa') && (
              <div className="p-3 bg-zinc-950 rounded-lg border border-amber-800/40 text-xs space-y-1">
                <p className="font-bold text-amber-300">JazzCash / EasyPaisa Till ID: 0313 7777344</p>
                <p className="text-[11px] text-zinc-400">Title: LeatherCraft Pakistan (Pvt) Ltd.</p>
                <input
                  type="text"
                  placeholder="Optional: Enter 12-digit Transaction ID"
                  value={txnRef}
                  onChange={(e) => setTxnRef(e.target.value)}
                  className="w-full bg-zinc-900 border border-amber-800/30 rounded p-1.5 text-xs text-amber-200 mt-1"
                />
              </div>
            )}

            {paymentMethod === 'BankTransfer' && (
              <div className="p-3 bg-zinc-950 rounded-lg border border-amber-800/40 text-xs space-y-1">
                <p className="font-bold text-amber-300">Meezan Bank IBAN: PK36MEZN009923010481239</p>
                <p className="text-[11px] text-zinc-400">Account Name: LeatherCraft PK</p>
              </div>
            )}
          </div>

          {/* Order Total & Submit */}
          <div className="p-4 bg-zinc-950 rounded-xl border border-amber-900/40 space-y-3">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Items Total ({items.length}):</span>
              <span className="text-amber-200 font-bold">Rs. {subtotal.toLocaleString('en-PK')}</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Nationwide COD Delivery:</span>
              <span className="text-emerald-400 font-bold">{deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs text-emerald-400 font-bold">
                <span>Promo Discount:</span>
                <span>- Rs. {discount.toLocaleString('en-PK')}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-amber-100 pt-2 border-t border-zinc-800">
              <span>Total Payable Amount:</span>
              <span className="font-serif text-xl text-amber-300">
                Rs. {grandTotal.toLocaleString('en-PK')}
              </span>
            </div>

            <button
              id="confirm-place-order-btn"
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-zinc-950 font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-amber-950 flex items-center justify-center gap-2 border border-amber-300"
            >
              {loading ? (
                <span>Generating Order & Tracking Code...</span>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-zinc-950" />
                  <span>Confirm & Place Order (Cash on Delivery)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
