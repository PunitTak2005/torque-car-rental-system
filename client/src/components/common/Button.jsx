import React from 'react';

const Button = ({
  children,
  type = 'button',
  loading = false,
  disabled = false,
  variant = 'primary', // 'primary', 'secondary', 'danger', 'outline', 'ghost', 'text'
  size = 'md', // 'sm', 'md', 'lg'
  className = '',
  showArrow = null,
  noArrow = false,
  onClick,
  ...props
}) => {
  let baseStyle = 'inline-flex items-center justify-between gap-3 font-bold tracking-[0.2em] uppercase transition-all duration-200 ease-out cursor-pointer focus:outline-none select-none rounded-xl border font-sans relative overflow-hidden group active:scale-[0.98]';
  
  let sizeStyle = '';
  switch (size) {
    case 'sm':
      sizeStyle = 'px-4 py-2 text-[9px]';
      break;
    case 'lg':
      sizeStyle = 'px-9 py-4 text-[11px]';
      break;
    default: // md
      sizeStyle = 'px-7 py-3 text-[10px]';
  }

  let variantStyle = '';
  switch (variant) {
    case 'secondary':
      variantStyle = 'bg-asphalt border-white/10 text-chalk hover:border-white/25 hover:bg-stone/20';
      break;
    case 'danger':
      variantStyle = 'bg-rose-500/20 border-rose-500/40 text-rose-400 hover:bg-rose-500/30';
      break;
    case 'outline':
      variantStyle = 'bg-transparent border-white/15 text-chalk hover:border-neon-accent hover:text-neon-accent';
      break;
    case 'ghost':
    case 'text':
      variantStyle = 'bg-transparent border-transparent text-silver hover:text-chalk active:translate-x-0.5';
      break;
    default: // primary
      variantStyle = 'bg-neon-accent border-neon-accent text-asphalt font-extrabold hover:bg-chalk hover:border-chalk shadow-md shadow-neon-accent/15';
  }

  const disabledState = disabled || loading;

  const isCustomLoading = typeof children === 'string' && loading;
  const processedLoadingText = isCustomLoading ? 'PROCESSING ···' : children;

  // Render trailing right arrow ONLY for primary forward CTA buttons (or when showArrow === true)
  const shouldRenderArrow = !loading && !noArrow && (
    showArrow === true || (showArrow !== false && variant === 'primary')
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabledState}
      className={`${baseStyle} ${sizeStyle} ${variantStyle} ${
        disabledState ? 'opacity-40 cursor-not-allowed pointer-events-none active:scale-100' : ''
      } ${className}`}
      {...props}
    >
      <span className="flex items-center gap-2 group-hover:translate-x-0.5 transition-transform duration-200">
        {processedLoadingText}
      </span>

      {shouldRenderArrow && (
        <span className="text-[10px] font-sans font-black tracking-normal transition-transform duration-200 group-hover:translate-x-1 shrink-0">
          →
        </span>
      )}
    </button>
  );
};

export default Button;
