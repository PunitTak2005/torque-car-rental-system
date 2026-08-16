import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { ShieldCheck, FileText } from 'lucide-react';

const TermsModal = ({ isOpen, onClose, onAccept }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Torque — Terms & Conditions (v1.0)"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 text-xs text-silver/90 font-sans leading-relaxed">
        
        {/* Header Badge */}
        <div className="flex items-center gap-3 p-3.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-silver">
          <ShieldCheck className="w-4 h-4 text-neon-accent shrink-0" />
          <span>EFFECTIVE DATE: AUGUST 2026 &bull; VERSION 1.0</span>
        </div>

        <p className="text-xs text-chalk font-medium">
          Welcome to Torque Car Rental ("Torque", "we", "us", or "our"). Please read these Terms & Conditions carefully before creating an account or reserving a vehicle.
        </p>

        {/* 1. Acceptance of Terms */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">1. Acceptance of Terms</h4>
          <p>
            By creating a Torque account or accessing our services, you confirm that you have read, understood, and agreed to be bound by these Terms & Conditions and our Privacy Policy.
          </p>
        </div>

        {/* 2. Account Registration */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">2. Account Registration</h4>
          <p>
            You must provide accurate, current, and complete information during registration. You are responsible for keeping your account details updated at all times.
          </p>
        </div>

        {/* 3. User Eligibility */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">3. User Eligibility</h4>
          <p>
            To rent a vehicle through Torque, you must be at least 21 years of age, possess a valid government-issued driver's license, and meet our driving history verification criteria.
          </p>
        </div>

        {/* 4. Account Security */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">4. Account Security</h4>
          <p>
            You are responsible for maintaining the confidentiality of your credentials. Notify Torque immediately if you suspect unauthorized access to your account.
          </p>
        </div>

        {/* 5. Vehicle Rental Requirements */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">5. Vehicle Rental Requirements</h4>
          <p>
            Renters must present their physical driver's license and government ID upon vehicle pickup. Additional authorized drivers must be registered prior to trip start.
          </p>
        </div>

        {/* 6. Booking & Reservation Rules */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">6. Booking & Reservation Rules</h4>
          <p>
            Reservations are subject to vehicle availability and confirmation. Pickup and drop-off locations, dates, and times must strictly adhere to the confirmed booking agreement.
          </p>
        </div>

        {/* 7. Payments & Charges */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">7. Payments & Charges</h4>
          <p>
            All rental fees, security deposits, taxes, and potential add-ons are displayed prior to booking confirmation. Security deposits are refunded after vehicle inspection upon return.
          </p>
        </div>

        {/* 8. Cancellation & Refunds */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">8. Cancellation & Refunds</h4>
          <p>
            Cancellations made at least 24 hours prior to trip start receive a 100% refund. Late cancellations or no-shows may incur cancellation processing fees.
          </p>
        </div>

        {/* 9. Vehicle Usage */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">9. Vehicle Usage</h4>
          <p>
            Vehicles must be operated responsibly and in compliance with all local traffic laws. Smoking, street racing, off-road driving, or illegal transport is strictly prohibited.
          </p>
        </div>

        {/* 10. Damage, Fines & Liability */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">10. Damage, Fines & Liability</h4>
          <p>
            Renters are responsible for traffic violations, toll fees, parking fines, and any physical or mechanical damage caused to the vehicle during the rental period.
          </p>
        </div>

        {/* 11. Prohibited Activities */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">11. Prohibited Activities</h4>
          <p>
            Subleasing the vehicle, driving under the influence of alcohol or narcotics, or towing heavy loads with unauthorized vehicles is forbidden and terminates insurance coverage.
          </p>
        </div>

        {/* 12. User Responsibilities */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">12. User Responsibilities</h4>
          <p>
            Renters must return the vehicle in the same clean condition with the same fuel/battery charge level as received at pickup.
          </p>
        </div>

        {/* 13. Privacy & Data Handling */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">13. Privacy & Data Handling</h4>
          <p>
            We process personal data in accordance with our Privacy Policy to facilitate reservations, verify identity, and ensure fleet telemetry security.
          </p>
        </div>

        {/* 14. Account Suspension or Termination */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">14. Account Suspension or Termination</h4>
          <p>
            Torque reserves the right to suspend or terminate accounts that violate safety protocols, engage in fraud, or fail to settle outstanding rental balances.
          </p>
        </div>

        {/* 15. Changes to These Terms */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">15. Changes to These Terms</h4>
          <p>
            We may update these terms periodically. Continued use of Torque services after updates constitutes acceptance of the revised Terms & Conditions.
          </p>
        </div>

        {/* 16. Contact Information */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <h4 className="text-sm font-bold uppercase tracking-wider text-chalk font-display">16. Contact Information</h4>
          <p>
            For questions regarding these Terms & Conditions, please contact Torque Support at <span className="text-neon-accent font-mono">support@torque-rentals.com</span> or call <span className="text-neon-accent font-mono">+91 1800-TORQUE</span>.
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
            I Accept Terms & Conditions
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default TermsModal;
