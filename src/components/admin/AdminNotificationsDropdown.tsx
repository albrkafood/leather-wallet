import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, ShoppingBag, CreditCard, AlertTriangle, XCircle, RotateCcw, Truck, ExternalLink } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  timestamp: string;
  read: boolean;
  linkOrder?: string;
}

interface AdminNotificationsDropdownProps {
  onSelectOrder?: (orderId: string) => void;
}

export const AdminNotificationsDropdown: React.FC<AdminNotificationsDropdownProps> = ({ onSelectOrder }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifs = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      const data = await res.json();
      if (res.ok && data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 20000); // Poll every 20s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/admin/notifications/mark-read', { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    try {
      await fetch('/api/admin/notifications', { method: 'DELETE' });
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'New Order':
        return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
      case 'Payment Received':
        return <CreditCard className="w-4 h-4 text-amber-400" />;
      case 'Low Stock':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'Order Cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'Return Requested':
        return <RotateCcw className="w-4 h-4 text-orange-400" />;
      default:
        return <Truck className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-zinc-900 hover:bg-zinc-800 text-amber-300 rounded-xl border border-amber-800/40 transition-all"
        title="Admin Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse border border-zinc-900 shadow">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-900 border border-amber-800/60 rounded-2xl shadow-2xl z-50 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h4 className="font-serif font-bold text-amber-100 text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Admin System Alerts ({unreadCount} New)</span>
            </h4>

            <div className="flex items-center gap-2 text-[11px]">
              <button
                onClick={handleMarkAllRead}
                className="text-amber-300 hover:underline flex items-center gap-1 font-semibold"
              >
                <Check className="w-3 h-3" /> Mark Read
              </button>
              <button
                onClick={handleClearAll}
                className="text-red-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 text-xs">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${
                    n.read
                      ? 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                      : 'bg-amber-950/30 border-amber-800/50 text-amber-100 font-semibold shadow'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{getTypeIcon(n.type)}</div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-200">{n.title}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-tight">{n.message}</p>

                    {n.linkOrder && onSelectOrder && (
                      <button
                        onClick={() => {
                          onSelectOrder(n.linkOrder!);
                          setIsOpen(false);
                        }}
                        className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 mt-1 font-bold"
                      >
                        <span>View Order #{n.linkOrder}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
