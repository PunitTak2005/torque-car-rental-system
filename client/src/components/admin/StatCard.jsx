import React from 'react';

const StatCard = ({
  title,
  headerSubtitle,
  value,
  icon: Icon,
  trend,
  trendType = 'positive',
  statusDescription,
  subtitle, // Fallback for backward compatibility
  iconBgColor = 'bg-neon-accent/10 border-neon-accent/30 text-neon-accent',
  loading = false,
  error = false,
  onRetry = null,
  className = ''
}) => {
  // Skeleton Loading State
  if (loading) {
    return (
      <div className={`bg-graphite/60 backdrop-blur-md border border-white/10 p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col justify-between h-56 animate-pulse ${className}`}>
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-white/10 rounded w-28" />
            <div className="h-3 bg-white/5 rounded w-40" />
          </div>
        </div>
        <div className="my-3 border-t border-white/5" />
        <div className="h-8 bg-white/15 rounded w-44" />
        <div className="my-3 border-t border-white/5" />
        <div className="space-y-1.5">
          <div className="h-3 bg-white/10 rounded w-32" />
          <div className="h-2.5 bg-white/5 rounded w-48" />
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className={`bg-graphite/60 backdrop-blur-md border border-rose-500/30 p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col justify-between h-56 ${className}`}>
        <div className="space-y-2">
          <span className="text-xs font-semibold text-rose-400 font-sans block">{title}</span>
          <p className="text-xs text-silver/70 font-sans">Unable to load metrics</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs font-bold text-neon-accent hover:underline text-left cursor-pointer uppercase tracking-wider"
          >
            Retry Sync
          </button>
        )}
      </div>
    );
  }

  // Trend Badge Pill Styling
  const getTrendBadgeStyle = () => {
    switch (trendType) {
      case 'positive':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'negative':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-white/5 text-silver border-white/10';
    }
  };

  const finalHeaderSubtitle = headerSubtitle || (subtitle && !trend ? subtitle : null);

  return (
    <div
      className={`bg-graphite/60 backdrop-blur-md border border-white/10 p-6 sm:p-7 rounded-3xl shadow-xl hover:border-neon-accent/40 hover:shadow-2xl hover:shadow-neon-accent/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden h-full ${className}`}
    >
      {/* Subtle top accent gradient */}
      <div className="absolute top-0 right-0 w-28 h-[2px] bg-gradient-to-l from-neon-accent/60 via-neon-accent/20 to-transparent" />

      {/* 1. HEADER SECTION (Icon + Title + Subtitle) */}
      <div className="flex items-start gap-3.5">
        {Icon && (
          <div className={`p-2.5 rounded-xl border shrink-0 flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-105 ${iconBgColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-0.5">
          <h3 className="text-sm sm:text-base font-semibold text-chalk font-sans leading-tight">
            {title}
          </h3>
          {finalHeaderSubtitle && (
            <p className="text-xs text-silver/60 font-normal font-sans leading-relaxed">
              {finalHeaderSubtitle}
            </p>
          )}
        </div>
      </div>

      {/* 2. VALUE / AMOUNT SECTION */}
      <div className="py-3">
        <div className="text-2xl sm:text-3xl lg:text-[1.85rem] font-extrabold text-chalk font-sans tracking-tight leading-none group-hover:text-neon-accent transition-colors duration-200 break-words">
          {value}
        </div>
      </div>

      {/* 3. DIVIDER LINE */}
      <div className="border-t border-white/10 w-full my-1" />

      {/* 4. BOTTOM STATUS / TREND SECTION */}
      {(trend || statusDescription) && (
        <div className="pt-2 space-y-1">
          {trend && (
            <div className="inline-flex items-center gap-1.5">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getTrendBadgeStyle()}`}>
                {trend}
              </span>
            </div>
          )}

          {statusDescription && (
            <p className="text-[11px] text-silver/60 font-normal font-sans leading-normal">
              {statusDescription}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
