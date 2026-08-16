const validate = require('../middleware/validate');

const carRules = [
  { field: 'brand', label: 'Brand Name', required: true },
  { field: 'model', label: 'Model Name', required: true },
  {
    field: 'category',
    label: 'Category',
    required: true,
    custom: (val) => {
      const valid = ['Economy', 'City', 'Hatchback', 'Sedan', 'SUV', 'Luxury', 'Sports', 'Performance', 'Electric', 'EV', 'Adventure', 'Off-Road', 'MPV', 'Family'];
      if (!valid.includes(val)) return `Category must be one of: ${valid.join(', ')}`;
      return null;
    }
  },
  {
    field: 'images',
    label: 'Images Array',
    required: true,
    custom: (val) => {
      if (!Array.isArray(val) || val.length === 0) return 'At least one image URL is required';
      return null;
    }
  },
  { field: 'description', label: 'Vehicle Description', required: true, min: 20 },
  {
    field: 'specifications',
    label: 'Specifications',
    required: true,
    custom: (val) => {
      if (!val || typeof val !== 'object') return 'Specifications object is required';
      const { transmission, fuelType, seats, doors } = val;
      if (!['Automatic', 'Manual'].includes(transmission)) return 'Transmission must be Automatic or Manual';
      if (!['Petrol', 'Diesel', 'Electric', 'Hybrid'].includes(fuelType)) return 'Fuel type is invalid';
      if (!seats || seats <= 0) return 'Seat count must be positive';
      if (!doors || doors <= 0) return 'Door count must be positive';
      return null;
    }
  },
  {
    field: 'pricePerDay',
    label: 'Price per Day',
    required: true,
    custom: (val) => {
      if (isNaN(val) || val <= 0) return 'Price per day must be a positive number';
      return null;
    }
  },
  { field: 'location', label: 'Physical Location', required: true }
];

module.exports = {
  validateCar: validate(carRules)
};
