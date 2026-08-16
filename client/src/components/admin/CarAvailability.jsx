import React from 'react';
import { Car, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

const CarAvailability = ({ cars = [], onManageCars }) => {
  const total = cars.length;
  const available = cars.filter(c => c.availability).length;
  const rented = cars.filter(c => !c.availability).length;

  return (
    <div className="bg-graphite/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-neon-accent/10 border border-neon-accent/30 text-neon-accent">
              <Car className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-extrabold text-chalk uppercase tracking-wider font-display">
              FLEET AVAILABILITY STATUS
            </h3>
          </div>
          <p className="text-xs text-silver/70">
            Realtime vehicle status and deployment metrics
          </p>
        </div>

        {onManageCars && (
          <button
            onClick={onManageCars}
            className="px-3.5 py-1.5 rounded-xl bg-asphalt text-neon-accent border border-white/10 font-bold text-xs hover:bg-stone/10 transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <span>Manage Cars</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Status Counters Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-extrabold mb-1 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" /> Available Cars
          </div>
          <span className="text-3xl font-extrabold text-chalk">
            {available}
          </span>
          <span className="text-[9px] font-bold text-emerald-400/80 block mt-1 uppercase tracking-wider">
            Ready for instant dispatch
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-extrabold mb-1 uppercase tracking-wider">
            <Clock className="w-4 h-4" /> Currently Rented
          </div>
          <span className="text-3xl font-extrabold text-chalk">
            {rented}
          </span>
          <span className="text-[9px] font-bold text-blue-400/80 block mt-1 uppercase tracking-wider">
            Active on customer trips
          </span>
        </div>
      </div>

      {/* Fleet Capacity Progress Bar */}
      <div className="p-4 rounded-2xl bg-asphalt/80 border border-white/10 space-y-3">
        <div className="flex justify-between items-center text-xs uppercase font-extrabold tracking-wider">
          <span className="text-silver/80">
            Total Fleet Capacity
          </span>
          <span className="text-neon-accent">
            {total} Vehicles Registered
          </span>
        </div>

        {total > 0 && (
          <div className="h-3 w-full bg-asphalt rounded-full overflow-hidden flex border border-white/10 p-0.5">
            <div
              style={{ width: `${(available / total) * 100}%` }}
              className="bg-emerald-500 h-full rounded-l-full"
              title={`Available: ${available}`}
            />
            <div
              style={{ width: `${(rented / total) * 100}%` }}
              className="bg-blue-500 h-full rounded-r-full"
              title={`Rented: ${rented}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CarAvailability;
