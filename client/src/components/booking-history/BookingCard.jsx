import React, { useState } from 'react';
import { Calendar, MapPin, Clock, CreditCard, ShieldCheck, AlertCircle, Eye, XCircle } from 'lucide-react';
import Button from '../common/Button';

const BookingCard = ({ booking, onViewDetails, onCancelBooking }) => {
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  if (!booking) return null;

  const {
    _id,
    bookingId,
    car,
    pickupLocation,
    dropoffLocation,
    pickupDate,
    returnDate,
    totalDays,
    dailyRate,
    billing,
    status,
    paymentStatus,
    createdAt
  } = booking;

  const formattedPickup = new Date(pickupDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedReturn = new Date(returnDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedBookedOn = new Date(createdAt || Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const canCancel = status !== 'Completed' && status !== 'Cancelled' && status !== 'Active';

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    try {
      await onCancelBooking(_id);
      setShowCancelPrompt(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="bg-graphite/80 border border-white/10 rounded-3xl overflow-hidden hover:border-neon-accent/30 hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col justify-between group">
      
      {/* Header Bar */}
      <div className="bg-asphalt/80 px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold text-silver uppercase tracking-widest">BOOKING</span>
          <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono font-bold text-neon-accent tracking-wider">
            #{bookingId || _id?.slice(-8)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
            status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
            status === 'Active' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
            status === 'Completed' ? 'bg-stone/40 text-silver border border-white/10' :
            status === 'Cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
            'bg-amber-500/20 text-amber-400 border border-amber-500/40'
          }`}>
            {status}
          </span>

          {/* Payment Status Badge */}
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
            paymentStatus === 'Paid' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
            paymentStatus === 'Refunded' ? 'bg-purple-955 text-purple-400 border border-purple-800' :
            paymentStatus === 'Failed' ? 'bg-rose-955 text-rose-400 border border-rose-800' :
            'bg-amber-955 text-amber-400 border border-amber-800'
          }`}>
            {paymentStatus || 'Pending'}
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Car Image Preview */}
        <div className="md:col-span-5 relative aspect-[16/10] rounded-2xl overflow-hidden bg-asphalt border border-white/10 group-hover:border-white/20 transition-all">
          <img
            src={car?.images?.[0] || '/cars/tesla.jpg'}
            alt={car ? `${car.brand} ${car.model}` : 'Vehicle'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'; }}
          />
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-asphalt/80 backdrop-blur-md border border-white/10 rounded-lg text-[9px] font-bold text-silver uppercase tracking-widest">
            {car?.category || 'Luxury'}
          </div>
        </div>

        {/* Booking Details */}
        <div className="md:col-span-7 space-y-4">
          <div>
            <span className="text-[9px] font-bold text-silver uppercase tracking-widest">VEHICLE RENTAL</span>
            <h3 className="text-xl font-extrabold uppercase tracking-wider text-chalk font-display mt-0.5">
              {car ? `${car.brand} ${car.model}` : 'Reserved Vehicle'}
            </h3>
            <p className="text-xs text-silver/80 flex items-center gap-1.5 mt-1 font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-neon-accent" />
              <span>{pickupLocation}</span>
              {dropoffLocation && dropoffLocation !== pickupLocation && (
                <span>→ {dropoffLocation}</span>
              )}
            </p>
          </div>

          {/* Schedule Grid */}
          <div className="grid grid-cols-3 gap-3 bg-asphalt/60 p-3 rounded-2xl border border-white/5 text-center">
            <div>
              <span className="text-[8px] font-bold text-silver/60 uppercase tracking-widest block">PICKUP</span>
              <span className="text-xs font-bold text-chalk uppercase">{formattedPickup}</span>
            </div>
            <div className="border-x border-white/10">
              <span className="text-[8px] font-bold text-silver/60 uppercase tracking-widest block">RETURN</span>
              <span className="text-xs font-bold text-chalk uppercase">{formattedReturn}</span>
            </div>
            <div>
              <span className="text-[8px] font-bold text-silver/60 uppercase tracking-widest block">DURATION</span>
              <span className="text-xs font-bold text-neon-accent uppercase">{totalDays} {totalDays === 1 ? 'Day' : 'Days'}</span>
            </div>
          </div>

          {/* Total & Creation Info */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <div>
              <span className="text-[9px] font-bold text-silver/60 uppercase tracking-widest block">BOOKED ON</span>
              <span className="text-xs text-silver font-semibold">{formattedBookedOn}</span>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-bold text-silver/60 uppercase tracking-widest block">TOTAL AMOUNT</span>
              <span className="text-xl font-extrabold text-neon-accent font-sans">
                ₹{billing?.totalAmount?.toLocaleString() || (dailyRate * totalDays)?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Prompt */}
      {showCancelPrompt && (
        <div className="mx-6 mb-4 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left animate-page-enter">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-chalk uppercase tracking-wider">Cancel this rental reservation?</p>
            <p className="text-[10px] text-silver/80 font-medium">
              {paymentStatus === 'Paid' ? 'Your booking will be cancelled and security deposit refunded according to policy.' : 'This reservation will be marked as cancelled.'}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowCancelPrompt(false)}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-chalk text-[10px] font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all"
              disabled={isCancelling}
            >
              Keep Booking
            </button>
            <button
              onClick={handleConfirmCancel}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-chalk text-[10px] font-extrabold uppercase tracking-wider rounded-xl cursor-pointer shadow-lg transition-all flex items-center gap-1.5"
              disabled={isCancelling}
            >
              {isCancelling ? 'Cancelling...' : 'Confirm Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Card Action Footer */}
      {canCancel && !showCancelPrompt && (
        <div className="bg-asphalt/40 px-6 py-4 border-t border-white/10 flex items-center justify-end">
          <button
            onClick={() => setShowCancelPrompt(true)}
            className="bg-rose-500/10 hover:bg-rose-600 border border-rose-500/30 text-rose-400 hover:text-chalk text-[10px] font-extrabold uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel Booking</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default BookingCard;
