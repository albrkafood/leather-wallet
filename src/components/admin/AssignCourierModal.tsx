import React, { useState } from 'react';
import { X, Truck, Check } from 'lucide-react';

interface AssignCourierModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrderIds: string[];
  onAssignCourier: (courierName: string, trackingPrefix?: string) => void;
}

export const AssignCourierModal: React.FC<AssignCourierModalProps> = ({
  isOpen,
  onClose,
  selectedOrderIds,
  onAssignCourier
}) => {
  const [selectedCourier, setSelectedCourier] = useState('TCS Express Pakistan');

  if (!isOpen) return null;

  const handleAssign = () => {
    onAssignCourier(selectedCourier);
    onClose();
  };

  const couriers = [
    { name: 'TCS', code: 'TCS', trackingUrl: 'https://www.tcsexpress.com/tracking', logoText: 'TCS' },
    { name: 'Leopards', code: 'LCS', trackingUrl: 'https://www.leopardscourier.com', logoText: 'Leopards' },
    { name: 'M&P', code: 'MNP', trackingUrl: 'https://www.mulphilog.com', logoText: 'M&P' },
    { name: 'Trax', code: 'TRAX', trackingUrl: 'https://trax.pk/tracking', logoText: 'Trax' },
    { name: 'PostEx', code: 'POSTEX', trackingUrl: 'https://postex.pk/tracking', logoText: 'PostEx' },
    { name: 'BlueEx', code: 'BLUEEX', trackingUrl: 'https://www.blue-ex.com/tracking', logoText: 'BlueEx' },
    { name: 'Other', code: 'OTHER', trackingUrl: '#', logoText: 'Other' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <div className="bg-zinc-900 border border-amber-800/60 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-amber-100 text-base">
              Assign Courier Partner
            </h3>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-amber-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-zinc-400">
          Assigning logistics partner for <span className="text-amber-300 font-bold">{selectedOrderIds.length} selected {selectedOrderIds.length === 1 ? 'order' : 'orders'}</span>:
        </p>

        <div className="space-y-2">
          {couriers.map((c) => (
            <div
              key={c.name}
              onClick={() => setSelectedCourier(c.name)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedCourier === c.name
                  ? 'bg-amber-950/60 border-amber-500 text-amber-100 shadow-md'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center font-extrabold text-xs text-amber-400">
                  {c.logoText}
                </div>
                <div>
                  <div className="font-bold text-xs">{c.name}</div>
                  <div className="text-[10px] text-zinc-500">Overnight Express COD Dispatch</div>
                </div>
              </div>

              {selectedCourier === c.name && (
                <div className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center font-bold">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-1/2 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="w-1/2 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            Confirm & Assign
          </button>
        </div>
      </div>
    </div>
  );
};
