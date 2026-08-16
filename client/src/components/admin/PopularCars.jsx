import React from 'react';
import { Award, Flame } from 'lucide-react';

const PopularCars = ({ popularCars = [] }) => {
  return (
    <div className="bg-graphite/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Flame className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-extrabold text-chalk uppercase tracking-wider font-display">
              POPULAR VEHICLES
            </h3>
          </div>
          <p className="text-xs text-silver/70">
            Top demand cars based on reservation volume
          </p>
        </div>
      </div>

      {popularCars.length === 0 ? (
        <div className="py-8 text-center text-silver/60 text-xs italic bg-asphalt/40 rounded-2xl border border-dashed border-white/10 uppercase tracking-widest">
          No rental volume metrics recorded yet.
        </div>
      ) : (
        <div className="divide-y divide-white/10">
          {popularCars.map((item, idx) => {
            const car = item.car;
            if (!car) return null;

            return (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-xs text-silver/60 w-5">
                    #{idx + 1}
                  </span>

                  {car.images?.[0] ? (
                    <img
                      src={car.images[0]}
                      alt={`${car.brand} ${car.model}`}
                      className="w-14 aspect-[16/10] rounded-xl object-cover border border-white/10 shrink-0 bg-asphalt"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'; }}
                    />
                  ) : (
                    <div className="w-14 aspect-[16/10] rounded-xl bg-asphalt border border-white/10 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 text-silver" />
                    </div>
                  )}

                  <div>
                    <h4 className="font-extrabold text-xs text-chalk uppercase font-display">
                      {car.brand} {car.model}
                    </h4>
                    <span className="text-[10px] font-bold text-silver/70 block uppercase tracking-wider">
                      {car.category} &bull; <span className="text-neon-accent font-extrabold">₹{car.pricePerDay?.toLocaleString()}/day</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 bg-asphalt text-neon-accent border border-white/10 font-extrabold text-xs rounded-xl inline-block uppercase tracking-wider">
                    {item.bookingsCount} bookings
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PopularCars;
