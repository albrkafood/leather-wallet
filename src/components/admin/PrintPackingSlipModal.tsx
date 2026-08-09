import React from 'react';
import { X, Printer, Package, CheckSquare, ShieldCheck, MapPin, Phone } from 'lucide-react';

interface PrintPackingSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: any[];
}

export const PrintPackingSlipModal: React.FC<PrintPackingSlipModalProps> = ({ isOpen, onClose, orders }) => {
  if (!isOpen || !orders || orders.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-zinc-900 border border-amber-800/40 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:w-full print:border-none print:bg-white print:text-black print:shadow-none">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-amber-800/30 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-amber-100 text-base">
              Packing Slips Preview ({orders.length} {orders.length === 1 ? 'Order' : 'Orders'})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Packing Slips</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-amber-200 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="p-6 overflow-y-auto space-y-12 bg-zinc-950 text-zinc-100 print:bg-white print:text-zinc-900 print:p-0">
          {orders.map((order, index) => (
            <div
              key={order.id || order.trackingNumber || index}
              className="bg-zinc-900 border-2 border-zinc-800 rounded-xl p-6 print:border-2 print:border-zinc-900 print:bg-white print:p-4 print:mb-8 space-y-6 page-break-after-always"
            >
              {/* BRAND HEADER & COURIER TAG */}
              <div className="flex items-center justify-between border-b-2 border-amber-800/40 print:border-zinc-900 pb-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-amber-400 print:text-zinc-900 uppercase tracking-wider">
                    WAREHOUSE PACKING SLIP
                  </h2>
                  <p className="text-xs text-zinc-400 print:text-zinc-600 font-bold">
                    LeatherCraft PK • Raiwind Road Workshop, Lahore
                  </p>
                </div>

                <div className="text-right flex flex-col items-end gap-1">
                  <div className="font-mono text-base font-extrabold text-amber-300 print:text-zinc-900 bg-amber-950/80 print:bg-zinc-100 px-3 py-1 rounded border print:border-zinc-800">
                    #{order.trackingNumber}
                  </div>
                  <p className="text-xs text-zinc-400 print:text-zinc-700 font-bold">
                    Courier: {order.courierName || 'TCS Express'}
                  </p>

                  {/* SVG Barcode & QR Code */}
                  <div className="flex items-center gap-2 pt-1 print:bg-white p-1 rounded">
                    {/* SVG Barcode */}
                    <div className="bg-white px-2 py-1 rounded border border-zinc-300 flex flex-col items-center">
                      <svg className="w-28 h-8" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="2" height="20" fill="black" />
                        <rect x="6" y="2" width="4" height="20" fill="black" />
                        <rect x="12" y="2" width="1" height="20" fill="black" />
                        <rect x="15" y="2" width="3" height="20" fill="black" />
                        <rect x="20" y="2" width="2" height="20" fill="black" />
                        <rect x="24" y="2" width="5" height="20" fill="black" />
                        <rect x="31" y="2" width="1" height="20" fill="black" />
                        <rect x="34" y="2" width="3" height="20" fill="black" />
                        <rect x="39" y="2" width="2" height="20" fill="black" />
                        <rect x="43" y="2" width="4" height="20" fill="black" />
                        <rect x="49" y="2" width="1" height="20" fill="black" />
                        <rect x="52" y="2" width="3" height="20" fill="black" />
                        <rect x="57" y="2" width="2" height="20" fill="black" />
                        <rect x="61" y="2" width="4" height="20" fill="black" />
                        <rect x="67" y="2" width="1" height="20" fill="black" />
                        <rect x="70" y="2" width="3" height="20" fill="black" />
                        <rect x="75" y="2" width="2" height="20" fill="black" />
                        <rect x="79" y="2" width="5" height="20" fill="black" />
                        <rect x="86" y="2" width="2" height="20" fill="black" />
                        <rect x="90" y="2" width="3" height="20" fill="black" />
                        <rect x="95" y="2" width="2" height="20" fill="black" />
                        <text x="50" y="28" fontSize="6" fontFamily="monospace" textAnchor="middle" fill="black">{order.trackingNumber}</text>
                      </svg>
                    </div>

                    {/* SVG QR Code */}
                    <div className="bg-white p-1 rounded border border-zinc-300">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                        <rect x="2" y="2" width="6" height="6" fill="black" />
                        <rect x="16" y="2" width="6" height="6" fill="black" />
                        <rect x="2" y="16" width="6" height="6" fill="black" />
                        <rect x="10" y="4" width="2" height="4" fill="black" />
                        <rect x="10" y="10" width="4" height="4" fill="black" />
                        <rect x="16" y="12" width="6" height="2" fill="black" />
                        <rect x="12" y="18" width="4" height="4" fill="black" />
                        <rect x="18" y="18" width="4" height="4" fill="black" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* RECIPIENT & DELIVER TO BOX */}
              <div className="border-2 border-amber-600/40 print:border-zinc-800 p-4 rounded-xl bg-amber-950/20 print:bg-zinc-50 space-y-2">
                <div className="flex items-center justify-between text-xs uppercase tracking-wider font-extrabold text-amber-400 print:text-zinc-900 border-b border-amber-800/30 print:border-zinc-300 pb-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-500 print:text-zinc-800" /> Deliver To Recipient:
                  </span>
                  <span className="bg-amber-500 text-zinc-950 px-2 py-0.5 rounded text-[10px] font-bold">
                    {order.paymentMethod || 'COD'} (Rs. {(order.total || 0).toLocaleString('en-PK')})
                  </span>
                </div>

                <div className="text-sm font-bold text-amber-100 print:text-zinc-900">
                  {order.shipping?.fullName || 'Valued Customer'}
                </div>

                <div className="text-xs text-zinc-200 print:text-zinc-800 font-medium">
                  {order.shipping?.address}
                </div>

                {order.shipping?.nearestLandmark && (
                  <div className="text-xs font-bold text-amber-300 print:text-zinc-900 italic">
                    Nearest Landmark: {order.shipping?.nearestLandmark}
                  </div>
                )}

                <div className="text-xs font-mono font-bold text-zinc-300 print:text-zinc-800 flex items-center gap-2 pt-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 print:text-zinc-800" />
                  <span>Phone: {order.shipping?.phone}</span>
                  <span className="ml-auto font-sans font-bold text-amber-300 print:text-zinc-900 bg-zinc-950 print:bg-zinc-200 px-2 py-0.5 rounded">
                    City: {order.shipping?.city} ({order.shipping?.province})
                  </span>
                </div>
              </div>

              {/* PACKING CHECKLIST TABLE */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 print:text-zinc-900 mb-2 flex items-center justify-between">
                  <span>Package Contents Checklist ({order.items?.length || 0} items)</span>
                  <span className="text-[10px] text-zinc-400 print:text-zinc-600 font-normal">QC Verification Required</span>
                </h4>

                <table className="w-full text-left text-xs border border-zinc-800 print:border-zinc-800">
                  <thead className="bg-zinc-950 print:bg-zinc-200 text-zinc-300 print:text-zinc-800 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2 border-b border-zinc-800">QC Checked</th>
                      <th className="p-2 border-b border-zinc-800">Item Name & Leather Finish</th>
                      <th className="p-2 border-b border-zinc-800 text-center">Qty</th>
                      <th className="p-2 border-b border-zinc-800 text-right">Monogram</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 print:divide-zinc-300">
                    {(order.items || []).map((item: any, i: number) => (
                      <tr key={i} className="text-zinc-200 print:text-zinc-900">
                        <td className="p-2 w-12 text-center">
                          <div className="w-5 h-5 mx-auto border-2 border-zinc-500 print:border-zinc-800 rounded flex items-center justify-center">
                            {/* Checkbox box for warehouse picker */}
                          </div>
                        </td>
                        <td className="p-2">
                          <span className="font-bold">{item.product?.name || item.name}</span>
                          {item.selectedColor?.name && (
                            <span className="block text-[11px] text-zinc-400 print:text-zinc-600">
                              Color: {item.selectedColor.name}
                            </span>
                          )}
                        </td>
                        <td className="p-2 text-center font-bold font-mono text-sm">{item.quantity || 1}</td>
                        <td className="p-2 text-right font-mono font-bold text-amber-400 print:text-zinc-900">
                          {item.customInitials ? `[ ${item.customInitials} ]` : 'None'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* WAREHOUSE SIGN-OFF & NOTES */}
              <div className="grid grid-cols-2 gap-4 border-t-2 border-dashed border-zinc-800 print:border-zinc-400 pt-4 text-[11px]">
                <div className="space-y-2 text-zinc-400 print:text-zinc-700">
                  <p className="font-bold text-zinc-200 print:text-zinc-900">Special Handling Instructions:</p>
                  <p>• Include luxury gift box & authenticity certificate card.</p>
                  <p>• Apply leather nourishment balm before final polybag sealing.</p>
                </div>

                <div className="text-right space-y-4">
                  <div className="text-zinc-400 print:text-zinc-800">
                    Packed By: _____________________
                  </div>
                  <div className="text-zinc-400 print:text-zinc-800">
                    Dispatched Date: _________________
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
