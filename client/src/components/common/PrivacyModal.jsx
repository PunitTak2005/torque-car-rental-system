import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { Lock, Eye } from 'lucide-react';

const PrivacyModal = ({ isOpen, onClose, onAccept }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Torque — Privacy Policy (v1.0)"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 text-xs text-silver/90 font-sans leading-relaxed">
        
        {/* Header Badge */}
        <div className="flex items-center gap-3 p-3.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-silver">
          <Lock className="w-4 h-4 text-neon-accent shrink-0" />
          <span>DATA PROTECTION & PRIVACY STATEMENT &bull; VERSION 1.0</span>
        </div>

        <p className="text-xs text-chalk font-medium">
          Torque ("we", "our", "us") values your trust and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and safeguard your data.
        </p>

        {/* 1. Information Collected */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">1. Information We Collect</h4>
          <p>
            We collect personal information necessary to deliver seamless car rental services, including account information, booking parameters, and operational data.
          </p>
        </div>

        {/* 2. Account Information */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">2. Account Information</h4>
          <p>
            When you register an account, we collect your full name, email address, contact telephone number, driver's license details, and encrypted password credentials.
          </p>
        </div>

        {/* 3. Booking Information */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">3. Booking Information</h4>
          <p>
            We store details related to your vehicle reservations, pickup and drop-off hubs, rental duration, price calculations, and booking status logs.
          </p>
        </div>

        {/* 4. Payment-Related Information */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">4. Payment-Related Information</h4>
          <p>
            Payment transactions are processed securely through PCI-DSS compliant third-party gateways. Torque does not store full credit card numbers or sensitive CVV codes.
          </p>
        </div>

        {/* 5. Vehicle & Rental Activity Data */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">5. Vehicle & Rental Activity Data</h4>
          <p>
            Vehicles in our fleet may collect operational telemetry (such as mileage, fuel levels, diagnostic fault codes, and GPS location) to ensure safety and fleet maintenance.
          </p>
        </div>

        {/* 6. How Information Is Used */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">6. How We Use Your Information</h4>
          <p>
            Your information is used to fulfill reservations, process payments, verify driving eligibility, provide customer support, and communicate important trip updates.
          </p>
        </div>

        {/* 7. Data Security */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">7. Data Security Measures</h4>
          <p>
            We implement industry-standard technical safeguards, including HTTPS encryption, secure database access controls, and hashed authentication tokens.
          </p>
        </div>

        {/* 8. Data Retention */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">8. Data Retention Policy</h4>
          <p>
            We retain your account and booking records for as long as your account remains active or as required by applicable tax, legal, and financial auditing regulations.
          </p>
        </div>

        {/* 9. Third-Party Services */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">9. Sharing With Third-Party Services</h4>
          <p>
            We do not sell your personal data. We share necessary data only with trusted partners (such as payment processors and identity verification providers) strictly to fulfill rental services.
          </p>
        </div>

        {/* 10. User Rights */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">10. Your Rights & Choices</h4>
          <p>
            You have the right to access, update, or request the deletion of your personal account data at any time by contacting our privacy team.
          </p>
        </div>

        {/* 11. Cookies & Local Storage */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">11. Cookies & Local Storage</h4>
          <p>
            We use browser LocalStorage and essential session tokens to remember your login state, theme preferences, and saved vehicles.
          </p>
        </div>

        {/* 12. Policy Updates */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">12. Updates to This Policy</h4>
          <p>
            We may modify this Privacy Policy to reflect operational or regulatory changes. Significant updates will be highlighted on our platform.
          </p>
        </div>

        {/* 13. Contact Information */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">13. Privacy Contact</h4>
          <p>
            If you have questions regarding data privacy or wish to exercise your rights, email <span className="text-neon-accent font-mono">punittak2005@gmail.com</span> or call <span className="text-neon-accent font-mono">6367088841</span>.
          </p>
        </div>

        {/* Sticky Footer Actions */}
        <div className="sticky bottom-0 bg-graphite/95 backdrop-blur-md pt-4 pb-1 flex justify-end gap-3 border-t border-white/10 shrink-0 mt-4 z-10">
          <Button
            onClick={() => {
              if (onAccept) onAccept();
              onClose();
            }}
            className="bg-neon-accent hover:bg-chalk text-asphalt font-extrabold text-xs px-6 py-2.5 uppercase tracking-widest rounded-xl shadow-lg cursor-pointer"
          >
            I Accept Privacy Policy
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default PrivacyModal;
