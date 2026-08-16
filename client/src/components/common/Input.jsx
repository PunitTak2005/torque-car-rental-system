import React from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  error,
  helperText,
  disabled = false,
  loading = false,
  id,
  className = '',
  icon: Icon,
  ...props
}) => {
  const inputId = id || `input-${name}`;
  const errorId = `error-${name}`;
  const helperId = `helper-${name}`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[9px] font-bold text-silver uppercase tracking-widest select-none"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-silver/60">
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          disabled={disabled || loading}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`block w-full ${Icon ? 'pl-9' : 'px-3'} py-3 bg-graphite border text-xs text-chalk placeholder-silver/50 focus:outline-none focus:border-neon-accent transition-colors rounded-none ${
            error
              ? 'border-rose-900 bg-rose-950/20'
              : 'border-white/10'
          } ${
            disabled || loading 
              ? 'opacity-40 cursor-not-allowed bg-asphalt' 
              : ''
          } ${className}`}
          {...props}
        />
        
        {loading && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <div className="w-3.5 h-3.5 border-2 border-stone border-t-neon-accent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {error && (
        <span
          id={errorId}
          role="alert"
          className="text-rose-450 text-[9px] font-bold tracking-wider uppercase mt-0.5"
        >
          {error}
        </span>
      )}

      {!error && helperText && (
        <span id={helperId} className="text-silver/60 text-[9px] tracking-wider uppercase mt-0.5">
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Input;
