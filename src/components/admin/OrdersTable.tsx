import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckSquare,
  Square,
  Eye,
  Edit,
  Printer,
  Package,
  Trash2,
  MessageCircle,
  Phone,
  ChevronLeft,
  ChevronRight,
  Download,
  Truck,
  ArrowUpDown,
  Check,
  XCircle,
  MoreHorizontal
} from 'lucide-react';

interface OrdersTableProps {
  orders: any[];
  onSelectOrder: (order: any) => void;
  onUpdateStatus: (id: string, newStatus: string) => void;
  onTogglePaymentStatus: (id: string, currentStatus: string) => void;
  onDeleteOrder: (id: string) => void;
  onBulkUpdateStatus: (ids: string[], newStatus: string) => void;
  onBulkAssignCourier: (ids: string[]) => void;
  onOpenPrintInvoice: (orders: any[]) => void;
  onOpenPrintPackingSlip: (orders: any[]) => void;
  onExportCSV: (orders: any[]) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onSelectOrder,
  onUpdateStatus,
  onTogglePaymentStatus,
  onDeleteOrder,
  onBulkUpdateStatus,
  onBulkAssignCourier,
  onOpenPrintInvoice,
  onOpenPrintPackingSlip,
  onExportCSV,
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'customer'>('newest');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Checkbox Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search matching across Order Number, Customer Name, Phone, Email, City, Tracking Number
      const query = searchQuery.trim().toLowerCase();
      const orderNum = (order.trackingNumber || '').toLowerCase();
      const customerName = (order.shipping?.fullName || '').toLowerCase();
      const phone = (order.shipping?.phone || '').toLowerCase();
      const email = (order.shipping?.email || '').toLowerCase();
      const city = (order.shipping?.city || '').toLowerCase();

      const matchesSearch =
        !query ||
        orderNum.includes(query) ||
        customerName.includes(query) ||
        phone.includes(query) ||
        email.includes(query) ||
        city.includes(query);

      // Status Filter matching
      let matchesFilter = true;
      if (statusFilter !== 'All') {
        if (statusFilter === 'Pending') matchesFilter = order.status === 'Order Placed' || order.status === 'Pending';
        else if (statusFilter === 'Payment Pending') matchesFilter = order.paymentStatus === 'Unpaid';
        else if (statusFilter === 'Paid') matchesFilter = order.paymentStatus === 'Paid';
        else if (statusFilter === 'COD') matchesFilter = (order.paymentMethod || 'COD') === 'COD';
        else if (statusFilter === 'Ready to Ship') matchesFilter = order.status === 'Ready to Ship';
        else if (statusFilter === 'Dispatched') matchesFilter = order.status === 'Dispatched' || order.status === 'Dispatched via TCS';
        else matchesFilter = order.status === statusFilter;
      }

      return matchesSearch && matchesFilter;
    });
  }, [orders, searchQuery, statusFilter]);

  // Sort Logic
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOption === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortOption === 'highest') {
        return (b.total || 0) - (a.total || 0);
      }
      if (sortOption === 'lowest') {
        return (a.total || 0) - (b.total || 0);
      }
      if (sortOption === 'customer') {
        return (a.shipping?.fullName || '').localeCompare(b.shipping?.fullName || '');
      }
      return 0;
    });
  }, [filteredOrders, sortOption]);

  // Pagination Slice
  const totalPages = Math.ceil(sortedOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedOrders.slice(start, start + pageSize);
  }, [sortedOrders, currentPage, pageSize]);

  // Selection Handlers
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedOrders.length && paginatedOrders.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedOrders.map((o) => o.id || o.trackingNumber));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllSelected = paginatedOrders.length > 0 && selectedIds.length === paginatedOrders.length;

  const selectedOrdersObjects = useMemo(() => {
    return orders.filter((o) => selectedIds.includes(o.id || o.trackingNumber));
  }, [orders, selectedIds]);

  // Bulk Actions
  const handleBulkStatus = (status: string) => {
    onBulkUpdateStatus(selectedIds, status);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* TOOLBAR: SEARCH, FILTERS & SORTING */}
      <div className="bg-zinc-950 p-4 rounded-2xl border border-amber-800/30 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Order #, Customer Name, Phone (0300...), Email, City or Tracking #..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl pl-9 pr-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-sans"
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700/60 rounded-xl px-3 py-2">
              <Filter className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-amber-200 font-semibold focus:outline-none cursor-pointer text-xs"
              >
                <option value="All" className="bg-zinc-900 text-amber-100">All Orders Filter</option>
                <option value="Pending" className="bg-zinc-900 text-amber-100">Pending</option>
                <option value="Confirmed" className="bg-zinc-900 text-amber-100">Confirmed</option>
                <option value="Processing" className="bg-zinc-900 text-amber-100">Processing</option>
                <option value="Ready to Ship" className="bg-zinc-900 text-amber-100">Ready to Ship</option>
                <option value="Dispatched" className="bg-zinc-900 text-amber-100">Dispatched</option>
                <option value="Delivered" className="bg-zinc-900 text-amber-100">Delivered</option>
                <option value="Cancelled" className="bg-zinc-900 text-amber-100">Cancelled</option>
                <option value="Returned" className="bg-zinc-900 text-amber-100">Returned</option>
                <option value="Payment Pending" className="bg-zinc-900 text-amber-100">Payment Pending (Unpaid)</option>
                <option value="Paid" className="bg-zinc-900 text-amber-100">Paid</option>
                <option value="COD" className="bg-zinc-900 text-amber-100">COD Orders</option>
              </select>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700/60 rounded-xl px-3 py-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <select
                value={sortOption}
                onChange={(e: any) => setSortOption(e.target.value)}
                className="bg-transparent text-amber-200 font-semibold focus:outline-none cursor-pointer text-xs"
              >
                <option value="newest" className="bg-zinc-900 text-amber-100">Newest First</option>
                <option value="oldest" className="bg-zinc-900 text-amber-100">Oldest First</option>
                <option value="highest" className="bg-zinc-900 text-amber-100">Highest Amount</option>
                <option value="lowest" className="bg-zinc-900 text-amber-100">Lowest Amount</option>
                <option value="customer" className="bg-zinc-900 text-amber-100">Customer Name</option>
              </select>
            </div>

            {/* Export Filtered CSV */}
            <button
              onClick={() => onExportCSV(sortedOrders)}
              className="px-3 py-2 bg-amber-950 hover:bg-amber-900 text-amber-300 font-bold rounded-xl border border-amber-800/50 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>

        </div>

        {/* BULK ACTIONS BAR (When orders checked) */}
        {selectedIds.length > 0 && (
          <div className="bg-amber-950/90 border border-amber-500/60 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-bold flex items-center justify-center text-xs">
                {selectedIds.length}
              </span>
              <span className="font-bold text-amber-100">
                {selectedIds.length} {selectedIds.length === 1 ? 'order' : 'orders'} selected:
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => handleBulkStatus('Confirmed')}
                className="px-2.5 py-1.5 bg-blue-900/80 hover:bg-blue-800 text-blue-200 font-semibold rounded-lg border border-blue-700"
              >
                Mark Confirmed
              </button>

              <button
                onClick={() => handleBulkStatus('Processing')}
                className="px-2.5 py-1.5 bg-purple-900/80 hover:bg-purple-800 text-purple-200 font-semibold rounded-lg border border-purple-700"
              >
                Mark Processing
              </button>

              <button
                onClick={() => handleBulkStatus('Ready to Ship')}
                className="px-2.5 py-1.5 bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 font-semibold rounded-lg border border-cyan-700"
              >
                Ready to Ship
              </button>

              <button
                onClick={() => handleBulkStatus('Dispatched via TCS')}
                className="px-2.5 py-1.5 bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 font-semibold rounded-lg border border-indigo-700"
              >
                Mark Dispatched
              </button>

              <button
                onClick={() => handleBulkStatus('Delivered')}
                className="px-2.5 py-1.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 font-semibold rounded-lg border border-emerald-700"
              >
                Mark Delivered
              </button>

              <button
                onClick={() => onBulkAssignCourier(selectedIds)}
                className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-semibold rounded-lg border border-amber-800/60 flex items-center gap-1"
              >
                <Truck className="w-3.5 h-3.5" />
                Assign Courier
              </button>

              <button
                onClick={() => onOpenPrintInvoice(selectedOrdersObjects)}
                className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-200 font-semibold rounded-lg border border-zinc-700 flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Invoices
              </button>

              <button
                onClick={() => onOpenPrintPackingSlip(selectedOrdersObjects)}
                className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-200 font-semibold rounded-lg border border-zinc-700 flex items-center gap-1"
              >
                <Package className="w-3.5 h-3.5" />
                Packing Slips
              </button>

              <button
                onClick={() => handleBulkStatus('Cancelled')}
                className="px-2.5 py-1.5 bg-red-950 hover:bg-red-900 text-red-300 font-semibold rounded-lg border border-red-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-zinc-950 border border-amber-800/30 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900 border-b border-amber-800/40 text-amber-300 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3 text-center w-10">
                  <button onClick={handleSelectAll} className="p-1 text-amber-400 hover:scale-110">
                    {isAllSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-zinc-600" />}
                  </button>
                </th>
                <th className="py-3 px-3 whitespace-nowrap">Order #</th>
                <th className="py-3 px-3 whitespace-nowrap">Date</th>
                <th className="py-3 px-3 whitespace-nowrap">Customer</th>
                <th className="py-3 px-3 whitespace-nowrap">Phone</th>
                <th className="py-3 px-3 whitespace-nowrap">City</th>
                <th className="py-3 px-3 whitespace-nowrap">Items</th>
                <th className="py-3 px-3 whitespace-nowrap text-right">Total</th>
                <th className="py-3 px-3 whitespace-nowrap">Payment</th>
                <th className="py-3 px-3 whitespace-nowrap">Fulfillment</th>
                <th className="py-3 px-3 whitespace-nowrap">Order Status</th>
                <th className="py-3 px-3 whitespace-nowrap">Courier</th>
                <th className="py-3 px-3 whitespace-nowrap">Tracking #</th>
                <th className="py-3 px-3 whitespace-nowrap text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70 text-zinc-200">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={14} className="text-center py-12 text-zinc-500">
                    No orders match your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const id = order.id || order.trackingNumber;
                  const isChecked = selectedIds.includes(id);

                  const cleanPhone = order.shipping?.phone?.replace(/[^0-9]/g, '') || '';
                  const formattedWa = cleanPhone.startsWith('0') ? `92${cleanPhone.slice(1)}` : cleanPhone;

                  const fulfillmentStatus =
                    order.status === 'Delivered'
                      ? 'Fulfilled'
                      : order.status === 'Dispatched' || order.status === 'Dispatched via TCS'
                      ? 'In Transit'
                      : 'Unfulfilled';

                  return (
                    <tr
                      key={id}
                      className={`hover:bg-zinc-900/80 transition-colors ${
                        isChecked ? 'bg-amber-950/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <button onClick={() => handleToggleSelect(id)} className="p-1">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Square className="w-4 h-4 text-zinc-600 hover:text-zinc-400" />
                          )}
                        </button>
                      </td>

                      {/* Order # */}
                      <td className="py-3 px-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                        <button
                          onClick={() => onSelectOrder(order)}
                          className="hover:underline text-left text-amber-300"
                        >
                          #{order.trackingNumber}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-zinc-400 whitespace-nowrap font-mono text-[11px]">
                        {new Date(order.createdAt).toLocaleDateString('en-PK', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      {/* Customer Name */}
                      <td className="py-3 px-3 font-semibold text-zinc-100 whitespace-nowrap">
                        {order.shipping?.fullName || 'Customer'}
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-3 font-mono text-zinc-300 whitespace-nowrap">
                        {order.shipping?.phone}
                      </td>

                      {/* City */}
                      <td className="py-3 px-3 text-zinc-300 whitespace-nowrap font-medium">
                        {order.shipping?.city}
                      </td>

                      {/* Items */}
                      <td className="py-3 px-3 whitespace-nowrap max-w-xs truncate">
                        <span className="font-bold text-amber-200">
                          {order.items?.length || 0} item(s):
                        </span>{' '}
                        <span className="text-zinc-400 text-[11px]">
                          {order.items?.map((i: any) => i.product?.name || i.name).join(', ')}
                        </span>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3 px-3 font-serif font-extrabold text-amber-300 text-right whitespace-nowrap">
                        Rs. {(order.total || 0).toLocaleString('en-PK')}
                      </td>

                      {/* Payment Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <button
                          onClick={() => onTogglePaymentStatus(id, order.paymentStatus || 'Unpaid')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                            order.paymentStatus === 'Paid'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-600/60'
                              : 'bg-amber-950 text-amber-300 border-amber-600/60'
                          }`}
                        >
                          {order.paymentStatus === 'Paid' ? 'Paid ✓' : 'Unpaid ⏳'}
                        </button>
                      </td>

                      {/* Fulfillment Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          fulfillmentStatus === 'Fulfilled'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            : fulfillmentStatus === 'In Transit'
                            ? 'bg-blue-950 text-blue-300 border border-blue-700'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}>
                          {fulfillmentStatus}
                        </span>
                      </td>

                      {/* Order Status Select */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateStatus(id, e.target.value)}
                          className="bg-zinc-900 border border-amber-800/60 text-amber-200 text-[11px] font-bold rounded px-2 py-1 focus:outline-none cursor-pointer"
                        >
                          <option value="Order Placed">📦 Placed</option>
                          <option value="Confirmed">👍 Confirmed</option>
                          <option value="Processing">⚙️ Processing</option>
                          <option value="Ready to Ship">🎁 Ready</option>
                          <option value="Dispatched via TCS">🚚 Dispatched</option>
                          <option value="Out for Delivery">🛵 Out Delivery</option>
                          <option value="Delivered">✅ Delivered</option>
                          <option value="Cancelled">❌ Cancelled</option>
                          <option value="Returned">↩️ Returned</option>
                        </select>
                      </td>

                      {/* Courier */}
                      <td className="py-3 px-3 text-zinc-300 whitespace-nowrap text-[11px]">
                        {order.courierName || 'TCS Express'}
                      </td>

                      {/* Tracking Number */}
                      <td className="py-3 px-3 font-mono text-amber-400 whitespace-nowrap text-[11px]">
                        #{order.trackingNumber}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onSelectOrder(order)}
                            className="p-1.5 bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-amber-200 rounded transition-colors"
                            title="View Full Order Intelligence"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {formattedWa && (
                            <a
                              href={`https://wa.me/${formattedWa}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 rounded transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-zinc-950" />
                            </a>
                          )}

                          <button
                            onClick={() => onDeleteOrder(id)}
                            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-4 bg-zinc-900 border-t border-amber-800/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-400 text-xs">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-amber-200 focus:outline-none"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <span>
              Showing {sortedOrders.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{' '}
              {Math.min(currentPage * pageSize, sortedOrders.length)} of {sortedOrders.length} orders
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 text-amber-200 rounded border border-zinc-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-mono text-amber-300 font-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 text-amber-200 rounded border border-zinc-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
