import React from 'react';
import { Users, Settings, Navigation, Clock, Cpu, Gauge } from 'lucide-react';

/**
 * CarSpecifications – renders a grid of key vehicle specs.
 * Props:
 *   specs: object containing transmission, fuelType, seats, mileage, engine, horsepower, doors.
 */
const CarSpecifications = ({ specs = {} }) => {
  const {
    transmission = 'N/A',
    fuelType = 'N/A',
    seats = 'N/A',
    mileage = 'Unlimited',
    engine = 'N/A',
    horsepower = 'N/A',
    doors = 'N/A',
  } = specs;

  const items = [
    { label: 'Transmission', value: transmission, icon: Settings },
    { label: 'Fuel Type', value: fuelType, icon: Navigation },
    { label: 'Seats', value: `${seats} passengers`, icon: Users },
    { label: 'Doors', value: `${doors}`, icon: Navigation },
    { label: 'Mileage', value: mileage, icon: Clock },
    { label: 'Engine', value: engine, icon: Cpu },
    { label: 'Horsepower', value: horsepower, icon: Gauge },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
      <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-4">Specifications</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div key={i} className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl flex flex-col items-start space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
              {item.label}
            </span>
            <div className="flex items-center gap-1">
              <item.icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarSpecifications;
