import React, { useState } from 'react';
import {
  X,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  FileText,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  Printer,
  Download,
  Clock,
  Smartphone,
  Banknote,
  Car as CarIcon
} from 'lucide-react';
import Button from '../common/Button';
import { generateInvoicePDF } from '../../utils/generateInvoicePDF';

const BookingDetailsModal = ({ booking, onClose, onCancelBooking, onPayBooking }) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

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
    customerDetails,
    status,
    paymentStatus,
    paymentDetails,
    createdAt
  } = booking;

  const formattedPickup = new Date(pickupDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();

  const formattedReturn = new Date(returnDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();

  const formattedCreated = new Date(createdAt || Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const canCancel = status !== 'Completed' && status !== 'Cancelled' && status !== 'Active';

  const handleConfirmCancel = async () => {
    setCancelling(true);
    try {
      await onCancelBooking(_id);
      setShowCancelConfirm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    generateInvoicePDF(booking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-asphalt/85 backdrop-blur-lg animate-page-enter">
      <div 
        className="bg-graphite border border-white/10 rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl text-chalk flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Modal Header */}
        <header className="px-6 py-4 border-b border-white/10 bg-asphalt/90 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-extrabold text-neon-accent tracking-[0.2em] uppercase">TORQUE RENTAL DOSSIER</span>
            <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-md text-xs font-mono font-bold text-chalk tracking-wider">
              #{bookingId || _id?.slice(-8)}
            </span>
            <span className="text-[9px] text-silver/60 uppercase font-bold tracking-wider hidden sm:inline">
              Created: {formattedCreated}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Rental Status */}
            <span className={`px-3 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${
              status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
              status === 'Active' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
              status === 'Completed' ? 'bg-stone/40 text-silver border border-white/10' :
              status === 'Cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
              'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}>
              {status}
            </span>

            {/* Payment Status */}
            <span className={`px-3 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${
              paymentStatus === 'Paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
              paymentStatus === 'Refunded' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' :
              paymentStatus === 'Failed' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
              'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}>
              {paymentStatus || 'Pending'}
            </span>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-silver hover:text-chalk hover:bg-white/10 transition-colors cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 space-y-4 overflow-y-auto">
          
          {/* Vehicle Feature Banner */}
          {car && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-asphalt/60 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-32 sm:w-40 aspect-[16/10] rounded-xl overflow-hidden bg-asphalt border border-white/10 shrink-0">
                  <img
                    src={car.images?.[0] || '/cars/tesla.jpg'}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'; }}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold text-neon-accent uppercase tracking-widest">{car.brand}</span>
                  <h3 className="text-xl font-extrabold uppercase tracking-wider text-chalk font-display">
                    {car.model}
                  </h3>
                  {car.specifications && (
                    <div className="flex flex-wrap gap-1.5 pt-1 text-[9px] text-silver font-bold uppercase tracking-wider">
                      <span className="px-2 py-0.5 bg-white/5 rounded-md border border-white/10">{car.specifications.transmission}</span>
                      <span className="px-2 py-0.5 bg-white/5 rounded-md border border-white/10">{car.specifications.fuelType}</span>
                      <span className="px-2 py-0.5 bg-white/5 rounded-md border border-white/10">{car.specifications.seats} Seats</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-6 gap-2 text-right">
                <div>
                  <span className="text-[8px] text-silver/50 uppercase font-bold tracking-widest block">DAILY RATE</span>
                  <span className="text-neon-accent text-base font-extrabold font-sans">₹{dailyRate?.toLocaleString()} <span className="text-[10px] text-silver font-normal">/ day</span></span>
                </div>
                <div>
                  <span className="text-[8px] text-silver/50 uppercase font-bold tracking-widest block">RENTAL DURATION</span>
                  <span className="text-chalk text-xs font-bold uppercase">{totalDays} {totalDays === 1 ? 'Day' : 'Days'}</span>
                </div>
              </div>
            </div>
          )}

          {/* 3-Column Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: Driver Information */}
            <div className="bg-asphalt/50 p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-1.5 text-neon-accent text-[10px] font-bold uppercase tracking-wider border-b border-white/10 pb-1.5">
                <User className="w-3.5 h-3.5" />
                <span>DRIVER INFO</span>
              </div>
              <div className="space-y-1 text-[11px] text-silver font-sans">
                <div className="flex justify-between"><span className="text-silver/50 font-bold">NAME:</span> <span className="text-chalk font-semibold">{customerDetails?.fullName || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-silver/50 font-bold">EMAIL:</span> <span className="text-chalk font-semibold truncate max-w-[140px]">{customerDetails?.email || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-silver/50 font-bold">PHONE:</span> <span className="text-chalk font-semibold">{customerDetails?.phone || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-silver/50 font-bold">LICENSE:</span> <span className="text-chalk font-mono font-semibold">{customerDetails?.driverLicense || 'N/A'}</span></div>
              </div>
            </div>

            {/* Card 2: Rental Timeline */}
            <div className="bg-asphalt/50 p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-1.5 text-neon-accent text-[10px] font-bold uppercase tracking-wider border-b border-white/10 pb-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>RENTAL TIMELINE</span>
              </div>
              <div className="space-y-1 text-[11px] text-silver font-sans">
                <div className="flex justify-between"><span className="text-silver/50 font-bold">PICKUP:</span> <span className="text-chalk font-semibold">{pickupLocation}</span></div>
                <div className="flex justify-between"><span className="text-silver/50 font-bold">DROPOFF:</span> <span className="text-chalk font-semibold">{dropoffLocation || pickupLocation}</span></div>
                <div className="flex justify-between"><span className="text-silver/50 font-bold">START DATE:</span> <span className="text-chalk font-semibold">{formattedPickup}</span></div>
                <div className="flex justify-between"><span className="text-silver/50 font-bold">END DATE:</span> <span className="text-chalk font-semibold">{formattedReturn}</span></div>
              </div>
            </div>

            {/* Card 3: Payment Metadata */}
            <div className="bg-asphalt/50 p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-1.5 text-neon-accent text-[10px] font-bold uppercase tracking-wider border-b border-white/10 pb-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                <span>PAYMENT METADATA</span>
              </div>
              <div className="space-y-1 text-[11px] text-silver font-sans">
                <div className="flex justify-between items-center">
                  <span className="text-silver/50 font-bold">METHOD:</span>
                  <span className="text-chalk font-semibold flex items-center gap-1">
                    {paymentDetails?.paymentMethod === 'UPI' ? <Smartphone className="w-3 h-3 text-neon-accent" /> : paymentDetails?.paymentMethod === 'Cash on Pickup' ? <Banknote className="w-3 h-3 text-neon-accent" /> : <CreditCard className="w-3 h-3 text-neon-accent" />}
                    {paymentDetails?.paymentMethod || 'Credit/Debit Card'}
                  </span>
                </div>
                <div className="flex justify-between"><span className="text-silver/50 font-bold">TXN ID:</span> <span className="text-chalk font-mono font-semibold">{paymentDetails?.transactionId || 'TXN-N/A'}</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-silver/50 font-bold">STATUS:</span>
                  <span className={`px-2 py-0.2 rounded-full text-[8px] font-extrabold uppercase ${
                    paymentStatus === 'Paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {paymentStatus === 'Paid' ? 'PAID' : 'PENDING'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Compact Pricing Matrix Bar */}
          <div className="bg-asphalt/80 p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-bold uppercase tracking-wider text-silver">
            <div className="flex flex-wrap items-center gap-4 sm:gap-8">
              <div>
                <span className="text-silver/50 text-[9px] block">BASE HIRE</span>
                <span className="text-chalk">₹{(dailyRate * totalDays)?.toLocaleString()}</span>
              </div>
              <div className="border-l border-white/10 pl-4 sm:pl-8">
                <span className="text-silver/50 text-[9px] block">REFUNDABLE DEPOSIT</span>
                <span className="text-chalk">₹{billing?.securityDeposit?.toLocaleString()}</span>
              </div>
              <div className="border-l border-white/10 pl-4 sm:pl-8">
                <span className="text-silver/50 text-[9px] block">TAXES & FEES (8%)</span>
                <span className="text-chalk">₹{billing?.taxes?.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-right border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-8 w-full sm:w-auto flex sm:block items-baseline justify-between">
              <span className="text-silver/50 text-[9px] block">TOTAL AMOUNT</span>
              <span className="text-neon-accent font-sans text-xl font-extrabold">₹{billing?.totalAmount?.toLocaleString()}</span>
            </div>
          </div>

          {/* Cancellation Confirmation Box */}
          {showCancelConfirm && (
            <div className="bg-rose-950/40 border border-rose-900/60 p-4 rounded-2xl space-y-2 text-center animate-fade-in">
              <div className="flex items-center justify-center gap-2 text-rose-400 font-bold text-xs uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>Confirm Reservation Cancellation</span>
              </div>
              <p className="text-[10px] text-silver">
                Are you sure you want to cancel booking <strong className="text-chalk font-mono">#{bookingId}</strong>? {paymentStatus === 'Paid' ? 'Deposit and payment will be refunded according to policy.' : ''}
              </p>
              <div className="flex items-center justify-center gap-3 pt-1">
                <Button
                  onClick={() => setShowCancelConfirm(false)}
                  className="bg-white/10 hover:bg-white/20 text-chalk text-[10px] px-4 py-1.5"
                  disabled={cancelling}
                >
                  Keep Booking
                </Button>
                <Button
                  onClick={handleConfirmCancel}
                  className="bg-rose-600 hover:bg-rose-500 text-chalk text-[10px] px-4 py-1.5 font-extrabold uppercase"
                  disabled={cancelling}
                >
                  {cancelling ? 'Cancelling...' : 'Yes, Cancel Rental'}
                </Button>
              </div>
            </div>
          )}

        </main>

        {/* Compact Footer Actions */}
        <footer className="px-6 py-3 border-t border-white/10 bg-asphalt/90 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadInvoice}
              className="bg-neon-accent hover:bg-chalk text-asphalt font-extrabold text-xs px-4 py-2 flex items-center gap-2 cursor-pointer shadow-lg rounded-xl transition-all"
            >
              <Download className="w-3.5 h-3.5 text-asphalt" />
              <span>DOWNLOAD INVOICE (PDF)</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-chalk text-xs font-bold px-3.5 py-2 flex items-center gap-2 cursor-pointer rounded-xl transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-neon-accent" />
              <span>PRINT INVOICE</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {canCancel && !showCancelConfirm && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="bg-rose-500/10 hover:bg-rose-600 border border-rose-500/30 text-rose-400 hover:text-chalk text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-2 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
              >
                Cancel Booking
              </button>
            )}

            {paymentStatus !== 'Paid' && status !== 'Cancelled' && onPayBooking && (
              <Button
                onClick={() => onPayBooking(_id)}
                className="bg-neon-accent hover:bg-chalk text-asphalt font-extrabold text-xs px-4 py-2 uppercase tracking-wider"
              >
                Complete Payment
              </Button>
            )}

            <Button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-chalk text-xs px-4 py-2 font-bold uppercase tracking-wider"
            >
              Close
            </Button>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default BookingDetailsModal;
