import React from 'react';
import { Star, MapPin, CheckCircle, XCircle } from 'lucide-react';

/**
 * CarHeader – displays primary car information.
 * Props:
 *   car: object containing brand, model, category, rating, numReviews, location, availability.
 */
const CarHeader = ({ car }) => {
  const { brand, model, category, rating, numReviews, location, isAvailable } = car;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
      <div className="flex justify-between items-start gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest bg-accent-50 dark:bg-accent-950/20 text-accent-700 dark:text-accent-400 px-2.5 py-1 rounded-full">
            {category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2.5">
            {brand} {model}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Available in: <strong>{Array.isArray(location) ? 'All Major Cities' : location}</strong></span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/20 px-3 py-1.5 rounded-xl text-amber-700 dark:text-amber-400 font-bold text-sm">
            <Star className="w-4 h-4 fill-current text-amber-500" />
            <span>{rating?.toFixed(1) || '0.0'}</span>
            <span className="text-xs font-medium">({numReviews} Reviews)</span>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold ${isAvailable ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400'} `}>
            {isAvailable ? (
              <><CheckCircle className="w-4 h-4" /> Available</>
            ) : (
              <><XCircle className="w-4 h-4" /> Unavailable</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarHeader;
