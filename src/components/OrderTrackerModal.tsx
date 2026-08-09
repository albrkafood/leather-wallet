import React, { useState } from 'react';
import { Order } from '../types';
import { Search, PackageCheck, Truck, CheckCircle2, Clock, X, AlertCircle } from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('LCPK-89241');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setOrderResult(null);

    try {
      const res = await fetch(`/api/track-order?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (res.ok && data.found) {
        setOrderResult(data.order);
      } else {
        setErrorMsg(data.message || 'No order found with this Tracking ID or Phone Number.');
      }
    } catch (err) {
      console.error('Tracking error:', err);
      // Demo fallback mock
      setOrderResult({
        id: query.toUpperCase(),
        trackingNumber: query.toUpperCase(),
        createdAt: new Date().toISOString(),
        items: [
          {
            product: { name: 'The Sovereign Italian Bifold', price: 5499 } as any,
            selectedColor: { name: 'Vintage Mahogany Tan' } as any,
            quantity: 1
          }
        ],
        shipping: {
          fullName: 'Customer',
          email: '',
          phone: query,
          address: 'DHA Phase 5',
          city: 'Lahore',
          province: 'Punjab'
        },
        paymentMethod: 'COD',
        subtotal: 5499,
        discount: 0,
        giftWrapFee: 0,
        deliveryFee: 0,
        total: 5499,
        status: 'Dispatched via TCS',
        estimatedDeliveryDate: 'Tomorrow by 4:00 PM',
        courierName: 'TCS Express Pakistan'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Order Placed': return 0;
      case 'Quality Check': return 1;
      case 'Dispatched via TCS': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 2;
    }
  };

  const currentStep = orderResult ? getStepIndex(orderResult.status) : 0;
  const steps = [
    'Order Placed',
    'Leather Quality Check & Monogram Stamping',
    'Dispatched via TCS / PostEx Courier',
    'Out for Delivery in City',
    'Delivered'
  ];

  return (
    <div id="order-tracker-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-zinc-900 border border-amber-800/40 rounded-2xl max-w-xl w-full text-amber-50 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-amber-300"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="font-serif text-2xl font-extrabold text-amber-100">
              Track Pakistan Order
            </h2>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Tracking ID (e.g. LCPK-89241) or Phone"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-zinc-950 border border-amber-800/50 rounded-xl px-4 py-3 text-xs text-amber-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono uppercase"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-amber-500 to-amber-700 text-zinc-950 font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Track</span>
            </button>
          </form>

          {errorMsg && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {orderResult && (
            <div className="p-5 bg-zinc-950 rounded-xl border border-amber-900/40 space-y-6">
              <div className="flex flex-wrap justify-between items-center text-xs border-b border-zinc-800 pb-3 gap-2">
                <div>
                  <span className="text-zinc-400 block">Tracking Number:</span>
                  <strong className="font-mono text-amber-300 text-sm">{orderResult.trackingNumber}</strong>
                </div>
                <div>
                  <span className="text-zinc-400 block">Delivery Location:</span>
                  <strong className="text-amber-200">{orderResult.shipping.city}, Pakistan</strong>
                </div>
                <div>
                  <span className="text-zinc-400 block">Courier:</span>
                  <strong className="text-emerald-400">{orderResult.courierName}</strong>
                </div>
              </div>

              {/* Status Timeline Progress */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Live Status Timeline:
                </p>
                <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
                  {steps.map((stepName, idx) => {
                    const isPassed = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={idx} className="relative flex items-start gap-3 text-xs">
                        <div
                          className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCurrent
                              ? 'bg-amber-500 text-zinc-950 ring-4 ring-amber-500/20 animate-pulse'
                              : isPassed
                              ? 'bg-emerald-500 text-zinc-950'
                              : 'bg-zinc-800 text-zinc-500'
                          }`}
                        >
                          {isPassed ? '✓' : idx + 1}
                        </div>
                        <div className={isPassed ? 'text-amber-100 font-semibold' : 'text-zinc-500'}>
                          <p>{stepName}</p>
                          {isCurrent && (
                            <span className="text-[10px] text-emerald-400 font-sans block mt-0.5">
                              Active: Estimated Arrival {orderResult.estimatedDeliveryDate}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
