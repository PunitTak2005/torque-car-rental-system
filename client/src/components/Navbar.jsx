import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Sun, Moon, ChevronDown, User, Calendar, LayoutDashboard, Shield, LogOut, Heart } from 'lucide-react';

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const { addToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const userDropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    addToast('Logged out successfully', 'success');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Format user display names
  const displayName = user?.name ? user.name.split(' ')[0] : 'Client';
  const fullDisplayName = user?.name || 'Authenticated Client';
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <nav className={`fixed top-0 left-0 w-full z-45 transition-all duration-300 ${
      scrolled 
        ? 'bg-asphalt/90 backdrop-blur-md py-4 border-b border-white/10 shadow-lg' 
        : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex justify-between items-center h-8">
          
          {/* Logo / Clean wordmark */}
          <Link to="/" className="text-xs font-bold tracking-[0.4em] text-chalk font-sans">
            TORQUE
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              to="/cars"
              className={`text-[9px] font-bold uppercase tracking-widest transition-all hover:text-neon-accent ${
                isActive('/cars') ? 'text-neon-accent' : 'text-silver'
              }`}
            >
              Fleet
            </Link>
            <Link
              to="/about"
              className={`text-[9px] font-bold uppercase tracking-widest transition-all hover:text-neon-accent ${
                isActive('/about') ? 'text-neon-accent' : 'text-silver'
              }`}
            >
              Journey
            </Link>
          </div>

          {/* Desktop Right Menu & Theme Switcher */}
          <div className="hidden md:flex items-center gap-6">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Light/Dark Theme"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
                theme === 'dark'
                  ? 'bg-neon-accent/10 border-neon-accent/40 text-neon-accent hover:bg-neon-accent/20'
                  : 'bg-chalk text-asphalt border-asphalt/30 hover:bg-asphalt hover:text-chalk'
              }`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-neon-accent" />
                  <span>LIGHT MODE</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-chalk" />
                  <span>DARK MODE</span>
                </>
              )}
            </button>

            {/* User State */}
            {loading ? (
              <div className="w-20 h-7 bg-white/10 animate-pulse rounded-full" />
            ) : user ? (
              <div className="relative" ref={userDropdownRef}>
                
                {/* User Trigger Button displaying Authenticated User Name */}
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-chalk transition-all cursor-pointer group shadow-sm active:scale-95"
                >
                  <span className="w-6 h-6 rounded-full bg-neon-accent text-asphalt font-extrabold text-[10px] flex items-center justify-center font-mono uppercase shadow-sm">
                    {userInitial}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-chalk group-hover:text-neon-accent transition-colors max-w-[130px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-silver transition-transform duration-200 ${userDropdownOpen ? 'rotate-180 text-neon-accent' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-graphite/95 backdrop-blur-xl border border-white/15 rounded-2xl p-2 shadow-2xl space-y-1 animate-modal-enter z-50">
                    
                    {/* Header Info */}
                    <div className="px-3.5 py-3 border-b border-white/10 space-y-0.5">
                      <p className="text-xs font-bold text-chalk uppercase tracking-wide truncate">{fullDisplayName}</p>
                      <p className="text-[9px] font-mono text-silver/60 truncate">{user.email}</p>
                    </div>

                    {/* Menu Options */}
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-silver hover:text-chalk hover:bg-white/5 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-neon-accent" />
                      <span>Profile</span>
                    </Link>

                    <Link
                      to="/my-bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-silver hover:text-chalk hover:bg-white/5 transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5 text-neon-accent" />
                      <span>My Bookings</span>
                    </Link>

                    <Link
                      to="/favorites"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-silver hover:text-chalk hover:bg-white/5 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/30" />
                      <span>Saved Favorites</span>
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-silver hover:text-chalk hover:bg-white/5 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-neon-accent" />
                      <span>Dashboard</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-neon-accent hover:bg-neon-accent/10 transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5 text-neon-accent" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <div className="pt-1 border-t border-white/10">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link
                  to="/login"
                  className="text-[9px] font-bold uppercase tracking-widest text-silver hover:text-chalk"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-chalk text-asphalt text-[9px] font-bold uppercase tracking-widest hover:bg-neon-accent transition-colors rounded-xl shadow-md"
                >
                  Book →
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Theme Controls */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Light/Dark Theme Mobile"
              className="p-2 rounded-full border border-white/15 bg-white/5 text-silver hover:text-chalk cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-neon-accent" /> : <Moon className="w-4 h-4 text-neon-accent" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-chalk hover:text-neon-accent p-1 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-asphalt flex flex-col justify-center px-10 gap-8 animate-page-enter">
          
          {/* User Profile Banner in Mobile Menu */}
          {user && (
            <div className="flex items-center gap-3.5 pb-6 border-b border-white/10">
              <span className="w-12 h-12 rounded-full bg-neon-accent text-asphalt font-extrabold text-base flex items-center justify-center font-mono uppercase shadow-md shrink-0">
                {userInitial}
              </span>
              <div className="space-y-0.5 min-w-0">
                <p className="text-base font-bold uppercase tracking-wider text-chalk truncate">{fullDisplayName}</p>
                <p className="text-xs font-mono text-silver/60 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <Link
            to="/cars"
            onClick={() => setMobileMenuOpen(false)}
            className="text-3xl font-display text-chalk hover:text-neon-accent tracking-widest"
          >
            01 // FLEET
          </Link>
          
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-3xl font-display text-chalk hover:text-neon-accent tracking-widest"
          >
            02 // JOURNEY
          </Link>

          <div className="mt-8 border-t border-white/10 pt-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-silver">THEME PREFERENCE</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 bg-white/5 text-xs font-bold text-chalk uppercase tracking-wider"
              >
                {theme === 'dark' ? <><Sun className="w-4 h-4 text-neon-accent" /> LIGHT MODE</> : <><Moon className="w-4 h-4 text-neon-accent" /> DARK MODE</>}
              </button>
            </div>

            {user ? (
              <div className="flex flex-col gap-4 pt-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold uppercase tracking-widest text-silver hover:text-chalk"
                >
                  Profile
                </Link>
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold uppercase tracking-widest text-silver hover:text-chalk"
                >
                  My Bookings
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold uppercase tracking-widest text-silver hover:text-chalk"
                >
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-bold uppercase tracking-widest text-neon-accent"
                  >
                    Admin Console
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-xs text-left font-bold uppercase tracking-widest text-rose-400 hover:text-rose-300 pt-2 border-t border-white/10"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold uppercase tracking-widest text-silver"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-4 bg-neon-accent text-xs font-bold uppercase tracking-widest text-asphalt rounded-xl font-extrabold shadow-lg"
                >
                  Book Now →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
