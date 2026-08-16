import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getAdminDashboard,
  getCars,
  adminGetBookings,
  adminGetUsers,
  adminGetPayments,
  adminGetReviews,
  adminAddCar,
  adminEditCar,
  adminDeleteCar,
  adminUpdateBookingStatus,
  adminUpdateUserRole,
  adminUpdateUserStatus,
  adminDeleteReview
} from '../services/api';
import { AdminSkeleton } from '../components/SkeletonLoader';
import Button from '../components/common/Button';
import Rating from '../components/common/Rating';

// Admin Subcomponents
import AdminLayout from '../components/admin/AdminLayout';
import AdminWelcome from '../components/admin/AdminWelcome';
import StatCard from '../components/admin/StatCard';
import RevenueChart from '../components/admin/RevenueChart';
import BookingChart from '../components/admin/BookingChart';
import RecentBookings from '../components/admin/RecentBookings';
import CarAvailability from '../components/admin/CarAvailability';
import PopularCars from '../components/admin/PopularCars';
import RecentUsers from '../components/admin/RecentUsers';
import ActivityFeed from '../components/admin/ActivityFeed';
import QuickActions from '../components/admin/QuickActions';
import BookingDetailsModal from '../components/admin/BookingDetailsModal';
import CarModal from '../components/admin/CarModal';

import {
  Car as CarIcon,
  ClipboardList,
  Users as UsersIcon,
  IndianRupee,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Ban,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle,
  CreditCard,
  MessageSquare,
  ShieldAlert,
  Settings as SettingsIcon,
  Sliders,
  Bell
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Core Data States
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    totalBookings: 0,
    activeRentals: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [popularCars, setPopularCars] = useState([]);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Modal States
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [isSubmittingCar, setIsSubmittingCar] = useState(false);

  // Car Form States
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carCategory, setCarCategory] = useState('Sedan');
  const [carTransmission, setCarTransmission] = useState('Automatic');
  const [carFuel, setCarFuel] = useState('Petrol');
  const [carLocation, setCarLocation] = useState('');
  const [carPrice, setCarPrice] = useState('');
  const [carDeposit, setCarDeposit] = useState('8000');
  const [carSeats, setCarSeats] = useState('5');
  const [carDoors, setCarDoors] = useState('4');
  const [carImages, setCarImages] = useState('');
  const [carDescription, setCarDescription] = useState('');
  const [carErrors, setCarErrors] = useState({});

  // Fleet Catalog Pagination & Filter States
  const [fleetPage, setFleetPage] = useState(1);
  const [fleetPageSize, setFleetPageSize] = useState('12'); // '12', '24', '36', 'All'
  const [fleetStatusFilter, setFleetStatusFilter] = useState('all'); // 'all', 'available', 'booked'
  const [fleetCategoryFilter, setFleetCategoryFilter] = useState('all');

  // Primary Data Fetcher
  const loadDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      // Fetch core dashboard metrics
      const [dashRes, carsRes, bookingsRes, usersRes, paymentsRes, reviewsRes] = await Promise.allSettled([
        getAdminDashboard(),
        getCars({ limit: 100 }),
        adminGetBookings(),
        adminGetUsers(),
        adminGetPayments(),
        adminGetReviews()
      ]);

      if (dashRes.status === 'fulfilled' && dashRes.value.data.success) {
        setStats(dashRes.value.data.stats || {});
        setMonthlyStats(dashRes.value.data.monthlyStats || []);
        setPopularCars(dashRes.value.data.popularCars || []);
      }

      if (carsRes.status === 'fulfilled' && carsRes.value.data.success) {
        setCars(carsRes.value.data.cars || []);
      }

      if (bookingsRes.status === 'fulfilled' && bookingsRes.value.data.success) {
        setBookings(bookingsRes.value.data.bookings || []);
      }

      if (usersRes.status === 'fulfilled' && usersRes.value.data.success) {
        setUsers(usersRes.value.data.users || []);
      }

      if (paymentsRes.status === 'fulfilled' && paymentsRes.value.data.success) {
        setPayments(paymentsRes.value.data.payments || []);
      }

      if (reviewsRes.status === 'fulfilled' && reviewsRes.value.data.success) {
        setReviews(reviewsRes.value.data.reviews || []);
      }

      if (isRefresh) addToast('Dashboard metrics synchronized', 'success');
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      setError('Unable to load dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Booking Status Handler
  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
      );
      if (selectedBooking && selectedBooking._id === bookingId) {
        setSelectedBooking((prev) => (prev ? { ...prev, status } : prev));
      }
      const { data } = await adminUpdateBookingStatus(bookingId, status);
      if (data.success) {
        addToast(`Booking status updated to ${status}`, 'success');
        loadDashboardData(true);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update booking status', 'error');
      loadDashboardData(true);
    }
  };

  // User Role Handler
  const handleToggleUserRole = async (userId, currentRole) => {
    try {
      const role = currentRole === 'admin' ? 'customer' : 'admin';
      const { data } = await adminUpdateUserRole(userId, role);
      if (data.success) {
        addToast(`User role updated to ${role}`, 'success');
        loadDashboardData(true);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to modify user role', 'error');
    }
  };

  // User Status Toggle Handler
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const status = currentStatus === 'active' ? 'suspended' : 'active';
      const { data } = await adminUpdateUserStatus(userId, status);
      if (data.success) {
        addToast(`User account status set to ${status}`, 'success');
        loadDashboardData(true);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to modify account status', 'error');
    }
  };

  // Delete Review Handler
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this customer review?')) return;
    try {
      const { data } = await adminDeleteReview(reviewId);
      if (data.success) {
        addToast('Review deleted successfully', 'success');
        loadDashboardData(true);
      }
    } catch (err) {
      addToast('Failed to delete review', 'error');
    }
  };

  // Open Car CRUD Modal
  const openCarModal = (carObj = null) => {
    if (carObj) {
      setEditingCar(carObj);
      setCarBrand(carObj.brand);
      setCarModel(carObj.model);
      setCarCategory(carObj.category);
      setCarTransmission(carObj.specifications?.transmission || 'Automatic');
      setCarFuel(carObj.specifications?.fuelType || 'Petrol');
      setCarLocation(Array.isArray(carObj.location) ? carObj.location[0] : (carObj.location || ''));
      setCarPrice(carObj.pricePerDay);
      setCarDeposit(carObj.securityDeposit || 8000);
      setCarSeats(carObj.specifications?.seats || '5');
      setCarDoors(carObj.specifications?.doors || '4');
      setCarImages(carObj.images?.join(', ') || '');
      setCarDescription(carObj.description || '');
    } else {
      setEditingCar(null);
      setCarBrand('');
      setCarModel('');
      setCarCategory('Sedan');
      setCarTransmission('Automatic');
      setCarFuel('Petrol');
      setCarLocation('');
      setCarPrice('');
      setCarDeposit('8000');
      setCarSeats('5');
      setCarDoors('4');
      setCarImages('');
      setCarDescription('');
    }
    setCarErrors({});
    setIsCarModalOpen(true);
  };

  // Submit Car Form
  const handleCarSubmit = async (e) => {
    e.preventDefault();

    const errs = {};
    if (!carBrand.trim()) errs.brand = 'Brand name is required';
    if (!carModel.trim()) errs.model = 'Model name is required';
    if (!carLocation.trim()) errs.location = 'Location hub is required';
    if (!carPrice || Number(carPrice) <= 0) errs.price = 'Valid daily rate is required';
    if (!carDeposit || Number(carDeposit) <= 0) errs.deposit = 'Valid security deposit is required';
    if (!carImages.trim()) errs.images = 'At least one image URL is required';
    if (!carDescription.trim() || carDescription.trim().length < 20) {
      errs.description = 'Description is required (min 20 characters)';
    }

    if (Object.keys(errs).length > 0) {
      setCarErrors(errs);
      return;
    }

    setCarErrors({});
    setIsSubmittingCar(true);

    const payload = {
      brand: carBrand,
      model: carModel,
      category: carCategory,
      location: carLocation,
      pricePerDay: Number(carPrice),
      securityDeposit: Number(carDeposit),
      images: carImages.split(',').map((url) => url.trim()).filter((url) => url.length > 0),
      description: carDescription,
      specifications: {
        transmission: carTransmission,
        fuelType: carFuel,
        seats: Number(carSeats),
        doors: Number(carDoors)
      }
    };

    try {
      if (editingCar) {
        const { data } = await adminEditCar(editingCar._id, payload);
        if (data.success) {
          addToast('Vehicle record updated successfully!', 'success');
          setIsCarModalOpen(false);
          loadDashboardData(true);
        }
      } else {
        const { data } = await adminAddCar(payload);
        if (data.success) {
          addToast('New vehicle published to fleet!', 'success');
          setIsCarModalOpen(false);
          loadDashboardData(true);
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error saving vehicle', 'error');
    } finally {
      setIsSubmittingCar(false);
    }
  };

  // Delete Car
  const handleDeleteCar = async (carId) => {
    if (!window.confirm('Delete this vehicle from fleet? Associated records will be removed.')) return;
    try {
      const { data } = await adminDeleteCar(carId);
      if (data.success) {
        addToast('Vehicle removed from fleet registry', 'success');
        loadDashboardData(true);
      }
    } catch (err) {
      addToast('Failed to delete vehicle', 'error');
    }
  };

  // Filter helper for search query
  const matchesSearch = (text) => {
    if (!searchQuery.trim()) return true;
    return text?.toLowerCase().includes(searchQuery.toLowerCase().trim());
  };

  const filteredCars = cars.filter((c) => {
    const matchesQuery = matchesSearch(c.brand) || matchesSearch(c.model) || matchesSearch(c.category) || matchesSearch(Array.isArray(c.location) ? c.location.join(' ') : c.location);
    const matchesStatus = fleetStatusFilter === 'all' ? true : (fleetStatusFilter === 'available' ? c.availability === true : c.availability === false);
    const matchesCategory = fleetCategoryFilter === 'all' ? true : (c.category || '').toLowerCase() === fleetCategoryFilter.toLowerCase();
    return matchesQuery && matchesStatus && matchesCategory;
  });

  const totalFleetCount = filteredCars.length;
  const numFleetPageSize = fleetPageSize === 'All' ? totalFleetCount : Number(fleetPageSize);
  const totalFleetPages = fleetPageSize === 'All' ? 1 : Math.ceil(totalFleetCount / numFleetPageSize) || 1;
  const safeFleetPage = Math.min(Math.max(1, fleetPage), totalFleetPages);
  
  const startFleetIdx = totalFleetCount === 0 ? 0 : (safeFleetPage - 1) * numFleetPageSize + 1;
  const endFleetIdx = fleetPageSize === 'All' ? totalFleetCount : Math.min(safeFleetPage * numFleetPageSize, totalFleetCount);

  const paginatedCars = fleetPageSize === 'All'
    ? filteredCars
    : filteredCars.slice((safeFleetPage - 1) * numFleetPageSize, safeFleetPage * numFleetPageSize);

  const filteredUsers = users.filter((u) =>
    matchesSearch(u.name) || matchesSearch(u.email) || matchesSearch(u.phone)
  );

  const filteredPayments = payments.filter((p) =>
    matchesSearch(p.transactionId) || matchesSearch(p.cardholderName) || matchesSearch(p.booking?.bookingId)
  );

  // Derived counts for sidebar badges
  const counts = {
    carsCount: cars.length,
    bookingsCount: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'Pending').length,
    confirmedBookings: bookings.filter(b => b.status === 'Confirmed').length,
    activeBookings: bookings.filter(b => b.status === 'Active').length,
    completedBookings: bookings.filter(b => b.status === 'Completed').length,
    cancelledBookings: bookings.filter(b => (b.status === 'Cancelled' || b.status === 'Rejected')).length,
    usersCount: users.length,
    paymentsCount: payments.length,
    reviewsCount: reviews.length,
    activityCount: bookings.length + payments.length + users.length
  };

  // Render Skeleton while loading
  if (loading) {
    return (
      <AdminLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        counts={counts}
      >
        <AdminSkeleton />
      </AdminLayout>
    );
  }

  // Graceful Error State
  if (error) {
    return (
      <AdminLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        counts={counts}
      >
        <div className="bg-graphite/60 backdrop-blur-md rounded-3xl p-8 border border-white/10 text-center max-w-lg mx-auto my-12 space-y-4 shadow-xl">
          <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-chalk uppercase">{error}</h3>
          <p className="text-xs text-silver/70">
            Please verify your network connection or backend service status.
          </p>
          <Button onClick={() => loadDashboardData()} className="text-xs px-5 py-2.5 bg-neon-accent text-asphalt font-extrabold uppercase">
            <RefreshCw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      counts={counts}
    >
      <div className="space-y-8 animate-page-enter">
        
        {/* Welcome Greeting Banner */}
        <AdminWelcome
          adminName={user?.name}
          onRefresh={() => loadDashboardData(true)}
          isRefreshing={refreshing}
        />

        {/* ==================================================
            TAB 1: OVERVIEW & ANALYTICS DASHBOARD
           ================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Quick Actions Panel */}
            <QuickActions
              onAddCar={() => openCarModal()}
              onSelectTab={setActiveTab}
            />

            {/* Statistics Cards Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" aria-label="KPI Metrics">
              <StatCard
                title="Total Revenue"
                headerSubtitle="Revenue from successful bookings"
                value={stats.totalRevenue ? `₹${stats.totalRevenue.toLocaleString('en-IN')}` : '₹0'}
                icon={IndianRupee}
                trend={stats.revenueGrowthLabel || 'No previous-month comparison'}
                trendType={stats.revenueGrowthTrend || 'neutral'}
                statusDescription={stats.revenueGrowthPercentage !== null ? (stats.revenueGrowthTrend === 'positive' ? 'Higher than previous month' : stats.revenueGrowthTrend === 'negative' ? 'Lower than previous month' : 'Equal to previous month') : 'This is your first month. Keep it up!'}
                iconBgColor="bg-neon-accent/10 border-neon-accent/30 text-neon-accent"
              />
              <StatCard
                title="Total Fleet"
                headerSubtitle="Vehicles in fleet registry"
                value={stats.totalCars || 0}
                icon={CarIcon}
                trend={`${stats.availableCars || 0} Available`}
                trendType="positive"
                statusDescription="Ready for immediate booking"
                iconBgColor="bg-neon-accent/10 border-neon-accent/30 text-neon-accent"
              />
              <StatCard
                title="Total Bookings"
                headerSubtitle="All-time reservations"
                value={stats.totalBookings || 0}
                icon={ClipboardList}
                trend={`${stats.activeRentals || 0} Active Trips`}
                trendType="positive"
                statusDescription="Currently on road"
                iconBgColor="bg-neon-accent/10 border-neon-accent/30 text-neon-accent"
              />
              <StatCard
                title="Total Customers"
                headerSubtitle="Registered driver directory"
                value={stats.totalUsers || 0}
                icon={UsersIcon}
                trend="Active Directory"
                trendType="positive"
                statusDescription="Authenticated client accounts"
                iconBgColor="bg-neon-accent/10 border-neon-accent/30 text-neon-accent"
              />
            </section>

            {/* Charts & Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <RevenueChart
                  monthlyStats={monthlyStats}
                  totalRevenue={stats.totalRevenue}
                />
              </div>
              <div className="lg:col-span-4">
                <BookingChart
                  bookings={bookings}
                  loading={loading}
                  error={error}
                  onRetry={() => loadDashboardData()}
                />
              </div>
            </div>

            {/* Recent Bookings & Fleet Status Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <RecentBookings
                  bookings={bookings}
                  onSelectBooking={(b) => {
                    setSelectedBooking(b);
                    setIsBookingModalOpen(true);
                  }}
                  onViewAll={() => setActiveTab('bookings')}
                  onUpdateStatus={handleUpdateBookingStatus}
                  searchQuery={searchQuery}
                />
              </div>
              <div className="lg:col-span-4 space-y-8">
                <CarAvailability
                  cars={cars}
                  onManageCars={() => setActiveTab('cars')}
                />
                <PopularCars popularCars={popularCars} />
              </div>
            </div>

            {/* Customers & Activity Timeline Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                <RecentUsers
                  users={users}
                  onToggleUserRole={handleToggleUserRole}
                  onToggleUserStatus={handleToggleUserStatus}
                  onViewAll={() => setActiveTab('users')}
                />
              </div>
              <div className="lg:col-span-5">
                <ActivityFeed
                  bookings={bookings}
                  payments={payments}
                  users={users}
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            TAB 2: FLEET REGISTRY (CARS MANAGEMENT)
           ================================================== */}
        {activeTab === 'cars' && (
          <div className="bg-graphite/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Header & Add Vehicle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-sm font-extrabold text-chalk uppercase tracking-widest font-display">
                  FLEET CATALOG ({totalFleetCount} Vehicles)
                </h3>
                <p className="text-xs text-silver/70">
                  Showing {startFleetIdx}–{endFleetIdx} of {totalFleetCount} vehicles in Torque fleet
                </p>
              </div>

              <Button onClick={() => openCarModal()} className="text-xs px-5 py-2.5 bg-neon-accent text-asphalt font-extrabold uppercase tracking-wider">
                <Plus className="w-4 h-4 mr-1.5" /> Add Vehicle
              </Button>
            </div>

            {/* Toolbar: Category, Status, Page Size */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-asphalt/50 p-4 rounded-2xl border border-white/5 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                {/* Status Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase text-silver/70 tracking-wider">Status:</span>
                  <select
                    value={fleetStatusFilter}
                    onChange={(e) => {
                      setFleetStatusFilter(e.target.value);
                      setFleetPage(1);
                    }}
                    className="bg-graphite text-chalk border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-neon-accent"
                  >
                    <option value="all">All Statuses ({cars.length})</option>
                    <option value="available">Available ({cars.filter(c => c.availability).length})</option>
                    <option value="booked">Booked ({cars.filter(c => !c.availability).length})</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase text-silver/70 tracking-wider">Category:</span>
                  <select
                    value={fleetCategoryFilter}
                    onChange={(e) => {
                      setFleetCategoryFilter(e.target.value);
                      setFleetPage(1);
                    }}
                    className="bg-graphite text-chalk border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-neon-accent"
                  >
                    <option value="all">All Categories</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="luxury">Luxury</option>
                    <option value="electric">Electric</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="off-road">Off-Road</option>
                  </select>
                </div>
              </div>

              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase text-silver/70 tracking-wider">Per Page:</span>
                {['12', '24', '36', 'All'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setFleetPageSize(sz);
                      setFleetPage(1);
                    }}
                    className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      fleetPageSize === sz
                        ? 'bg-neon-accent text-asphalt border-neon-accent'
                        : 'bg-graphite text-silver border-white/10 hover:border-white/30'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Fleet Table */}
            <div className="overflow-x-auto border border-white/10 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse min-w-[750px]">
                <thead>
                  <tr className="bg-asphalt border-b border-white/10 text-silver uppercase font-extrabold tracking-widest text-[9px]">
                    <th className="p-4">Vehicle Details</th>
                    <th className="p-4">Location Hub</th>
                    <th className="p-4 text-center">Daily Rate</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[10px] tracking-wider">
                  {paginatedCars.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-silver/60 italic uppercase tracking-widest">
                        No vehicles found matching search parameters.
                      </td>
                    </tr>
                  ) : (
                    paginatedCars.map((car) => (
                      <tr key={car._id} className="hover:bg-asphalt/60 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {car.images?.[0] ? (
                              <img
                                src={car.images[0]}
                                alt=""
                                className="w-14 aspect-[16/10] object-cover border border-white/10 shrink-0 rounded-xl bg-asphalt"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'; }}
                              />
                            ) : (
                              <div className="w-14 aspect-[16/10] bg-asphalt flex items-center justify-center shrink-0 border border-white/10 rounded-xl">
                                <CarIcon className="w-4 h-4 text-silver" />
                              </div>
                            )}
                            <div>
                              <h4 className="font-extrabold text-chalk uppercase font-display">
                                {car.brand} {car.model}
                              </h4>
                              <span className="text-[9px] font-bold text-silver/70 block mt-0.5 uppercase">
                                {car.category} &bull; {car.specifications?.transmission || 'Auto'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-silver font-bold uppercase">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-neon-accent" />
                            {Array.isArray(car.location) ? car.location[0] : (car.location || 'All Hubs')}
                          </span>
                        </td>

                        <td className="p-4 text-center font-extrabold text-neon-accent font-sans">
                          ₹{car.pricePerDay?.toLocaleString() || car.pricePerDay}
                        </td>

                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 text-[8px] font-extrabold rounded-full tracking-widest uppercase ${
                            car.availability
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-white/5 text-silver border border-white/10'
                          }`}>
                            {car.availability ? 'Available' : 'Booked'}
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openCarModal(car)}
                              className="p-2 bg-asphalt hover:bg-white/10 text-silver hover:text-neon-accent border border-white/10 rounded-xl transition-all cursor-pointer"
                              title="Edit vehicle"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCar(car._id)}
                              className="p-2 bg-asphalt hover:bg-rose-955 text-silver hover:text-rose-400 border border-white/10 rounded-xl transition-all cursor-pointer"
                              title="Delete vehicle"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs">
              <span className="text-silver/70 text-xs">
                Showing <strong className="text-chalk">{startFleetIdx}–{endFleetIdx}</strong> of <strong className="text-chalk">{totalFleetCount}</strong> vehicles
              </span>

              {totalFleetPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    disabled={safeFleetPage === 1}
                    onClick={() => setFleetPage((p) => Math.max(1, p - 1))}
                    className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-asphalt text-chalk text-xs font-extrabold hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalFleetPages }, (_, i) => i + 1).map((pgNum) => (
                      <button
                        key={pgNum}
                        onClick={() => setFleetPage(pgNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                          safeFleetPage === pgNum
                            ? 'bg-neon-accent text-asphalt border-neon-accent'
                            : 'bg-asphalt text-silver border-white/10 hover:border-white/30'
                        }`}
                      >
                        {pgNum}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={safeFleetPage === totalFleetPages}
                    onClick={() => setFleetPage((p) => Math.min(totalFleetPages, p + 1))}
                    className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-asphalt text-chalk text-xs font-extrabold hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================
            TAB 3: RESERVATIONS MANAGEMENT
           ================================================== */}
        {activeTab === 'bookings' && (
          <RecentBookings
            bookings={bookings}
            onSelectBooking={(b) => {
              setSelectedBooking(b);
              setIsBookingModalOpen(true);
            }}
            onUpdateStatus={handleUpdateBookingStatus}
            searchQuery={searchQuery}
          />
        )}

        {/* ==================================================
            TAB 4: USER DIRECTORY
           ================================================== */}
        {activeTab === 'users' && (
          <div className="bg-graphite/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-sm font-extrabold text-chalk uppercase tracking-widest font-display">
                  USER DIRECTORY ({filteredUsers.length})
                </h3>
                <p className="text-xs text-silver/70">
                  Manage registered customer accounts, admin privileges, and status
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-white/10 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-asphalt border-b border-white/10 text-silver uppercase font-extrabold tracking-widest text-[9px]">
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Registered Date</th>
                    <th className="p-4 text-center">Role</th>
                    <th className="p-4 text-center">Account Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[10px] tracking-wider">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-silver/60 italic uppercase tracking-widest">
                        No users match search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-asphalt/60 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-asphalt border border-white/10 flex items-center justify-center font-extrabold text-neon-accent text-xs shrink-0 rounded-xl">
                              {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-chalk uppercase">
                                {u.name}
                              </h4>
                              <span className="text-[9px] text-silver/60 block lowercase mt-0.5">
                                {u.email} {u.phone ? `• ${u.phone}` : ''}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-silver font-bold uppercase">
                          {new Date(u.createdAt).toLocaleDateString('en-IN')}
                        </td>

                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 text-[8px] font-extrabold rounded-full uppercase tracking-widest ${
                            u.role === 'admin'
                              ? 'bg-neon-accent/20 text-neon-accent border border-neon-accent/40'
                              : 'bg-white/5 text-silver border border-white/10'
                          }`}>
                            {u.role}
                          </span>
                        </td>

                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 text-[8px] font-extrabold rounded-full tracking-widest uppercase ${
                            u.status === 'active' || !u.status
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          }`}>
                            {u.status || 'active'}
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleToggleUserRole(u._id, u.role)}
                              className="p-2 bg-asphalt hover:bg-white/10 text-silver hover:text-neon-accent border border-white/10 rounded-xl transition-all cursor-pointer"
                              title="Toggle admin role"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleUserStatus(u._id, u.status)}
                              className="p-2 bg-asphalt hover:bg-rose-955 text-silver hover:text-rose-400 border border-white/10 rounded-xl transition-all cursor-pointer"
                              title="Toggle suspension"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================
            TAB 5: PAYMENTS AUDIT LOGS
           ================================================== */}
        {activeTab === 'payments' && (
          <div className="bg-graphite/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-extrabold text-chalk uppercase tracking-widest font-display">
                TRANSACTION AUDIT LOGS ({filteredPayments.length})
              </h3>
              <p className="text-xs text-silver/70">
                Verified payment gateway receipts & financial logs
              </p>
            </div>

            <div className="overflow-x-auto border border-white/10 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-asphalt border-b border-white/10 text-silver uppercase font-extrabold tracking-widest text-[9px]">
                    <th className="p-4">Transaction Ref</th>
                    <th className="p-4">Cardholder / Last 4</th>
                    <th className="p-4 text-center">Amount</th>
                    <th className="p-4 text-center">Date</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[10px] tracking-wider">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-silver/60 italic uppercase tracking-widest">
                        No transactions recorded.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((p) => (
                      <tr key={p._id} className="hover:bg-asphalt/60 transition-colors">
                        <td className="p-4 font-mono font-bold text-neon-accent uppercase tracking-wider">
                          {p.transactionId}
                          <span className="text-[10px] font-sans font-normal text-silver/60 block mt-0.5">
                            Booking: #{p.booking?.bookingId || p.booking?._id?.slice(-6) || 'N/A'}
                          </span>
                        </td>

                        <td className="p-4 font-bold text-chalk uppercase">
                          {p.cardholderName} (•••• {p.last4Digits})
                        </td>

                        <td className="p-4 text-center font-extrabold text-neon-accent font-sans">
                          ₹{p.amount?.toLocaleString() || p.amount}
                        </td>

                        <td className="p-4 text-center text-silver uppercase font-bold">
                          {new Date(p.createdAt).toLocaleDateString('en-IN')}
                        </td>

                        <td className="p-4 text-right">
                          <span className={`px-3 py-1 text-[8px] font-extrabold rounded-full tracking-widest uppercase ${
                            p.status === 'Success'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================
            TAB 6: REVIEWS MODERATION
           ================================================== */}
        {activeTab === 'reviews' && (
          <div className="bg-graphite/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-extrabold text-chalk uppercase tracking-widest font-display">
                REVIEW MODERATION FEED ({reviews.length})
              </h3>
              <p className="text-xs text-silver/70">
                Monitor and moderate customer vehicle feedback
              </p>
            </div>

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="py-8 text-center text-silver/60 text-xs italic uppercase tracking-widest bg-asphalt/40 rounded-2xl border border-dashed border-white/10">
                  No reviews posted yet.
                </div>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-5 border border-white/10 bg-asphalt/80 rounded-2xl hover:border-white/20 transition-all flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-chalk text-xs uppercase">
                          {rev.user?.name || 'Customer'}
                        </h4>
                        <span className="text-[10px] text-silver/60 font-bold uppercase">
                          &bull; Car: {rev.car ? `${rev.car.brand} ${rev.car.model}` : 'N/A'}
                        </span>
                      </div>

                      <Rating rating={rev.rating} size="w-3.5 h-3.5" className="mt-1" />

                      <p className="text-xs text-silver mt-2 leading-relaxed italic">
                        "{rev.comment}"
                      </p>

                      <span className="text-[10px] text-silver/60 block mt-2 font-bold uppercase">
                        Posted on {new Date(rev.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteReview(rev._id)}
                      className="p-2 text-silver hover:text-rose-400 bg-asphalt hover:bg-rose-955 border border-white/10 rounded-xl transition-colors cursor-pointer"
                      title="Remove review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================================================
            TAB 7: TELEMETRY STREAM
           ================================================== */}
        {activeTab === 'activity' && (
          <ActivityFeed
            bookings={bookings}
            payments={payments}
            users={users}
          />
        )}

        {/* ==================================================
            TAB 8: SYSTEM SETTINGS
           ================================================== */}
        {activeTab === 'settings' && (
          <div className="bg-graphite/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 bg-asphalt rounded-2xl flex items-center justify-center text-neon-accent border border-white/10">
                <SettingsIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-chalk uppercase tracking-widest font-display">
                  PLATFORM CONFIGURATION
                </h3>
                <p className="text-xs text-silver/70">
                  Global rental parameters, currency, and authorization privileges
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-bold tracking-wider">
              <div className="p-5 border border-white/10 bg-asphalt/80 rounded-2xl space-y-3 uppercase">
                <span className="font-extrabold text-chalk block">Platform Currency</span>
                <p className="text-silver/60 text-[10px]">Default currency for booking invoices and billing.</p>
                <input
                  type="text"
                  disabled
                  value="INR (₹)"
                  className="w-full p-3 bg-graphite rounded-xl border border-white/10 text-neon-accent font-extrabold"
                />
              </div>

              <div className="p-5 border border-white/10 bg-asphalt/80 rounded-2xl space-y-3 uppercase">
                <span className="font-extrabold text-chalk block">Security Role</span>
                <p className="text-silver/60 text-[10px]">Authenticated user security privileges.</p>
                <input
                  type="text"
                  disabled
                  value="Full Admin Access (Active)"
                  className="w-full p-3 bg-graphite rounded-xl border border-white/10 text-neon-accent font-extrabold"
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onUpdateStatus={handleUpdateBookingStatus}
      />

      {/* Car CRUD Modal */}
      <CarModal
        isOpen={isCarModalOpen}
        onClose={() => setIsCarModalOpen(false)}
        editingCar={editingCar}
        carFormState={{
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
        }}
        carErrors={carErrors}
        isSubmitting={isSubmittingCar}
        onSubmit={handleCarSubmit}
      />
    </AdminLayout>
  );
};

export default AdminDashboard;
