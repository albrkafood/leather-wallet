import React, { useState } from 'react';
import { Tag, Plus, CheckCircle2, XCircle, Trash2, Edit, Calendar, Percent, DollarSign, Copy, RefreshCw } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSpend: number;
  usageLimit: number;
  timesUsed: number;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Disabled';
}

export const DiscountsCouponsView: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 'c1',
      code: 'AZADI2026',
      type: 'percentage',
      value: 14,
      minSpend: 3000,
      usageLimit: 500,
      timesUsed: 142,
      expiryDate: '2026-08-31',
      status: 'Active'
    },
    {
      id: 'c2',
      code: 'WELCOME500',
      type: 'fixed',
      value: 500,
      minSpend: 4000,
      usageLimit: 1000,
      timesUsed: 620,
      expiryDate: '2026-12-31',
      status: 'Active'
    },
    {
      id: 'c3',
      code: 'VIPFLAT10',
      type: 'percentage',
      value: 10,
      minSpend: 5000,
      usageLimit: 100,
      timesUsed: 100,
      expiryDate: '2026-07-31',
      status: 'Expired'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percentage' | 'fixed'>('percentage');
  const [newValue, setNewValue] = useState('10');
  const [newMinSpend, setNewMinSpend] = useState('2000');
  const [newUsageLimit, setNewUsageLimit] = useState('100');
  const [newExpiry, setNewExpiry] = useState('2026-12-31');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;

    const newC: Coupon = {
      id: `c_${Date.now()}`,
      code: newCode.toUpperCase().trim(),
      type: newType,
      value: Number(newValue),
      minSpend: Number(newMinSpend),
      usageLimit: Number(newUsageLimit),
      timesUsed: 0,
      expiryDate: newExpiry,
      status: 'Active'
    };

    setCoupons([newC, ...coupons]);
    setShowAddModal(false);
    setNewCode('');
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'Active' ? 'Disabled' : 'Active' } : c
      )
    );
  };

  const deleteCoupon = (id: string) => {
    if (window.confirm('Are you sure you want to delete this promo coupon?')) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950/80 p-4 rounded-xl border border-amber-800/30">
        <div>
          <h3 className="font-serif font-bold text-amber-100 text-base flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" />
            <span>Discount Coupons & Promotional Campaign Management</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Create flat & percentage discount codes, set minimum cart spend requirements & usage limits
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Promo Coupon</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="bg-zinc-950/80 p-4 rounded-xl border border-amber-800/30 space-y-3 shadow-lg hover:border-amber-500/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-extrabold text-base text-amber-300 bg-amber-950/80 px-3 py-1 rounded-lg border border-amber-600/40">
                {c.code}
              </span>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  c.status === 'Active'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : c.status === 'Expired'
                    ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    : 'bg-red-950 text-red-300 border-red-800'
                }`}
              >
                {c.status}
              </span>
            </div>

            <div className="space-y-1 text-zinc-300">
              <div className="text-sm font-bold text-amber-100 flex items-center gap-1">
                {c.type === 'percentage' ? (
                  <>
                    <Percent className="w-4 h-4 text-amber-400" />
                    <span>{c.value}% OFF entire order</span>
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    <span>Rs. {c.value.toLocaleString('en-PK')} OFF order</span>
                  </>
                )}
              </div>

              <div className="text-zinc-400 text-[11px]">
                Min order spend: <span className="text-amber-200 font-mono font-bold">Rs. {c.minSpend.toLocaleString('en-PK')}</span>
              </div>

              <div className="text-zinc-400 text-[11px]">
                Usage: <span className="text-amber-200 font-bold">{c.timesUsed}</span> / {c.usageLimit} redemptions
              </div>

              <div className="text-zinc-400 text-[11px] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-zinc-500" />
                <span>Expires on: {c.expiryDate}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px]">
              <button
                onClick={() => toggleCouponStatus(c.id)}
                className="text-amber-400 hover:underline font-semibold"
              >
                {c.status === 'Active' ? 'Disable Code' : 'Enable Code'}
              </button>

              <button
                onClick={() => deleteCoupon(c.id)}
                className="text-red-400 hover:text-red-300 p-1 hover:bg-zinc-800 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-amber-800/60 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <h4 className="font-serif font-bold text-amber-100 text-base flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-400" />
              <span>Create New Promotional Coupon</span>
            </h4>

            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EIDSALE2026"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-amber-100 font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Discount Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-amber-100"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PKR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-amber-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Min Order Spend (PKR)</label>
                  <input
                    type="number"
                    value={newMinSpend}
                    onChange={(e) => setNewMinSpend(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-amber-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Max Redemption Limit</label>
                  <input
                    type="number"
                    value={newUsageLimit}
                    onChange={(e) => setNewUsageLimit(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-amber-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Expiration Date</label>
                <input
                  type="date"
                  value={newExpiry}
                  onChange={(e) => setNewExpiry(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-amber-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg shadow"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
