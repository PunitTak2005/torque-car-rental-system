import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Breadcrumbs = () => {
  return (
    <div className="flex items-center gap-2">
      <Link
        to="/cars"
        className="inline-flex items-center gap-2 px-4 py-2 bg-graphite/60 border border-white/10 rounded-xl text-xs font-bold text-silver hover:text-chalk hover:border-neon-accent transition-all uppercase tracking-wider shadow-sm group"
      >
        <ArrowLeft className="w-4 h-4 text-neon-accent transition-transform group-hover:-translate-x-1" />
        <span>Back to Fleet</span>
      </Link>
    </div>
  );
};

export default Breadcrumbs;
