import React from 'react';
import { Activity, CheckCircle, CreditCard, UserPlus, Clock } from 'lucide-react';

const ActivityFeed = ({ bookings = [], payments = [], users = [] }) => {
  // Synthesize timeline events from real backend entities
  const events = [];

  bookings.slice(0, 4).forEach(b => {
    events.push({
      id: `bk-${b._id}`,
      type: 'booking',
      title: `Booking #${b.bookingId || b._id.slice(-6)} (${b.status})`,
      desc: `Reserved by ${b.customerDetails?.fullName || b.user?.name || 'Customer'} - Total ₹${b.billing?.totalAmount?.toLocaleString() || b.totalAmount?.toLocaleString() || 0}`,
      date: new Date(b.createdAt || Date.now()),
      icon: CheckCircle,
      color: 'text-neon-accent bg-asphalt border-white/10'
    });
  });

  payments.slice(0, 3).forEach(p => {
    events.push({
      id: `pay-${p._id}`,
      type: 'payment',
      title: `Payment Received (₹${p.amount?.toLocaleString() || p.amount})`,
      desc: `Paid by ${p.cardholderName || 'Customer'} (Ref: ${p.transactionId})`,
      date: new Date(p.createdAt || Date.now()),
      icon: CreditCard,
      color: 'text-emerald-400 bg-asphalt border-white/10'
    });
  });

  users.slice(0, 3).forEach(u => {
    events.push({
      id: `usr-${u._id}`,
      type: 'user',
      title: `New Customer Registered`,
      desc: `${u.name} (${u.email}) joined TORQUE fleet system`,
      date: new Date(u.createdAt || Date.now()),
      icon: UserPlus,
      color: 'text-blue-400 bg-asphalt border-white/10'
    });
  });

  // Sort events newest first
  events.sort((a, b) => b.date - a.date);

  return (
    <div className="bg-graphite/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-neon-accent/10 border border-neon-accent/30 text-neon-accent">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-extrabold text-chalk uppercase tracking-wider font-display">
              RECENT SYSTEM ACTIVITY
            </h3>
          </div>
          <p className="text-xs text-silver/70">
            Realtime event stream across reservations & audit logs
          </p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="py-8 text-center text-silver/60 text-xs italic bg-asphalt/40 rounded-2xl border border-dashed border-white/10 uppercase tracking-widest">
          No system events logged today.
        </div>
      ) : (
        <div className="relative pl-6 space-y-4 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
          {events.slice(0, 6).map((evt) => {
            const Icon = evt.icon;
            return (
              <div key={evt.id} className="relative flex items-start gap-3.5 group">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 absolute -left-7 bg-graphite ${evt.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 bg-asphalt/80 p-3.5 rounded-2xl border border-white/10 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-extrabold text-chalk uppercase tracking-wider">
                      {evt.title}
                    </h4>
                    <span className="text-[9px] text-silver/60 flex items-center gap-1 font-bold">
                      <Clock className="w-3 h-3 text-neon-accent" />
                      {evt.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-silver/80 font-medium">
                    {evt.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
