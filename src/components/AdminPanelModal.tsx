import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  Package, 
  Search, 
  RefreshCw, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Truck, 
  DollarSign, 
  MessageCircle, 
  Trash2, 
  LogOut,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('lcpk_admin_token') === 'admin-auth-token-lcpk';
  });
  const [loginError, setLoginError] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch orders when authenticated
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoadingLogin(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('lcpk_admin_token', data.token);
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setLoginError(data.error || 'Incorrect Admin Password');
      }
    } catch (err) {
      setLoginError('Failed to verify password');
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lcpk_admin_token');
    setIsAuthenticated(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId || o.trackingNumber === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to delete order #${orderId}?`)) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId && o.trackingNumber !== orderId));
      }
    } catch (err) {
      console.error('Failed to delete order', err);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shipping?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shipping?.phone?.includes(searchQuery) ||
      o.shipping?.city?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Analytics Metrics
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'Order Placed' || o.status === 'Quality Check').length;
  const dispatchedOrdersCount = orders.filter((o) => o.status === 'Dispatched via TCS' || o.status === 'Out for Delivery' || o.status === 'Delivered').length;

  return (
    <div id="admin-panel-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-zinc-900 border border-amber-800/40 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-950 border-b border-amber-800/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-amber-100 flex items-center gap-2">
                <span>LeatherCraft PK Admin Panel</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-sans uppercase">
                  Store Owner Access
                </span>
              </h2>
              <p className="text-xs text-zinc-400">View live customer orders, update tracking status, and contact buyers</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-amber-200 hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-zinc-200">
          {!isAuthenticated ? (
            /* Login Form */
            <div className="max-w-md mx-auto py-12 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-950/80 border border-amber-600/40 flex items-center justify-center text-amber-400 shadow-xl">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-amber-100">Admin Authentication</h3>
                <p className="text-xs text-zinc-400 mt-1">Enter your store administrator password to access customer orders</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter admin password (default: admin123)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-amber-800/40 rounded-xl px-4 py-3 text-amber-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400 font-sans"
                    autoFocus
                  />
                  <p className="text-[11px] text-zinc-500 mt-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Default password: <code className="text-amber-300 bg-zinc-950 px-1.5 py-0.5 rounded border border-amber-900/40">admin123</code>
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 bg-red-950/60 border border-red-800/50 rounded-xl text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loadingLogin}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl border border-amber-300 transition-all flex items-center justify-center gap-2"
                >
                  {loadingLogin ? 'Verifying Password...' : 'Unlock Admin Dashboard'}
                </button>
              </form>
            </div>
          ) : (
            /* Admin Dashboard Panel */
            <div className="space-y-6">
              {/* Top Metrics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-zinc-950/80 border border-amber-800/30 p-4 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-zinc-400 uppercase font-semibold">Total Orders</div>
                    <div className="text-xl font-bold font-serif text-amber-100">{totalOrdersCount}</div>
                  </div>
                </div>

                <div className="bg-zinc-950/80 border border-amber-800/30 p-4 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-zinc-400 uppercase font-semibold">Total Revenue</div>
                    <div className="text-xl font-bold font-serif text-emerald-300">Rs. {totalRevenue.toLocaleString('en-PK')}</div>
                  </div>
                </div>

                <div className="bg-zinc-950/80 border border-amber-800/30 p-4 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-600/10 border border-amber-600/30 flex items-center justify-center text-amber-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-zinc-400 uppercase font-semibold">Pending Orders</div>
                    <div className="text-xl font-bold font-serif text-amber-200">{pendingOrdersCount}</div>
                  </div>
                </div>

                <div className="bg-zinc-950/80 border border-amber-800/30 p-4 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-zinc-400 uppercase font-semibold">Dispatched / Sent</div>
                    <div className="text-xl font-bold font-serif text-blue-200">{dispatchedOrdersCount}</div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar & Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by Customer Name, Phone (0300...), City, or Tracking ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700/60 rounded-lg pl-9 pr-4 py-2 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Status Dropdown Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700/60 rounded-lg px-3 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="All">All Statuses</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Quality Check">Quality Check</option>
                  <option value="Dispatched via TCS">Dispatched via TCS</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>

                {/* Refresh & Logout */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchOrders}
                    disabled={loadingOrders}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-amber-800/40"
                    title="Refresh orders"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin text-amber-400' : ''}`} />
                    <span className="hidden md:inline">Refresh</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="p-2 bg-red-950/60 hover:bg-red-900/60 text-red-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-800/50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </div>
              </div>

              {/* Orders Cards List */}
              {loadingOrders ? (
                <div className="text-center py-12 text-zinc-500 flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                  <span>Loading customer orders...</span>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-zinc-950/40 rounded-xl border border-zinc-800">
                  <Package className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-zinc-300">No orders found</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {searchQuery ? 'Try adjusting your search filter' : 'When someone places an order on the site, it will appear here immediately!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const cleanPhone = order.shipping?.phone?.replace(/[^0-9]/g, '') || '';
                    const formattedPhoneForWa = cleanPhone.startsWith('0') ? `92${cleanPhone.slice(1)}` : cleanPhone;

                    const waMsg = encodeURIComponent(
                      `Assalam o Alaikum ${order.shipping?.fullName || 'Valued Customer'}!\n\n` +
                      `This is LeatherCraft PK regarding your Order *#${order.trackingNumber}*:\n` +
                      `📦 *Item(s):* ${order.items?.map((i: any) => `${i.product?.name || i.name} (${i.selectedColor?.name || ''})`).join(', ')}\n` +
                      `💵 *Total Amount:* Rs. ${order.total?.toLocaleString('en-PK')} (Cash on Delivery)\n` +
                      `📍 *Address:* ${order.shipping?.address}, ${order.shipping?.city}\n\n` +
                      `Current Status: *${order.status}*\nThank you for choosing LeatherCraft PK!`
                    );

                    return (
                      <div
                        key={order.id || order.trackingNumber}
                        className="bg-zinc-950 border border-amber-800/40 rounded-xl p-4 shadow-lg space-y-3 transition-all hover:border-amber-600/60"
                      >
                        {/* Card Top Row: Tracking & Status Selector */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-800/60">
                              #{order.trackingNumber}
                            </span>
                            <span className="text-xs text-zinc-500">
                              Placed on: {new Date(order.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>

                          {/* Status Change Selector */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-400 font-semibold hidden sm:inline">Status:</span>
                            <select
                              value={order.status}
                              disabled={updatingId === (order.id || order.trackingNumber)}
                              onChange={(e) => handleStatusChange(order.id || order.trackingNumber, e.target.value)}
                              className="bg-zinc-900 border border-amber-600/50 text-amber-200 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer"
                            >
                              <option value="Order Placed">📦 Order Placed</option>
                              <option value="Quality Check">🔍 Quality Check</option>
                              <option value="Dispatched via TCS">🚚 Dispatched via TCS</option>
                              <option value="Out for Delivery">🛵 Out for Delivery</option>
                              <option value="Delivered">✅ Delivered</option>
                            </select>

                            <button
                              onClick={() => handleDeleteOrder(order.id || order.trackingNumber)}
                              className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded-lg transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Customer & Shipping Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {/* Customer Details */}
                          <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80 space-y-1.5">
                            <div className="font-bold text-amber-200 text-sm flex items-center justify-between">
                              <span>{order.shipping?.fullName || 'Customer Name'}</span>
                              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50 font-sans font-semibold">
                                {order.paymentMethod || 'COD'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-zinc-300 font-mono">
                              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{order.shipping?.phone}</span>
                              {formattedPhoneForWa && (
                                <a
                                  href={`https://wa.me/${formattedPhoneForWa}?text=${waMsg}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-auto inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-sans font-extrabold px-2 py-0.5 rounded text-[10px] transition-transform hover:scale-105"
                                >
                                  <MessageCircle className="w-3 h-3 fill-zinc-950" /> WhatsApp
                                </a>
                              )}
                            </div>

                            <div className="flex items-start gap-1.5 text-zinc-400 pt-1">
                              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-zinc-200 font-medium">{order.shipping?.address}</p>
                                {order.shipping?.nearestLandmark && (
                                  <p className="text-amber-400/90 text-[11px] italic">
                                    Landmark: {order.shipping?.nearestLandmark}
                                  </p>
                                )}
                                <p className="text-zinc-400 text-[11px]">
                                  {order.shipping?.city}, {order.shipping?.province}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Ordered Items & Pricing Summary */}
                          <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80 flex flex-col justify-between">
                            <div>
                              <div className="text-[11px] uppercase font-bold text-zinc-400 mb-1.5">
                                Items Ordered ({order.items?.length || 0}):
                              </div>
                              <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                                {order.items?.map((item: any, idx: number) => (
                                  <div key={idx} className="flex items-center justify-between text-zinc-300 text-xs border-b border-zinc-800/50 pb-1">
                                    <div className="truncate pr-2">
                                      <span className="font-semibold text-amber-100">{item.quantity}x</span>{' '}
                                      {item.product?.name || item.name}
                                      {item.selectedColor?.name && (
                                        <span className="text-zinc-400 text-[11px] block">
                                          Color: {item.selectedColor.name}
                                        </span>
                                      )}
                                      {item.customInitials && (
                                        <span className="text-amber-400 text-[10px] block font-mono">
                                          Gold Initials: "{item.customInitials}"
                                        </span>
                                      )}
                                    </div>
                                    <div className="font-mono text-amber-300 text-right shrink-0">
                                      Rs. {((item.product?.price || item.price || 0) * (item.quantity || 1)).toLocaleString('en-PK')}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between mt-2">
                              <span className="text-xs text-zinc-400 font-semibold">Total Payable COD Amount:</span>
                              <span className="font-serif font-extrabold text-base text-amber-300">
                                Rs. {(order.total || 0).toLocaleString('en-PK')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
