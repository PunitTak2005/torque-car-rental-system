import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { getCarLocations } from '../../services/api';

const DEFAULT_CITIES = [
  'Udaipur',
  'Jaipur',
  'Jodhpur',
  'Delhi',
  'Mumbai',
  'Ahmedabad',
  'Pune',
  'Goa',
  'Gurugram',
  'Bengaluru'
];

const PickupHubSelect = ({
  value = '',
  onChange,
  label = 'PICKUP HUB',
  placeholder = 'Select Pickup Hub',
  required = false,
  disabled = false,
  className = '',
  error = ''
}) => {
  const [hubs, setHubs] = useState(DEFAULT_CITIES);

  useEffect(() => {
    let isMounted = true;
    const fetchLocations = async () => {
      try {
        const { data } = await getCarLocations();
        if (data.success && Array.isArray(data.locations) && data.locations.length > 0) {
          if (isMounted) setHubs(data.locations);
        }
      } catch (err) {
        console.warn('[PickupHubSelect]: Failed to fetch dynamic locations, fallback to defaults');
      }
    };
    fetchLocations();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="text-[10px] font-bold text-silver uppercase tracking-widest flex items-center gap-1.5 select-none">
          <MapPin className="w-3 h-3 text-neon-accent" />
          <span>{label}</span>
          {required && <span className="text-neon-accent">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          required={required}
          disabled={disabled}
          className={`block w-full appearance-none pl-9 pr-10 py-3 bg-graphite border text-xs font-bold uppercase tracking-wider text-chalk focus:outline-none focus:border-neon-accent rounded-xl cursor-pointer transition-all ${
            error ? 'border-rose-500 bg-rose-955/20' : 'border-white/15 hover:border-white/30'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <option value="" disabled className="bg-graphite text-silver/60">
            -- {placeholder} --
          </option>
          {hubs.map((hub) => (
            <option key={hub} value={hub} className="bg-graphite text-chalk py-1">
              {hub} Hub
            </option>
          ))}
        </select>

        {/* Custom Chevron Indicator */}
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neon-accent">
          <MapPin className="w-4 h-4" />
        </div>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-silver/60">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      {error && (
        <span role="alert" className="text-rose-500 text-[9px] font-bold tracking-widest uppercase block mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default PickupHubSelect;
