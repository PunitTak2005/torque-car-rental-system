import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { getCarDetails, getCars, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateLicense,
  validateCardNumber,
  validateExpiry,
  validateCvv,
  validateDates,
  validateUpiId
} from '../validations/rules';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import PickupHubSelect from '../components/common/PickupHubSelect';
import CalendarCard from '../components/common/CalendarCard';
import { 
  Printer, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Car, 
  Calendar, 
  CreditCard, 
  Sparkles, 
  User, 
  MapPin, 
  Smartphone, 
  Banknote,
  Info
} from 'lucide-react';

const BookingWorkflow = () => {
  const { carId: pathCarId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  const [carList, setCarList] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState(pathCarId || searchParams.get('car') || '');
  const [car, setCar] = useState(null);

  // Rental Dates & Locations
  const [pickupLocation, setPickupLocation] = useState(searchParams.get('pickupLocation') || 'Delhi');
  const [dropoffLocation, setDropoffLocation] = useState(searchParams.get('dropoffLocation') || 'Delhi');
  const [pickupDate, setPickupDate] = useState(searchParams.get('pickupDate') || new Date().toISOString().split('T')[0]);
  
  // Default return date to 3 days in the future
  const defaultReturnDate = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
  const [returnDate, setReturnDate] = useState(searchParams.get('returnDate') || defaultReturnDate);

  // Customer Information
  const [driverName, setDriverName] = useState(user?.name || '');
  const [driverEmail, setDriverEmail] = useState(user?.email || '');
  const [driverPhone, setDriverPhone] = useState(user?.phone || '');
  const [driverLicense, setDriverLicense] = useState('DL-RJ27A91023');
  const [specialRequests, setSpecialRequests] = useState('');

  // Multi Payment Method States (UPI, CARD, CASH_ON_PICKUP)
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiProvider, setUpiProvider] = useState('Google Pay');
  const [upiId, setUpiId] = useState('');

  // Card Payment States
  const [cardholderName, setCardholderName] = useState(user?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Form & Submission States
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Cost Variables
  const [numDays, setNumDays] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [securityDeposit, setSecurityDeposit] = useState(3000);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (user) {
      if (!driverName) setDriverName(user.name);
      if (!driverEmail) setDriverEmail(user.email);
      if (!driverPhone && user.phone) setDriverPhone(user.phone);
      if (!cardholderName) setCardholderName(user.name);
      if (!upiId && user.email) {
        setUpiId(user.email.split('@')[0] + '@upi');
      }
    }
  }, [user]);

  // Load available cars and specific selected car details
  useEffect(() => {
    const initBookingData = async () => {
      setLoading(true);
      try {
        const { data: fleetRes } = await getCars({ limit: 100 });
        if (fleetRes.success) {
          const availableCars = fleetRes.cars.filter(item => item.availability === true);
          setCarList(availableCars);

          // If no car selected yet, select the first available car
          if (!selectedCarId && availableCars.length > 0) {
            setSelectedCarId(availableCars[0]._id);
          }
        }

        if (selectedCarId) {
          const { data } = await getCarDetails(selectedCarId);
          if (data.success) {
            setCar(data.car);
            setSecurityDeposit(data.car.securityDeposit || 3000);
          }
        }
      } catch (err) {
        console.error(err);
        addToast('Failed to load vehicle parameters', 'error');
      } finally {
        setLoading(false);
      }
    };
    initBookingData();
  }, [selectedCarId]);

  // Real-time rental duration & cost calculations
  useEffect(() => {
    if (!pickupDate || !returnDate || !car) {
      setNumDays(0);
      setSubtotal(0);
      setTaxes(0);
      setTotalAmount(0);
      return;
    }

    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diff = end.getTime() - start.getTime();

    if (diff <= 0) {
      setNumDays(0);
      setSubtotal(0);
      setTaxes(0);
      setTotalAmount(0);
      return;
    }

    const days = Math.max(Math.ceil(diff / (1000 * 3600 * 24)), 1);
    const rawSubtotal = car.pricePerDay * days;
    const tax = Math.round(rawSubtotal * 0.08);

    setNumDays(days);
    setSubtotal(rawSubtotal);
    setTaxes(tax);
    setTotalAmount(rawSubtotal + tax + securityDeposit);
  }, [pickupDate, returnDate, car, securityDeposit]);

  const formatDateFriendly = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  };

  // Step 1: Vehicle & Dates Validation
  const handleStep1Next = () => {
    const errs = {};
    if (!selectedCarId) errs.selectedCarId = 'Please select a vehicle.';
    if (!pickupDate) errs.pickupDate = 'Please select a pickup date.';
    if (!returnDate) errs.returnDate = 'Please select a return date.';

    const dateValErr = validateDates(pickupDate, returnDate);
    if (dateValErr) errs.dates = dateValErr;

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (errs.dates) addToast(errs.dates, 'warning');
      return;
    }

    setErrors({});
    setStep(2);
  };

  // Step 2: Driver Info Validation
  const handleStep2Next = () => {
    const nameErr = validateName(driverName);
    const emailErr = validateEmail(driverEmail);
    const phoneErr = validatePhone(driverPhone);
    const licenseErr = validateLicense(driverLicense);

    if (nameErr || emailErr || phoneErr || licenseErr) {
      setErrors({
        driverName: nameErr || '',
        driverEmail: emailErr || '',
        driverPhone: phoneErr || '',
        driverLicense: licenseErr || ''
      });
      return;
    }

    setErrors({});
    setStep(3);
  };

  const prevStep = () => {
    setErrors({});
    setStep(prev => Math.max(prev - 1, 1));
  };

  // Submit Final Booking & Payment Method
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    let paymentPayload = {};

    if (paymentMethod === 'UPI') {
      const upiErr = validateUpiId(upiId);
      if (upiErr) {
        setErrors({ upiId: upiErr });
        return;
      }
      paymentPayload = {
        paymentMethod: 'UPI',
        upiProvider,
        upiId: upiId.trim()
      };
    } else if (paymentMethod === 'CARD') {
      const holderErr = validateName(cardholderName);
      const cardErr = validateCardNumber(cardNumber || '4111222233334444');
      const expiryErr = validateExpiry(cardExpiry || '12/28');
      const cvvErr = validateCvv(cardCvv || '123');

      if (holderErr || cardErr || expiryErr || cvvErr) {
        setErrors({
          cardholderName: holderErr || '',
          cardNumber: cardErr || '',
          cardExpiry: expiryErr || '',
          cardCvv: cvvErr || ''
        });
        return;
      }
      paymentPayload = {
        paymentMethod: 'Credit/Debit Card',
        cardholderName,
        cardNumber: (cardNumber || '4111222233334444').replace(/\s/g, ''),
        expiryDate: cardExpiry || '12/28',
        cvv: cardCvv || '123'
      };
    } else if (paymentMethod === 'CASH_ON_PICKUP') {
      paymentPayload = {
        paymentMethod: 'Cash on Pickup'
      };
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const payload = {
        carId: selectedCarId,
        pickupLocation: pickupLocation || 'Delhi',
        dropoffLocation: dropoffLocation || pickupLocation || 'Delhi',
        pickupDate,
        returnDate,
        customerDetails: {
          fullName: driverName,
          email: driverEmail,
          phone: driverPhone,
          driverLicense
        },
        notes: specialRequests || undefined,
        paymentDetails: paymentPayload
      };

      const { data } = await createBooking(payload);
      if (data.success) {
        setConfirmedBooking(data.booking);
        addToast('Booking Request Submitted Successfully!', 'success');
        setStep(4);
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to submit booking. Please try again.';
      addToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && step === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-asphalt gap-4">
        <div className="w-8 h-8 border-2 border-stone border-t-neon-accent rounded-full animate-spin" />
        <span className="text-[10px] font-bold text-silver uppercase tracking-widest">LOADING BOOKING PARAMETERS...</span>
      </div>
    );
  }

  return (
    <div className="bg-asphalt min-h-screen pb-24 pt-20 text-chalk">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10 space-y-10">
        
        {/* Header Hero */}
        <div className="space-y-3 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-neon-accent" />
            <span className="text-[10px] font-bold text-silver uppercase tracking-widest">RESERVATION ENGINE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display uppercase tracking-widest text-chalk">
            BOOK YOUR MACHINE
          </h1>
          <p className="text-xs sm:text-sm text-silver/70 tracking-wide font-sans max-w-xl">
            Complete your reservation details below. Select dates, choose your machine, and confirm your rental booking.
          </p>
        </div>

        {/* Step Progress Navigation Bar */}
        {step < 4 && (
          <nav className="bg-graphite/60 border border-white/10 p-4 rounded-2xl flex items-center justify-between overflow-x-auto gap-4" aria-label="Progress steps">
            {[
              { num: 1, label: '01 — Vehicle & Dates', icon: Calendar },
              { num: 2, label: '02 — Driver Info', icon: User },
              { num: 3, label: '03 — Summary & Checkout', icon: CreditCard }
            ].map(item => {
              const Icon = item.icon;
              const isActive = step === item.num;
              const isPassed = step > item.num;
              return (
                <div key={item.num} className="flex items-center gap-2 shrink-0">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-neon-accent text-asphalt font-extrabold shadow-md shadow-neon-accent/20'
                      : isPassed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/5 text-silver/50 border border-white/10'
                  }`}>
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : item.num}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    isActive ? 'text-chalk' : isPassed ? 'text-emerald-400' : 'text-silver/50'
                  }`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </nav>
        )}

        {/* Workflow Steps Grid */}
        {step < 4 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Interactive Step Forms */}
            <main className="lg:col-span-8 space-y-8 bg-graphite/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
              
              {/* STEP 1: VEHICLE & DATES SELECTION */}
              {step === 1 && (
                <section className="space-y-6 animate-page-enter">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-neon-accent" />
                      <h2 className="text-sm font-bold uppercase tracking-widest text-chalk">Step 01 — Vehicle Selection</h2>
                    </div>
                    <span className="text-[10px] font-bold text-silver/60 uppercase tracking-widest">{carList.length} Vehicles Available</span>
                  </div>

                  {/* Vehicle Selector Dropdown */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-silver uppercase tracking-widest">Choose Vehicle Machine</label>
                    <select
                      value={selectedCarId}
                      onChange={(e) => setSelectedCarId(e.target.value)}
                      className="w-full px-4 py-3.5 bg-asphalt border border-white/15 rounded-xl text-xs font-bold text-chalk uppercase tracking-wider focus:outline-none focus:border-neon-accent cursor-pointer"
                    >
                      {carList.map(c => (
                        <option key={c._id} value={c._id} className="bg-graphite text-chalk">
                          {c.brand} {c.model} — ₹{c.pricePerDay?.toLocaleString()}/day ({c.category || 'Standard'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <PickupHubSelect
                      value={pickupLocation}
                      onChange={(val) => setPickupLocation(val)}
                      label="PICKUP LOCATION HUB"
                      placeholder="Select Pickup Hub"
                      required
                    />

                    <PickupHubSelect
                      value={dropoffLocation}
                      onChange={(val) => setDropoffLocation(val)}
                      label="RETURN LOCATION HUB"
                      placeholder="Select Return Hub"
                      required
                    />
                  </div>

                  {/* Dates Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-silver uppercase tracking-widest">Pickup Date</label>
                      <input
                        type="date"
                        value={pickupDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => {
                          setPickupDate(e.target.value);
                          if (errors.dates) setErrors(prev => ({ ...prev, dates: '' }));
                        }}
                        className="w-full px-4 py-3 bg-asphalt border border-white/15 rounded-xl text-xs font-bold text-chalk uppercase tracking-wider focus:outline-none focus:border-neon-accent"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-silver uppercase tracking-widest">Return Date</label>
                      <input
                        type="date"
                        value={returnDate}
                        min={pickupDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => {
                          setReturnDate(e.target.value);
                          if (errors.dates) setErrors(prev => ({ ...prev, dates: '' }));
                        }}
                        className="w-full px-4 py-3 bg-asphalt border border-white/15 rounded-xl text-xs font-bold text-chalk uppercase tracking-wider focus:outline-none focus:border-neon-accent"
                      />
                    </div>
                  </div>

                  {/* Interactive City/Vehicle Real Availability Calendar */}
                  <div className="pt-2">
                    <CalendarCard
                      selectedCity={pickupLocation}
                      selectedCarId={selectedCarId}
                      pickupDate={pickupDate}
                      returnDate={returnDate}
                      onDateSelect={(pDate, rDate) => {
                        setPickupDate(pDate);
                        setReturnDate(rDate);
                        if (errors.dates) setErrors(prev => ({ ...prev, dates: '' }));
                      }}
                    />
                  </div>

                  {errors.dates && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-bold uppercase tracking-wider">
                      {errors.dates}
                    </div>
                  )}

                  <footer className="flex justify-end pt-6 border-t border-white/10">
                    <Button onClick={handleStep1Next} className="px-8 py-3.5">
                      <span>NEXT: DRIVER INFO</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </footer>
                </section>
              )}

              {/* STEP 2: CUSTOMER INFORMATION */}
              {step === 2 && (
                <section className="space-y-6 animate-page-enter">
                  <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                    <User className="w-5 h-5 text-neon-accent" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-chalk">Step 02 — Customer Information</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="driverName"
                      required
                      value={driverName}
                      error={errors.driverName}
                      onChange={(e) => {
                        setDriverName(e.target.value);
                        if (errors.driverName) setErrors(prev => ({ ...prev, driverName: '' }));
                      }}
                      placeholder="ENTER YOUR FULL NAME"
                    />

                    <Input
                      label="Email Address"
                      name="driverEmail"
                      type="email"
                      required
                      value={driverEmail}
                      error={errors.driverEmail}
                      onChange={(e) => {
                        setDriverEmail(e.target.value);
                        if (errors.driverEmail) setErrors(prev => ({ ...prev, driverEmail: '' }));
                      }}
                      placeholder="NAME@EXAMPLE.COM"
                    />

                    <Input
                      label="Phone Number"
                      name="driverPhone"
                      type="tel"
                      required
                      value={driverPhone}
                      error={errors.driverPhone}
                      onChange={(e) => {
                        setDriverPhone(e.target.value);
                        if (errors.driverPhone) setErrors(prev => ({ ...prev, driverPhone: '' }));
                      }}
                      placeholder="+91 98765 43210"
                    />

                    <Input
                      label="Driving License Number"
                      name="driverLicense"
                      required
                      value={driverLicense}
                      error={errors.driverLicense}
                      onChange={(e) => {
                        setDriverLicense(e.target.value);
                        if (errors.driverLicense) setErrors(prev => ({ ...prev, driverLicense: '' }));
                      }}
                      placeholder="E.G. DL-RJ27A91023"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-silver uppercase tracking-widest">Special Requests / Handover Notes (Optional)</label>
                    <textarea
                      rows={3}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any additional requests or flight arrival details..."
                      className="block w-full px-4 py-3 bg-asphalt border border-white/15 text-xs text-chalk focus:outline-none focus:border-neon-accent rounded-xl resize-none font-sans"
                    />
                  </div>

                  <footer className="flex justify-between pt-6 border-t border-white/10">
                    <Button onClick={prevStep} variant="secondary">
                      <ArrowLeft className="w-4 h-4" />
                      <span>BACK</span>
                    </Button>
                    <Button onClick={handleStep2Next}>
                      <span>NEXT: SUMMARY & CHECKOUT</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </footer>
                </section>
              )}

              {/* STEP 3: SUMMARY REVIEW & SECURE CHECKOUT */}
              {step === 3 && (
                <section className="space-y-6 animate-page-enter">
                  <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                    <CreditCard className="w-5 h-5 text-neon-accent" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-chalk">Step 03 — Select Payment Method & Checkout</h2>
                  </div>

                  {/* Customer & Route Details Review Box */}
                  <div className="bg-asphalt/60 border border-white/10 rounded-2xl p-6 text-xs text-silver space-y-4 uppercase tracking-wider">
                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <span className="text-[10px] font-extrabold text-neon-accent">CUSTOMER SUMMARY</span>
                      <button onClick={() => setStep(2)} className="text-[9px] font-bold text-silver hover:text-chalk underline cursor-pointer">EDIT INFO</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[10px]">
                      <div>
                        <span className="text-silver/50 block text-[8px]">DRIVER NAME</span>
                        <span className="font-bold text-chalk">{driverName}</span>
                      </div>
                      <div>
                        <span className="text-silver/50 block text-[8px]">EMAIL</span>
                        <span className="font-bold text-chalk">{driverEmail}</span>
                      </div>
                      <div>
                        <span className="text-silver/50 block text-[8px]">PHONE</span>
                        <span className="font-bold text-chalk">{driverPhone}</span>
                      </div>
                      <div>
                        <span className="text-silver/50 block text-[8px]">DRIVING LICENSE</span>
                        <span className="font-bold text-chalk">{driverLicense}</span>
                      </div>
                    </div>
                  </div>

                  {/* Multiple Payment Methods Selection Cards */}
                  <form onSubmit={handleBookingSubmit} className="space-y-6" noValidate>
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-chalk flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Select Payment Method
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        
                        {/* 1. UPI Payment Card */}
                        <div
                          onClick={() => {
                            setPaymentMethod('UPI');
                            setErrors({});
                          }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                            paymentMethod === 'UPI'
                              ? 'bg-neon-accent/10 border-neon-accent text-chalk shadow-lg shadow-neon-accent/10 scale-[1.01]'
                              : 'bg-asphalt/40 border-white/10 text-silver hover:border-white/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <Smartphone className={`w-5 h-5 ${paymentMethod === 'UPI' ? 'text-neon-accent' : 'text-silver/60'}`} />
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={paymentMethod === 'UPI'}
                              onChange={() => setPaymentMethod('UPI')}
                              className="accent-neon-accent"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold uppercase tracking-wide text-chalk">UPI</p>
                            <p className="text-[9px] text-silver/70 font-medium leading-relaxed mt-0.5">
                              Google Pay, PhonePe, Paytm & UPI ID
                            </p>
                          </div>
                        </div>

                        {/* 2. Credit / Debit Card */}
                        <div
                          onClick={() => {
                            setPaymentMethod('CARD');
                            setErrors({});
                          }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                            paymentMethod === 'CARD'
                              ? 'bg-neon-accent/10 border-neon-accent text-chalk shadow-lg shadow-neon-accent/10 scale-[1.01]'
                              : 'bg-asphalt/40 border-white/10 text-silver hover:border-white/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <CreditCard className={`w-5 h-5 ${paymentMethod === 'CARD' ? 'text-neon-accent' : 'text-silver/60'}`} />
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={paymentMethod === 'CARD'}
                              onChange={() => setPaymentMethod('CARD')}
                              className="accent-neon-accent"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold uppercase tracking-wide text-chalk">Credit / Debit Card</p>
                            <p className="text-[9px] text-silver/70 font-medium leading-relaxed mt-0.5">
                              Visa, Mastercard, RuPay & major cards
                            </p>
                          </div>
                        </div>

                        {/* 3. Cash on Pickup */}
                        <div
                          onClick={() => {
                            setPaymentMethod('CASH_ON_PICKUP');
                            setErrors({});
                          }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                            paymentMethod === 'CASH_ON_PICKUP'
                              ? 'bg-neon-accent/10 border-neon-accent text-chalk shadow-lg shadow-neon-accent/10 scale-[1.01]'
                              : 'bg-asphalt/40 border-white/10 text-silver hover:border-white/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <Banknote className={`w-5 h-5 ${paymentMethod === 'CASH_ON_PICKUP' ? 'text-neon-accent' : 'text-silver/60'}`} />
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={paymentMethod === 'CASH_ON_PICKUP'}
                              onChange={() => setPaymentMethod('CASH_ON_PICKUP')}
                              className="accent-neon-accent"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold uppercase tracking-wide text-chalk">Cash on Pickup</p>
                            <p className="text-[9px] text-silver/70 font-medium leading-relaxed mt-0.5">
                              Pay in cash or card at the rental hub
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* CONDITIONAL PAYMENT FORM AREA */}
                    <div className="p-6 bg-asphalt/60 border border-white/10 rounded-2xl space-y-4 transition-all">
                      
                      {/* 1. UPI Form */}
                      {paymentMethod === 'UPI' && (
                        <div className="space-y-4 animate-page-enter">
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold text-silver uppercase tracking-widest">Select UPI Application</label>
                            <div className="flex flex-wrap gap-2">
                              {['Google Pay', 'PhonePe', 'Paytm', 'Generic UPI'].map(app => (
                                <button
                                  key={app}
                                  type="button"
                                  onClick={() => {
                                    setUpiProvider(app);
                                    if (driverEmail && app !== 'Generic UPI') {
                                      const suffix = app === 'Google Pay' ? '@okaxis' : app === 'PhonePe' ? '@ybl' : '@paytm';
                                      setUpiId(driverEmail.split('@')[0] + suffix);
                                    }
                                  }}
                                  className={`px-3.5 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border transition-all ${
                                    upiProvider === app
                                      ? 'bg-neon-accent text-asphalt border-neon-accent shadow-sm'
                                      : 'bg-white/5 border-white/10 text-silver hover:text-chalk'
                                  }`}
                                >
                                  {app}
                                </button>
                              ))}
                            </div>
                          </div>

                          <Input
                            label="UPI Virtual Payment Address (VPA / UPI ID)"
                            name="upiId"
                            required
                            value={upiId}
                            error={errors.upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              if (errors.upiId) setErrors(prev => ({ ...prev, upiId: '' }));
                            }}
                            placeholder="USERNAME@OKHDFCBANK / 9876543210@PAYTM"
                            className="font-mono"
                          />
                          <p className="text-[9px] text-silver/60">
                            A payment request will be sent to your UPI app upon clicking Confirm Booking.
                          </p>
                        </div>
                      )}

                      {/* 2. Credit / Debit Card Form */}
                      {paymentMethod === 'CARD' && (
                        <div className="space-y-4 animate-page-enter">
                          <Input
                            label="Cardholder Name"
                            name="cardholderName"
                            required
                            value={cardholderName}
                            error={errors.cardholderName}
                            onChange={(e) => {
                              setCardholderName(e.target.value);
                              if (errors.cardholderName) setErrors(prev => ({ ...prev, cardholderName: '' }));
                            }}
                            placeholder="ENTER CARDHOLDER NAME"
                          />

                          <Input
                            label="Card Number"
                            name="cardNumber"
                            required
                            placeholder="4111 2222 3333 4444"
                            maxLength={19}
                            value={cardNumber}
                            error={errors.cardNumber}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                              setCardNumber(val);
                              if (errors.cardNumber) setErrors(prev => ({ ...prev, cardNumber: '' }));
                            }}
                            className="font-mono tracking-widest"
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Expiry Date"
                              name="cardExpiry"
                              required
                              placeholder="MM/YY"
                              maxLength={5}
                              value={cardExpiry}
                              error={errors.cardExpiry}
                              onChange={(e) => {
                                let val = e.target.value.replace(/\D/g, '');
                                if (val.length > 2) {
                                  val = val.substring(0, 2) + '/' + val.substring(2, 4);
                                }
                                setCardExpiry(val);
                                if (errors.cardExpiry) setErrors(prev => ({ ...prev, cardExpiry: '' }));
                              }}
                            />

                            <Input
                              label="CVV"
                              name="cardCvv"
                              type="password"
                              required
                              placeholder="•••"
                              maxLength={3}
                              value={cardCvv}
                              error={errors.cardCvv}
                              onChange={(e) => {
                                setCardCvv(e.target.value.replace(/\D/g, ''));
                                if (errors.cardCvv) setErrors(prev => ({ ...prev, cardCvv: '' }));
                              }}
                              className="font-mono"
                            />
                          </div>
                        </div>
                      )}

                      {/* 3. Cash on Pickup Informational Banner */}
                      {paymentMethod === 'CASH_ON_PICKUP' && (
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2 animate-page-enter">
                          <div className="flex items-center gap-2 text-neon-accent font-bold text-xs uppercase tracking-wider">
                            <Info className="w-4 h-4 shrink-0" />
                            <span>Cash / Card Payment at Vehicle Handover</span>
                          </div>
                          <p className="text-[10px] text-silver/80 leading-relaxed font-sans">
                            No online payment credentials are required right now. Total rental fee of <strong className="text-chalk font-sans">₹{totalAmount.toLocaleString()}</strong> will be settled at the pickup location hub when you collect the vehicle keys. Please present your valid physical driving license and government ID during pickup.
                          </p>
                        </div>
                      )}

                    </div>

                    <footer className="flex justify-between pt-6 border-t border-white/10">
                      <Button onClick={prevStep} variant="secondary" type="button">
                        <ArrowLeft className="w-4 h-4" />
                        <span>BACK</span>
                      </Button>
                      <Button type="submit" loading={isSubmitting} className="px-8 py-3.5">
                        <span>CONFIRM BOOKING ({paymentMethod === 'CASH_ON_PICKUP' ? 'PAY ON PICKUP' : 'PAY & CONFIRM'})</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </footer>
                  </form>
                </section>
              )}

            </main>

            {/* Right Column: Dynamic Booking Summary Matrix */}
            <aside className="lg:col-span-4 bg-graphite/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 sticky top-28 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[10px] font-bold text-silver uppercase tracking-widest">BOOKING SUMMARY</span>
                <span className="text-[9px] font-extrabold text-neon-accent uppercase tracking-widest">ESTIMATED COST</span>
              </div>

              {car ? (
                <div className="space-y-6">
                  {/* Selected Car Visual */}
                  <div className="space-y-3">
                    <div className="aspect-[16/10] w-full overflow-hidden bg-asphalt rounded-2xl border border-white/10 relative">
                      <img
                        src={car.images?.[0]}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'; }}
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-silver/60 uppercase tracking-widest block">{car.brand}</span>
                      <h3 className="font-display text-lg text-chalk uppercase tracking-wide">{car.model}</h3>
                    </div>
                  </div>

                  {/* Route & Dates Breakdown */}
                  <div className="text-[10px] text-silver space-y-2 border-t border-white/10 pt-4 uppercase tracking-wider font-bold">
                    <div className="flex justify-between">
                      <span className="text-silver/60">Pickup:</span>
                      <span className="text-chalk">{formatDateFriendly(pickupDate) || 'Select date'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-silver/60">Return:</span>
                      <span className="text-chalk">{formatDateFriendly(returnDate) || 'Select date'}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2 text-chalk">
                      <span className="text-silver/60">Rental Duration:</span>
                      <span className="text-neon-accent font-extrabold">{numDays} {numDays === 1 ? 'Day' : 'Days'}</span>
                    </div>
                  </div>

                  {/* Cost Breakdown Matrix */}
                  <div className="text-[10px] space-y-2.5 border-t border-white/10 pt-4 font-bold uppercase tracking-wider">
                    <div className="flex justify-between text-silver">
                      <span className="text-silver/60">Daily Rate:</span>
                      <span className="text-chalk font-extrabold">₹{car.pricePerDay?.toLocaleString()} / day</span>
                    </div>
                    <div className="flex justify-between text-silver">
                      <span className="text-silver/60">Base Cost ({numDays} days):</span>
                      <span className="text-chalk font-extrabold">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-silver">
                      <span className="text-silver/60">Taxes & Fees (8%):</span>
                      <span className="text-chalk font-extrabold">₹{taxes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-silver">
                      <span className="text-silver/60">Refundable Deposit:</span>
                      <span className="text-chalk font-extrabold">₹{securityDeposit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-4 text-chalk items-baseline">
                      <span className="text-xs font-bold uppercase tracking-widest">ESTIMATED TOTAL:</span>
                      <span className="text-2xl font-extrabold text-neon-accent font-sans">₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-silver text-xs uppercase tracking-widest font-bold">
                  Please select a vehicle to calculate estimated rental total.
                </div>
              )}
            </aside>

          </div>
        ) : (
          /* STEP 4: SUCCESS CONFIRMATION MODAL SCREEN */
          confirmedBooking && (
            <main className="max-w-3xl mx-auto space-y-8 animate-page-enter">
              <div className="bg-graphite/60 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-2xl font-display uppercase tracking-widest text-chalk">BOOKING CONFIRMED</h1>
                  <p className="text-silver/80 text-xs font-sans max-w-md mx-auto">
                    Your reservation has been confirmed and registered under Reference ID: <strong className="text-neon-accent font-mono">{confirmedBooking.bookingId}</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <Button onClick={() => window.print()} variant="secondary">
                    <Printer className="w-4 h-4" />
                    <span>PRINT INVOICE</span>
                  </Button>
                  <Link
                    to="/my-bookings"
                    className="bg-neon-accent hover:bg-chalk text-asphalt px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors shadow-lg"
                  >
                    VIEW BOOKING HISTORY →
                  </Link>
                  <Link
                    to="/dashboard"
                    className="bg-white/10 hover:bg-white/20 text-chalk px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    MY DASHBOARD
                  </Link>
                </div>
              </div>

              {/* Printable Invoice Container */}
              <div id="printable-invoice" className="bg-graphite/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 space-y-6 text-xs text-silver">
                <div className="flex justify-between items-start pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-base font-display uppercase tracking-widest text-chalk">TORQUE RENTAL INVOICE</h2>
                    <span className="text-silver/60 text-[10px] uppercase tracking-wider block mt-1">REFERENCE ID: {confirmedBooking.bookingId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                      {confirmedBooking.status || 'CONFIRMED'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 uppercase tracking-wider text-[10px] font-bold">
                  <div className="space-y-1.5 p-4 bg-asphalt/50 border border-white/10 rounded-2xl">
                    <h4 className="text-neon-accent font-extrabold uppercase text-[10px] tracking-widest mb-2">CUSTOMER DETAILS</h4>
                    <p className="text-chalk">{confirmedBooking.customerDetails.fullName}</p>
                    <p className="text-silver/80">{confirmedBooking.customerDetails.email}</p>
                    <p className="text-silver/80">Phone: {confirmedBooking.customerDetails.phone}</p>
                    <p className="text-silver/80">License: {confirmedBooking.customerDetails.driverLicense}</p>
                  </div>
                  
                  <div className="space-y-1.5 p-4 bg-asphalt/50 border border-white/10 rounded-2xl">
                    <h4 className="text-neon-accent font-extrabold uppercase text-[10px] tracking-widest mb-2">ROUTE PARAMETERS</h4>
                    <p className="text-chalk">Vehicle: {car?.brand} {car?.model}</p>
                    <p className="text-silver/80">Pickup: {formatDateFriendly(pickupDate)} ({confirmedBooking.pickupLocation})</p>
                    <p className="text-silver/80">Return: {formatDateFriendly(returnDate)} ({confirmedBooking.dropoffLocation})</p>
                    <p className="text-silver/80">Duration: {confirmedBooking.totalDays} Days</p>
                  </div>
                </div>

                {/* Explicit Payment Method & Status Confirmation Block */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 uppercase text-[10px] font-bold tracking-wider">
                  <div>
                    <span className="text-silver/50 block text-[8px]">PAYMENT METHOD</span>
                    <span className="text-chalk font-extrabold flex items-center gap-1.5 mt-0.5">
                      {confirmedBooking.paymentDetails?.paymentMethod === 'UPI' ? <Smartphone className="w-3.5 h-3.5 text-neon-accent" /> : confirmedBooking.paymentDetails?.paymentMethod === 'Cash on Pickup' ? <Banknote className="w-3.5 h-3.5 text-neon-accent" /> : <CreditCard className="w-3.5 h-3.5 text-neon-accent" />}
                      {confirmedBooking.paymentDetails?.paymentMethod || 'Credit/Debit Card'}
                      {confirmedBooking.paymentDetails?.upiProvider ? ` (${confirmedBooking.paymentDetails.upiProvider})` : ''}
                    </span>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-silver/50 block text-[8px]">PAYMENT STATUS</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold inline-block mt-0.5 ${
                      confirmedBooking.paymentStatus === 'Paid'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {confirmedBooking.paymentStatus === 'Paid' ? 'PAID' : 'PENDING (PAY ON PICKUP)'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2 uppercase tracking-wider text-[10px] font-bold">
                  <div className="flex justify-between text-silver">
                    <span>Base Hire ({confirmedBooking.totalDays} Days):</span>
                    <span className="font-bold text-chalk">₹{confirmedBooking.billing.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-silver">
                    <span>Refundable Security Deposit:</span>
                    <span className="font-bold text-chalk">₹{confirmedBooking.billing.securityDeposit?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-silver">
                    <span>Taxes & Service Fees:</span>
                    <span className="font-bold text-chalk">₹{confirmedBooking.billing.taxes?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-3 text-base font-extrabold text-chalk items-baseline">
                    <span>TOTAL AMOUNT:</span>
                    <span className="text-neon-accent font-sans text-xl">₹{confirmedBooking.billing.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

            </main>
          )
        )}

      </div>
    </div>
  );
};

export default BookingWorkflow;
