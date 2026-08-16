import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-asphalt text-silver border-t border-white/5 font-sans">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand Summary Column */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="text-sm font-bold tracking-[0.4em] text-chalk">
            TORQUE
          </Link>
          <span className="text-[9px] font-bold tracking-widest text-neon-accent uppercase block">
            DRIVE WITH FORCE.
          </span>
          <p className="text-[10px] leading-relaxed text-silver/50">
            Premium performance showroom configurations made simple. Transparent configurator pricing, telemetry options, and 24/7 client systems.
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <h3 className="text-chalk font-bold text-[9px] tracking-widest uppercase mb-5">
            Navigation
          </h3>
          <ul className="flex flex-col gap-3 text-[10px] uppercase tracking-wider font-bold">
            <li><Link to="/" className="hover:text-neon-accent transition-colors">Home</Link></li>
            <li><Link to="/cars" className="hover:text-neon-accent transition-colors">Browse Fleet</Link></li>
            <li><Link to="/about" className="hover:text-neon-accent transition-colors">About Us</Link></li>
          </ul>
        </div>

        {/* Customer Portal Column */}
        <div>
          <h3 className="text-chalk font-bold text-[9px] tracking-widest uppercase mb-5">
            Customer Portal
          </h3>
          <ul className="flex flex-col gap-3 text-[10px] uppercase tracking-wider font-bold">
            <li><Link to="/my-bookings" className="hover:text-neon-accent transition-colors">My Bookings</Link></li>
            <li><Link to="/dashboard" className="hover:text-neon-accent transition-colors">User Profile</Link></li>
            <li><Link to="/login" className="hover:text-neon-accent transition-colors">Sign In</Link></li>
          </ul>
        </div>

        {/* Contact Information Column */}
        <div>
          <h3 className="text-chalk font-bold text-[9px] tracking-widest uppercase mb-5">
            Contact & Support
          </h3>
          <ul className="flex flex-col gap-3 text-[10px] text-silver/80">
            <li className="leading-relaxed">
              Udaipur, Rajasthan, India<br />Pin: 313001
            </li>
            <li className="font-bold text-chalk">+91 6367088841</li>
            <li className="font-bold text-chalk">punittak2005@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="bg-asphalt py-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row justify-between items-center gap-3 text-[9px] tracking-widest uppercase text-silver/40">
          <p>
            &copy; 2026 TORQUE Mobility. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-chalk transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-chalk transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
