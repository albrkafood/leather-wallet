import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Download, Printer, FileSpreadsheet, DollarSign, ShoppingBag, Truck, AlertOctagon, RotateCcw, PieChart, Layers } from 'lucide-react';
import { OrderRecord } from '../../server/apiRouter';

interface ReportsAnalyticsProps {
  orders: OrderRecord[];
}

export const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({ orders }) => {
  const [reportType, setReportType] = useState<
    'sales' | 'orders' | 'products' | 'customers' | 'cod' | 'courier' | 'cancelled' | 'returned' | 'profit'
  >('sales');

  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Filter orders by date range
  const now = new Date();
  const filteredOrders = orders.filter((ord) => {
    const oDate = new Date(ord.createdAt);
    if (dateRange === 'today') {
      return oDate.toDateString() === now.toDateString();
    }
    if (dateRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return oDate >= weekAgo;
    }
    if (dateRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return oDate >= monthAgo;
    }
    return true;
  });

  // Export functions
  const exportCSV = (excelMode = false) => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];

    if (reportType === 'sales' || reportType === 'orders' || reportType === 'cod' || reportType === 'cancelled' || reportType === 'returned') {
      headers = ['Order ID', 'Tracking Number', 'Date', 'Customer', 'City', 'Total (PKR)', 'Payment Method', 'Payment Status', 'Order Status', 'Courier'];
      rows = filteredOrders.map((o) => [
        o.id,
        o.trackingNumber,
        new Date(o.createdAt).toLocaleString('en-PK'),
        o.shipping?.fullName || '',
        o.shipping?.city || '',
        o.total,
        o.paymentMethod,
        o.paymentStatus,
        o.status,
        o.courierName
      ]);
    } else if (reportType === 'profit') {
      headers = ['Order ID', 'Date', 'Customer', 'Revenue (PKR)', 'Estimated Cost (PKR)', 'Net Profit (PKR)', 'Profit Margin %'];
      rows = filteredOrders.map((o) => {
        const estCost = Math.round(o.total * 0.42); // Average leather manufacturing cost ~42%
        const profit = o.total - estCost;
        const margin = Math.round((profit / (o.total || 1)) * 100);
        return [o.id, new Date(o.createdAt).toLocaleString('en-PK'), o.shipping?.fullName || '', o.total, estCost, profit, `${margin}%`];
      });
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LeatherCraft_${reportType}_report_${dateRange}.${excelMode ? 'xls' : 'csv'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics computation
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const totalOrdersCount = filteredOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const codOrders = filteredOrders.filter((o) => o.paymentMethod === 'COD');
  const codTotal = codOrders.reduce((sum, o) => sum + o.total, 0);
  const cancelledOrders = filteredOrders.filter((o) => o.status === 'Cancelled');
  const returnedOrders = filteredOrders.filter((o) => o.status === 'Returned');
  const estTotalCost = Math.round(totalRevenue * 0.42);
  const netProfitTotal = totalRevenue - estTotalCost;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950/80 p-4 rounded-xl border border-amber-800/30">
        <div>
          <h3 className="font-serif font-bold text-amber-100 text-base flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span>Financial Reports & Analytics Center</span>
          </h3>
          <p className="text-xs text-zinc-400">Export financial summaries, sales reports, courier performance, COD logs & net profit statements</p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCSV(false)}
            className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border border-emerald-800/60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => exportCSV(true)}
            className="bg-emerald-700 hover:bg-emerald-600 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={() => window.print()}
            className="bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border border-amber-800/40"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center gap-2 bg-zinc-900 p-2.5 rounded-xl border border-zinc-800 text-xs">
        <Calendar className="w-4 h-4 text-amber-400 ml-1" />
        <span className="font-bold text-amber-200">Date Range Filter:</span>

        <div className="flex items-center gap-1">
          {(['all', 'today', 'week', 'month'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-3 py-1 rounded-md font-bold uppercase text-[10px] transition-all ${
                dateRange === r ? 'bg-amber-500 text-zinc-950 shadow' : 'text-zinc-400 hover:text-amber-300 bg-zinc-950'
              }`}
            >
              {r === 'all' ? 'All Time' : r === 'today' ? 'Today' : r === 'week' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Report Type Selector Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
        <button
          onClick={() => setReportType('sales')}
          className={`p-3 rounded-xl border font-bold text-left transition-all flex flex-col justify-between ${
            reportType === 'sales' ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg' : 'bg-zinc-950 text-amber-200 border-zinc-800 hover:border-amber-800'
          }`}
        >
          <TrendingUp className="w-4 h-4 mb-1" />
          <span>Sales Report</span>
        </button>

        <button
          onClick={() => setReportType('orders')}
          className={`p-3 rounded-xl border font-bold text-left transition-all flex flex-col justify-between ${
            reportType === 'orders' ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg' : 'bg-zinc-950 text-amber-200 border-zinc-800 hover:border-amber-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4 mb-1" />
          <span>Orders Report</span>
        </button>

        <button
          onClick={() => setReportType('cod')}
          className={`p-3 rounded-xl border font-bold text-left transition-all flex flex-col justify-between ${
            reportType === 'cod' ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg' : 'bg-zinc-950 text-amber-200 border-zinc-800 hover:border-amber-800'
          }`}
        >
          <DollarSign className="w-4 h-4 mb-1" />
          <span>COD Report</span>
        </button>

        <button
          onClick={() => setReportType('courier')}
          className={`p-3 rounded-xl border font-bold text-left transition-all flex flex-col justify-between ${
            reportType === 'courier' ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg' : 'bg-zinc-950 text-amber-200 border-zinc-800 hover:border-amber-800'
          }`}
        >
          <Truck className="w-4 h-4 mb-1" />
          <span>Courier Report</span>
        </button>

        <button
          onClick={() => setReportType('profit')}
          className={`p-3 rounded-xl border font-bold text-left transition-all flex flex-col justify-between ${
            reportType === 'profit' ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg' : 'bg-zinc-950 text-amber-200 border-zinc-800 hover:border-amber-800'
          }`}
        >
          <PieChart className="w-4 h-4 mb-1" />
          <span>Profit Statement</span>
        </button>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-zinc-950 p-4 rounded-xl border border-amber-800/30">
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Total Sales Revenue</div>
          <div className="font-mono text-xl font-bold text-amber-300 mt-1">Rs. {totalRevenue.toLocaleString('en-PK')}</div>
        </div>

        <div className="bg-zinc-950 p-4 rounded-xl border border-amber-800/30">
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Total Orders Count</div>
          <div className="font-mono text-xl font-bold text-amber-300 mt-1">{totalOrdersCount}</div>
        </div>

        <div className="bg-zinc-950 p-4 rounded-xl border border-amber-800/30">
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Average Order Value</div>
          <div className="font-mono text-xl font-bold text-amber-300 mt-1">Rs. {avgOrderValue.toLocaleString('en-PK')}</div>
        </div>

        <div className="bg-zinc-950 p-4 rounded-xl border border-emerald-800/40">
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Estimated Net Profit</div>
          <div className="font-mono text-xl font-bold text-emerald-400 mt-1">Rs. {netProfitTotal.toLocaleString('en-PK')}</div>
        </div>
      </div>

      {/* Detailed Data Table */}
      <div className="bg-zinc-950/80 border border-amber-800/30 rounded-xl overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900 border-b border-amber-800/30 text-amber-300 font-serif font-bold uppercase text-[11px]">
            <tr>
              <th className="p-3">Order ID / Date</th>
              <th className="p-3">Customer & City</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3 text-right">Revenue (PKR)</th>
              {reportType === 'profit' && (
                <>
                  <th className="p-3 text-right">Cost Price (Est)</th>
                  <th className="p-3 text-right">Net Profit</th>
                  <th className="p-3 text-center">Margin %</th>
                </>
              )}
              <th className="p-3">Order Status</th>
              <th className="p-3">Courier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
            {filteredOrders.map((o) => {
              const estCost = Math.round(o.total * 0.42);
              const profit = o.total - estCost;
              const margin = Math.round((profit / (o.total || 1)) * 100);

              return (
                <tr key={o.id} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="p-3">
                    <div className="font-mono font-bold text-amber-300">#{o.trackingNumber}</div>
                    <div className="text-[10px] text-zinc-400">{new Date(o.createdAt).toLocaleString('en-PK')}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-bold text-amber-100">{o.shipping?.fullName}</div>
                    <div className="text-[10px] text-zinc-400">{o.shipping?.city}</div>
                  </td>

                  <td className="p-3 font-semibold text-zinc-300">{o.paymentMethod} ({o.paymentStatus})</td>

                  <td className="p-3 text-right font-mono font-bold text-amber-300">
                    Rs. {o.total.toLocaleString('en-PK')}
                  </td>

                  {reportType === 'profit' && (
                    <>
                      <td className="p-3 text-right font-mono text-zinc-400">Rs. {estCost.toLocaleString('en-PK')}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400">Rs. {profit.toLocaleString('en-PK')}</td>
                      <td className="p-3 text-center font-mono font-bold text-emerald-300">{margin}%</td>
                    </>
                  )}

                  <td className="p-3 font-bold text-amber-200">{o.status}</td>
                  <td className="p-3 text-zinc-400">{o.courierName}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
