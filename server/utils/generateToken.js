const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'torque_car_rental_jwt_secret_key_2026_fallback';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

module.exports = generateToken;
