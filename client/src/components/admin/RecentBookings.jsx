import React, { useState } from 'react';
import { Eye, Filter, Calendar, MapPin, Search, ArrowUpRight } from 'lucide-react';

const RecentBookings = ({
  bookings = [],
  onSelectBooking,
  onViewAll,
  onUpdateStatus,
  searchQuery = ''
}) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [localSearch, setLocalSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('10'); // '10', '20', '50', 'All'

  // Combine parent searchQuery with localSearch
  const activeSearch = (localSearch || searchQuery || '').toLowerCase().trim();

  // Filter bookings based on status, payment status, and search query
  const filteredBookings = bookings.filter((b) => {
    // 1. Status Filter
    const matchesStatus =
      statusFilter === 'All' ||
      (b.status || '').toLowerCase() === statusFilter.toLowerCase();

    // 2. Payment Status Filter
    const matchesPayment =
      paymentFilter === 'All' ||
      (b.paymentStatus || '').toLowerCase() === paymentFilter.toLowerCase();

    if (!matchesStatus || !matchesPayment) return false;
    if (!activeSearch) return true;

    // 3. Search Query
    const matchesId =
      (b.bookingId || '').toLowerCase().includes(activeSearch) ||
      (b._id || '').toLowerCase().includes(activeSearch);
    const matchesCustomer =
      (b.customerDetails?.fullName || b.user?.name || '').toLowerCase().includes(activeSearch) ||
      (b.customerDetails?.email || b.user?.email || '').toLowerCase().includes(activeSearch) ||
      (b.customerDetails?.phone || b.user?.phone || '').toLowerCase().includes(activeSearch);
    const matchesCar =
      (b.car?.brand || '').toLowerCase().includes(activeSearch) ||
      (b.car?.model || '').toLowerCase().includes(activeSearch);

    return matchesId || matchesCustomer || matchesCar;
  });

  // Pagination Calculations
  const totalCount = filteredBookings.length;
  const numPageSize = pageSize === 'All' ? totalCount : Number(pageSize);
  const totalPages = pageSize === 'All' ? 1 : Math.ceil(totalCount / numPageSize) || 1;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIdx = totalCount === 0 ? 0 : (safePage - 1) * numPageSize + 1;
  const endIdx = pageSize === 'All' ? totalCount : Math.min(safePage * numPageSize, totalCount);

  const paginatedBookings =
    pageSize === 'All'
      ? filteredBookings
      : filteredBookings.slice((safePage - 1) * numPageSize, safePage * numPageSize);

  const getStatusBadgeStyle = (st) => {
    switch (st) {
      case 'Confirmed':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
      case 'Active':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/40';
      case 'Completed':
        return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/40';
      default:
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/40';
    }
  };

  const getPaymentBadgeStyle = (st) => {
    switch (st) {
      case 'Paid':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'Refunded':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
      case 'Failed':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
    }
  };

  const formatDate = (dateVal) => {
    if (!dateVal) return 'N/A';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="bg-graphite/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl w-full min-w-0">
      
      {/* 1. HEADER & FILTER CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-sm font-extrabold text-chalk uppercase tracking-widest font-display">
            RESERVATIONS & BOOKINGS FEED ({totalCount})
          </h3>
          <p className="text-xs text-silver/70">
            Realtime customer reservation feed, status tracking & lifecycle management
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-silver/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, customer, car..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-asphalt text-chalk placeholder-silver/50 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-neon-accent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-asphalt p-1 border border-white/10 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-silver/60 ml-2" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-bold text-silver focus:outline-none cursor-pointer pr-3 py-1"
            >
              <option value="All" className="bg-graphite">All Statuses</option>
              <option value="Pending" className="bg-graphite">Pending</option>
              <option value="Confirmed" className="bg-graphite">Confirmed</option>
              <option value="Active" className="bg-graphite">Active</option>
              <option value="Completed" className="bg-graphite">Completed</option>
              <option value="Cancelled" className="bg-graphite">Cancelled</option>
              <option value="Rejected" className="bg-graphite">Rejected</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="flex items-center gap-1.5 bg-asphalt p-1 border border-white/10 rounded-xl">
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-bold text-silver focus:outline-none cursor-pointer px-2 py-1"
            >
              <option value="All" className="bg-graphite">All Payments</option>
              <option value="Paid" className="bg-graphite">Paid</option>
              <option value="Pending" className="bg-graphite">Pending</option>
              <option value="Refunded" className="bg-graphite">Refunded</option>
              <option value="Failed" className="bg-graphite">Failed</option>
            </select>
          </div>

          {onViewAll && (
            <button
              onClick={onViewAll}
              className="px-3.5 py-1.5 bg-neon-accent/10 hover:bg-neon-accent hover:text-asphalt text-neon-accent font-extrabold text-xs border border-neon-accent/30 transition-all flex items-center gap-1.5 cursor-pointer rounded-xl"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. DESKTOP BOOKINGS TABLE VIEW */}
      <div className="hidden md:block overflow-x-auto border border-white/10 rounded-2xl">
        <table className="w-full text-left text-xs border-collapse min-w-[950px]">
          <thead>
            <tr className="bg-asphalt border-b border-white/10 text-silver uppercase font-extrabold tracking-widest text-[9px]">
              <th className="p-4">Booking ID</th>
              <th className="p-4">Customer Details</th>
              <th className="p-4">Car Model</th>
              <th className="p-4">Schedule & Hub</th>
              <th className="p-4 text-center">Amount</th>
              <th className="p-4 text-center">Payment</th>
              <th className="p-4 text-center">Booking Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-[10px] tracking-wider">
            {paginatedBookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-silver/60 italic uppercase tracking-widest">
                  No matching reservation records found.
                </td>
              </tr>
            ) : (
              paginatedBookings.map((b) => {
                const startDateStr = formatDate(b.pickupDate || b.rentalDates?.startDate);
                const endDateStr = formatDate(b.returnDate || b.rentalDates?.endDate);
                const customerName = b.customerDetails?.fullName || b.user?.name || 'Customer';
                const customerEmail = b.customerDetails?.email || b.user?.email || '';
                const customerPhone = b.customerDetails?.phone || b.user?.phone || '';
                const totalDays = b.totalDays || 1;

                return (
                  <tr
                    key={b._id}
                    className="hover:bg-asphalt/60 transition-colors group cursor-pointer"
                    onClick={() => onSelectBooking && onSelectBooking(b)}
                  >
                    {/* Booking ID */}
                    <td className="p-4 font-mono font-bold text-neon-accent uppercase tracking-wider">
                      #{b.bookingId || b._id.substring(0, 8)}
                    </td>

                    {/* Customer Info */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-chalk block font-sans">
                          {customerName}
                        </span>
                        {customerEmail && (
                          <span className="text-[10px] text-silver/60 block font-mono">
                            {customerEmail}
                          </span>
                        )}
                        {customerPhone && (
                          <span className="text-[9px] text-silver/50 block font-mono">
                            {customerPhone}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Car Model */}
                    <td className="p-4 font-bold text-chalk font-sans">
                      {b.car ? `${b.car.brand} ${b.car.model}` : 'Reserved Vehicle'}
                    </td>

                    {/* Schedule & Location */}
                    <td className="p-4 text-silver space-y-0.5">
                      <div className="font-bold text-chalk">
                        {startDateStr} – {endDateStr} <span className="text-[9px] text-silver/60">({totalDays}d)</span>
                      </div>
                      <div className="text-[9px] text-silver/60 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neon-accent" />
                        <span>{b.pickupLocation || 'Main Hub'}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="p-4 text-center font-extrabold text-neon-accent font-sans text-sm">
                      ₹{(b.billing?.totalAmount || b.totalAmount || 0).toLocaleString('en-IN')}
                    </td>

                    {/* Payment Status Badge */}
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 text-[9px] font-extrabold rounded-full tracking-wider uppercase inline-block ${getPaymentBadgeStyle(b.paymentStatus)}`}>
                        {b.paymentStatus || 'Pending'}
                      </span>
                    </td>

                    {/* Booking Status Dropdown */}
                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={b.status}
                        onChange={(e) => onUpdateStatus && onUpdateStatus(b._id, e.target.value)}
                        className={`text-[9px] font-extrabold rounded-xl px-2.5 py-1.5 border cursor-pointer uppercase focus:outline-none ${getStatusBadgeStyle(b.status)}`}
                      >
                        <option value="Pending" className="bg-graphite text-chalk">Pending</option>
                        <option value="Confirmed" className="bg-graphite text-chalk">Confirmed</option>
                        <option value="Active" className="bg-graphite text-chalk">Active</option>
                        <option value="Completed" className="bg-graphite text-chalk">Completed</option>
                        <option value="Cancelled" className="bg-graphite text-chalk">Cancelled</option>
                        <option value="Rejected" className="bg-graphite text-chalk">Rejected</option>
                      </select>
                    </td>

                    {/* View Action */}
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectBooking && onSelectBooking(b)}
                        className="px-3.5 py-1.5 bg-asphalt hover:bg-neon-accent hover:text-asphalt text-silver border border-white/10 font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 text-xs rounded-xl"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 3. MOBILE CARD LIST VIEW */}
      <div className="md:hidden space-y-4">
        {paginatedBookings.length === 0 ? (
          <div className="p-6 text-center text-silver/60 text-xs italic bg-asphalt/40 rounded-2xl border border-dashed border-white/10">
            No matching bookings found.
          </div>
        ) : (
          paginatedBookings.map((b) => {
            const customerName = b.customerDetails?.fullName || b.user?.name || 'Customer';
            const startDateStr = formatDate(b.pickupDate || b.rentalDates?.startDate);
            const endDateStr = formatDate(b.returnDate || b.rentalDates?.endDate);

            return (
              <div
                key={b._id}
                onClick={() => onSelectBooking && onSelectBooking(b)}
                className="bg-asphalt/80 border border-white/10 p-4 rounded-2xl space-y-3 cursor-pointer hover:border-neon-accent/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-neon-accent">
                    #{b.bookingId || b._id.slice(-8)}
                  </span>
                  <span className={`px-2.5 py-0.5 text-[9px] font-extrabold rounded-full uppercase ${getStatusBadgeStyle(b.status)}`}>
                    {b.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold uppercase text-chalk font-sans">
                    {b.car ? `${b.car.brand} ${b.car.model}` : 'Vehicle'}
                  </h4>
                  <p className="text-xs text-silver/80 font-semibold">{customerName}</p>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-white/10 pt-2 font-bold">
                  <span className="text-silver/70 text-[10px]">{startDateStr} – {endDateStr}</span>
                  <span className="text-neon-accent">₹{(b.billing?.totalAmount || b.totalAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. PAGINATION FOOTER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs">
        <span className="text-silver/70 text-xs">
          Showing <strong className="text-chalk">{startIdx}–{endIdx}</strong> of <strong className="text-chalk">{totalCount}</strong> reservations
        </span>

        <div className="flex flex-wrap items-center gap-3">
          {/* Page Size Options */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold uppercase text-silver/70 tracking-wider">Per Page:</span>
            {['10', '20', '50', 'All'].map((sz) => (
              <button
                key={sz}
                onClick={() => {
                  setPageSize(sz);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  pageSize === sz
                    ? 'bg-neon-accent text-asphalt border-neon-accent'
                    : 'bg-asphalt text-silver border-white/10 hover:border-white/30'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* Navigation Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-xl border border-white/10 bg-asphalt text-chalk text-xs font-extrabold hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>

              <span className="text-xs text-silver font-mono px-2">
                {safePage} / {totalPages}
              </span>

              <button
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded-xl border border-white/10 bg-asphalt text-chalk text-xs font-extrabold hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default RecentBookings;
