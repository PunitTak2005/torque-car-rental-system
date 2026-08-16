import React from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const CarModal = ({
  isOpen,
  onClose,
  editingCar,
  carFormState,
  carErrors,
  isSubmitting,
  onSubmit
}) => {
  const {
    carBrand, setCarBrand,
    carModel, setCarModel,
    carCategory, setCarCategory,
    carTransmission, setCarTransmission,
    carFuel, setCarFuel,
    carLocation, setCarLocation,
    carPrice, setCarPrice,
    carDeposit, setCarDeposit,
    carSeats, setCarSeats,
    carDoors, setCarDoors,
    carImages, setCarImages,
    carDescription, setCarDescription
  } = carFormState;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCar ? 'Update Fleet Record' : 'Add New Vehicle to Fleet'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Brand Name"
            name="brand"
            required
            value={carBrand}
            error={carErrors.brand}
            onChange={(e) => setCarBrand(e.target.value)}
            placeholder="e.g. Mahindra"
          />

          <Input
            label="Model Name"
            name="model"
            required
            value={carModel}
            error={carErrors.model}
            onChange={(e) => setCarModel(e.target.value)}
            placeholder="e.g. Scorpio-N Z8L"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-silver uppercase tracking-wider select-none">
              Category
            </label>
            <select
              value={carCategory}
              onChange={(e) => setCarCategory(e.target.value)}
              className="block w-full px-3 py-3 bg-asphalt border border-white/10 rounded-xl text-xs text-chalk focus:outline-none focus:border-neon-accent font-bold"
            >
              {['City', 'Hatchback', 'Sedan', 'SUV', 'Luxury', 'Performance', 'Sports', 'Electric', 'EV', 'Adventure', 'MPV'].map(cat => (
                <option key={cat} value={cat} className="bg-graphite">{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-silver uppercase tracking-wider select-none">
              Transmission
            </label>
            <select
              value={carTransmission}
              onChange={(e) => setCarTransmission(e.target.value)}
              className="block w-full px-3 py-3 bg-asphalt border border-white/10 rounded-xl text-xs text-chalk focus:outline-none focus:border-neon-accent font-bold"
            >
              <option value="Automatic" className="bg-graphite">Automatic</option>
              <option value="Manual" className="bg-graphite">Manual</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-silver uppercase tracking-wider select-none">
              Fuel Type
            </label>
            <select
              value={carFuel}
              onChange={(e) => setCarFuel(e.target.value)}
              className="block w-full px-3 py-3 bg-asphalt border border-white/10 rounded-xl text-xs text-chalk focus:outline-none focus:border-neon-accent font-bold"
            >
              {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map(fl => (
                <option key={fl} value={fl} className="bg-graphite">{fl}</option>
              ))}
            </select>
          </div>

          <Input
            label="Location Hub"
            name="location"
            required
            value={carLocation}
            error={carErrors.location}
            onChange={(e) => setCarLocation(e.target.value)}
            placeholder="e.g. Udaipur Hub"
          />

          <Input
            label="Daily Rate (₹)"
            name="price"
            type="number"
            required
            value={carPrice}
            error={carErrors.price}
            onChange={(e) => setCarPrice(e.target.value)}
            placeholder="4000"
          />

          <Input
            label="Security Deposit (₹)"
            name="deposit"
            type="number"
            required
            value={carDeposit}
            error={carErrors.deposit}
            onChange={(e) => setCarDeposit(e.target.value)}
            placeholder="8000"
          />

          <Input
            label="Seats Count"
            name="seats"
            type="number"
            required
            value={carSeats}
            onChange={(e) => setCarSeats(e.target.value)}
          />

          <Input
            label="Doors Count"
            name="doors"
            type="number"
            required
            value={carDoors}
            onChange={(e) => setCarDoors(e.target.value)}
          />
        </div>

        <Input
          label="Image URLs (Comma-separated or /cars/filename.jpg)"
          name="images"
          required
          value={carImages}
          error={carErrors.images}
          onChange={(e) => setCarImages(e.target.value)}
          placeholder="/cars/scorpio_n.jpg, /cars/suv.jpg"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-silver uppercase tracking-wider select-none">
            Vehicle Description
          </label>
          <textarea
            required
            rows={3}
            value={carDescription}
            onChange={(e) => setCarDescription(e.target.value)}
            placeholder="Provide a detailed description of vehicle specifications and features. (min 20 chars)"
            className={`block w-full px-3 py-3 bg-asphalt border rounded-xl text-xs placeholder-silver/40 text-chalk focus:outline-none focus:border-neon-accent resize-none ${
              carErrors.description ? 'border-rose-500 bg-rose-955/20' : 'border-white/10'
            }`}
          />
          {carErrors.description && (
            <span role="alert" className="text-rose-400 text-xs font-bold mt-0.5">
              {carErrors.description}
            </span>
          )}
        </div>

        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full py-3.5 text-xs font-extrabold tracking-wider uppercase bg-neon-accent text-asphalt hover:bg-chalk"
        >
          <span>{editingCar ? 'Save Vehicle Updates' : 'Publish New Vehicle'}</span>
        </Button>
      </form>
    </Modal>
  );
};

export default CarModal;
