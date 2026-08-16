import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * CarFeatures – renders a grid of feature badges.
 * Props:
 *   features: string[] – list of feature names.
 */
const CarFeatures = ({ features = [] }) => (
  <div className="space-y-4 pt-2">
    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
      Key Features
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {features.map((feat, i) => (
        <div
          key={i}
          className="flex items-center gap-2 text-xs text-slate-705 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent-500 shrink-0" />
          <span>{feat}</span>
        </div>
      ))}
    </div>
  </div>
);

export default CarFeatures;
