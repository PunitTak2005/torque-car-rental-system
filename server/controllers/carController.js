const mongoose = require('mongoose');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// @desc    Get all cars with filtering, search, and sorting
// @route   GET /api/cars
// @access  Public
const getCars = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      fuelType,
      transmission,
      seats,
      priceMin,
      priceMax,
      rating,
      location,
      pickupDate,
      returnDate,
      sort,
      limit,
      page,
      availability
    } = req.query;

    const query = {};

    if (availability !== undefined) {
      query.availability = availability === 'true';
    }

    if (search) {
      query.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      const rawCategories = category.includes(',') ? category.split(',') : [category];
      const categoryConditions = [];

      const aliasMap = {
        'CITY': ['City', 'Hatchback', 'Economy'],
        'HATCHBACK': ['City', 'Hatchback', 'Economy'],
        'ECONOMY': ['City', 'Hatchback', 'Economy'],
        'SEDAN': ['Sedan'],
        'SUV': ['SUV'],
        'LUXURY': ['Luxury', 'Premium'],
        'PREMIUM': ['Luxury', 'Premium'],
        'SPORTS': ['Sports', 'Performance'],
        'PERFORMANCE': ['Sports', 'Performance'],
        'ELECTRIC': ['Electric', 'EV'],
        'EV': ['Electric', 'EV'],
        'ADVENTURE': ['Adventure', 'Off-Road'],
        'OFF-ROAD': ['Adventure', 'Off-Road'],
        'MPV': ['MPV', 'Family'],
        'FAMILY': ['MPV', 'Family']
      };

      rawCategories.forEach(cat => {
        const uppercaseCat = cat.trim().toUpperCase();
        if (aliasMap[uppercaseCat]) {
          categoryConditions.push(...aliasMap[uppercaseCat]);
        } else {
          categoryConditions.push(cat.trim());
        }
      });

      const uniqueConditions = [...new Set(categoryConditions)];
      query.category = { $in: uniqueConditions.map(c => new RegExp(`^${c}$`, 'i')) };
    }
    if (brand) query.brand = { $regex: new RegExp('^' + brand + '$', 'i') };
    if (fuelType && fuelType !== 'All' && fuelType !== 'all') {
      query['specifications.fuelType'] = { $regex: new RegExp('^' + fuelType + '$', 'i') };
    }
    if (transmission && transmission !== 'All' && transmission !== 'all') {
      query['specifications.transmission'] = { $regex: new RegExp('^' + transmission + '$', 'i') };
    }
    if (seats) query['specifications.seats'] = { $gte: Number(seats) };
    if (location) query.location = { $regex: new RegExp(location, 'i') };
    
    if (priceMin || priceMax) {
      query.pricePerDay = {};
      if (priceMin) query.pricePerDay.$gte = Number(priceMin);
      if (priceMax) query.pricePerDay.$lte = Number(priceMax);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Dynamic date overlap availability checking
    if (pickupDate && returnDate) {
      const pDate = new Date(pickupDate);
      const rDate = new Date(returnDate);

      if (!isNaN(pDate) && !isNaN(rDate) && pDate < rDate) {
        const overlappingBookings = await Booking.find({
          status: { $in: ['Pending', 'Confirmed', 'Active'] },
          $or: [
            {
              pickupDate: { $lte: rDate },
              returnDate: { $gte: pDate }
            }
          ]
        }).select('car');

        const bookedCarIds = overlappingBookings.map(b => b.car);
        query._id = { $nin: bookedCarIds };
      }
    }

    let sortBy = { createdAt: -1, _id: 1 };
    if (sort) {
      if (sort === 'recommended') {
        sortBy = { rating: -1, numReviews: -1, _id: 1 };
      } else if (sort === 'priceAsc') {
        sortBy = { pricePerDay: 1, _id: 1 };
      } else if (sort === 'priceDesc') {
        sortBy = { pricePerDay: -1, _id: 1 };
      } else if (sort === 'rating') {
        sortBy = { rating: -1, numReviews: -1, _id: 1 };
      } else if (sort === 'newest') {
        sortBy = { createdAt: -1, _id: 1 };
      } else if (sort === 'nameAsc') {
        sortBy = { brand: 1, model: 1, _id: 1 };
      } else if (sort === 'nameDesc') {
        sortBy = { brand: -1, model: -1, _id: 1 };
      }
    }

    const pg = Number(page) || 1;
    let lm;
    if (limit === 'all' || limit === '0') {
      lm = 0;
    } else {
      lm = Number(limit) || 12;
    }

    let carsQuery = Car.find(query).sort(sortBy);
    if (lm > 0) {
      const skip = (pg - 1) * lm;
      carsQuery = carsQuery.skip(skip).limit(lm);
    }
    const cars = await carsQuery;

    const totalCars = await Car.countDocuments(query);

    res.json({
      success: true,
      cars,
      pagination: {
        total: totalCars,
        pages: Math.ceil(totalCars / lm),
        page: pg,
        limit: lm
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique car locations
// @route   GET /api/cars/locations
// @access  Public
const getCarLocations = async (req, res, next) => {
  try {
    const rawLocations = await Car.distinct('location');
    const defaultCities = ['Udaipur', 'Jaipur', 'Jodhpur', 'Delhi', 'Mumbai', 'Ahmedabad', 'Pune', 'Goa', 'Gurugram', 'Bengaluru'];
    const flatLocations = Array.isArray(rawLocations) ? rawLocations.flat() : [];
    const uniqueLocations = [...new Set([...flatLocations, ...defaultCities])].sort();
    res.json({ success: true, locations: uniqueLocations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unique brands
// @route   GET /api/cars/brands
// @access  Public
const getCarBrands = async (req, res, next) => {
  try {
    const brands = await Car.distinct('brand');
    res.json({ success: true, brands });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single car by ID
// @route   GET /api/cars/:id
// @access  Public
const getCarDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid car ID' });
    }

    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    const reviews = await Review.find({ car: car._id })
      .populate('user', 'name profilePhoto')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      car,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCars,
  getCarLocations,
  getCarBrands,
  getCarDetails
};
