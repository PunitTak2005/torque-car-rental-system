import { getCars, getCarDetails, getCarBrands, getCarLocations, getCarReviews, createCar, updateCar, deleteCar } from '../api';

export const carService = {
  getCars,
  getCarDetails,
  getCarBrands,
  getCarLocations,
  getCarReviews,
  createCar,
  updateCar,
  deleteCar
};

export default carService;
