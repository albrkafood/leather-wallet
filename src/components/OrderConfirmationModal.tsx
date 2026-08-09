import React from 'react';
import { Order } from '../types';
import { CheckCircle, Package, Truck, Printer, PhoneCall, ExternalLink, ShieldCheck } from 'lucide-react';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = encodeURIComponent(
    `Assalam o Alaikum! I placed order #${order.trackingNumber} on LeatherCraft PK.\nTotal Payable Amount: Rs. ${order.total.toLocaleString('en-PK')}\nPayment: Cash on Delivery\n\nPlease confirm dispatch details.`
  );

  return (
    <div id="order-confirmation-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-zinc-900 border border-amber-700/50 rounded-2xl max-w-2xl w-full text-amber-50 shadow-2xl p-6 sm:p-8 my-8 animate-in zoom-in-95 duration-200 print:bg-white print:text-black">
        {/* Top Success Badge */}
        <div className="text-center space-y-2 border-b border-amber-900/30 pb-6 print:border-gray-300">
          <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-100 print:text-black">
            Order Confirmed!
          </h2>
          <p className="text-xs text-zinc-400 font-sans print:text-gray-600">
            Thank you, <strong className="text-amber-200 print:text-black">{order.shipping.fullName}</strong>. Your luxury wallet order has been registered for Cash on Delivery.
          </p>
        </div>

        {/* Tracking Code Highlight */}
        <div className="my-6 p-4 rounded-xl bg-amber-950/80 border border-amber-700/40 text-center space-y-1 print:bg-gray-100 print:border-gray-300">
          <span className="text-[11px] uppercase tracking-widest text-amber-400 font-bold block print:text-gray-700">
            Pakistan Courier Tracking Number
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-200 tracking-wider print:text-black">
            {order.trackingNumber}
          </span>
          <p className="text-[11px] text-zinc-300 print:text-gray-600">
            Estimated Delivery: <strong className="text-emerald-400 print:text-black">{order.estimatedDeliveryDate}</strong> via {order.courierName}
          </p>
        </div>

        {/* Items Summary */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 border-b border-amber-900/30 pb-1 print:text-black">
            Order Summary
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-xs p-2 bg-zinc-950 rounded border border-zinc-800 print:bg-white print:border-gray-200">
                <div>
                  <p className="font-bold text-amber-100 print:text-black">{item.product.name}</p>
                  <p className="text-[10px] text-zinc-400">Tone: {item.selectedColor.name} {item.customInitials ? `| Monogram: ${item.customInitials}` : ''}</p>
                </div>
                <span className="font-serif font-bold text-amber-300 print:text-black">
                  Rs. {((item.product.price + (item.isGiftWrapped ? 350 : 0)) * item.quantity).toLocaleString('en-PK')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Row */}
        <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center text-sm font-bold print:border-gray-300">
          <span className="text-zinc-300 print:text-black">Total Amount Payable (COD):</span>
          <span className="font-serif text-xl text-amber-300 print:text-black">
            Rs. {order.total.toLocaleString('en-PK')}
          </span>
        </div>

        {/* Customer Service & WhatsApp */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 print:hidden">
          <a
            href={`https://wa.me/923137777344?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Confirm Order on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handlePrint}
            className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-700/40 font-bold text-xs flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>

        {/* Close */}
        <div className="mt-4 text-center print:hidden">
          <button
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-amber-300 underline font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
