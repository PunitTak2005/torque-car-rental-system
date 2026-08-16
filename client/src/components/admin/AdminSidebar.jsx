import React from 'react';
import {
  LayoutDashboard,
  Car,
  ClipboardList,
  Users,
  CreditCard,
  MessageSquare,
  Activity,
  Settings,
  X,
  Clock,
  CheckCircle2,
  PlayCircle,
  CheckSquare,
  XCircle
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'cars', label: 'Fleet Catalog', icon: Car, badgeKey: 'carsCount' },
  {
    id: 'bookings',
    label: 'Bookings',
    icon: ClipboardList,
    badgeKey: 'bookingsCount',
    subItems: [
      { id: 'bookings-pending', label: 'Pending', statusValue: 'Pending', badgeKey: 'pendingBookings', icon: Clock },
      { id: 'bookings-confirmed', label: 'Confirmed', statusValue: 'Confirmed', badgeKey: 'confirmedBookings', icon: CheckCircle2 },
      { id: 'bookings-active', label: 'Active', statusValue: 'Active', badgeKey: 'activeBookings', icon: PlayCircle },
      { id: 'bookings-completed', label: 'Completed', statusValue: 'Completed', badgeKey: 'completedBookings', icon: CheckSquare },
      { id: 'bookings-cancelled', label: 'Cancelled', statusValue: 'Cancelled', badgeKey: 'cancelledBookings', icon: XCircle }
    ]
  },
  { id: 'users', label: 'Users', icon: Users, badgeKey: 'usersCount' },
  { id: 'payments', label: 'Payments', icon: CreditCard, badgeKey: 'paymentsCount' },
  { id: 'reviews', label: 'Reviews', icon: MessageSquare, badgeKey: 'reviewsCount' },
  { id: 'activity', label: 'Telemetry', icon: Activity, badgeKey: 'activityCount' },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const AdminSidebar = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  counts = {}
}) => {
  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  const renderNavContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Brand Header */}
        <div className="px-6 py-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-extrabold uppercase tracking-[0.25em] text-chalk font-sans">
              TORQUE CONTROL
            </h2>
            <span className="text-[7px] font-extrabold uppercase tracking-widest text-neon-accent border border-neon-accent/40 bg-neon-accent/10 px-1.5 py-0.5 rounded-md">
              ADMIN
            </span>
          </div>

          <button onClick={onClose} className="lg:hidden text-silver hover:text-chalk cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <div className="px-4 py-6">
          <nav className="space-y-1.5" aria-label="Admin Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.subItems && activeTab === item.id);
              const badgeValue = item.badgeKey ? counts[item.badgeKey] : null;

              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-left transition-all duration-200 rounded-xl cursor-pointer ${
                      isActive
                        ? 'bg-neon-accent text-asphalt shadow-md shadow-neon-accent/20 font-extrabold'
                        : 'text-silver/80 hover:bg-white/5 hover:text-chalk'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>

                    {badgeValue !== undefined && badgeValue !== null && (
                      <span className={`px-2 py-0.5 text-[8px] font-extrabold rounded-md ${
                        isActive ? 'bg-asphalt text-neon-accent' : 'bg-white/10 text-chalk'
                      }`}>
                        {badgeValue}
                      </span>
                    )}
                  </button>

                  {/* Sub-items for Bookings status breakdown */}
                  {item.subItems && isActive && (
                    <div className="pl-6 space-y-1 pt-1 pb-1">
                      {item.subItems.map((sub) => {
                        const SubIcon = sub.icon;
                        const subBadge = counts[sub.badgeKey] !== undefined ? counts[sub.badgeKey] : 0;
                        return (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-silver/70 hover:text-chalk transition-colors rounded-lg bg-asphalt/40 border border-white/5"
                          >
                            <div className="flex items-center gap-2">
                              <SubIcon className="w-3 h-3 text-neon-accent/80" />
                              <span>{sub.label}</span>
                            </div>
                            <span className="px-1.5 py-0.2 bg-white/5 border border-white/10 rounded font-mono text-[8px] text-chalk">
                              {subBadge}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="p-4 m-4 bg-asphalt/80 border border-white/10 rounded-2xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></span>
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-chalk">TELEMETRY SECURE</span>
        </div>
        <p className="text-[9px] text-silver/60 leading-normal uppercase font-bold">
          Cluster verified. Connected to database operations.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-60 shrink-0 bg-graphite/40 border-r border-white/10 min-h-[calc(100vh-4rem)]">
        <div className="sticky top-20 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin">
          {renderNavContent()}
        </div>
      </aside>

      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-asphalt/80 backdrop-blur-md lg:hidden animate-fade-in"
        />
      )}

      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-graphite border-r border-white/10 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderNavContent()}
      </div>
    </>
  );
};

export default AdminSidebar;
