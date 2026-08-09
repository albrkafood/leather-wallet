import React, { useState, useEffect } from 'react';
import { Layers, AlertTriangle, PlusCircle, MinusCircle, History, RefreshCw, CheckCircle2, ShieldAlert, ArrowUpRight, ArrowDownRight, PackageCheck, Info } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  reservedStock: number;
  lowStockAlert: number;
  status: string;
  image: string;
}

interface StockLog {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  change: number;
  type: string;
  previousStock: number;
  newStock: number;
  reason: string;
  adminName: string;
  date: string;
}

interface InventoryManagementProps {
  currentRole: string;
}

export const InventoryManagement: React.FC<InventoryManagementProps> = ({ currentRole }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [stockHistory, setStockHistory] = useState<StockLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'levels' | 'history'>('levels');

  const canManageInventory = ['Store Owner', 'Admin', 'Inventory Manager'].includes(currentRole);

  // Adjustment Modal
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('Restock from Sialkot Leather Workshop');
  const [adjustType, setAdjustType] = useState('Restock');
  const [adjusting, setAdjusting] = useState(false);

  const canAdjustInventory = ['Store Owner', 'Admin', 'Inventory Manager'].includes(currentRole);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, hRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/stock-history')
      ]);
      const pData = await pRes.json();
      const hData = await hRes.json();

      if (pRes.ok && pData.success) setItems(pData.products || []);
      if (hRes.ok && hData.success) setStockHistory(hData.history || []);
    } catch (err) {
      console.error('Failed to load inventory data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!canAdjustInventory) {
      alert(`Role "${currentRole}" does not have permission to adjust stock levels.`);
      return;
    }

    setAdjusting(true);
    try {
      const res = await fetch('/api/admin/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          adjustmentQty: Number(adjustQty),
          reason: adjustReason,
          adminName: currentRole,
          type: adjustType
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSelectedProduct(null);
        setAdjustQty('');
        fetchData();
      }
    } catch (err) {
      console.error('Failed to adjust stock', err);
    } finally {
      setAdjusting(false);
    }
  };

  const lowStockItems = items.filter((i) => i.stock <= i.lowStockAlert);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950/80 p-4 rounded-xl border border-amber-800/30">
        <div>
          <h3 className="font-serif font-bold text-amber-100 text-base flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Real-Time Inventory & Stock Movement</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Track current, reserved & available stock levels with automated order deductions and restoration audit trails
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="p-2 bg-zinc-900 hover:bg-zinc-800 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-amber-800/40 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          <span>Sync Stock</span>
        </button>
      </div>

      {/* Auto Rules Information Box */}
      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3 text-xs text-amber-200/90 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300">Automated Inventory Rules Active: </span>
          When an order is created or confirmed, available stock is automatically reduced and logged to stock history. When an order is marked as <span className="font-bold text-red-400">Cancelled</span> or <span className="font-bold text-amber-400">Returned</span>, stock is automatically restored to warehouse inventory!
        </div>
      </div>

      {/* Low Stock Alert Cards Banner if Any */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-950/50 border border-red-800/60 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />
            <div>
              <div className="text-xs font-bold text-red-200 uppercase tracking-wider">
                {lowStockItems.length} Products at or below Low Stock Threshold!
              </div>
              <div className="text-[11px] text-zinc-300">
                {lowStockItems.map((i) => `${i.name} (${i.stock} left)`).join(', ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('levels')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'levels'
              ? 'bg-amber-500 text-zinc-950 shadow-md'
              : 'bg-zinc-900 text-zinc-400 hover:text-amber-200'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>Warehouse Stock Levels</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-amber-500 text-zinc-950 shadow-md'
              : 'bg-zinc-900 text-zinc-400 hover:text-amber-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Stock Movement History ({stockHistory.length})</span>
        </button>
      </div>

      {activeTab === 'levels' ? (
        <div className="bg-zinc-950/80 border border-amber-800/30 rounded-xl overflow-x-auto shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900 border-b border-amber-800/30 text-amber-300 font-serif font-bold uppercase text-[11px]">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">SKU</th>
                <th className="p-3 text-center">Total Stock</th>
                <th className="p-3 text-center">Reserved</th>
                <th className="p-3 text-center">Available Stock</th>
                <th className="p-3 text-center">Low Stock Alert</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
              {items.map((i) => {
                const available = Math.max(0, i.stock - i.reservedStock);
                return (
                  <tr key={i.id} className="hover:bg-zinc-900/60 transition-colors">
                    <td className="p-3 font-bold text-amber-100 flex items-center gap-2">
                      <img src={i.image} alt={i.name} className="w-8 h-8 rounded border border-zinc-700 object-cover" />
                      <span>{i.name}</span>
                    </td>
                    <td className="p-3 font-mono text-zinc-400">{i.sku}</td>
                    <td className="p-3 text-center font-mono font-bold text-amber-300">{i.stock}</td>
                    <td className="p-3 text-center font-mono text-purple-300">{i.reservedStock}</td>
                    <td className="p-3 text-center font-mono font-extrabold text-emerald-400 text-sm">{available}</td>
                    <td className="p-3 text-center font-mono text-zinc-400">{i.lowStockAlert} units</td>
                    <td className="p-3">
                      {i.stock === 0 ? (
                        <span className="px-2 py-0.5 text-[10px] bg-red-950 text-red-300 border border-red-800/50 rounded-full font-bold">Out of Stock</span>
                      ) : i.stock <= i.lowStockAlert ? (
                        <span className="px-2 py-0.5 text-[10px] bg-amber-950 text-amber-300 border border-amber-800/50 rounded-full font-bold">Low Stock Alert</span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/50 rounded-full font-bold">Healthy Stock</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {canManageInventory && (
                        <button
                          onClick={() => {
                            setSelectedProduct(i);
                            setAdjustQty('10');
                            setAdjustType('Restock');
                          }}
                          className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-800/50 px-2.5 py-1 rounded text-xs font-bold transition-all"
                        >
                          Adjust Stock
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* HISTORY TAB */
        <div className="bg-zinc-950/80 border border-amber-800/30 rounded-xl overflow-x-auto shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900 border-b border-amber-800/30 text-amber-300 font-serif font-bold uppercase text-[11px]">
              <tr>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Product</th>
                <th className="p-3">SKU</th>
                <th className="p-3 text-center">Movement</th>
                <th className="p-3 text-center">Prev → New</th>
                <th className="p-3">Type / Reason</th>
                <th className="p-3">Log Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
              {stockHistory.map((h) => (
                <tr key={h.id} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="p-3 font-mono text-zinc-400 text-[11px]">
                    {new Date(h.date).toLocaleString('en-PK')}
                  </td>
                  <td className="p-3 font-bold text-amber-100">{h.productName}</td>
                  <td className="p-3 font-mono text-zinc-400">{h.sku}</td>
                  <td className="p-3 text-center font-mono font-bold">
                    {h.change > 0 ? (
                      <span className="text-emerald-400 flex items-center justify-center gap-0.5">
                        <ArrowUpRight className="w-3.5 h-3.5" /> +{h.change}
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center justify-center gap-0.5">
                        <ArrowDownRight className="w-3.5 h-3.5" /> {h.change}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center font-mono text-zinc-300">
                    {h.previousStock} → <span className="font-bold text-amber-300">{h.newStock}</span>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-amber-200">{h.type}</div>
                    <div className="text-[10px] text-zinc-400">{h.reason}</div>
                  </td>
                  <td className="p-3 text-zinc-400">{h.adminName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* STOCK ADJUSTMENT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-zinc-950/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-amber-800/60 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-serif font-bold text-amber-100 text-lg">
              Adjust Stock: {selectedProduct.name}
            </h3>
            <p className="text-xs text-zinc-400">Current Warehouse Stock: <span className="font-bold text-amber-300">{selectedProduct.stock} units</span></p>

            <form onSubmit={handleAdjustStock} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Adjustment Type</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-amber-100 focus:outline-none"
                >
                  <option value="Restock">Restock (+ Add Stock)</option>
                  <option value="Manual Reduction">Manual Reduction (- Deduct Stock)</option>
                  <option value="Damaged / QC Fail">Damaged / Quality Check Fail (-)</option>
                  <option value="Warehouse Transfer">Warehouse Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Quantity Change (+ or -)</label>
                <input
                  type="number"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  placeholder="e.g. 10 or -2"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-amber-100 focus:outline-none font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Reason / Audit Log Note</label>
                <textarea
                  rows={2}
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-amber-100 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="w-1/2 py-2.5 bg-zinc-800 text-zinc-300 font-bold rounded-xl hover:bg-zinc-700 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="w-1/2 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl transition-all text-xs"
                >
                  {adjusting ? 'Saving...' : 'Confirm Stock Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
