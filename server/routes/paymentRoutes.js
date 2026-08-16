const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getUserPayments } = require('../controllers/paymentController');

router.get('/', protect, getUserPayments);

module.exports = router;
