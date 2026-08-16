import React from 'react';

/**
 * CarDescription – displays the vehicle description text.
 * Props:
 *   description: string
 */
const CarDescription = ({ description }) => (
  <div className="space-y-3 pt-2">
    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
      Vehicle Description
    </h3>
    <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed sm:text-sm">
      {description}
    </p>
  </div>
);

export default CarDescription;
