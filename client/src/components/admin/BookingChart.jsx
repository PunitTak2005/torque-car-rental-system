import React from 'react';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Car,
  CheckSquare,
  XCircle,
  HelpCircle,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

const BookingChart = ({
  bookings = [],
  loading = false,
  error = false,
  onRetry = null
}) => {

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="bg-graphite/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl space-y-6 animate-pulse">
        <div className="space-y-2 border-b border-white/10 pb-4">
          <div className="h-4 bg-white/10 rounded w-48" />
          <div className="h-3 bg-white/5 rounded w-64" />
        </div>
        <div className="space-y-1">
          <div className="h-7 bg-white/15 rounded w-16" />
          <div className="h-3 bg-white/10 rounded w-28" />
        </div>
        <div className="space-y-4 pt-2">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="space-y-2 p-3.5 bg-asphalt/40 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center">
                <div className="h-3 bg-white/10 rounded w-32" />
                <div className="h-3 bg-white/10 rounded w-12" />
                <div className="h-3 bg-white/10 rounded w-10" />
              </div>
              <div className="h-2 bg-white/10 rounded-full w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-graphite/60 backdrop-blur-md rounded-3xl border border-rose-500/30 p-6 sm:p-7 shadow-xl space-y-4 text-center">
        <div className="w-12 h-12 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-extrabold text-chalk uppercase tracking-wider font-sans">
          UNABLE TO LOAD BOOKING ANALYTICS
        </h4>
        <p className="text-xs text-silver/70 font-sans">
          Could not sync status metrics from backend server.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-neon-accent text-asphalt font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-chalk transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RETRY ANALYTICS</span>
          </button>
        )}
      </div>
    );
  }

  const total = bookings.length;

  // Centralized status normalization
  const counts = {
    Confirmed: 0,
    Active: 0,
    Pending: 0,
    Completed: 0,
    Cancelled: 0,
    Other: 0
  };

  bookings.forEach((b) => {
    const rawStatus = (b.status || '').toString().toLowerCase().trim();
    if (rawStatus === 'confirmed') counts.Confirmed++;
    else if (rawStatus === 'active') counts.Active++;
    else if (rawStatus === 'pending') counts.Pending++;
    else if (rawStatus === 'completed') counts.Completed++;
    else if (rawStatus === 'cancelled' || rawStatus === 'canceled') counts.Cancelled++;
    else counts.Other++;
  });

  const lifecycleConfig = [
    {
      key: 'Confirmed',
      label: 'Confirmed',
      count: counts.Confirmed,
      barBg: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30',
      icon: CheckCircle2
    },
    {
      key: 'Active',
      label: 'Active Trip',
      count: counts.Active,
      barBg: 'bg-blue-500',
      textColor: 'text-blue-400',
      badgeBg: 'bg-blue-500/10 border-blue-500/30',
      icon: Car
    },
    {
      key: 'Pending',
      label: 'Pending Approval',
      count: counts.Pending,
      barBg: 'bg-amber-500',
      textColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/30',
      icon: Clock
    },
    {
      key: 'Completed',
      label: 'Completed',
      count: counts.Completed,
      barBg: 'bg-indigo-400',
      textColor: 'text-indigo-400',
      badgeBg: 'bg-indigo-500/10 border-indigo-500/30',
      icon: CheckSquare
    },
    {
      key: 'Cancelled',
      label: 'Cancelled',
      count: counts.Cancelled,
      barBg: 'bg-rose-500',
      textColor: 'text-rose-400',
      badgeBg: 'bg-rose-500/10 border-rose-500/30',
      icon: XCircle
    }
  ];

  if (counts.Other > 0) {
    lifecycleConfig.push({
      key: 'Other',
      label: 'Other / Uncategorized',
      count: counts.Other,
      barBg: 'bg-silver',
      textColor: 'text-silver',
      badgeBg: 'bg-white/10 border-white/20',
      icon: HelpCircle
    });
  }

  return (
    <div className="bg-graphite/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl space-y-5 min-w-0 w-full">
      
      {/* 1. HEADER SECTION */}
      <div className="border-b border-white/10 pb-4 space-y-1">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-neon-accent/10 border border-neon-accent/30 text-neon-accent shrink-0">
            <ClipboardList className="w-4 h-4" />
          </span>
          <h3 className="text-sm font-extrabold text-chalk uppercase tracking-wider font-display">
            BOOKING ANALYTICS & STATUS
          </h3>
        </div>
        <p className="text-xs text-silver/70 font-sans leading-normal">
          Distribution of reservations across lifecycle states
        </p>
      </div>

      {/* 2. TOTAL SUMMARY CALLOUT (Stacked Vertical Layout) */}
      <div className="flex flex-col gap-0.5 pt-1">
        <span className="text-2xl sm:text-3xl font-extrabold text-chalk font-sans tracking-tight">
          {total}
        </span>
        <span className="text-xs font-medium text-silver/70 font-sans tracking-wide">
          Total Reservations
        </span>
      </div>

      {/* 3. LIFECYCLE STATUS LIST */}
      <div className="space-y-4 pt-2">
        {lifecycleConfig.map((st) => {
          const Icon = st.icon;
          const pctNumber = total > 0 ? Math.round((st.count / total) * 100) : 0;
          const precisePct = total > 0 ? ((st.count / total) * 100).toFixed(1) : '0.0';

          return (
            <div
              key={st.key}
              className="space-y-2 p-3 sm:p-3.5 rounded-2xl bg-asphalt/70 border border-white/5 hover:border-white/20 transition-colors duration-200 group"
              title={`${st.label}: ${st.count} of ${total} bookings (${precisePct}%)`}
            >
              {/* Row: 3 Explicit Grid Columns (Name | Count | Percentage) */}
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 min-w-0">
                {/* Column 1: Status Name & Icon */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`p-1.5 rounded-lg border ${st.badgeBg} shrink-0`}>
                    <Icon className={`w-3.5 h-3.5 ${st.textColor}`} />
                  </span>
                  <span className="text-xs font-semibold text-chalk font-sans truncate">
                    {st.label}
                  </span>
                </div>

                {/* Column 2: Booking Count (Dedicated min-width container) */}
                <div className="min-w-[28px] text-right font-extrabold text-chalk font-sans text-xs">
                  {st.count}
                </div>

                {/* Column 3: Percentage (Dedicated min-width container) */}
                <div className="min-w-[42px] text-right font-extrabold text-silver/80 font-mono text-xs">
                  {pctNumber}%
                </div>
              </div>

              {/* Separate Row: Progress Bar Track */}
              <div className="w-full h-2 bg-graphite/80 rounded-full overflow-hidden border border-white/5 p-0.5">
                <div
                  style={{ width: `${pctNumber}%` }}
                  className={`h-full ${st.barBg} rounded-full transition-all duration-700 ease-out shadow-sm`}
                />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default BookingChart;
