import React, { useState, useEffect } from 'react';
import { Search, X, Package, Users, Box, ExternalLink, ArrowRight } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: any[];
  onSelectOrder: (order: any) => void;
  onNavigateTab: (tab: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrder,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingOrders = q
    ? orders.filter(
        (o) =>
          o.trackingNumber?.toLowerCase().includes(q) ||
          o.id?.toLowerCase().includes(q) ||
          o.shipping?.fullName?.toLowerCase().includes(q) ||
          o.shipping?.phone?.includes(q) ||
          o.shipping?.city?.toLowerCase().includes(q)
      )
    : [];

  // Mock Products Matching
  const mockProducts = [
    { id: 'p1', name: 'The Sovereign Italian Bifold Wallet', sku: 'LCPK-SOV-01', price: 5499 },
    { id: 'p2', name: 'The Heritage Handcrafted Leather Belt', sku: 'LCPK-BELT-02', price: 3850 },
    { id: 'p3', name: 'The Executive Leather Duffle Bag', sku: 'LCPK-DUFF-03', price: 18900 },
    { id: 'p4', name: 'The Artisan Cardholder Slim', sku: 'LCPK-CARD-04', price: 2200 },
  ];

  const matchingProducts = q
    ? mockProducts.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-16 sm:pt-24 animate-fade-in">
      <div className="bg-zinc-900 border border-amber-800/60 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header Input */}
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3 bg-zinc-950">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            placeholder="Search Order #, Customer Name, Phone, City, Product Name, or SKU..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-amber-100 placeholder-zinc-500 focus:outline-none w-full text-sm font-sans"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-500 hover:text-amber-200 text-xs font-semibold"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-amber-200 hover:bg-zinc-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {!query ? (
            <div className="text-center py-12 text-zinc-500 space-y-2">
              <Search className="w-8 h-8 text-zinc-700 mx-auto" />
              <p className="font-semibold text-zinc-400">Type to search across LeatherCraft PK Admin</p>
              <p className="text-[11px]">Search by Order Tracking Number, Customer Phone, Name, Product Title or SKU</p>
            </div>
          ) : (
            <>
              {/* Matching Orders */}
              <div>
                <h4 className="font-serif font-bold text-amber-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  <span>Orders ({matchingOrders.length})</span>
                </h4>

                {matchingOrders.length === 0 ? (
                  <p className="text-zinc-500 italic text-[11px] pl-2">No orders found matching "{query}"</p>
                ) : (
                  <div className="space-y-1.5">
                    {matchingOrders.map((o) => (
                      <div
                        key={o.id}
                        onClick={() => {
                          onSelectOrder(o);
                          onClose();
                        }}
                        className="p-3 bg-zinc-950/80 hover:bg-zinc-800 border border-amber-800/30 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-amber-200 font-mono">
                            #{o.trackingNumber || o.id}
                          </div>
                          <div className="text-[11px] text-zinc-400">
                            {o.shipping?.fullName} • {o.shipping?.phone} ({o.shipping?.city})
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-serif font-bold text-amber-300">
                            Rs. {(o.totalAmount || 5499).toLocaleString('en-PK')}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/40">
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Matching Products */}
              <div>
                <h4 className="font-serif font-bold text-amber-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 mt-4">
                  <Box className="w-3.5 h-3.5" />
                  <span>Products & Catalog ({matchingProducts.length})</span>
                </h4>

                {matchingProducts.length === 0 ? (
                  <p className="text-zinc-500 italic text-[11px] pl-2">No catalog products found matching "{query}"</p>
                ) : (
                  <div className="space-y-1.5">
                    {matchingProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onNavigateTab('products');
                          onClose();
                        }}
                        className="p-3 bg-zinc-950/80 hover:bg-zinc-800 border border-amber-800/30 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-amber-100">{p.name}</div>
                          <div className="text-[10px] text-zinc-400 font-mono">SKU: {p.sku}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-amber-300">
                            Rs. {p.price.toLocaleString('en-PK')}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
