import React, { useState } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const tabTitles = {
  overview: 'Dashboard Overview',
  cars: 'Fleet Registry',
  bookings: 'Reservations Management',
  users: 'User Directory',
  payments: 'Transaction Audits',
  reviews: 'Moderation Feed',
  activity: 'Telemetry Operations',
  settings: 'System Configuration'
};

const AdminLayout = ({
  children,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  counts = {}
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-asphalt text-chalk flex flex-col pt-16">
      {/* Top Header */}
      <AdminHeader
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTabTitle={tabTitles[activeTab] || 'Admin Console'}
      />

      {/* Main Body */}
      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          counts={counts}
        />

        {/* Workspace */}
        <main className="flex-1 min-w-0 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
