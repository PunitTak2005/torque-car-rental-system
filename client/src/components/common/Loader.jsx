import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ message = 'Loading...', size = 'w-8 h-8' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <Loader2 className={`animate-spin text-accent-600 ${size}`} />
      {message && <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">{message}</p>}
    </div>
  );
};

export default Loader;
