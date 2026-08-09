import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, XCircle, RefreshCw, Search, DollarSign, Package } from 'lucide-react';

interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  productName: string;
  reason: string;
  refundAmount: number;
  status: 'Return Requested' | 'Approved' | 'In Transit' | 'Received & Refunded' | 'Rejected';
  date: string;
}

export const ReturnsRefundsView: React.FC = () => {
  const [requests, setRequests] = useState<ReturnRequest[]>([
    {
      id: 'ret_1',
      orderId: 'LCPK-89210',
      customerName: 'Shahid Mehmood',
      phone: '03018882233',
      productName: 'The Sovereign Italian Bifold Wallet',
      reason: 'Ordered wrong color variant (requested Tan instead of Brown)',
      refundAmount: 5499,
      status: 'Return Requested',
      date: '2026-08-08'
    },
    {
      id: 'ret_2',
      orderId: 'LCPK-89190',
      customerName: 'Zainab Bibi',
      phone: '03227771122',
      productName: 'The Heritage Handcrafted Leather Belt',
      reason: 'Size too large',
      refundAmount: 3850,
      status: 'Approved',
      date: '2026-08-06'
    },
    {
      id: 'ret_3',
      orderId: 'LCPK-89150',
      customerName: 'Bilal Farooq',
      phone: '03459990011',
      productName: 'The Artisan Cardholder Slim',
      reason: 'Defective stitching on corner edge',
      refundAmount: 2200,
      status: 'Received & Refunded',
      date: '2026-08-02'
    }
  ]);

  const handleUpdateStatus = (id: string, newStatus: any) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950/80 p-4 rounded-xl border border-amber-800/30">
        <div>
          <h3 className="font-serif font-bold text-amber-100 text-base flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-amber-400" />
            <span>Returns, Exchanges & Customer Refund Management</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Process customer exchange requests, approve return shipments & issue direct bank/JazzCash refunds
          </p>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {requests.map((r) => (
          <div
            key={r.id}
            className="bg-zinc-950/80 p-4 rounded-xl border border-amber-800/30 space-y-3 shadow-lg hover:border-amber-500/40 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2">
              <div>
                <span className="font-mono font-bold text-amber-300 text-sm">
                  Return for Order #{r.orderId}
                </span>
                <div className="text-[11px] text-zinc-400">
                  {r.customerName} ({r.phone}) • Requested on {r.date}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-serif font-extrabold text-amber-200 text-sm">
                  Refund: Rs. {r.refundAmount.toLocaleString('en-PK')}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    r.status === 'Received & Refunded'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : r.status === 'Approved'
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : r.status === 'Rejected'
                      ? 'bg-red-950 text-red-300 border-red-800'
                      : 'bg-orange-950 text-orange-300 border-orange-800'
                  }`}
                >
                  {r.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-zinc-500 block font-semibold">Item to Return:</span>
                <span className="text-amber-100 font-bold">{r.productName}</span>
              </div>

              <div>
                <span className="text-zinc-500 block font-semibold">Reason for Return:</span>
                <span className="text-zinc-300 italic">{r.reason}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-2">
              <span className="text-zinc-500 text-[10px]">Actions:</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(r.id, 'Approved')}
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-zinc-950 font-bold rounded border border-amber-500/40 text-[11px] transition-colors"
                >
                  Approve Return
                </button>

                <button
                  onClick={() => handleUpdateStatus(r.id, 'Received & Refunded')}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold rounded text-[11px] transition-colors"
                >
                  Confirm Refund Issued
                </button>

                <button
                  onClick={() => handleUpdateStatus(r.id, 'Rejected')}
                  className="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-300 font-bold rounded border border-red-800 text-[11px] transition-colors"
                >
                  Reject Request
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
