import React from 'react';

/* ─── Shimmer box utility ─── */
const ShimmerBox = ({ className = '' }) => (
  <div className={`animate-shimmer rounded ${className}`} />
);

export const CarCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-750 overflow-hidden shadow-sm flex flex-col h-full">
      {/* Image Skeleton */}
      <ShimmerBox className="aspect-[16/10] w-full rounded-none" />

      {/* Details Skeleton */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <ShimmerBox className="h-3 w-16 mb-2" />
            <ShimmerBox className="h-5 w-3/4" />
          </div>
          <ShimmerBox className="h-6 rounded-lg w-12 shrink-0" />
        </div>

        <div className="grid grid-cols-3 gap-2 border-y border-slate-100 dark:border-slate-750 py-3 my-1">
          <ShimmerBox className="h-8" />
          <ShimmerBox className="h-8" />
          <ShimmerBox className="h-8" />
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <ShimmerBox className="h-3 w-16 mb-1.5" />
            <ShimmerBox className="h-6 w-20" />
          </div>
          <div className="flex gap-2">
            <ShimmerBox className="h-9 rounded-xl w-16" />
            <ShimmerBox className="h-9 rounded-xl w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-750 h-24 overflow-hidden">
            <ShimmerBox className="h-4 w-20 mb-3" />
            <ShimmerBox className="h-7 w-14" />
          </div>
        ))}
      </div>
      
      {/* Big Chart and Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-750 h-80 overflow-hidden">
          <ShimmerBox className="h-5 w-32 mb-4" />
          <ShimmerBox className="h-48 w-full" />
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-750 h-80 overflow-hidden">
          <ShimmerBox className="h-5 w-28 mb-4" />
          {[...Array(4)].map((_, i) => (
            <ShimmerBox key={i} className="h-10 w-full mb-3" />
          ))}
        </div>
      </div>
    </div>
  );
};

export const AdminSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-750 h-24 overflow-hidden">
            <ShimmerBox className="h-4 w-20 mb-3" />
            <ShimmerBox className="h-7 w-14" />
          </div>
        ))}
      </div>
      
      {/* Grid: Charts + Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-750 h-80 overflow-hidden">
          <ShimmerBox className="h-5 w-32 mb-4" />
          <ShimmerBox className="h-52 w-full" />
        </div>
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-750 h-80 overflow-hidden">
          <ShimmerBox className="h-5 w-28 mb-4" />
          {[...Array(4)].map((_, i) => (
            <ShimmerBox key={i} className="h-12 w-full mb-3" />
          ))}
        </div>
      </div>
    </div>
  );
};

export const CarDetailsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 h-96 border border-slate-100 dark:border-slate-800 overflow-hidden">
          <ShimmerBox className="h-full w-full rounded-2xl" />
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 h-48 border border-slate-100 dark:border-slate-800 overflow-hidden">
          <ShimmerBox className="h-5 w-40 mb-4" />
          <ShimmerBox className="h-3 w-full mb-2" />
          <ShimmerBox className="h-3 w-4/5 mb-2" />
          <ShimmerBox className="h-3 w-3/5" />
        </div>
      </div>
      <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 h-80 border border-slate-100 dark:border-slate-800 overflow-hidden">
        <ShimmerBox className="h-5 w-24 mb-4" />
        <ShimmerBox className="h-8 w-28 mb-6" />
        <ShimmerBox className="h-12 w-full mb-3" />
        <ShimmerBox className="h-12 w-full mb-3" />
        <ShimmerBox className="h-12 w-full" />
      </div>
    </div>
  );
};
