import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

interface PrintInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: any[]; // single or multiple orders for printing
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({ isOpen, onClose, orders }) => {
  if (!isOpen || !orders || orders.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Modal Box */}
      <div className="bg-zinc-900 border border-amber-800/40 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:w-full print:border-none print:bg-white print:text-black print:shadow-none">
        
        {/* Modal Header (Hidden on Print) */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-amber-800/30 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-amber-100 text-base">
              Invoice Preview ({orders.length} {orders.length === 1 ? 'Order' : 'Orders'})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all border border-amber-800/40"
              title="Save as PDF via Browser Print"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-amber-200 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Content Container */}
        <div className="p-6 overflow-y-auto space-y-12 bg-zinc-950 text-zinc-100 print:bg-white print:text-zinc-900 print:p-0">
          {orders.map((order, index) => (
            <div
              key={order.id || order.trackingNumber || index}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 print:border-none print:bg-white print:p-0 print:mb-8 space-y-6 page-break-after-always"
            >
              {/* BRAND HEADER & INVOICE META */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-800/30 print:border-zinc-300 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-2xl font-bold text-amber-400 print:text-amber-800">
                      LeatherCraft PK
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 print:text-zinc-600 mt-1">
                    Premium Handcrafted Italian Leather Goods
                  </p>
                  <p className="text-[11px] text-zinc-500 print:text-zinc-500">
                    Workshop #14, Leather Artisan Quarter, Raiwind Road, Lahore • Helpline: +92 300 123 4567
                  </p>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <div className="inline-block bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider print:bg-zinc-100 print:text-zinc-800 print:border-zinc-300">
                    INVOICE #{order.trackingNumber}
                  </div>
                  <p className="text-xs text-zinc-400 print:text-zinc-600 font-mono">
                    Date: {new Date(order.createdAt).toLocaleDateString('en-PK', { dateStyle: 'long' })}
                  </p>
                  <p className="text-xs text-zinc-400 print:text-zinc-600 font-mono">
                    Payment Method: <span className="font-bold text-amber-300 print:text-zinc-900">{order.paymentMethod || 'COD'}</span>
                  </p>
                </div>
              </div>

              {/* CUSTOMER & SHIPPING ADDRESS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs bg-zinc-950/60 p-4 rounded-xl border border-zinc-800 print:bg-zinc-50 print:border-zinc-200">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 print:text-zinc-500">
                    Billed & Shipped To:
                  </span>
                  <p className="font-bold text-sm text-zinc-100 print:text-zinc-900">{order.shipping?.fullName || 'Valued Customer'}</p>
                  <p className="text-zinc-300 print:text-zinc-700">{order.shipping?.address}</p>
                  {order.shipping?.nearestLandmark && (
                    <p className="text-amber-400/90 print:text-amber-800 text-[11px] italic">
                      Landmark: {order.shipping?.nearestLandmark}
                    </p>
                  )}
                  <p className="text-zinc-300 print:text-zinc-700 font-medium">
                    {order.shipping?.city}, {order.shipping?.province}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 print:text-zinc-500">
                    Contact Information:
                  </span>
                  <p className="text-zinc-200 print:text-zinc-800 font-mono">Phone: {order.shipping?.phone}</p>
                  <p className="text-zinc-300 print:text-zinc-700 font-mono">Email: {order.shipping?.email || 'N/A'}</p>
                  <p className="text-zinc-300 print:text-zinc-700">Courier: <span className="font-semibold text-amber-300 print:text-zinc-900">{order.courierName || 'TCS Express Pakistan'}</span></p>
                  <p className="text-zinc-300 print:text-zinc-700">Payment Status: <span className="font-bold text-emerald-400 print:text-emerald-700">{order.paymentStatus || 'Unpaid'}</span></p>
                </div>
              </div>

              {/* ITEMS TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-amber-800/40 print:border-zinc-300 text-zinc-400 print:text-zinc-600 uppercase font-bold text-[10px]">
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 print:divide-zinc-200">
                    {(order.items || []).map((item: any, i: number) => {
                      const name = item.product?.name || item.name || 'Leather Item';
                      const price = item.product?.price || item.price || 0;
                      const qty = item.quantity || 1;

                      return (
                        <tr key={i} className="text-zinc-200 print:text-zinc-800">
                          <td className="py-3 px-3">
                            <div className="font-bold text-amber-100 print:text-zinc-900">{name}</div>
                            {item.selectedColor?.name && (
                              <div className="text-zinc-400 print:text-zinc-500 text-[11px]">Color: {item.selectedColor.name}</div>
                            )}
                            {item.customInitials && (
                              <div className="text-amber-400 print:text-amber-700 text-[11px] font-mono">Monogram Initials: [{item.customInitials}]</div>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-bold">{qty}</td>
                          <td className="py-3 px-3 text-right font-mono">Rs. {price.toLocaleString('en-PK')}</td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-amber-300 print:text-zinc-900">
                            Rs. {(price * qty).toLocaleString('en-PK')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* TOTALS & SUMMARY */}
              <div className="flex flex-col sm:flex-row items-end justify-between gap-4 border-t border-amber-800/30 print:border-zinc-300 pt-4 text-xs">
                <div className="text-zinc-400 print:text-zinc-600 max-w-xs text-[11px] space-y-1">
                  <p className="font-bold text-amber-200 print:text-zinc-900">Quality Guarantee:</p>
                  <p>Every LeatherCraft PK wallet is crafted with 100% genuine top-grain full-grain leather backed by our 1-year stitching warranty.</p>
                </div>

                <div className="w-full sm:w-64 space-y-2 font-mono">
                  <div className="flex justify-between text-zinc-400 print:text-zinc-600">
                    <span>Subtotal:</span>
                    <span>Rs. {((order.total || 0) - 200).toLocaleString('en-PK')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400 print:text-zinc-600">
                    <span>Shipping Charges:</span>
                    <span>Rs. 200</span>
                  </div>
                  <div className="flex justify-between border-t border-zinc-800 print:border-zinc-300 pt-2 text-sm font-bold text-amber-300 print:text-zinc-900">
                    <span>Total Amount:</span>
                    <span>Rs. {(order.total || 0).toLocaleString('en-PK')}</span>
                  </div>
                </div>
              </div>

              {/* FOOTER SIGNATURE */}
              <div className="text-center pt-4 border-t border-dashed border-zinc-800 print:border-zinc-300 text-[10px] text-zinc-500 print:text-zinc-500">
                Thank you for supporting authentic local Pakistani craftsmanship! • www.leathercraft.pk
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
