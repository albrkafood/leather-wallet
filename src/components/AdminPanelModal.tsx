import React, { useState, useEffect, useMemo } from 'react';
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
  AlertCircle,
  Calendar,
  Download,
  Plus,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Users,
  CreditCard,
  XCircle,
  RotateCcw,
  Box,
  CheckSquare,
  Filter,
  Check,
  ChevronDown,
  Menu
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

import { OrdersTable } from './admin/OrdersTable';
import { OrderDetailModal } from './admin/OrderDetailModal';
import { PrintInvoiceModal } from './admin/PrintInvoiceModal';
import { PrintPackingSlipModal } from './admin/PrintPackingSlipModal';
import { AssignCourierModal } from './admin/AssignCourierModal';
import { ProductsManagement } from './admin/ProductsManagement';
import { InventoryManagement } from './admin/InventoryManagement';
import { CustomersDirectory } from './admin/CustomersDirectory';
import { ReportsAnalytics } from './admin/ReportsAnalytics';
import { ActivityLogView } from './admin/ActivityLogView';
import { AdminSettingsView } from './admin/AdminSettingsView';
import { AdminNotificationsDropdown } from './admin/AdminNotificationsDropdown';
import { DiscountsCouponsView } from './admin/DiscountsCouponsView';
import { ShipmentsTrackingView } from './admin/ShipmentsTrackingView';
import { ReturnsRefundsView } from './admin/ReturnsRefundsView';
import { GlobalSearchModal } from './admin/GlobalSearchModal';
import { AdminSidebar } from './admin/AdminSidebar';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Authentication state
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('lcpk_admin_token') === 'admin-auth-token-lcpk';
  });
  const [loginError, setLoginError] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);

  // Active Admin Role State
  const [currentRole, setCurrentRole] = useState<'Store Owner' | 'Admin' | 'Order Manager' | 'Inventory Manager' | 'Customer Support'>('Store Owner');

  // Tab State
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'orders'
    | 'products'
    | 'inventory'
    | 'customers'
    | 'coupons'
    | 'shipments'
    | 'returns'
    | 'reports'
    | 'activity'
    | 'settings'
  >('orders');

  // Sidebar & Search State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showGlobalSearchModal, setShowGlobalSearchModal] = useState(false);
  const [isStoreLive, setIsStoreLive] = useState(true);

  // Date Filter State
  const [dateRange, setDateRange] = useState<string>('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Orders & Data State
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Detail & Print Modal States
  const [selectedDetailOrder, setSelectedDetailOrder] = useState<any | null>(null);
  const [printInvoiceOrders, setPrintInvoiceOrders] = useState<any[]>([]);
  const [printPackingSlipOrders, setPrintPackingSlipOrders] = useState<any[]>([]);
  const [showAssignCourierModal, setShowAssignCourierModal] = useState(false);
  const [assignCourierOrderIds, setAssignCourierOrderIds] = useState<string[]>([]);

  // New Order Modal State
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('Lahore');
  const [newAddress, setNewAddress] = useState('');
  const [newNearestLandmark, setNewNearestLandmark] = useState('');
  const [newProductName, setNewProductName] = useState('The Sovereign Italian Bifold');
  const [newProductPrice, setNewProductPrice] = useState('5499');
  const [newPaymentMethod, setNewPaymentMethod] = useState('COD');
  const [newPaymentStatus, setNewPaymentStatus] = useState<'Paid' | 'Unpaid'>('Unpaid');
  const [newOrderStatus, setNewOrderStatus] = useState('Order Placed');
  const [creatingOrder, setCreatingOrder] = useState(false);

  // Fetch orders from API
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
          prev.map((o) => (o.id === orderId || o.trackingNumber === orderId ? { 
            ...o, 
            status: newStatus,
            paymentStatus: newStatus === 'Delivered' && o.paymentMethod === 'COD' ? 'Paid' : o.paymentStatus
          } : o))
        );
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentStatusToggle = async (orderId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: nextStatus })
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId || o.trackingNumber === orderId ? { ...o, paymentStatus: nextStatus } : o))
        );
      }
    } catch (err) {
      console.error('Failed to update payment status', err);
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
        if (selectedDetailOrder && (selectedDetailOrder.id === orderId || selectedDetailOrder.trackingNumber === orderId)) {
          setSelectedDetailOrder(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete order', err);
    }
  };

  const handleBulkUpdateStatus = async (ids: string[], newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        const oId = o.id || o.trackingNumber;
        if (ids.includes(oId)) {
          return {
            ...o,
            status: newStatus,
            paymentStatus: newStatus === 'Delivered' && o.paymentMethod === 'COD' ? 'Paid' : o.paymentStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return o;
      })
    );

    // Persist changes to server
    for (const id of ids) {
      try {
        await fetch(`/api/admin/orders/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
      } catch (err) {
        console.error('Failed to bulk update order status', id, err);
      }
    }
  };

  const handleBulkAssignCourier = (ids: string[]) => {
    setAssignCourierOrderIds(ids);
    setShowAssignCourierModal(true);
  };

  const handlePerformAssignCourier = async (courierName: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        const oId = o.id || o.trackingNumber;
        if (assignCourierOrderIds.includes(oId)) {
          return { ...o, courierName, updatedAt: new Date().toISOString() };
        }
        return o;
      })
    );

    for (const id of assignCourierOrderIds) {
      try {
        await fetch(`/api/admin/orders/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courierName })
        });
      } catch (err) {
        console.error('Failed to update courier', id, err);
      }
    }
    setShowAssignCourierModal(false);
  };

  const handleUpdateSingleOrder = async (updatedOrder: any) => {
    const oId = updatedOrder.id || updatedOrder.trackingNumber;
    setOrders((prev) => prev.map((o) => ((o.id || o.trackingNumber) === oId ? updatedOrder : o)));
    setSelectedDetailOrder(updatedOrder);

    try {
      await fetch(`/api/admin/orders/${oId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrder)
      });
    } catch (err) {
      console.error('Failed to persist single order update', err);
    }
  };

  const handleDuplicateOrder = async (orderToDuplicate: any) => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const duplicatedNumber = `LCPK-${randomSuffix}`;
    const duplicated = {
      ...orderToDuplicate,
      id: undefined,
      trackingNumber: duplicatedNumber,
      status: 'Order Placed',
      paymentStatus: 'Unpaid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicated)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) => [data.order, ...prev]);
        setSelectedDetailOrder(data.order);
      }
    } catch (err) {
      console.error('Failed to duplicate order', err);
    }
  };

  const handleCreateOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingOrder(true);
    try {
      const priceNum = parseInt(newProductPrice) || 5499;
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              product: { name: newProductName, price: priceNum },
              selectedColor: { name: 'Natural Leather Finish' },
              quantity: 1
            }
          ],
          shipping: {
            fullName: newCustomerName,
            phone: newPhone,
            address: newAddress,
            nearestLandmark: newNearestLandmark,
            city: newCity,
            province: 'Punjab'
          },
          paymentMethod: newPaymentMethod,
          paymentStatus: newPaymentStatus,
          total: priceNum + 200, // including 200 courier
          status: newOrderStatus
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) => [data.order, ...prev]);
        setShowAddOrderModal(false);
        // Reset form
        setNewCustomerName('');
        setNewPhone('');
        setNewAddress('');
        setNewNearestLandmark('');
      }
    } catch (err) {
      console.error('Failed to create manual order', err);
    } finally {
      setCreatingOrder(false);
    }
  };

  // CSV Export Function
  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Tracking ID', 'Order Date', 'Customer Name', 'Phone', 'City', 'Province', 'Address', 'Landmark', 'Order Status', 'Payment Method', 'Payment Status', 'Total PKR', 'Items Purchased'];
    const rows = dateFilteredOrders.map((o) => [
      o.trackingNumber,
      new Date(o.createdAt).toLocaleDateString('en-PK'),
      `"${(o.shipping?.fullName || '').replace(/"/g, '""')}"`,
      `"${o.shipping?.phone || ''}"`,
      `"${o.shipping?.city || ''}"`,
      `"${o.shipping?.province || ''}"`,
      `"${(o.shipping?.address || '').replace(/"/g, '""')}"`,
      `"${(o.shipping?.nearestLandmark || '').replace(/"/g, '""')}"`,
      `"${o.status || ''}"`,
      `"${o.paymentMethod || ''}"`,
      `"${o.paymentStatus || 'Unpaid'}"`,
      o.total || 0,
      `"${(o.items || []).map((i: any) => `${i.product?.name || i.name} x${i.quantity || 1}`).join('; ')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LeatherCraft_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Date Filtering Logic
  const dateFilteredOrders = useMemo(() => {
    const now = new Date();

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      if (isNaN(orderDate.getTime())) return true;

      if (dateRange === 'Today') {
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return orderDate >= startOfToday;
      }
      if (dateRange === 'Yesterday') {
        const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
        return orderDate >= startOfYesterday && orderDate <= endOfYesterday;
      }
      if (dateRange === 'Last 7 Days') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
        return orderDate >= sevenDaysAgo;
      }
      if (dateRange === 'Last 30 Days') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
        return orderDate >= thirtyDaysAgo;
      }
      if (dateRange === 'This Month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return orderDate >= startOfMonth;
      }
      if (dateRange === 'Last Month') {
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        return orderDate >= startOfLastMonth && orderDate <= endOfLastMonth;
      }
      if (dateRange === 'Custom Date Range') {
        if (!customStartDate && !customEndDate) return true;
        const start = customStartDate ? new Date(customStartDate + 'T00:00:00') : new Date(0);
        const end = customEndDate ? new Date(customEndDate + 'T23:59:59') : new Date(now.getTime() + 86400000);
        return orderDate >= start && orderDate <= end;
      }
      return true;
    });
  }, [orders, dateRange, customStartDate, customEndDate]);

  // Search & Status Filtered Orders
  const searchFilteredOrders = useMemo(() => {
    return dateFilteredOrders.filter((o) => {
      const matchesSearch =
        o.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.shipping?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.shipping?.phone?.includes(searchQuery) ||
        o.shipping?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.items?.some((i: any) => (i.product?.name || i.name)?.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
      const matchesPayment = paymentFilter === 'All' || o.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [dateFilteredOrders, searchQuery, statusFilter, paymentFilter]);

  // ==========================================
  // 13 DASHBOARD METRICS CALCULATION
  // ==========================================
  const metrics = useMemo(() => {
    const list = dateFilteredOrders;
    const totalOrders = list.length;
    const totalRevenue = list.reduce((acc, o) => o.status !== 'Cancelled' ? acc + (o.total || 0) : acc, 0);

    const pendingOrders = list.filter((o) => o.status === 'Order Placed').length;
    const confirmedOrders = list.filter((o) => o.status === 'Confirmed').length;
    const processingOrders = list.filter((o) => o.status === 'Processing' || o.status === 'Quality Check').length;
    const readyToShip = list.filter((o) => o.status === 'Ready to Ship').length;
    const dispatchedOrders = list.filter((o) => o.status === 'Dispatched via TCS' || o.status === 'Out for Delivery').length;
    const deliveredOrders = list.filter((o) => o.status === 'Delivered').length;
    const cancelledOrders = list.filter((o) => o.status === 'Cancelled').length;
    const returnedOrders = list.filter((o) => o.status === 'Returned').length;

    // COD Pending Amount (COD orders that are not paid yet and not cancelled/returned)
    const codPendingAmount = list.reduce((acc, o) => {
      if (o.paymentMethod === 'COD' && o.paymentStatus !== 'Paid' && o.status !== 'Cancelled' && o.status !== 'Returned') {
        return acc + (o.total || 0);
      }
      return acc;
    }, 0);

    const paidOrders = list.filter((o) => o.paymentStatus === 'Paid').length;
    const unpaidOrders = list.filter((o) => o.paymentStatus !== 'Paid' && o.status !== 'Cancelled').length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      readyToShip,
      dispatchedOrders,
      deliveredOrders,
      cancelledOrders,
      returnedOrders,
      codPendingAmount,
      paidOrders,
      unpaidOrders
    };
  }, [dateFilteredOrders]);

  // ==========================================
  // CHART DATA PREPARATION
  // ==========================================

  // 1. Sales & Orders Overview / Revenue by Day
  const salesByDayData = useMemo(() => {
    const dayMap: { [key: string]: { date: string; revenue: number; orders: number } } = {};

    // Sort ascending
    const sorted = [...dateFilteredOrders].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    sorted.forEach((order) => {
      const d = new Date(order.createdAt);
      if (isNaN(d.getTime())) return;
      const key = d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' });
      if (!dayMap[key]) {
        dayMap[key] = { date: key, revenue: 0, orders: 0 };
      }
      if (order.status !== 'Cancelled') {
        dayMap[key].revenue += order.total || 0;
      }
      dayMap[key].orders += 1;
    });

    const result = Object.values(dayMap);
    if (result.length === 0) {
      return [
        { date: 'Today', revenue: metrics.totalRevenue, orders: metrics.totalOrders }
      ];
    }
    return result;
  }, [dateFilteredOrders, metrics]);

  // 2. Order Status Distribution Pie Data
  const statusDistributionData = useMemo(() => {
    return [
      { name: 'Order Placed', count: metrics.pendingOrders, color: '#f59e0b' },
      { name: 'Confirmed', count: metrics.confirmedOrders, color: '#3b82f6' },
      { name: 'Processing', count: metrics.processingOrders, color: '#8b5cf6' },
      { name: 'Ready to Ship', count: metrics.readyToShip, color: '#06b6d4' },
      { name: 'Dispatched', count: metrics.dispatchedOrders, color: '#6366f1' },
      { name: 'Delivered', count: metrics.deliveredOrders, color: '#10b981' },
      { name: 'Cancelled', count: metrics.cancelledOrders, color: '#ef4444' },
      { name: 'Returned', count: metrics.returnedOrders, color: '#f97316' }
    ].filter((item) => item.count > 0);
  }, [metrics]);

  // 3. Top Selling Products
  const topProductsData = useMemo(() => {
    const pMap: { [name: string]: { name: string; units: number; revenue: number } } = {};

    dateFilteredOrders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      (o.items || []).forEach((i: any) => {
        const pName = i.product?.name || i.name || 'Leather Wallet';
        const price = i.product?.price || i.price || 0;
        const qty = i.quantity || 1;
        if (!pMap[pName]) {
          pMap[pName] = { name: pName, units: 0, revenue: 0 };
        }
        pMap[pName].units += qty;
        pMap[pName].revenue += price * qty;
      });
    });

    return Object.values(pMap).sort((a, b) => b.units - a.units).slice(0, 6);
  }, [dateFilteredOrders]);

  // 4. Top Customers
  const topCustomersData = useMemo(() => {
    const cMap: { [phone: string]: { name: string; phone: string; city: string; ordersCount: number; totalSpent: number } } = {};

    dateFilteredOrders.forEach((o) => {
      const phone = o.shipping?.phone || 'Unknown';
      const name = o.shipping?.fullName || 'Valued Buyer';
      const city = o.shipping?.city || 'Lahore';
      if (!cMap[phone]) {
        cMap[phone] = { name, phone, city, ordersCount: 0, totalSpent: 0 };
      }
      cMap[phone].ordersCount += 1;
      if (o.status !== 'Cancelled') {
        cMap[phone].totalSpent += o.total || 0;
      }
    });

    return Object.values(cMap).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
  }, [dateFilteredOrders]);

  // 5. COD vs Paid Orders
  const codVsPaidData = useMemo(() => {
    const codOrders = dateFilteredOrders.filter((o) => o.paymentMethod === 'COD');
    const onlineOrders = dateFilteredOrders.filter((o) => o.paymentMethod !== 'COD');

    const codTotal = codOrders.reduce((acc, o) => acc + (o.total || 0), 0);
    const onlineTotal = onlineOrders.reduce((acc, o) => acc + (o.total || 0), 0);

    return [
      { name: 'COD Orders', count: codOrders.length, revenue: codTotal, color: '#f59e0b' },
      { name: 'Paid / Card / JazzCash', count: onlineOrders.length, revenue: onlineTotal, color: '#10b981' }
    ];
  }, [dateFilteredOrders]);

  return (
    <div id="admin-panel-modal" className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden">
      <div className="bg-zinc-900 border border-amber-800/40 w-full max-w-7xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[94vh] max-h-[94vh]">
        
        {/* TOP BAR HEADER */}
        <div className="px-4 py-3 bg-zinc-950 border-b border-amber-800/30 flex items-center justify-between gap-3 shrink-0">
          {/* Left: Mobile Drawer Toggle & Breadcrumbs */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated && (
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-1.5 md:hidden text-zinc-300 hover:text-amber-300 hover:bg-zinc-800 rounded-lg"
                title="Open Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="font-serif text-sm font-bold text-amber-100 flex items-center gap-2">
                  <span>LeatherCraft PK Admin</span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 uppercase font-sans">
                    {activeTab}
                  </span>
                </h2>
              </div>
            </div>
          </div>

          {/* Center: Global Search Bar Trigger */}
          {isAuthenticated && (
            <button
              onClick={() => setShowGlobalSearchModal(true)}
              className="hidden sm:flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-200 px-3 py-1.5 rounded-xl border border-amber-800/30 text-xs w-64 md:w-80 justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>Search orders, SKU, customer...</span>
              </div>
              <kbd className="bg-zinc-950 border border-zinc-700 text-zinc-400 font-mono px-1.5 py-0.5 text-[10px] rounded">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                {/* Search Icon for Mobile */}
                <button
                  onClick={() => setShowGlobalSearchModal(true)}
                  className="sm:hidden p-2 text-zinc-400 hover:text-amber-200 hover:bg-zinc-800 rounded-lg"
                >
                  <Search className="w-4 h-4 text-amber-400" />
                </button>

                {/* Store Status Toggle */}
                <button
                  onClick={() => setIsStoreLive(!isStoreLive)}
                  className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    isStoreLive
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                      : 'bg-red-950/80 text-red-300 border-red-800/60'
                  }`}
                  title="Toggle Store Status"
                >
                  <span className={`w-2 h-2 rounded-full ${isStoreLive ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                  <span>Store: {isStoreLive ? 'Live' : 'Maintenance'}</span>
                </button>

                {/* Notifications Bell */}
                <AdminNotificationsDropdown
                  onSelectOrder={(ordId) => {
                    setActiveTab('orders');
                    const found = orders.find((o) => o.id === ordId || o.trackingNumber === ordId);
                    if (found) setSelectedDetailOrder(found);
                  }}
                />

                {/* Role Switcher */}
                <div className="hidden lg:flex items-center gap-1 bg-zinc-950 border border-amber-800/40 rounded-xl px-2 py-1 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <select
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value as any)}
                    className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer text-xs"
                  >
                    <option value="Store Owner" className="bg-zinc-900">Store Owner</option>
                    <option value="Admin" className="bg-zinc-900">Admin</option>
                    <option value="Order Manager" className="bg-zinc-900">Order Manager</option>
                    <option value="Inventory Manager" className="bg-zinc-900">Inventory Manager</option>
                    <option value="Customer Support" className="bg-zinc-900">Customer Support</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowAddOrderModal(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-all shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden xl:inline">+ New Order</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-amber-200 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL MAIN BODY */}
        {!isAuthenticated ? (
            /* AUTH LOGIN SCREEN */
            <div className="max-w-md mx-auto py-12 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-950/80 border border-amber-600/40 flex items-center justify-center text-amber-400 shadow-xl">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-amber-100">Admin Login</h3>
                <p className="text-xs text-zinc-400 mt-1">Enter your store password to access Shopify-style sales & order analytics</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password (e.g. admin123)"
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
            /* AUTHENTICATED MAIN LAYOUT (SIDEBAR + CONTENT) */
            <div className="flex-1 flex overflow-hidden">
              {/* Desktop Left Sidebar */}
              <div className="hidden md:block h-full shrink-0">
                <AdminSidebar
                  activeTab={activeTab}
                  onSelectTab={(tab, statusF) => {
                    setActiveTab(tab);
                    if (statusF) setStatusFilter(statusF);
                  }}
                  isCollapsed={isSidebarCollapsed}
                  onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  currentRole={currentRole}
                  onLogout={handleLogout}
                />
              </div>

              {/* Mobile Drawer Overlay */}
              {isMobileSidebarOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden flex">
                  <AdminSidebar
                    activeTab={activeTab}
                    onSelectTab={(tab, statusF) => {
                      setActiveTab(tab);
                      if (statusF) setStatusFilter(statusF);
                    }}
                    isCollapsed={false}
                    onToggleCollapse={() => {}}
                    currentRole={currentRole}
                    onLogout={handleLogout}
                    isMobileDrawer={true}
                    onCloseMobileDrawer={() => setIsMobileSidebarOpen(false)}
                  />
                  <div
                    className="flex-1"
                    onClick={() => setIsMobileSidebarOpen(false)}
                  />
                </div>
              )}

              {/* Main Scrollable View Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-zinc-200 space-y-6">

                {/* DATE FILTER BAR FOR OVERVIEW / DASHBOARD VIEW */}
                {activeTab === 'dashboard' && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950/80 p-3.5 rounded-xl border border-amber-800/30">
                    <div>
                      <h3 className="font-serif font-bold text-amber-100 text-sm">
                        Financial Overview & Revenue Analytics
                      </h3>
                      <p className="text-[11px] text-zinc-400">Total revenue, COD pending collections, average order value & sales charts</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-zinc-900 border border-amber-800/40 rounded-lg px-2.5 py-1.5 text-xs">
                        <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                        <select
                          value={dateRange}
                          onChange={(e) => setDateRange(e.target.value)}
                          className="bg-transparent text-amber-100 font-semibold focus:outline-none cursor-pointer"
                        >
                          <option value="Today" className="bg-zinc-900 text-amber-100">Today</option>
                          <option value="Yesterday" className="bg-zinc-900 text-amber-100">Yesterday</option>
                          <option value="Last 7 Days" className="bg-zinc-900 text-amber-100">Last 7 Days</option>
                          <option value="Last 30 Days" className="bg-zinc-900 text-amber-100">Last 30 Days</option>
                          <option value="This Month" className="bg-zinc-900 text-amber-100">This Month</option>
                          <option value="Last Month" className="bg-zinc-900 text-amber-100">Last Month</option>
                          <option value="Custom Date Range" className="bg-zinc-900 text-amber-100">Custom Date Range</option>
                        </select>
                      </div>

                      {dateRange === 'Custom Date Range' && (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            className="bg-zinc-900 border border-zinc-700/60 rounded-lg px-2 py-1 text-xs text-amber-100 focus:outline-none"
                          />
                          <span className="text-zinc-500 text-xs">to</span>
                          <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            className="bg-zinc-900 border border-zinc-700/60 rounded-lg px-2 py-1 text-xs text-amber-100 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* TAB 1: DASHBOARD OVERVIEW */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  
                  {/* SECTION TITLE */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-amber-100">Performance Summary</h3>
                      <p className="text-xs text-zinc-400">Filtering metrics for: <span className="text-amber-300 font-semibold">{dateRange}</span> ({dateFilteredOrders.length} orders found)</p>
                    </div>
                  </div>

                  {/* 13 METRICS CARDS GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    
                    {/* 1. Total Orders */}
                    <div className="bg-zinc-950/80 border border-amber-800/40 p-3.5 rounded-xl space-y-1.5 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Total Orders</span>
                        <Package className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-xl font-bold font-serif text-amber-100">{metrics.totalOrders}</div>
                      <div className="text-[10px] text-zinc-500">In {dateRange}</div>
                    </div>

                    {/* 2. Total Revenue */}
                    <div className="bg-zinc-950/80 border border-emerald-800/40 p-3.5 rounded-xl space-y-1.5 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Total Revenue</span>
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-xl font-bold font-serif text-emerald-300">Rs. {metrics.totalRevenue.toLocaleString('en-PK')}</div>
                      <div className="text-[10px] text-emerald-500/80">Gross Sales</div>
                    </div>

                    {/* 3. Pending Orders */}
                    <div className="bg-zinc-950/80 border border-amber-600/40 p-3.5 rounded-xl space-y-1.5 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Pending Orders</span>
                        <Clock className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-xl font-bold font-serif text-amber-200">{metrics.pendingOrders}</div>
                      <div className="text-[10px] text-amber-500/80">Order Placed</div>
                    </div>

                    {/* 4. Confirmed Orders */}
                    <div className="bg-zinc-950/80 border border-blue-600/40 p-3.5 rounded-xl space-y-1.5 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Confirmed</span>
                        <CheckSquare className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-xl font-bold font-serif text-blue-200">{metrics.confirmedOrders}</div>
                      <div className="text-[10px] text-blue-400/80">Verified & Accepted</div>
                    </div>

                    {/* 5. Processing Orders */}
                    <div className="bg-zinc-950/80 border border-purple-600/40 p-3.5 rounded-xl space-y-1.5 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Processing</span>
                        <Box className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="text-xl font-bold font-serif text-purple-200">{metrics.processingOrders}</div>
                      <div className="text-[10px] text-purple-400/80">Crafting & QC</div>
                    </div>

                    {/* 6. Ready to Ship */}
                    <div className="bg-zinc-950/80 border border-cyan-600/40 p-3.5 rounded-xl space-y-1.5 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Ready to Ship</span>
                        <Box className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="text-xl font-bold font-serif text-cyan-200">{metrics.readyToShip}</div>
                      <div className="text-[10px] text-cyan-400/80">Packed in Box</div>
                    </div>

                    {/* 7. Dispatched Orders */}
                    <div className="bg-zinc-950/80 border border-indigo-600/40 p-3.5 rounded-xl space-y-1.5 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Dispatched</span>
                        <Truck className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="text-xl font-bold font-serif text-indigo-200">{metrics.dispatchedOrders}</div>
                      <div className="text-[10px] text-indigo-400/80">In Transit TCS</div>
                    </div>

                    {/* 8. Delivered Orders */}
                    <div className="bg-zinc-950/80 border border-emerald-600/40 p-3.5 rounded-xl space-y-1.5 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Delivered</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-xl font-bold font-serif text-emerald-300">{metrics.deliveredOrders}</div>
                      <div className="text-[10px] text-emerald-500/80">Completed</div>
                    </div>

                    {/* 9. Cancelled Orders */}
                    <div className="bg-zinc-950/80 border border-red-800/40 p-3.5 rounded-xl space-y-1.5 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Cancelled</span>
                        <XCircle className="w-4 h-4 text-red-400" />
                      </div>
                      <div className="text-xl font-bold font-serif text-red-300">{metrics.cancelledOrders}</div>
                      <div className="text-[10px] text-red-500/80">Voided</div>
                    </div>

                    {/* 10. Returned Orders */}
                    <div className="bg-zinc-950/80 border border-orange-800/40 p-3.5 rounded-xl space-y-1.5 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Returned</span>
                        <RotateCcw className="w-4 h-4 text-orange-400" />
                      </div>
                      <div className="text-xl font-bold font-serif text-orange-300">{metrics.returnedOrders}</div>
                      <div className="text-[10px] text-orange-500/80">Courier Return</div>
                    </div>

                    {/* 11. COD Pending Amount */}
                    <div className="bg-zinc-950/80 border border-amber-500/50 p-3.5 rounded-xl space-y-1.5 shadow-md col-span-2 sm:col-span-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">COD Pending</span>
                        <DollarSign className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-lg font-bold font-serif text-amber-300">Rs. {metrics.codPendingAmount.toLocaleString('en-PK')}</div>
                      <div className="text-[10px] text-amber-400/80">To Collect at Doorstep</div>
                    </div>

                    {/* 12. Paid Orders */}
                    <div className="bg-zinc-950/80 border border-emerald-500/40 p-3.5 rounded-xl space-y-1.5 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Paid Orders</span>
                        <CreditCard className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-xl font-bold font-serif text-emerald-200">{metrics.paidOrders}</div>
                      <div className="text-[10px] text-emerald-400/80">Payment Received</div>
                    </div>

                    {/* 13. Unpaid Orders */}
                    <div className="bg-zinc-950/80 border border-amber-700/40 p-3.5 rounded-xl space-y-1.5 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Unpaid Orders</span>
                        <Clock className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-xl font-bold font-serif text-amber-200">{metrics.unpaidOrders}</div>
                      <div className="text-[10px] text-amber-500/80">Awaiting COD / Clear</div>
                    </div>

                  </div>

                  {/* CHARTS ROW 1: Sales Overview & Orders Overview */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sales Overview Chart */}
                    <div className="bg-zinc-950/80 border border-amber-800/30 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                        <div>
                          <h4 className="font-serif font-bold text-amber-100 text-sm flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-amber-400" />
                            <span>Sales & Revenue Overview</span>
                          </h4>
                          <p className="text-[11px] text-zinc-400">Total revenue generated over time in PKR</p>
                        </div>
                      </div>

                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={salesByDayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 11 }} />
                            <YAxis stroke="#71717a" tick={{ fontSize: 11 }} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#09090b', borderColor: '#b45309', borderRadius: '8px', color: '#fef3c7', fontSize: '12px' }}
                              formatter={(value: any) => [`Rs. ${Number(value).toLocaleString('en-PK')}`, 'Revenue']}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Orders Overview Chart */}
                    <div className="bg-zinc-950/80 border border-amber-800/30 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                        <div>
                          <h4 className="font-serif font-bold text-amber-100 text-sm flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-blue-400" />
                            <span>Orders Volume Overview</span>
                          </h4>
                          <p className="text-[11px] text-zinc-400">Number of customer orders received</p>
                        </div>
                      </div>

                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={salesByDayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 11 }} />
                            <YAxis stroke="#71717a" tick={{ fontSize: 11 }} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#09090b', borderColor: '#3b82f6', borderRadius: '8px', color: '#bfdbfe', fontSize: '12px' }}
                              formatter={(value: any) => [`${value} Orders`, 'Order Count']}
                            />
                            <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* CHARTS ROW 2: Status Distribution & COD vs Paid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Order Status Distribution Pie Chart */}
                    <div className="bg-zinc-950/80 border border-amber-800/30 p-4 rounded-xl space-y-3">
                      <div className="border-b border-zinc-800 pb-2">
                        <h4 className="font-serif font-bold text-amber-100 text-sm flex items-center gap-2">
                          <PieIcon className="w-4 h-4 text-purple-400" />
                          <span>Order Status Distribution</span>
                        </h4>
                        <p className="text-[11px] text-zinc-400">Current breakdown of active & completed orders</p>
                      </div>

                      <div className="h-64 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={statusDistributionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={55}
                              outerRadius={80}
                              paddingAngle={4}
                              dataKey="count"
                            >
                              {statusDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ backgroundColor: '#09090b', borderColor: '#8b5cf6', borderRadius: '8px', color: '#e9d5ff', fontSize: '12px' }}
                              formatter={(value: any, name: any) => [`${value} Orders`, name]}
                            />
                            <Legend wrapperStyle={{ fontSize: '11px', color: '#d4d4d8' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* COD vs Paid Orders Chart */}
                    <div className="bg-zinc-950/80 border border-amber-800/30 p-4 rounded-xl space-y-3">
                      <div className="border-b border-zinc-800 pb-2">
                        <h4 className="font-serif font-bold text-amber-100 text-sm flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-emerald-400" />
                          <span>COD vs Online Paid Comparison</span>
                        </h4>
                        <p className="text-[11px] text-zinc-400">Cash on Delivery vs Advance Payment Volume & Value</p>
                      </div>

                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={codVsPaidData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                            <XAxis dataKey="name" stroke="#71717a" tick={{ fontSize: 11 }} />
                            <YAxis stroke="#71717a" tick={{ fontSize: 11 }} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#09090b', borderColor: '#10b981', borderRadius: '8px', color: '#a7f3d0', fontSize: '12px' }}
                              formatter={(value: any, name: any) => [
                                name === 'revenue' ? `Rs. ${Number(value).toLocaleString('en-PK')}` : `${value} Orders`,
                                name === 'revenue' ? 'Total Revenue' : 'Orders Count'
                              ]}
                            />
                            <Bar dataKey="revenue" fill="#f59e0b" name="Revenue (PKR)" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: PROFESSIONAL ORDERS TABLE & DIRECTORY */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {loadingOrders ? (
                    <div className="text-center py-12 text-zinc-500 flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                      <span>Loading live customer orders directory...</span>
                    </div>
                  ) : (
                    <OrdersTable
                      orders={dateFilteredOrders}
                      onSelectOrder={(ord) => setSelectedDetailOrder(ord)}
                      onUpdateStatus={handleStatusChange}
                      onTogglePaymentStatus={handlePaymentStatusToggle}
                      onDeleteOrder={handleDeleteOrder}
                      onBulkUpdateStatus={handleBulkUpdateStatus}
                      onBulkAssignCourier={handleBulkAssignCourier}
                      onOpenPrintInvoice={(ords) => setPrintInvoiceOrders(ords)}
                      onOpenPrintPackingSlip={(ords) => setPrintPackingSlipOrders(ords)}
                      onExportCSV={handleExportCSV}
                    />
                  )}
                </div>
              )}

              {/* TAB 3: CHARTS & ANALYTICS IN-DEPTH */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Top Selling Products Ranking */}
                  <div className="bg-zinc-950/80 border border-amber-800/30 p-5 rounded-xl space-y-4">
                    <div className="border-b border-zinc-800 pb-3">
                      <h4 className="font-serif font-bold text-amber-100 text-base flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <span>Top Selling Products Ranking</span>
                      </h4>
                      <p className="text-xs text-zinc-400">Most popular leather wallets and cardholders by units sold</p>
                    </div>

                    <div className="space-y-3">
                      {topProductsData.map((item, idx) => {
                        const maxUnits = topProductsData[0]?.units || 1;
                        const percentage = Math.round((item.units / maxUnits) * 100);

                        return (
                          <div key={idx} className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-amber-100 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-[10px] font-mono">
                                  #{idx + 1}
                                </span>
                                {item.name}
                              </span>
                              <div className="text-right font-mono">
                                <span className="text-amber-300 font-bold">{item.units} units</span>
                                <span className="text-zinc-500 ml-2">Rs. {item.revenue.toLocaleString('en-PK')}</span>
                              </div>
                            </div>

                            <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                              <div
                                className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Revenue by Day Chart */}
                  <div className="bg-zinc-950/80 border border-amber-800/30 p-5 rounded-xl space-y-4">
                    <div className="border-b border-zinc-800 pb-3">
                      <h4 className="font-serif font-bold text-amber-100 text-base flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        <span>Daily Revenue Breakdown</span>
                      </h4>
                      <p className="text-xs text-zinc-400">Exact daily sales total for the selected period</p>
                    </div>

                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesByDayData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                          <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 11 }} />
                          <YAxis stroke="#71717a" tick={{ fontSize: 11 }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#09090b', borderColor: '#10b981', borderRadius: '8px', color: '#a7f3d0', fontSize: '12px' }}
                            formatter={(value: any) => [`Rs. ${Number(value).toLocaleString('en-PK')}`, 'Daily Revenue']}
                          />
                          <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PRODUCTS MANAGEMENT */}
              {activeTab === 'products' && (
                <ProductsManagement currentRole={currentRole} onRefreshOrders={fetchOrders} />
              )}

              {/* TAB: INVENTORY MANAGEMENT */}
              {activeTab === 'inventory' && (
                <InventoryManagement currentRole={currentRole} />
              )}

              {/* TAB: CUSTOMERS DIRECTORY */}
              {activeTab === 'customers' && (
                <CustomersDirectory orders={orders} />
              )}

              {/* TAB: REPORTS & ANALYTICS */}
              {activeTab === 'reports' && (
                <ReportsAnalytics orders={orders} />
              )}

              {/* TAB: DISCOUNTS & COUPONS */}
              {activeTab === 'coupons' && (
                <DiscountsCouponsView />
              )}

              {/* TAB: SHIPMENTS & TRACKING */}
              {activeTab === 'shipments' && (
                <ShipmentsTrackingView />
              )}

              {/* TAB: RETURNS & REFUNDS */}
              {activeTab === 'returns' && (
                <ReturnsRefundsView />
              )}

              {/* TAB: AUDIT & ACTIVITY LOG */}
              {activeTab === 'activity' && (
                <ActivityLogView />
              )}

              {/* TAB: STORE SETTINGS */}
              {activeTab === 'settings' && (
                <AdminSettingsView currentRole={currentRole} />
              )}

              </div>
            </div>
          )}

        {/* Global Search Modal */}
        <GlobalSearchModal
          isOpen={showGlobalSearchModal}
          onClose={() => setShowGlobalSearchModal(false)}
          orders={orders}
          onSelectOrder={(ord) => {
            setSelectedDetailOrder(ord);
            setActiveTab('orders');
          }}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      </div>

      {/* CREATE MANUAL ORDER MODAL */}
      {showAddOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-zinc-950/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-amber-800/60 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif font-bold text-amber-100 text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Create Manual Order</span>
              </h3>
              <button onClick={() => setShowAddOrderModal(false)} className="text-zinc-400 hover:text-amber-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Customer Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Usman Ali"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Phone Number (0300...) *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 03001234567"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-100 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">City *</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Multan">Multan</option>
                    <option value="Gujranwala">Gujranwala</option>
                    <option value="Sialkot">Sialkot</option>
                    <option value="Quetta">Quetta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Price (PKR) *</label>
                  <input
                    required
                    type="number"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Product Name *</label>
                <input
                  required
                  type="text"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Street Address *</label>
                <input
                  required
                  type="text"
                  placeholder="House #, Street, Area"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">Payment Method</label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-amber-100 focus:outline-none"
                  >
                    <option value="COD">Cash on Delivery</option>
                    <option value="Card">Bank Card</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="EasyPaisa">EasyPaisa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Payment Status</label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value as 'Paid' | 'Unpaid')}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-amber-100 focus:outline-none"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={creatingOrder}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold uppercase rounded-xl transition-all shadow-lg text-xs tracking-wider mt-2"
              >
                {creatingOrder ? 'Creating Order...' : 'Confirm & Save Order'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODALS FOR SHOPIFY STYLE ORDER MANAGEMENT */}
      {selectedDetailOrder && (
        <OrderDetailModal
          isOpen={true}
          order={selectedDetailOrder}
          onClose={() => setSelectedDetailOrder(null)}
          onUpdateOrder={handleUpdateSingleOrder}
          onDeleteOrder={(id) => handleDeleteOrder(id)}
          onOpenPrintInvoice={(orders) => setPrintInvoiceOrders(orders)}
          onOpenPrintPackingSlip={(orders) => setPrintPackingSlipOrders(orders)}
          onDuplicateOrder={handleDuplicateOrder}
        />
      )}

      {printInvoiceOrders.length > 0 && (
        <PrintInvoiceModal
          isOpen={true}
          orders={printInvoiceOrders}
          onClose={() => setPrintInvoiceOrders([])}
        />
      )}

      {printPackingSlipOrders.length > 0 && (
        <PrintPackingSlipModal
          isOpen={true}
          orders={printPackingSlipOrders}
          onClose={() => setPrintPackingSlipOrders([])}
        />
      )}

      {showAssignCourierModal && (
        <AssignCourierModal
          isOpen={showAssignCourierModal}
          selectedOrderIds={assignCourierOrderIds}
          onClose={() => setShowAssignCourierModal(false)}
          onAssignCourier={handlePerformAssignCourier}
        />
      )}
    </div>
  );
};
