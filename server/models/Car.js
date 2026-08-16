const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Economy', 'City', 'Hatchback', 'Sedan', 'SUV', 'Luxury', 'Sports', 'Performance', 'Electric', 'EV', 'Adventure', 'Off-Road', 'MPV', 'Family']
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required']
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    specifications: {
      transmission: {
        type: String,
        required: true,
        enum: ['Automatic', 'Manual']
      },
      fuelType: {
        type: String,
        required: true,
        enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid']
      },
      seats: {
        type: Number,
        required: true
      },
      doors: {
        type: Number,
        required: true
      },
      mileage: {
        type: String
      },
      engine: {
        type: String
      },
      horsepower: {
        type: Number
      }
    },
    features: {
      type: [String],
      default: []
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required']
    },
    securityDeposit: {
      type: Number,
      default: 0
    },
    rentalRequirements: {
      type: [String],
      default: []
    },
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    },
    availability: {
      type: Boolean,
      default: true
    },
    location: {
      type: [String],
      required: [true, 'Location is required'],
      default: ['Udaipur', 'Jaipur', 'Jodhpur', 'Delhi', 'Mumbai', 'Ahmedabad', 'Pune', 'Goa', 'Gurugram', 'Bengaluru']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Car', carSchema);
