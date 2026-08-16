import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import {
  User,
  Car,
  Calendar,
  MapPin,
  CreditCard,
  CheckCircle,
  PlayCircle,
  CheckSquare,
  XCircle,
  Clock,
  Mail,
  Phone
} from 'lucide-react';

const BookingDetailsModal = ({
  isOpen,
  onClose,
  booking,
  onUpdateStatus
}) => {
  if (!booking) return null;

  const {
    _id,
    bookingId,
    user,
    customerDetails,
    car,
    pickupDate,
    returnDate,
    rentalDates,
    pickupLocation,
    dropoffLocation,
    billing,
    totalAmount,
    paymentStatus,
    status,
    createdAt
  } = booking;

  const rawStart = pickupDate || rentalDates?.startDate;
  const rawEnd = returnDate || rentalDates?.endDate;

  const startDateFormatted = rawStart
    ? new Date(rawStart).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'N/A';
  const endDateFormatted = rawEnd
    ? new Date(rawEnd).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'N/A';

  const customerName = customerDetails?.fullName || user?.name || 'Customer';
  const customerEmail = customerDetails?.email || user?.email || 'N/A';
  const customerPhone = customerDetails?.phone || user?.phone || '';

  const finalTotal = billing?.totalAmount || totalAmount || 0;

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Confirmed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Active':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'Completed':
        return 'bg-stone/40 text-silver border-white/10';
      case 'Cancelled':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reservation Reference: #${bookingId || _id.slice(-8)}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        
        {/* Status Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-asphalt rounded-2xl border border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neon-accent" />
            <span className="text-xs text-silver">
              Booked on {createdAt ? new Date(createdAt).toLocaleDateString('en-IN') : 'N/A'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-extrabold rounded-full border ${getStatusBadge(status)}`}>
              {status}
            </span>
            <span className={`px-3 py-1 text-xs font-extrabold rounded-full border ${
              paymentStatus === 'Paid'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
            }`}>
              Payment: {paymentStatus || 'Pending'}
            </span>
          </div>
        </div>

        {/* Customer Information Card */}
        <div className="p-5 rounded-2xl border border-white/10 bg-asphalt/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-silver tracking-wider">
            <User className="w-4 h-4 text-neon-accent" /> Customer Information
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-silver/60 block text-[10px] uppercase font-bold">Full Name</span>
              <span className="font-extrabold text-chalk text-sm">{customerName}</span>
            </div>
            <div>
              <span className="text-silver/60 block text-[10px] uppercase font-bold">Email Address</span>
              <span className="font-bold text-chalk flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-silver/60" /> {customerEmail}
              </span>
            </div>
            {customerPhone && (
              <div>
                <span className="text-silver/60 block text-[10px] uppercase font-bold">Contact Phone</span>
                <span className="font-bold text-chalk flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-silver/60" /> {customerPhone}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Details Card */}
        <div className="p-5 rounded-2xl border border-white/10 bg-asphalt/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-silver tracking-wider">
            <Car className="w-4 h-4 text-neon-accent" /> Reserved Vehicle
          </div>
          {car ? (
            <div className="flex items-center gap-4">
              {car.images?.[0] && (
                <img
                  src={car.images[0]}
                  alt={`${car.brand} ${car.model}`}
                  className="w-24 aspect-[16/10] rounded-xl object-cover border border-white/10 shrink-0 bg-graphite"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'; }}
                />
              )}
              <div className="flex-1 text-xs">
                <h4 className="font-extrabold text-chalk text-base uppercase font-display">
                  {car.brand} {car.model}
                </h4>
                <div className="flex items-center gap-2 text-silver/70 font-bold mt-1">
                  <span>{car.category}</span>
                  <span>&bull;</span>
                  <span>{car.specifications?.transmission || 'Auto'}</span>
                  <span>&bull;</span>
                  <span className="text-neon-accent">₹{car.pricePerDay?.toLocaleString()}/day</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-silver/60 italic">Vehicle record no longer available.</div>
          )}
        </div>

        {/* Schedule & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-white/10 bg-asphalt/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-silver tracking-wider">
              <Calendar className="w-4 h-4 text-neon-accent" /> Schedule
            </div>
            <div className="text-xs space-y-1.5 pt-1">
              <div>
                <span className="text-silver/60 block text-[10px] uppercase font-bold">Pickup Date:</span>
                <span className="font-bold text-chalk">{startDateFormatted}</span>
              </div>
              <div>
                <span className="text-silver/60 block text-[10px] uppercase font-bold">Return Date:</span>
                <span className="font-bold text-chalk">{endDateFormatted}</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-asphalt/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-silver tracking-wider">
              <MapPin className="w-4 h-4 text-neon-accent" /> Pickup / Drop-off
            </div>
            <div className="text-xs space-y-1.5 pt-1">
              <div>
                <span className="text-silver/60 block text-[10px] uppercase font-bold">Pickup Hub:</span>
                <span className="font-bold text-chalk">{pickupLocation || 'Main Hub'}</span>
              </div>
              <div>
                <span className="text-silver/60 block text-[10px] uppercase font-bold">Return Hub:</span>
                <span className="font-bold text-chalk">{dropoffLocation || pickupLocation || 'Main Hub'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="p-5 rounded-2xl border border-white/10 bg-asphalt flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            <CreditCard className="w-5 h-5 text-neon-accent" />
            <div>
              <span className="font-extrabold text-chalk uppercase block">Total Billing Amount</span>
              <span className="text-[10px] text-silver/60">Includes taxes & security deposit</span>
            </div>
          </div>
          <span className="text-2xl font-extrabold text-neon-accent font-sans">
            ₹{finalTotal.toLocaleString()}
          </span>
        </div>

        {/* Admin Status Update Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-end gap-2">
          {status === 'Pending' && (
            <Button
              onClick={() => {
                onUpdateStatus(_id, 'Confirmed');
                onClose();
              }}
              className="text-xs px-4 py-2.5 bg-neon-accent text-asphalt font-extrabold uppercase"
            >
              <CheckCircle className="w-4 h-4" /> Confirm Reservation
            </Button>
          )}

          {status === 'Confirmed' && (
            <Button
              onClick={() => {
                onUpdateStatus(_id, 'Active');
                onClose();
              }}
              className="text-xs px-4 py-2.5 bg-blue-500 text-white font-extrabold uppercase"
            >
              <PlayCircle className="w-4 h-4" /> Start Active Trip
            </Button>
          )}

          {status === 'Active' && (
            <Button
              onClick={() => {
                onUpdateStatus(_id, 'Completed');
                onClose();
              }}
              className="text-xs px-4 py-2.5 bg-emerald-500 text-asphalt font-extrabold uppercase"
            >
              <CheckSquare className="w-4 h-4" /> Mark Completed
            </Button>
          )}

          {status !== 'Cancelled' && status !== 'Completed' && (
            <Button
              onClick={() => {
                if (window.confirm('Cancel this reservation?')) {
                  onUpdateStatus(_id, 'Cancelled');
                  onClose();
                }
              }}
              variant="danger"
              className="text-xs px-4 py-2.5 bg-rose-500 text-white font-extrabold uppercase"
            >
              <XCircle className="w-4 h-4" /> Cancel Booking
            </Button>
          )}
        </div>

      </div>
    </Modal>
  );
};

export default BookingDetailsModal;
