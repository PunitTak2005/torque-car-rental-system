import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { ROUTES } from '../constants/routes';

// Lazy loaded page components
const Home = lazy(() => import('../pages/Home'));
const BrowseCars = lazy(() => import('../pages/BrowseCars'));
const CarDetails = lazy(() => import('../pages/CarDetails'));
const BookingWorkflow = lazy(() => import('../pages/BookingWorkflow'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const Contact = lazy(() => import('../pages/Contact'));
const About = lazy(() => import('../pages/About'));
const UserDashboard = lazy(() => import('../pages/UserDashboard'));
const BookingHistoryPage = lazy(() => import('../pages/BookingHistoryPage'));
const Favorites = lazy(() => import('../pages/Favorites'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));

// Premium TORQUE loading animation: Subtle horizontal line & mechanical text motion
const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-asphalt gap-6">
    <div className="text-sm font-bold tracking-[0.6em] text-chalk animate-pulse font-sans">
      TORQUE
    </div>
    <div className="w-24 h-[1px] bg-white/10 relative overflow-hidden">
      <div className="absolute top-0 left-0 h-full w-8 bg-neon-accent animate-[shimmer_1.5s_infinite_linear]" 
           style={{ animation: 'shimmer 1.5s infinite linear' }} />
    </div>
    <p className="text-[8px] font-bold text-silver/60 uppercase tracking-[0.3em] animate-pulse">SYSTEM INITIALIZATION</p>
  </div>
);

// Dynamic Document Title Updater for Page specific TORQUE naming
const TitleManager = () => {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      [ROUTES.HOME]: 'TORQUE — Drive With Force.',
      [ROUTES.CARS]: 'TORQUE — Fleet Gallery',
      [ROUTES.LOGIN]: 'TORQUE — Sign In',
      [ROUTES.REGISTER]: 'TORQUE — Join Showroom',
      [ROUTES.CONTACT]: 'TORQUE — Contact Operations',
      [ROUTES.ABOUT]: 'TORQUE — About Platform',
      [ROUTES.DASHBOARD]: 'TORQUE — Client Dashboard',
      [ROUTES.MY_BOOKINGS]: 'TORQUE — Journey Timeline',
      [ROUTES.ADMIN]: 'TORQUE — Control Center'
    };

    // Match patterns for car detail configurations or workflow booking path parameters
    let matchedTitle = titles[location.pathname] || 'TORQUE — Drive With Force.';
    if (location.pathname.startsWith('/cars/')) matchedTitle = 'TORQUE — Configure Vehicle';
    if (location.pathname.startsWith('/booking/')) matchedTitle = 'TORQUE — Book Your Drive';

    document.title = matchedTitle;
  }, [location]);

  return null;
};

export const AppRoutes = () => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="animate-page-enter">
      <TitleManager />
      <Suspense fallback={<LoadingFallback />}>
        <Routes location={location}>
          {/* Public Routes */}
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.CARS} element={<BrowseCars />} />
          <Route path={ROUTES.CAR_DETAILS} element={<CarDetails />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />
          <Route path={ROUTES.ABOUT} element={<About />} />

          {/* Customer Protected Routes */}
          <Route
            path={ROUTES.BOOKING_WITH_ID}
            element={
              <ProtectedRoute>
                <BookingWorkflow />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.BOOKING}
            element={
              <ProtectedRoute>
                <BookingWorkflow />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MY_BOOKINGS}
            element={
              <ProtectedRoute>
                <BookingHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FAVORITES}
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path={ROUTES.ADMIN}
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback redirect */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppRoutes;
