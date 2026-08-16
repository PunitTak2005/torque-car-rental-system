import React from 'react';
import { Plus, ClipboardList, Users, BarChart3, CreditCard, Sparkles } from 'lucide-react';

const QuickActions = ({ onAddCar, onSelectTab }) => {
  const actions = [
    {
      label: 'Add New Car',
      icon: Plus,
      onClick: onAddCar,
      bgColor: 'bg-neon-accent hover:bg-chalk text-asphalt font-extrabold shadow-md shadow-neon-accent/20'
    },
    {
      label: 'Manage Bookings',
      icon: ClipboardList,
      onClick: () => onSelectTab('bookings'),
      bgColor: 'bg-asphalt hover:bg-white/10 text-chalk border border-white/10'
    },
    {
      label: 'Manage Users',
      icon: Users,
      onClick: () => onSelectTab('users'),
      bgColor: 'bg-asphalt hover:bg-white/10 text-chalk border border-white/10'
    },
    {
      label: 'Fleet Catalog',
      icon: BarChart3,
      onClick: () => onSelectTab('cars'),
      bgColor: 'bg-asphalt hover:bg-white/10 text-chalk border border-white/10'
    },
    {
      label: 'Audit Payments',
      icon: CreditCard,
      onClick: () => onSelectTab('payments'),
      bgColor: 'bg-asphalt hover:bg-white/10 text-chalk border border-white/10'
    }
  ];

  return (
    <div className="bg-graphite/60 backdrop-blur-md rounded-3xl border border-white/10 p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-neon-accent" />
        <h3 className="text-xs font-extrabold text-chalk uppercase tracking-widest font-display">
          QUICK ACTIONS
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              onClick={act.onClick}
              className={`p-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-95 ${act.bgColor}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
