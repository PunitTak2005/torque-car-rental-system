// Client-side Validation Rules for DriveEase

export const validateEmail = (email) => {
  if (!email) return 'Email address is required';
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
  if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
  return null;
};

export const validateCardNumber = (cardNumber) => {
  if (!cardNumber) return 'Card number is required';
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d{15,16}$/.test(cleaned)) return 'Card number must be 15 or 16 digits';
  return null;
};

export const validateExpiry = (expiry) => {
  if (!expiry) return 'Expiry date is required';
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return 'Expiry format must be MM/YY';
  
  const [month, year] = expiry.split('/').map(Number);
  if (month < 1 || month > 12) return 'Expiry month must be between 01 and 12';
  
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = Number(now.getFullYear().toString().slice(-2));

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Card has expired';
  }
  return null;
};

export const validateCvv = (cvv) => {
  if (!cvv) return 'CVV is required';
  if (!/^\d{3,4}$/.test(cvv)) return 'CVV must be 3 or 4 digits';
  return null;
};

export const validateLicense = (license) => {
  if (!license) return 'Driver license number is required';
  if (license.length < 5) return 'License must be at least 5 characters long';
  return null;
};

export const validateName = (name) => {
  if (!name || !name.trim()) return 'Please enter your full name.';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  if (/^\d+$/.test(name.trim())) return 'Name cannot consist of numbers only';
  return null;
};

export const validateDates = (pickup, dropoff) => {
  if (!pickup || !dropoff) return 'Both pickup and return dates are required';
  const p = new Date(pickup);
  const d = new Date(dropoff);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(p)) return 'Pickup date is invalid';
  if (isNaN(d)) return 'Return date is invalid';

  if (p < today) return 'Pickup date cannot be in the past';
  if (p >= d) return 'Return date must be after pickup date';

  return null;
};

export const validateUpiId = (upiId) => {
  if (!upiId || !upiId.trim()) return 'UPI ID is required';
  const upiRegex = /^[\w\.\-]+@[\w\.\-]+$/;
  if (!upiRegex.test(upiId.trim())) return 'Please enter a valid UPI ID (e.g. name@paytm, user@ybl, name@upi)';
  return null;
};
