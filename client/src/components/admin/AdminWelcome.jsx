import React from 'react';
import { Calendar, RefreshCw } from 'lucide-react';

const AdminWelcome = ({ adminName, onRefresh, isRefreshing }) => {
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toUpperCase();

  return (
    <div className="bg-graphite text-chalk p-6 border border-white/5 relative">
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[8px] font-bold bg-neon-accent text-asphalt uppercase tracking-widest">
              TELEMETRY OPERATIONS
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[8px] text-silver font-bold uppercase tracking-widest">
              <Calendar className="w-3 h-3 text-neon-accent" /> {currentDateFormatted}
            </span>
          </div>

          <h2 className="text-xl font-bold uppercase tracking-widest text-chalk font-sans">
            Welcome back, {adminName || 'Admin'}
          </h2>
          <p className="text-xs text-silver mt-1 max-w-xl">
            Live telemetry dashboard tracking vehicle logs and global operational fleet utilization parameters.
          </p>
        </div>

        {onRefresh && (
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="px-5 py-2.5 bg-chalk text-asphalt hover:bg-neon-accent text-[9px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 inline mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'SYNCHRONIZING...' : 'SYNC OPERATIONS'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWelcome;
