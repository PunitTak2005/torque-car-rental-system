import React from 'react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon = '🚙',
  title = 'No Data Found',
  description = 'There are no items to display at this time.',
  actionText,
  actionLink,
  onActionClick
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-sm transition-colors duration-200">
      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto text-2xl select-none">
        {icon}
      </div>
      <h3 className="text-base font-black text-slate-900 dark:text-white">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>

      {actionText && (
        <div className="pt-2">
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-block px-5 py-2.5 bg-accent-600 hover:bg-accent-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              {actionText}
            </Link>
          ) : (
            <button
              onClick={onActionClick}
              className="px-5 py-2.5 bg-accent-600 hover:bg-accent-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
            >
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
