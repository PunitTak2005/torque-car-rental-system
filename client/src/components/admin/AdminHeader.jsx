import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { Menu, Search, X, LogOut, Sun, Moon, User, ShieldCheck } from 'lucide-react';

const AdminHeader = ({
  onToggleMobileMenu,
  searchQuery,
  setSearchQuery,
  activeTabTitle = 'Admin Dashboard'
}) => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    addToast('Logged out of Admin Portal', 'success');
  };

  return (
    <header className="bg-graphite/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
      <div className="px-6 sm:px-10 py-4 flex items-center justify-between gap-4">
        
        {/* Mobile Menu & Active Tab Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 text-silver hover:text-chalk transition-colors rounded-xl border border-white/10 bg-asphalt"
            aria-label="Open menu drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <span className="text-[8px] font-extrabold text-neon-accent tracking-[0.2em] uppercase block">CONTROL CENTER</span>
            <h1 className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-chalk font-display">
              {activeTabTitle}
            </h1>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-silver/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fleet, bookings, users..."
              className="w-full pl-9 pr-8 py-2 bg-asphalt border border-white/10 text-xs text-chalk placeholder-silver/40 focus:outline-none focus:border-neon-accent rounded-xl font-semibold transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-silver/60 hover:text-chalk"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Console Controls */}
        <div className="flex items-center gap-3">
          
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
                <span className="hidden sm:inline">LIGHT MODE</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-chalk" />
                <span className="hidden sm:inline">DARK MODE</span>
              </>
            )}
          </button>

          {/* Admin Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 p-1.5 border border-white/15 bg-asphalt rounded-xl text-chalk hover:bg-white/5 transition-all cursor-pointer"
            >
              {user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover border border-neon-accent/40"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-neon-accent/20 border border-neon-accent/40 flex items-center justify-center text-neon-accent font-extrabold text-xs">
                  {user?.name?.charAt(0) || 'A'}
                </div>
              )}
              <span className="text-[10px] font-extrabold uppercase tracking-wider hidden sm:inline">{user?.name || 'Administrator'}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-neon-accent" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-graphite border border-white/10 rounded-2xl p-4 shadow-2xl z-50 space-y-3 animate-fade-in">
                <div className="border-b border-white/10 pb-3">
                  <p className="text-xs font-extrabold text-chalk uppercase">{user?.name || 'Administrator'}</p>
                  <p className="text-[9px] text-silver/60 truncate">{user?.email || 'admin@torque.com'}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-neon-accent/20 border border-neon-accent/40 text-neon-accent text-[8px] font-extrabold uppercase tracking-widest rounded-md">
                    System Admin
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-[10px] text-rose-400 hover:text-rose-300 font-extrabold text-left uppercase tracking-widest cursor-pointer pt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default AdminHeader;
