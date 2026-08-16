/**
 * Centralized formatting helper utilities
 */

/**
 * Format a number as currency (USD default)
 * @param {number} amount 
 * @returns {string}
 */
export const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format date string into friendly readable string (e.g. "20 Aug 2026")
 * @param {string|Date} dateInput 
 * @returns {string}
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Calculate rental days between pickup and return dates
 * @param {string} pickupDate 
 * @param {string} returnDate 
 * @returns {number}
 */
export const calculateRentalDays = (pickupDate, returnDate) => {
  if (!pickupDate || !returnDate) return 0;
  const start = new Date(pickupDate);
  const end = new Date(returnDate);
  const diff = end.getTime() - start.getTime();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 3600 * 24));
};

/**
 * Calculate total booking estimation breakdown
 * @param {number} pricePerDay 
 * @param {number} rentalDays 
 * @param {number} deposit 
 * @param {number} taxRate 
 * @returns {object}
 */
export const calculateBookingTotal = (pricePerDay = 0, rentalDays = 0, deposit = 150, taxRate = 0.08) => {
  const subtotal = pricePerDay * rentalDays;
  const taxes = Math.round(subtotal * taxRate);
  const total = subtotal + taxes + (rentalDays > 0 ? deposit : 0);
  return { subtotal, taxes, deposit, total };
};
