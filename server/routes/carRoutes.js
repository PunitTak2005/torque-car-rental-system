const express = require('express');
const router = express.Router();
const {
  getCars,
  getCarLocations,
  getCarBrands,
  getCarDetails,
  getCarAvailability
} = require('../controllers/carController');

router.get('/', getCars);
router.get('/availability', getCarAvailability);
router.get('/locations', getCarLocations);
router.get('/brands', getCarBrands);
router.get('/:id', getCarDetails);

module.exports = router;
