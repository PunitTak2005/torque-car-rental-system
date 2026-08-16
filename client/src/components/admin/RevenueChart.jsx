import React, { useState } from 'react';
import { TrendingUp, IndianRupee, Calendar } from 'lucide-react';

const RevenueChart = ({ monthlyStats = [], totalRevenue = 0 }) => {
  const [timeRange, setTimeRange] = useState('6 Months');

  // Filter or scale stats based on time range selection
  const getFilteredData = () => {
    if (!monthlyStats || monthlyStats.length === 0) return [];
    if (timeRange === '7 Days') {
      return monthlyStats.slice(-1).map(item => ({ ...item, month: 'This Week' }));
    }
    if (timeRange === '30 Days') {
      return monthlyStats.slice(-1);
    }
    if (timeRange === '3 Months') {
      return monthlyStats.slice(-3);
    }
    if (timeRange === '1 Year') {
      return monthlyStats;
    }
    return monthlyStats; // Default 6 Months
  };

  const displayData = getFilteredData();
  const maxRevenue = Math.max(...displayData.map(item => item.revenue || 0), 100);

  return (
    <div className="bg-graphite/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
      
      {/* Chart Header & Time Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-neon-accent/10 border border-neon-accent/30 text-neon-accent">
              <IndianRupee className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-extrabold text-chalk uppercase tracking-wider font-display">
              REVENUE ANALYTICS
            </h3>
          </div>
          <p className="text-xs text-silver/70">
            Financial performance & rental booking revenue trends
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-silver/60 hidden sm:inline-block" />
          <div className="inline-flex bg-asphalt/80 p-1 rounded-2xl border border-white/10 text-xs">
            {['7 Days', '30 Days', '3 Months', '6 Months', '1 Year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  timeRange === range
                    ? 'bg-neon-accent text-asphalt shadow-md shadow-neon-accent/20 font-extrabold'
                    : 'text-silver hover:text-chalk hover:bg-white/5'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Total Metric Bar */}
      <div className="bg-asphalt/80 p-5 rounded-2xl border border-white/10 flex items-center justify-between">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-silver/70 block">
            TOTAL REVENUE COLLECTED
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-neon-accent font-sans mt-0.5">
            ₹{totalRevenue.toLocaleString()}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-xl uppercase tracking-wider">
          <TrendingUp className="w-4 h-4" />
          <span>Verified Ledger</span>
        </div>
      </div>

      {/* Dynamic Bar Chart Display */}
      {displayData.length === 0 ? (
        <div className="h-56 flex flex-col items-center justify-center text-silver/60 text-xs italic bg-asphalt/40 rounded-2xl border border-dashed border-white/10">
          No revenue metrics recorded for this timeframe.
        </div>
      ) : (
        <div className="pt-4">
          <div className="h-60 flex items-end justify-between gap-3 sm:gap-6 border-b border-white/10 pb-2">
            {displayData.map((item, idx) => {
              const heightPercent = Math.max((item.revenue / maxRevenue) * 100, 8);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end relative">
                  
                  {/* Hover Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 bg-asphalt border border-white/20 text-chalk text-[10px] font-extrabold px-3 py-1.5 rounded-xl transition-all duration-200 absolute -top-10 shadow-2xl z-20 pointer-events-none whitespace-nowrap">
                    ₹{item.revenue.toLocaleString()} ({item.bookings} bookings)
                  </div>

                  {/* Gradient Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-neon-accent/40 to-neon-accent rounded-t-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-neon-accent/30 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Month Label */}
                  <span className="text-[10px] font-extrabold text-silver/70 uppercase select-none mt-2 truncate max-w-full">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
