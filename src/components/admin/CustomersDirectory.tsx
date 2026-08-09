import React, { useState } from 'react';
import { Users, Search, Filter, Phone, Mail, MapPin, ShoppingBag, DollarSign, Calendar, ChevronRight, X, Star, ShieldCheck, UserCheck } from 'lucide-react';
import { OrderRecord } from '../../server/apiRouter';

interface CustomersDirectoryProps {
  orders: OrderRecord[];
}

interface CustomerGroup {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  isVip: boolean;
  customerOrders: OrderRecord[];
}

export const CustomersDirectory: React.FC<CustomersDirectoryProps> = ({ orders }) => {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerGroup | null>(null);

  // Group orders by customer phone / email
  const customerMap: { [key: string]: CustomerGroup } = {};

  orders.forEach((ord) => {
    const phoneKey = ord.shipping?.phone || ord.shipping?.email || ord.shipping?.fullName || 'unknown';
    if (!customerMap[phoneKey]) {
      customerMap[phoneKey] = {
        fullName: ord.shipping?.fullName || 'Valued Customer',
        email: ord.shipping?.email || 'N/A',
        phone: ord.shipping?.phone || 'N/A',
        city: ord.shipping?.city || 'Lahore',
        address: ord.shipping?.address || 'N/A',
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: ord.createdAt,
        isVip: false,
        customerOrders: []
      };
    }

    const c = customerMap[phoneKey];
    c.totalOrders += 1;
    if (ord.status !== 'Cancelled') {
      c.totalSpent += ord.total || 0;
    }
    c.customerOrders.push(ord);

    if (new Date(ord.createdAt) > new Date(c.lastOrderDate)) {
      c.lastOrderDate = ord.createdAt;
    }

    if (c.totalSpent >= 10000 || c.totalOrders >= 2) {
      c.isVip = true;
    }
  });

  const customerList = Object.values(customerMap);

  // Filters
  const filteredCustomers = customerList.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());

    const matchesCity = cityFilter === 'All' || c.city === cityFilter;
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'VIP' && c.isVip) ||
      (statusFilter === 'Repeat' && c.totalOrders > 1);

    return matchesSearch && matchesCity && matchesStatus;
  });

  const uniqueCities = Array.from(new Set(customerList.map((c) => c.city))).filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950/80 p-4 rounded-xl border border-amber-800/30">
        <div>
          <h3 className="font-serif font-bold text-amber-100 text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Customer Directory & Lifetime Value Analytics</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Total Unique Customers: <span className="font-bold text-amber-300">{customerList.length}</span> • VIP Customers: <span className="font-bold text-amber-300">{customerList.filter(c => c.isVip).length}</span>
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-80 bg-zinc-950 border border-zinc-700/60 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search name, phone, email or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-amber-100 placeholder-zinc-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-700/60 px-2.5 py-1.5 rounded-lg">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-zinc-400">City:</span>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-transparent text-amber-100 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-zinc-900">All Cities</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city} className="bg-zinc-900">{city}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-700/60 px-2.5 py-1.5 rounded-lg">
            <span className="text-zinc-400">Segment:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-amber-100 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-zinc-900">All Customers</option>
              <option value="VIP" className="bg-zinc-900">VIP (Spent Rs 10k+)</option>
              <option value="Repeat" className="bg-zinc-900">Repeat Buyers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-zinc-950/80 border border-amber-800/30 rounded-xl overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900 border-b border-amber-800/30 text-amber-300 font-serif font-bold uppercase text-[11px]">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Phone & Email</th>
              <th className="p-3">City</th>
              <th className="p-3 text-center">Total Orders</th>
              <th className="p-3 text-right">Total Lifetime Spent</th>
              <th className="p-3">Last Order Date</th>
              <th className="p-3">Segment</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-zinc-500">
                  No customers found matching search filter.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="p-3 font-bold text-amber-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-950 border border-amber-800/60 flex items-center justify-center font-bold text-amber-300 text-xs">
                        {c.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span>{c.fullName}</span>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="font-mono text-emerald-400 font-semibold flex items-center gap-1">
                      <Phone className="w-3 h-3 text-zinc-400" /> {c.phone}
                    </div>
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-zinc-500" /> {c.email}
                    </div>
                  </td>

                  <td className="p-3 text-zinc-300">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-500" /> {c.city}
                    </span>
                  </td>

                  <td className="p-3 text-center font-mono font-bold text-amber-300">
                    {c.totalOrders} order{c.totalOrders > 1 ? 's' : ''}
                  </td>

                  <td className="p-3 text-right font-mono font-bold text-amber-300 text-sm">
                    Rs. {c.totalSpent.toLocaleString('en-PK')}
                  </td>

                  <td className="p-3 text-zinc-400 font-mono text-[11px]">
                    {new Date(c.lastOrderDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>

                  <td className="p-3">
                    {c.isVip ? (
                      <span className="px-2 py-0.5 text-[10px] bg-amber-950 text-amber-300 border border-amber-800/60 rounded-full font-bold flex items-center gap-1 w-fit">
                        <Star className="w-3 h-3 fill-amber-400" /> VIP Client
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-700 rounded-full font-semibold">
                        Standard
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-amber-300 rounded border border-amber-800/40 text-xs font-semibold flex items-center gap-1 ml-auto"
                    >
                      <span>View Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CUSTOMER PROFILE MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-zinc-950/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-amber-800/60 w-full max-w-2xl rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-zinc-950 font-bold text-lg flex items-center justify-center">
                  {selectedCustomer.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-amber-100 text-lg flex items-center gap-2">
                    <span>{selectedCustomer.fullName}</span>
                    {selectedCustomer.isVip && <Star className="w-4 h-4 fill-amber-400 text-amber-400" />}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    {selectedCustomer.city} • {selectedCustomer.phone}
                  </p>
                </div>
              </div>

              <button onClick={() => setSelectedCustomer(null)} className="text-zinc-400 hover:text-amber-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lifetime Summary */}
            <div className="grid grid-cols-3 gap-3 bg-zinc-950 p-4 rounded-xl border border-amber-800/30 text-center">
              <div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Total Orders</div>
                <div className="font-mono text-lg font-bold text-amber-300">{selectedCustomer.totalOrders}</div>
              </div>

              <div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Lifetime Spent</div>
                <div className="font-mono text-lg font-bold text-amber-300">Rs. {selectedCustomer.totalSpent.toLocaleString('en-PK')}</div>
              </div>

              <div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Address</div>
                <div className="text-xs text-zinc-300 line-clamp-1">{selectedCustomer.address}</div>
              </div>
            </div>

            {/* Complete Order History */}
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-amber-300 text-sm flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4" /> Order History ({selectedCustomer.customerOrders.length})
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedCustomer.customerOrders.map((ord) => (
                  <div key={ord.id} className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-mono font-bold text-amber-300">#{ord.trackingNumber}</div>
                      <div className="text-[10px] text-zinc-400">{new Date(ord.createdAt).toLocaleString('en-PK')}</div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-amber-100">Rs. {ord.total.toLocaleString('en-PK')} ({ord.paymentMethod})</div>
                      <div className="text-[10px] font-bold text-emerald-400">{ord.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
