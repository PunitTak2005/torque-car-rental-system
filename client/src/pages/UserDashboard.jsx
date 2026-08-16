import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getUserBookings, cancelBooking, createReview, updateProfile } from '../services/api';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import { validateName, validateEmail, validatePhone, validatePassword } from '../validations/rules';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Rating from '../components/common/Rating';
import EmptyState from '../components/common/EmptyState';
import BookingDetailsModal from '../components/booking-history/BookingDetailsModal';
import { Calendar, User, Bell, Printer, MapPin, Settings, MessageSquare } from 'lucide-react';

const UserDashboard = () => {
  const { user, logout, notifications, markRead } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');
  const [errors, setErrors] = useState({});
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Review Modal States
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Invoice Modal States
  const [viewingInvoice, setViewingInvoice] = useState(null);

  const fetchBookings = async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }
    try {
      const { data } = await getUserBookings();
      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      addToast('Failed to load reservation bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setBookings([]);
    if (user?._id) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user?._id]);

  const handleCancelClick = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? A refund will be issued if paid.')) {
      return;
    }
    try {
      const { data } = await cancelBooking(bookingId);
      if (data.success) {
        addToast('Booking successfully cancelled and refund initiated.', 'success');
        fetchBookings();
      }
    } catch (error) {
      console.error(error);
      addToast(error.response?.data?.message || 'Failed to cancel booking', 'error');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validations
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const passErr = password ? validatePassword(password) : null;

    if (nameErr || emailErr || phoneErr || passErr) {
      setErrors({
        name: nameErr || '',
        email: emailErr || '',
        phone: phoneErr || '',
        password: passErr || ''
      });
      return;
    }

    setErrors({});
    setIsUpdatingProfile(true);
    try {
      const payload = { name, email, phone, profilePhoto };
      if (password) payload.password = password;

      const { data } = await updateProfile(payload);
      if (data.success) {
        addToast('Profile updated successfully!', 'success');
        setPassword('');
      }
    } catch (error) {
      console.error(error);
      addToast('Failed to update profile settings', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setReviewError('Review comment is required');
      return;
    }
    if (reviewComment.trim().length < 10) {
      setReviewError('Review comment must be at least 10 characters');
      return;
    }

    setReviewError('');
    setIsSubmittingReview(true);
    try {
      const { data } = await createReview({
        bookingId: selectedBookingForReview._id,
        rating: reviewRating,
        comment: reviewComment
      });
      if (data.success) {
        addToast('Review submitted successfully!', 'success');
        setSelectedBookingForReview(null);
        setReviewRating(5);
        setReviewComment('');
        fetchBookings();
      }
    } catch (error) {
      console.error(error);
      addToast(error.response?.data?.message || 'Failed to post review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Calculations for dashboard overview
  const totalSpending = bookings
    .filter(b => b.paymentStatus === 'Paid')
    .reduce((sum, b) => sum + b.billing.totalAmount, 0);

  const activeRentals = bookings.filter(b => b.status === 'Active').length;
  const completedRentals = bookings.filter(b => b.status === 'Completed').length;
  const pendingReservations = bookings.filter(b => b.status === 'Pending').length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10 bg-asphalt min-h-screen">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-asphalt text-chalk min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Sidebar Nav */}
        <aside className="lg:col-span-3 bg-graphite border border-white/5 p-6 space-y-6">
          <div className="flex items-center gap-3">
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt="" className="w-12 h-12 object-cover border border-white/10 shrink-0" />
            ) : (
              <div className="w-12 h-12 bg-asphalt flex items-center justify-center text-silver border border-white/10 shrink-0">
                <User className="w-6 h-6" aria-hidden="true" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-chalk truncate uppercase tracking-widest text-xs">{user?.name}</h2>
              <span className="text-silver/60 text-[9px] uppercase tracking-widest block mt-0.5">{user?.role} Account</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5 pt-4 border-t border-white/5" aria-label="Dashboard navigation">
            {[
              { id: 'bookings', label: 'My Bookings', icon: Calendar },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'profile', label: 'Profile Settings', icon: Settings }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 text-[9px] font-bold text-left transition-colors cursor-pointer uppercase tracking-widest border rounded-none ${
                    activeTab === item.id 
                      ? 'bg-neon-accent text-asphalt border-neon-accent' 
                      : 'text-silver border-transparent hover:bg-stone/10 hover:text-chalk'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Dashboard Main Workspace */}
        <main className="lg:col-span-9 space-y-8">
          
          {/* Dashboard Summary Statistics */}
          {activeTab === 'bookings' && (
            <section className="grid grid-cols-2 md:grid-cols-4 gap-5 animate-fade-in" aria-label="Overview Statistics">
              <div className="bg-graphite/40 border border-white/5 p-5">
                <span className="text-[8px] uppercase font-bold tracking-widest text-silver">Spending</span>
                <h3 className="text-xl font-bold text-neon-accent mt-1">₹{totalSpending?.toLocaleString() || totalSpending}</h3>
              </div>
              <div className="bg-graphite/40 border border-white/5 p-5">
                <span className="text-[8px] uppercase font-bold tracking-widest text-silver">Active</span>
                <h3 className="text-xl font-bold text-chalk mt-1">{activeRentals}</h3>
              </div>
              <div className="bg-graphite/40 border border-white/5 p-5">
                <span className="text-[8px] uppercase font-bold tracking-widest text-silver">Completed</span>
                <h3 className="text-xl font-bold text-chalk mt-1">{completedRentals}</h3>
              </div>
              <div className="bg-graphite/40 border border-white/5 p-5">
                <span className="text-[8px] uppercase font-bold tracking-widest text-silver">Pending</span>
                <h3 className="text-xl font-bold text-chalk mt-1">{pendingReservations}</h3>
              </div>
            </section>
          )}

          {/* Bookings View Content */}
          {activeTab === 'bookings' && (
            <section className="bg-graphite/45 border border-white/5 p-6 sm:p-8 space-y-6" aria-label="My Reservation Bookings">
              <h3 className="text-xs font-bold uppercase tracking-widest text-chalk">Reservation Bookings</h3>

              <div className="space-y-6">
                {bookings.length === 0 ? (
                  <EmptyState
                    icon="🚙"
                    title="No Bookings Yet"
                    description="No bookings yet. Your next journey could start here."
                    actionText="Browse Available Cars"
                    actionLink="/cars"
                  />
                ) : (
                  bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="border border-white/5 p-5 hover:border-white/10 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-5 bg-graphite/20"
                    >
                      <div className="flex gap-4 items-start">
                        {booking.car?.images && (
                          <img
                            src={booking.car.images[0]}
                            alt=""
                            className="w-20 sm:w-24 aspect-[16/10] object-cover border border-white/5 bg-asphalt shrink-0"
                          />
                        )}
                        <div>
                          <span className="text-[8px] font-bold text-silver/60 uppercase tracking-widest block">REF: {booking.bookingId}</span>
                          <h4 className="font-bold text-chalk mt-0.5 text-sm sm:text-base uppercase tracking-wider font-display">{booking.car?.brand} {booking.car?.model}</h4>
                          <span className="text-[10px] text-silver font-bold block mt-1 uppercase tracking-widest">
                            {new Date(booking.pickupDate).toLocaleDateString()} to {new Date(booking.returnDate).toLocaleDateString()}
                          </span>
                          <span className="text-[9px] text-silver/60 mt-1 flex items-center gap-0.5 uppercase tracking-widest font-bold">
                            <MapPin className="w-3 h-3 text-neon-accent" />
                            <span>Pickup: {booking.pickupLocation}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end justify-between h-full gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-neon-accent">₹{booking.billing?.totalAmount?.toLocaleString() || booking.billing?.totalAmount}</span>
                          
                          <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest ${
                            booking.status === 'Confirmed' ? 'bg-emerald-950 text-emerald-450 border border-emerald-800' :
                            booking.status === 'Active' ? 'bg-blue-950 text-blue-450 border border-blue-800' :
                            booking.status === 'Completed' ? 'bg-stone/50 text-chalk border border-stone' :
                            'bg-rose-955 text-rose-455 border border-rose-900'
                          }`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => setViewingInvoice(booking)}
                            variant="secondary"
                            className="text-[9px] px-3 py-1.5"
                          >
                            Receipt
                          </Button>

                          {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                            <Button
                              onClick={() => handleCancelClick(booking._id)}
                              variant="danger"
                              className="text-[9px] px-3 py-1.5"
                            >
                              Cancel Booking
                            </Button>
                          )}

                          {booking.status === 'Completed' && (
                            <Button
                              onClick={() => {
                                setReviewComment('');
                                setReviewError('');
                                setSelectedBookingForReview(booking);
                              }}
                              className="text-[9px] px-3 py-1.5"
                            >
                              <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Write Review</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Notifications View */}
          {activeTab === 'notifications' && (
            <section className="bg-graphite/45 border border-white/5 p-6 sm:p-8 space-y-6" aria-label="Notifications Center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-chalk">Account Notifications</h3>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <p className="text-xs text-silver italic py-6 text-center uppercase tracking-widest">No notifications yet</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => !notif.read && markRead(notif._id)}
                      className={`p-4 border transition-all cursor-pointer flex justify-between items-center gap-4 ${
                        !notif.read 
                          ? 'bg-neon-accent/5 border-neon-accent/30' 
                          : 'bg-asphalt border-white/5'
                      }`}
                    >
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-widest ${!notif.read ? 'text-neon-accent' : 'text-chalk'}`}>
                          {notif.title}
                        </h4>
                        <p className="text-xs text-silver mt-1 leading-relaxed">{notif.message}</p>
                        <span className="text-[9px] text-silver/60 mt-1.5 block uppercase font-bold tracking-widest">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-neon-accent shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Profile Settings Form */}
          {activeTab === 'profile' && (
            <section className="bg-graphite/45 border border-white/5 p-6 sm:p-8 space-y-6" aria-label="Profile Settings">
              <h3 className="text-xs font-bold uppercase tracking-widest text-chalk">Profile Settings</h3>
              
              <form onSubmit={handleProfileSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Full Name"
                    name="name"
                    required
                    value={name}
                    error={errors.name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    required
                    value={email}
                    error={errors.email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                  />

                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    error={errors.phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                    }}
                  />

                  <Input
                    label="Profile Photo URL"
                    name="profilePhoto"
                    type="url"
                    value={profilePhoto}
                    onChange={(e) => setProfilePhoto(e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <Input
                  label="Update Password (Leave blank to keep current)"
                  name="password"
                  type="password"
                  value={password}
                  error={errors.password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  placeholder="Enter new password"
                />

                <Button
                  type="submit"
                  loading={isUpdatingProfile}
                  className="px-6 py-3 text-xs"
                >
                  Save Settings
                </Button>
              </form>
            </section>
          )}

        </main>
      </div>

      {/* Review Modal Form */}
      <Modal
        isOpen={!!selectedBookingForReview}
        onClose={() => setSelectedBookingForReview(null)}
        title="Review Your Rental"
      >
        {selectedBookingForReview && (
          <form onSubmit={handleReviewSubmit} className="space-y-5" noValidate>
            <p className="text-silver text-xs leading-relaxed uppercase tracking-wide">
              Rate your configuration metrics for <strong className="text-chalk">{selectedBookingForReview.car?.brand} {selectedBookingForReview.car?.model}</strong>.
            </p>

            {/* Stars Rating Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-silver uppercase tracking-widest">Rating</label>
              <Rating
                rating={reviewRating}
                setRating={setReviewRating}
                interactive={true}
                size="w-8 h-8"
              />
            </div>

            {/* Comment text */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-silver uppercase tracking-widest">Review Comments</label>
              <textarea
                required
                rows={4}
                value={reviewComment}
                onChange={(e) => {
                  setReviewComment(e.target.value);
                  if (reviewError) setReviewError('');
                }}
                placeholder="What did you like or dislike? (min 10 chars)"
                className={`block w-full px-3.5 py-3 bg-graphite border text-xs resize-none placeholder-silver/40 text-chalk focus:outline-none focus:border-neon-accent rounded-none ${
                  reviewError ? 'border-rose-900 bg-rose-955/20' : 'border-white/10'
                }`}
              />
              {reviewError && (
                <span role="alert" className="text-rose-455 text-[9px] font-bold tracking-widest uppercase mt-0.5">
                  {reviewError}
                </span>
              )}
            </div>

            <Button
              type="submit"
              loading={isSubmittingReview}
              className="w-full py-3 text-xs"
            >
              Post Review
            </Button>
          </form>
        )}
      </Modal>

      {/* Detailed Booking & Invoice Modal */}
      {viewingInvoice && (
        <BookingDetailsModal
          booking={viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          onCancelBooking={handleCancelBooking}
        />
      )}

    </div>
  );
};

export default UserDashboard;
