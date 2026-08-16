import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getUserBookings, cancelBooking, payBooking } from '../services/api';
import { AlertCircle, Search, Filter, ArrowUpDown, RefreshCw, Calendar, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';
import BookingCard from '../components/booking-history/BookingCard';
import BookingDetailsModal from '../components/booking-history/BookingDetailsModal';

const BookingHistoryPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters, Search & Sort
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Modal State
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await getUserBookings();
      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Unable to load your booking history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setBookings([]);
    setSelectedBooking(null);
    if (user?._id) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user?._id]);

  // Handle Cancellation
  const handleCancelBooking = async (bookingId) => {
    try {
      const { data } = await cancelBooking(bookingId);
      if (data.success) {
        addToast('Booking cancelled successfully', 'success');
        // Update state locally
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId
              ? { ...b, status: 'Cancelled', paymentStatus: b.paymentStatus === 'Paid' ? 'Refunded' : b.paymentStatus }
              : b
          )
        );
        if (selectedBooking && selectedBooking._id === bookingId) {
          setSelectedBooking((prev) => ({
            ...prev,
            status: 'Cancelled',
            paymentStatus: prev.paymentStatus === 'Paid' ? 'Refunded' : prev.paymentStatus
          }));
        }
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to cancel booking. Please try again.';
      addToast(msg, 'error');
    }
  };

  // Handle Mock Payment completion if needed
  const handlePayBooking = async (bookingId) => {
    try {
      const { data } = await payBooking(bookingId, {
        cardholderName: user?.name || 'Customer Name',
        cardNumber: '4111222233334444'
      });
      if (data.success) {
        addToast('Payment completed successfully!', 'success');
        fetchBookings();
        setSelectedBooking(null);
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Payment processing failed', 'error');
    }
  };

  // Filter & Search & Sort logic
  const filteredBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        // Tab Filter
        if (activeTab === 'Upcoming') {
          const isUpcomingStatus = booking.status === 'Confirmed' || booking.status === 'Pending';
          const isFuture = new Date(booking.pickupDate) >= new Date(new Date().setHours(0, 0, 0, 0));
          if (!isUpcomingStatus || !isFuture) return false;
        } else if (activeTab !== 'All') {
          if (booking.status !== activeTab) return false;
        }

        // Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const carBrand = booking.car?.brand?.toLowerCase() || '';
          const carModel = booking.car?.model?.toLowerCase() || '';
          const bId = booking.bookingId?.toLowerCase() || booking._id?.toLowerCase() || '';
          const loc = booking.pickupLocation?.toLowerCase() || '';

          return carBrand.includes(q) || carModel.includes(q) || bId.includes(q) || loc.includes(q);
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (sortBy === 'pickupDate') {
          return new Date(a.pickupDate) - new Date(b.pickupDate);
        } else {
          // default: newest
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
  }, [bookings, activeTab, searchQuery, sortBy]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-asphalt p-4">
        <div className="bg-graphite border border-white/10 p-8 text-center space-y-4 max-w-md rounded-3xl">
          <h2 className="text-sm font-bold uppercase tracking-widest text-chalk font-display">Authentication Required</h2>
          <p className="text-xs text-silver">Please sign in to view your reservation bookings history.</p>
          <Link to="/login" className="inline-block px-6 py-3 bg-neon-accent hover:bg-chalk text-asphalt font-bold text-xs uppercase tracking-widest rounded-xl">
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-asphalt pt-28 pb-20 text-chalk animate-page-enter">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 space-y-8">
        
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-neon-accent" />
              <span className="text-[10px] font-bold text-silver uppercase tracking-widest">JOURNEY ARCHIVE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display text-chalk uppercase tracking-wider">
              BOOKING HISTORY
            </h1>
            <p className="text-xs sm:text-sm text-silver/70 tracking-wide max-w-xl font-sans">
              View, track, and manage all your past, present, and upcoming vehicle rental reservations.
            </p>
          </div>

          <Button
            onClick={fetchBookings}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-silver text-xs px-4 py-2.5 flex items-center gap-2 self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh History</span>
          </Button>
        </div>

        {/* Filters & Search Control Bar */}
        <div className="bg-graphite/60 border border-white/10 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {['All', 'Upcoming', 'Active', 'Completed', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab
                    ? 'bg-neon-accent text-asphalt shadow-md shadow-neon-accent/20 font-extrabold'
                    : 'bg-white/5 text-silver hover:text-chalk hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-silver/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search booking ID, car..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-asphalt border border-white/10 rounded-xl text-xs text-chalk focus:outline-none focus:border-neon-accent transition-colors"
              />
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-asphalt border border-white/10 rounded-xl text-xs text-silver focus:outline-none focus:border-neon-accent font-bold uppercase tracking-wider appearance-none pr-8 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="pickupDate">Pickup Date</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-silver/60 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          /* Loading Skeleton State */
          <div className="space-y-6">
            {[1, 2].map((n) => (
              <div key={n} className="bg-graphite/40 border border-white/5 rounded-3xl p-6 h-64 animate-pulse flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-32 h-6 bg-white/10 rounded-lg" />
                  <div className="w-24 h-6 bg-white/10 rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 aspect-[16/10] bg-white/5 rounded-2xl" />
                  <div className="md:col-span-7 space-y-3">
                    <div className="w-48 h-6 bg-white/10 rounded-lg" />
                    <div className="w-32 h-4 bg-white/5 rounded-md" />
                    <div className="w-full h-12 bg-white/5 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-graphite border border-rose-900/60 p-10 rounded-3xl text-center space-y-4 max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="text-base font-bold uppercase tracking-wider text-chalk">Unable to load your booking history</h3>
            <p className="text-xs text-silver">{error}</p>
            <Button
              onClick={fetchBookings}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-6 py-2.5 font-bold uppercase tracking-wider"
            >
              Try Again
            </Button>
          </div>
        ) : filteredBookings.length === 0 ? (
          /* Empty State */
          <EmptyState
            icon="🚙"
            title="No Bookings Yet"
            description={
              searchQuery || activeTab !== 'All'
                ? 'No rental reservations match your active filter criteria.'
                : 'Your booked vehicles will appear here once reserved.'
            }
            actionText="Browse Available Cars"
            actionLink="/cars"
          />
        ) : (
          /* Bookings Card List */
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onViewDetails={(b) => setSelectedBooking(b)}
                onCancelBooking={handleCancelBooking}
              />
            ))}
          </div>
        )}

        {/* Detailed Booking Modal */}
        {selectedBooking && (
          <BookingDetailsModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onCancelBooking={handleCancelBooking}
            onPayBooking={handlePayBooking}
          />
        )}

      </div>
    </div>
  );
};

export default BookingHistoryPage;
