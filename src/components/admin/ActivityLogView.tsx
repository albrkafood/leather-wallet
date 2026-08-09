import React, { useState, useEffect } from 'react';
import { History, Shield, Search, RefreshCw, UserCheck, Clock, FileText, CheckCircle2 } from 'lucide-react';

interface ActivityLog {
  id: string;
  adminName: string;
  role: string;
  action: string;
  target: string;
  details: string;
  date: string;
}

export const ActivityLogView: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/activity-logs');
      const data = await res.json();
      if (res.ok && data.success) {
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to load activity logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.adminName?.toLowerCase().includes(search.toLowerCase()) ||
      l.action?.toLowerCase().includes(search.toLowerCase()) ||
      l.target?.toLowerCase().includes(search.toLowerCase()) ||
      l.details?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950/80 p-4 rounded-xl border border-amber-800/30">
        <div>
          <h3 className="font-serif font-bold text-amber-100 text-base flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <span>Admin Audit Trail & Activity Logs</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Immutable log of all administrative actions, status updates, inventory changes & order edits
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="p-2 bg-zinc-900 hover:bg-zinc-800 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-amber-800/40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          <span>Refresh Audit Logs</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-xs flex items-center gap-2">
        <Search className="w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search admin name, action, target order or details..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-amber-100 placeholder-zinc-500 focus:outline-none w-full"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-zinc-950/80 border border-amber-800/30 rounded-xl overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900 border-b border-amber-800/30 text-amber-300 font-serif font-bold uppercase text-[11px]">
            <tr>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Admin User & Role</th>
              <th className="p-3">Action</th>
              <th className="p-3">Target Object</th>
              <th className="p-3">Activity Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">
                  No activity log entries found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="p-3 font-mono text-zinc-400 text-[11px] whitespace-nowrap">
                    {new Date(l.date).toLocaleString('en-PK')}
                  </td>

                  <td className="p-3">
                    <div className="font-bold text-amber-100">{l.adminName}</div>
                    <div className="text-[10px] text-amber-400 font-semibold">{l.role}</div>
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/50">
                      {l.action}
                    </span>
                  </td>

                  <td className="p-3 font-mono font-bold text-amber-200">{l.target}</td>

                  <td className="p-3 text-zinc-300">{l.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
