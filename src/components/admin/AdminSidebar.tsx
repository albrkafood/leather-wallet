import React from 'react';
import {
  TrendingUp,
  Package,
  Box,
  CheckSquare,
  Users,
  Tag,
  Truck,
  RotateCcw,
  BarChart3,
  Clock,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Store,
  Layers
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onSelectTab: (tab: any, statusFilter?: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentRole: string;
  onLogout: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  currentRole,
  onLogout,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const handleNavClick = (tab: string, statusFilter?: string) => {
    onSelectTab(tab, statusFilter);
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: TrendingUp }
      ]
    },
    {
      title: 'ORDERS',
      items: [
        { id: 'orders', label: 'All Orders', icon: Package },
        { id: 'orders_new', label: '• New Orders', icon: Package, tab: 'orders', filter: 'New' },
        { id: 'orders_proc', label: '• Processing', icon: Package, tab: 'orders', filter: 'Processing' },
        { id: 'orders_ready', label: '• Ready to Ship', icon: Package, tab: 'orders', filter: 'Ready to Ship' },
        { id: 'orders_disp', label: '• Dispatched', icon: Package, tab: 'orders', filter: 'Dispatched' },
        { id: 'orders_del', label: '• Delivered', icon: Package, tab: 'orders', filter: 'Delivered' },
        { id: 'orders_canc', label: '• Cancelled', icon: Package, tab: 'orders', filter: 'Cancelled' },
        { id: 'orders_ret', label: '• Returned', icon: Package, tab: 'orders', filter: 'Returned' }
      ]
    },
    {
      title: 'CATALOG',
      items: [
        { id: 'products', label: 'Products', icon: Box },
        { id: 'inventory', label: 'Inventory', icon: CheckSquare }
      ]
    },
    {
      title: 'CUSTOMERS',
      items: [
        { id: 'customers', label: 'All Customers', icon: Users }
      ]
    },
    {
      title: 'SALES',
      items: [
        { id: 'coupons', label: 'Discounts & Coupons', icon: Tag }
      ]
    },
    {
      title: 'SHIPPING',
      items: [
        { id: 'shipments', label: 'Shipments & Tracking', icon: Truck },
        { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { id: 'reports', label: 'Sales & Analytics', icon: BarChart3 }
      ]
    },
    {
      title: 'AUDIT',
      items: [
        { id: 'activity', label: 'Activity Logs', icon: Clock }
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { id: 'settings', label: 'Store Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside
      className={`bg-zinc-950 border-r border-amber-800/30 flex flex-col justify-between transition-all duration-200 z-20 shrink-0 ${
        isCollapsed && !isMobileDrawer ? 'w-16' : 'w-64'
      } ${isMobileDrawer ? 'w-72 h-full' : ''}`}
    >
      {/* Top Header Logo */}
      <div className="p-4 border-b border-amber-800/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
            <Store className="w-4 h-4 text-amber-400" />
          </div>

          {(!isCollapsed || isMobileDrawer) && (
            <div>
              <h2 className="font-serif font-bold text-amber-100 text-sm whitespace-nowrap">
                LeatherCraft PK
              </h2>
              <span className="text-[9px] text-amber-400 font-sans tracking-wider uppercase font-semibold block">
                Shopify-Style Admin
              </span>
            </div>
          )}
        </div>

        {!isMobileDrawer && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 text-zinc-400 hover:text-amber-300 hover:bg-zinc-900 rounded-lg transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="p-2 flex-1 overflow-y-auto space-y-4 text-xs scrollbar-thin scrollbar-thumb-zinc-800">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {(!isCollapsed || isMobileDrawer) && (
              <h4 className="px-3 pt-2 text-[10px] font-mono font-bold text-zinc-500 tracking-wider uppercase">
                {group.title}
              </h4>
            )}

            {group.items.map((item) => {
              const targetTab = item.tab || item.id;
              const isActive = activeTab === targetTab && !item.filter;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(targetTab, item.filter)}
                  title={item.label}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    isActive
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                      : 'text-zinc-400 hover:text-amber-200 hover:bg-zinc-900'
                  } ${isCollapsed && !isMobileDrawer ? 'justify-center px-0' : ''}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-zinc-950' : 'text-amber-400'}`} />

                  {(!isCollapsed || isMobileDrawer) && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Profile Footer */}
      <div className="p-3 border-t border-amber-800/30 bg-zinc-900/60 space-y-2">
        {(!isCollapsed || isMobileDrawer) ? (
          <div className="flex items-center justify-between gap-2">
            <div className="overflow-hidden">
              <div className="font-bold text-amber-100 text-xs truncate">Super Admin</div>
              <div className="text-[10px] text-amber-400 font-semibold truncate flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{currentRole}</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-red-400 hover:bg-red-950/80 rounded-lg transition-colors shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onLogout}
            className="w-full py-2 text-red-400 hover:bg-red-950/80 rounded-lg flex justify-center"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
