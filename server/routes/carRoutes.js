const express = require('express');
const router = express.Router();
const {
  getCars,
  getCarLocations,
  getCarBrands,
  getCarDetails
} = require('../controllers/carController');

router.get('/', getCars);
router.get('/locations', getCarLocations);
router.get('/brands', getCarBrands);
router.get('/:id', getCarDetails);

module.exports = router;
