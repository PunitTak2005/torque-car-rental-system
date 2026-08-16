const Favorite = require('../models/Favorite');
const Car = require('../models/Car');

// @desc    Get current user's favorited vehicles
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate('car')
      .sort({ createdAt: -1 });

    const validFavorites = favorites.filter(f => f.car !== null);
    const carIds = validFavorites.map(f => f.car._id.toString());
    const cars = validFavorites.map(f => f.car);

    res.json({
      success: true,
      count: validFavorites.length,
      carIds,
      cars
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle a vehicle in user's favorites
// @route   POST /api/favorites/:carId
// @access  Private
const toggleFavorite = async (req, res, next) => {
  try {
    const { carId } = req.params;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const existing = await Favorite.findOne({ user: req.user._id, car: carId });

    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return res.json({
        success: true,
        isFavorite: false,
        carId,
        message: 'Removed from saved favorites'
      });
    } else {
      await Favorite.create({ user: req.user._id, car: carId });
      return res.json({
        success: true,
        isFavorite: true,
        carId,
        message: 'Added to saved favorites'
      });
    }
  } catch (error) {
    // Handle duplicate key error gracefully
    if (error.code === 11000) {
      return res.json({
        success: true,
        isFavorite: true,
        carId: req.params.carId,
        message: 'Already in favorites'
      });
    }
    next(error);
  }
};

// @desc    Remove a vehicle from user's favorites
// @route   DELETE /api/favorites/:carId
// @access  Private
const removeFavorite = async (req, res, next) => {
  try {
    const { carId } = req.params;
    await Favorite.deleteOne({ user: req.user._id, car: carId });

    res.json({
      success: true,
      isFavorite: false,
      carId,
      message: 'Removed from saved favorites'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavorites,
  toggleFavorite,
  removeFavorite
};
