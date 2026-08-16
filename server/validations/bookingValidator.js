const validate = require('../middleware/validate');

const createBookingRules = [
  { field: 'carId', label: 'Car Reference', required: true },
  { field: 'pickupLocation', label: 'Pickup Location', required: true },
  { field: 'dropoffLocation', label: 'Dropoff Location', required: true },
  
  // Custom date validation check
  {
    field: 'pickupDate',
    label: 'Pickup Date',
    required: true,
    custom: (val) => {
      const d = new Date(val);
      if (isNaN(d)) return 'Pickup date must be a valid date';
      const today = new Date();
      today.setHours(0,0,0,0);
      if (d < today) return 'Pickup date cannot be in the past';
      return null;
    }
  },
  {
    field: 'returnDate',
    label: 'Return Date',
    required: true,
    custom: (val, body) => {
      const r = new Date(val);
      const p = new Date(body.pickupDate);
      if (isNaN(r)) return 'Return date must be a valid date';
      if (!isNaN(p) && r <= p) return 'Return date must be after the pickup date';
      return null;
    }
  },

  // Customer Details checks
  {
    field: 'customerDetails',
    label: 'Customer Details',
    required: true,
    custom: (val) => {
      if (!val || typeof val !== 'object') return 'Customer details are required';
      const { fullName, email, phone, driverLicense } = val;
      if (!fullName) return 'Driver name is required';
      if (!email) return 'Driver email is required';
      if (!phone) return 'Driver phone is required';
      if (!driverLicense) return 'Driver license number is required';

      // Verify email format
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) return 'Driver email address is invalid';

      // Verify phone format
      const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
      if (!phoneRegex.test(phone)) return 'Driver phone number is invalid';

      return null;
    }
  },

  // Payment Details checks (supports UPI, Card, and Cash on Pickup)
  {
    field: 'paymentDetails',
    label: 'Payment Details',
    required: false,
    custom: (val) => {
      if (!val) return null;
      const method = val.paymentMethod || 'Credit/Debit Card';
      
      if (method === 'UPI') {
        if (!val.upiId || !val.upiId.trim()) return 'UPI ID is required for UPI payments';
        if (!/^[\w\.\-]+@[\w\.\-]+$/.test(val.upiId.trim())) return 'Please provide a valid UPI ID';
        return null;
      }
      
      if (method === 'Cash on Pickup' || method === 'CASH') {
        return null;
      }

      // Credit / Debit Card
      const { cardholderName, cardNumber, expiryDate, cvv } = val;
      if (!cardholderName) return 'Cardholder name is required';
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15) return 'Card number must be valid';
      if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) return 'Expiry date must be MM/YY';
      if (!cvv || cvv.length < 3) return 'CVV must be 3 digits';
      return null;
    }
  }
];

const payBookingRules = [
  { field: 'cardholderName', label: 'Cardholder Name', required: true },
  {
    field: 'cardNumber',
    label: 'Card Number',
    required: true,
    custom: (val) => {
      const cleaned = val.replace(/\s/g, '');
      if (cleaned.length < 15 || cleaned.length > 16) return 'Card number must be 15 or 16 digits';
      return null;
    }
  },
  {
    field: 'expiryDate',
    label: 'Expiry Date',
    required: true,
    matches: /^\d{2}\/\d{2}$/
  },
  {
    field: 'cvv',
    label: 'CVV Code',
    required: true,
    custom: (val) => {
      if (val.length < 3 || val.length > 4) return 'CVV must be 3 or 4 digits';
      return null;
    }
  }
];

module.exports = {
  validateCreateBooking: validate(createBookingRules),
  validatePayBooking: validate(payBookingRules)
};
