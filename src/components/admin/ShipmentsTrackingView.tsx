import React, { useState } from 'react';
import { Truck, ExternalLink, RefreshCw, Search, CheckCircle2, AlertCircle, Clock, MapPin } from 'lucide-react';

interface Shipment {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  city: string;
  courier: string;
  trackingNumber: string;
  status: 'Booked' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Returned';
  dispatchDate: string;
  codAmount: number;
}

export const ShipmentsTrackingView: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: 'shp_1',
      orderId: 'LCPK-89241',
      customerName: 'Hamza Malik',
      phone: '03001234567',
      city: 'Lahore',
      courier: 'TCS Express',
      trackingNumber: '77291038291',
      status: 'In Transit',
      dispatchDate: '2026-08-08',
      codAmount: 5499
    },
    {
      id: 'shp_2',
      orderId: 'LCPK-89242',
      customerName: 'Usman Ali',
      phone: '03219876543',
      city: 'Karachi',
      courier: 'PostEx Courier',
      trackingNumber: 'PX-99210293',
      status: 'Out for Delivery',
      dispatchDate: '2026-08-07',
      codAmount: 8900
    },
    {
      id: 'shp_3',
      orderId: 'LCPK-89243',
      customerName: 'Ayesha Khan',
      phone: '03334567890',
      city: 'Islamabad',
      courier: 'Trax Logistics',
      trackingNumber: 'TRX-8820192',
      status: 'Delivered',
      dispatchDate: '2026-08-05',
      codAmount: 3850
    }
  ]);

  const [search, setSearch] = useState('');
  const [courierFilter, setCourierFilter] = useState('All');

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.orderId.toLowerCase().includes(search.toLowerCase()) ||
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase());

    const matchesCourier = courierFilter === 'All' || s.courier.includes(courierFilter);

    return matchesSearch && matchesCourier;
  });

  return (
    <div className="space-y-4 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950/80 p-4 rounded-xl border border-amber-800/30">
        <div>
          <h3 className="font-serif font-bold text-amber-100 text-base flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <span>Courier Dispatch & Live Shipments Tracking</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Monitor real-time courier statuses across TCS Express, PostEx, Trax & Leopards Logistics
          </p>
        </div>

        <button
          onClick={() => alert('Courier API Statuses Synced!')}
          className="p-2 bg-zinc-900 hover:bg-zinc-800 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-amber-800/40 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Sync Courier APIs</span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800 text-xs flex items-center gap-2 flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search tracking number, order ID, customer name, or destination city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-amber-100 placeholder-zinc-500 focus:outline-none w-full"
          />
        </div>

        <div className="bg-zinc-900 p-2 rounded-xl border border-zinc-800 text-xs flex items-center gap-1.5 shrink-0">
          <span className="text-zinc-400 font-semibold pl-1">Courier:</span>
          <select
            value={courierFilter}
            onChange={(e) => setCourierFilter(e.target.value)}
            className="bg-zinc-950 text-amber-200 font-bold focus:outline-none p-1 rounded border border-zinc-700"
          >
            <option value="All">All Couriers</option>
            <option value="TCS">TCS Express</option>
            <option value="PostEx">PostEx Courier</option>
            <option value="Trax">Trax Logistics</option>
            <option value="Leopards">Leopards</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-950/80 border border-amber-800/30 rounded-xl overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900 border-b border-amber-800/30 text-amber-300 font-serif font-bold uppercase text-[11px]">
            <tr>
              <th className="p-3">Order #</th>
              <th className="p-3">Customer & Destination</th>
              <th className="p-3">Courier Partner</th>
              <th className="p-3">Tracking ID</th>
              <th className="p-3">COD Amount</th>
              <th className="p-3">Shipment Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
            {filteredShipments.map((s) => (
              <tr key={s.id} className="hover:bg-zinc-900/60 transition-colors">
                <td className="p-3 font-mono font-bold text-amber-100">{s.orderId}</td>

                <td className="p-3">
                  <div className="font-bold text-amber-100">{s.customerName}</div>
                  <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-500" /> {s.city} • {s.phone}
                  </div>
                </td>

                <td className="p-3 font-semibold text-amber-200">{s.courier}</td>

                <td className="p-3 font-mono text-amber-300 font-bold">{s.trackingNumber}</td>

                <td className="p-3 font-serif font-bold text-amber-200">
                  Rs. {s.codAmount.toLocaleString('en-PK')}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      s.status === 'Delivered'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : s.status === 'Out for Delivery'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-sky-950 text-sky-300 border-sky-800'
                    }`}
                  >
                    {s.status}
                  </span>
                </td>

                <td className="p-3">
                  <a
                    href={`https://www.google.com/search?q=${s.courier}+tracking+${s.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Live Track</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
