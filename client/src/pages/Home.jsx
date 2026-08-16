import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCars } from '../services/api';
import { validateDates } from '../validations/rules';
import { useToast } from '../context/ToastContext';
import { AlertCircle, Gauge, Fuel, Users, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';

const Home = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Search parameters for progressive layout
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [errors, setErrors] = useState({});

  const [activeMood, setActiveMood] = useState('CITY');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [categoryIndices, setCategoryIndices] = useState({
    ALL: 0,
    CITY: 0,
    LUXURY: 0,
    SUV: 0,
    PERFORMANCE: 0
  });
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  const fleetSectionRef = useRef(null);

  // Set default dates
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const returnDay = new Date(today);
    returnDay.setDate(today.getDate() + 4);

    setPickupDate(tomorrow.toISOString().split('T')[0]);
    setReturnDate(returnDay.toISOString().split('T')[0]);
  }, []);

  // Fetch fleet cars (limit 20 for rich category pools)
  useEffect(() => {
    const fetchFleet = async () => {
      setLoading(true);
      try {
        setApiError(false);
        const { data } = await getCars({ limit: 20 });
        if (data.success) {
          setFeaturedCars(data.cars);
        }
      } catch (error) {
        console.error(error);
        setApiError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFleet();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!pickupLocation.trim()) errs.pickupLocation = 'Required';
    if (!dropoffLocation.trim()) errs.dropoffLocation = 'Required';
    const dateErr = validateDates(pickupDate, returnDate);
    if (dateErr) errs.dates = dateErr;

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (errs.dates) addToast(dateErr, 'warning');
      return;
    }

    setErrors({});
    const query = new URLSearchParams({
      location: pickupLocation,
      pickupLocation,
      dropoffLocation,
      pickupDate,
      returnDate
    });
    navigate(`/cars?${query.toString()}`);
  };

  const scrollToFleet = () => {
    fleetSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const moodSpecs = {
    CITY: {
      desc: 'Agile, electric, and compact drives built for urban maneuvers and efficiency.',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    },
    ESCAPE: {
      desc: 'Substantial all-wheel-drive systems optimized for mountain trails and weekend freedom.',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
    },
    EXECUTIVE: {
      desc: 'Impeccable acoustic isolation and advanced driver comfort parameters.',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80'
    },
    PERFORMANCE: {
      desc: 'Tuned suspensions, responsive exhausts, and raw power for driving enthusiasts.',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    }
  };

  // Dynamic Category Pool Matching
  const getCategoryPool = (categoryName, carsList) => {
    if (!carsList || carsList.length === 0) return [];
    if (categoryName === 'ALL') return carsList;

    const catUpper = categoryName.toUpperCase();
    const filtered = carsList.filter(car => {
      const carCat = (car.category || '').toUpperCase();
      const carModel = (car.model || '').toUpperCase();
      const carBrand = (car.brand || '').toUpperCase();

      if (catUpper === 'CITY') {
        return carCat.includes('CITY') || carCat.includes('HATCH') || carCat.includes('SEDAN') ||
          carModel.includes('SWIFT') || carModel.includes('I20') || carModel.includes('BALENO') || carModel.includes('ALTROZ') || carModel.includes('I10');
      }
      if (catUpper === 'LUXURY') {
        return carCat.includes('LUXURY') || carCat.includes('EXEC') || carCat.includes('PREMIUM') ||
          carBrand.includes('LEXUS') || carBrand.includes('BMW') || carBrand.includes('MERCEDES') || carBrand.includes('AUDI') || carModel.includes('CAMRY') || carModel.includes('CARNIVAL');
      }
      if (catUpper === 'SUV') {
        return carCat.includes('SUV') || carCat.includes('4X4') || carCat.includes('CROSSOVER') ||
          carModel.includes('CRETA') || carModel.includes('SELTOS') || carModel.includes('HARRIER') || carModel.includes('SCORPIO') || carModel.includes('DEFENDER') || carModel.includes('HYCROSS') || carModel.includes('INVICTO');
      }
      if (catUpper === 'PERFORMANCE') {
        return carCat.includes('PERFORMANCE') || carCat.includes('SPORT') || carCat.includes('SUPER') ||
          carModel.includes('THAR') || carModel.includes('MUSTANG') || carModel.includes('PORSCHE') || carModel.includes('DEFENDER') || carModel.includes('VERNA') || carModel.includes('VIRTUS');
      }

      return carCat.includes(catUpper);
    });

    return filtered.length > 0 ? filtered : carsList;
  };

  // Handle Category Button Click with Sequential Rotation
  const handleCategoryClick = (categoryName) => {
    const pool = getCategoryPool(categoryName, featuredCars);
    if (selectedCategory === categoryName) {
      setCategoryIndices(prev => {
        const nextIdx = pool.length > 0 ? (prev[categoryName] + 1) % pool.length : 0;
        return { ...prev, [categoryName]: nextIdx };
      });
    } else {
      setSelectedCategory(categoryName);
    }
  };

  // Currently Featured Vehicle from Pool
  const currentPool = getCategoryPool(selectedCategory, featuredCars);
  const currentIdx = (categoryIndices[selectedCategory] || 0) % (currentPool.length || 1);
  const featuredCar = currentPool[currentIdx] || featuredCars[0];

  // Secondary Cars from Pool (Excluding currently featured car)
  const secondaryCars = currentPool.filter((_, idx) => idx !== currentIdx);

  return (
    <div className="bg-asphalt text-chalk selection:bg-neon-accent selection:text-asphalt min-h-screen">

      {/* 1. IMMERSIVE HERO WITH ALMOST EMPTY VIEWPORT */}
      <section className="relative h-screen w-full flex items-center overflow-hidden bg-asphalt px-6 sm:px-12 lg:px-20">
        {/* Background Full Viewport Image - Pushed right on desktop */}
        <div className="absolute top-0 right-0 h-full w-full lg:w-3/5 z-0">
          <img
            src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=85"
            alt="Immersive sports car launch screen"
            className="w-full h-full object-cover opacity-40 lg:opacity-75 scale-100 transition-transform duration-[12s] ease-out hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-transparent to-asphalt lg:bg-gradient-to-r lg:from-asphalt lg:via-asphalt/60 lg:to-transparent" />
        </div>

        {/* Asymmetric Content Overlay Grid */}
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-20">
          <div className="lg:col-span-7 space-y-6 lg:space-y-8 animate-page-enter">
            <span className="text-[9px] font-bold tracking-[0.3em] text-neon-accent uppercase block">
              TORQUE
            </span>

            <h1 className="text-6xl sm:text-8xl tracking-tight leading-[0.85] font-display uppercase font-bold text-chalk">
              DRIVE <br />
              <span className="text-silver">WITH FORCE.</span>
            </h1>

            <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-silver/60 uppercase max-w-md leading-relaxed">
              Premium vehicles. Unforgettable journeys.
            </p>

            <div className="pt-4">
              <button
                onClick={scrollToFleet}
                className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-neon-accent hover:text-chalk transition-all relative py-2"
              >
                EXPLORE THE FLEET <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-neon-accent transition-all duration-300 group-hover:w-full" />
              </button>
            </div>
          </div>

          {/* Embedded Mechanical Telemetry Specs Overlay */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-end text-right space-y-4 uppercase tracking-widest text-[9px] font-bold text-silver/60">

            {/* Telemetry Module 1 */}
            <div className="group w-44 p-4 rounded-2xl bg-graphite/40 backdrop-blur-md border border-white/10 hover:border-neon-accent/40 hover:-translate-x-1.5 transition-all duration-300 shadow-xl relative overflow-hidden text-right">
              <div className="absolute top-0 right-0 w-12 h-[2px] bg-gradient-to-l from-neon-accent/80 to-transparent" />
              <div className="flex items-center justify-end gap-1.5 mb-1.5 text-[8px] font-extrabold text-silver/50 tracking-[0.2em]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span></span>
              </div>
              <span className="text-chalk font-display text-base tracking-normal group-hover:text-neon-accent transition-colors duration-200 block">
                TORQUE
              </span>
              <p className="text-[8px] mt-1 text-silver/50 font-extrabold tracking-widest">
                PREMIUM CONFIG
              </p>
            </div>

            {/* Telemetry Module 2 */}
            <div className="group w-44 p-4 rounded-2xl bg-graphite/40 backdrop-blur-md border border-white/10 hover:border-neon-accent/40 hover:-translate-x-1.5 transition-all duration-300 shadow-xl relative overflow-hidden text-right">
              <div className="absolute top-0 right-0 w-12 h-[2px] bg-gradient-to-l from-neon-accent/80 to-transparent" />
              <div className="flex items-center justify-end gap-1.5 mb-1.5 text-[8px] font-extrabold text-silver/50 tracking-[0.2em]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span></span>
              </div>
              <span className="text-chalk font-display text-base tracking-normal group-hover:text-neon-accent transition-colors duration-200 block">
                24/7
              </span>
              <p className="text-[8px] mt-1 text-silver/50 font-extrabold tracking-widest">
                OPERATIONAL GRID
              </p>
            </div>

            {/* Telemetry Module 3 */}
            <div className="group w-44 p-4 rounded-2xl bg-graphite/40 backdrop-blur-md border border-white/10 hover:border-neon-accent/40 hover:-translate-x-1.5 transition-all duration-300 shadow-xl relative overflow-hidden text-right">
              <div className="absolute top-0 right-0 w-12 h-[2px] bg-gradient-to-l from-neon-accent/80 to-transparent" />
              <div className="flex items-center justify-end gap-1.5 mb-1.5 text-[8px] font-extrabold text-silver/50 tracking-[0.2em]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span></span>
              </div>
              <span className="text-chalk font-display text-base tracking-normal group-hover:text-neon-accent transition-colors duration-200 block">
                5+
              </span>
              <p className="text-[8px] mt-1 text-silver/50 font-extrabold tracking-widest">
                VEHICLE CLASSES
              </p>
            </div>

          </div>
        </div>

        {/* Scroll indicator footer */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 text-silver/40 text-[9px] uppercase tracking-widest font-bold">
          <span>SCROLL TO EXPLORE</span>
          <div className="w-[1px] h-6 bg-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-neon-accent animate-[bounce_1.8s_infinite]" />
          </div>
        </div>
      </section>

      {/* 2. PLAN YOUR DRIVE PROGRESSIVE TRIP CONFIGURATOR */}
      <section className="bg-graphite border-y border-white/5 py-24 px-6 sm:px-10">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="space-y-2 border-l border-neon-accent pl-6">
            <span className="text-[9px] font-bold text-silver tracking-widest uppercase">CONFIGURATOR</span>
            <h2 className="text-3xl font-display uppercase tracking-wider text-chalk">PLAN YOUR DRIVE</h2>
          </header>

          <form onSubmit={handleSearchSubmit} className="space-y-10" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <span className="text-[11px] font-bold text-silver tracking-widest uppercase block">Where are you going?</span>
                <input
                  type="text"
                  required
                  placeholder="PICKUP HUB"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-chalk placeholder-stone focus:outline-none focus:border-neon-accent transition-colors tracking-widest uppercase font-bold"
                />
              </div>

              <div className="space-y-4">
                <span className="text-[11px] font-bold text-silver tracking-widest uppercase block">Where will you return?</span>
                <input
                  type="text"
                  required
                  placeholder="DROPOFF HUB"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-chalk placeholder-stone focus:outline-none focus:border-neon-accent transition-colors tracking-widest uppercase font-bold"
                />
              </div>

              <div className="space-y-4">
                <span className="text-[11px] font-bold text-silver tracking-widest uppercase block">When does the journey begin?</span>
                <input
                  type="date"
                  required
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-chalk focus:outline-none focus:border-neon-accent transition-colors uppercase font-bold"
                />
              </div>

              <div className="space-y-4">
                <span className="text-[11px] font-bold text-silver tracking-widest uppercase block">How long are you staying?</span>
                <input
                  type="date"
                  required
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-chalk focus:outline-none focus:border-neon-accent transition-colors uppercase font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-10 py-4 bg-neon-accent text-asphalt text-[10px] font-bold uppercase tracking-widest hover:bg-chalk transition-all"
              >
                FIND MY DRIVE →
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 2.5 THE TORQUE PHILOSOPHY (EDITORIAL SECTION) */}
      <section className="bg-asphalt py-32 px-6 sm:px-10 border-b border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-24">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Huge Confident Headline */}
            <div className="lg:col-span-8 space-y-6">
              <span className="text-[9px] font-bold tracking-[0.3em] text-neon-accent uppercase block">
                THE TORQUE PHILOSOPHY
              </span>
              <h2 className="text-4xl sm:text-7xl tracking-tight leading-[0.9] font-display uppercase font-bold text-chalk">
                WE DON'T JUST <br />
                RENT CARS. <br />
                <span className="text-silver">WE CREATE WAYS TO MOVE.</span>
              </h2>
              <p className="text-[11px] sm:text-xs font-bold tracking-widest text-silver/60 uppercase max-w-xl leading-relaxed mt-6">
                TORQUE connects people with vehicles built for the journey ahead — from everyday city drives to long-distance escapes and unforgettable road trips.
              </p>
            </div>

            {/* Right Column: Dynamic Numbers Area */}
            <div className="lg:col-span-4 flex flex-col gap-8 justify-end h-full lg:text-right border-l lg:border-l-0 lg:border-r border-white/5 pl-6 lg:pl-0 lg:pr-8">
              <div className="uppercase tracking-widest font-bold">
                <span className="text-4xl sm:text-5xl font-display text-neon-accent block">30+</span>
                <span className="text-[8px] text-silver/45 mt-1 block">Vehicles in Grid</span>
              </div>
              <div className="uppercase tracking-widest font-bold">
                <span className="text-4xl sm:text-5xl font-display text-chalk block">24/7</span>
                <span className="text-[8px] text-silver/45 mt-1 block">Configurator Online</span>
              </div>
              <div className="uppercase tracking-widest font-bold">
                <span className="text-4xl sm:text-5xl font-display text-chalk block">100%</span>
                <span className="text-[8px] text-silver/45 mt-1 block">Drive Ready Telemetry</span>
              </div>
            </div>
          </div>

          {/* Immersive Road Movement Image Block */}
          <div className="relative w-full aspect-[21/9] overflow-hidden bg-graphite border border-white/5">
            <img
              src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=2000&q=80"
              alt="High-speed mountain pass drive"
              className="w-full h-full object-cover opacity-60 scale-100 transition-transform duration-[10s] hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-transparent to-transparent" />
          </div>

          {/* Principles sequence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-8 uppercase tracking-widest font-bold text-[9px]">
            <div className="space-y-4 border-t border-white/5 pt-6">
              <span className="text-neon-accent block text-xs">FREEDOM</span>
              <p className="text-[10px] text-silver/70 leading-relaxed font-bold tracking-wider">
                Go wherever the road takes you.
              </p>
            </div>
            <div className="space-y-4 border-t border-white/5 pt-6">
              <span className="text-chalk block text-xs">PRECISION</span>
              <p className="text-[10px] text-silver/70 leading-relaxed font-bold tracking-wider">
                Simple booking. Carefully selected vehicles.
              </p>
            </div>
            <div className="space-y-4 border-t border-white/5 pt-6">
              <span className="text-chalk block text-xs">MOTION</span>
              <p className="text-[10px] text-silver/70 leading-relaxed font-bold tracking-wider">
                Because the journey matters as much as the destination.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. HORIZONTAL VEHICLE REVEAL / SHOWROOM SECTION */}
      <section ref={fleetSectionRef} className="py-28 lg:py-36 bg-asphalt text-chalk border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 space-y-16">

          {/* Section Header & Category Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/10 pb-10">
            <div className="space-y-4 max-w-2xl">
              {/* Section Marker */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-accent animate-pulse" />
                <span className="text-[10px] font-extrabold text-silver uppercase tracking-[0.25em]">THE FLEET</span>
                <span className="w-4 h-[1px] bg-white/20" />
              </div>

              {/* Main Heading */}
              <h2 className="text-4xl sm:text-6xl font-display uppercase tracking-wider text-chalk font-extrabold leading-[0.9]">
                CHOOSE YOUR DRIVE
              </h2>

              {/* Description */}
              <p className="text-silver/70 text-xs sm:text-sm font-sans tracking-wide leading-relaxed max-w-xl">
                From everyday escapes to long-distance adventures, find the machine that fits your journey.
              </p>
            </div>

            {/* Category Navigation Controls */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none shrink-0">
              {['ALL', 'CITY', 'LUXURY', 'SUV', 'PERFORMANCE'].map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${selectedCategory === cat
                    ? 'bg-neon-accent text-asphalt shadow-lg shadow-neon-accent/20 scale-[1.02]'
                    : 'bg-graphite/40 border border-white/10 text-silver hover:text-chalk hover:border-white/30'
                    }`}
                >
                  {cat} {currentPool.length > 1 && selectedCategory === cat ? `(${currentIdx + 1}/${currentPool.length})` : ''}
                </button>
              ))}
            </div>
          </div>

          {apiError ? (
            <div className="text-center py-20 text-silver uppercase text-[10px] tracking-widest font-bold border border-white/10 rounded-3xl bg-graphite/40 max-w-md mx-auto space-y-4">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <p className="text-chalk font-bold">THE ROAD IS QUIET</p>
              <p className="text-silver/60">NO VEHICLES ARE CURRENTLY AVAILABLE IN THIS CATEGORY.</p>
            </div>
          ) : loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4 bg-graphite/40 border border-white/10 rounded-3xl">
              <span className="text-[10px] font-extrabold text-silver uppercase tracking-[0.3em] animate-pulse">LOADING FLEET CATALOG</span>
              <div className="w-32 h-[2px] bg-white/10 relative overflow-hidden rounded-full">
                <div className="absolute top-0 left-0 h-full w-12 bg-neon-accent animate-pulse" />
              </div>
            </div>
          ) : !featuredCar ? (
            <div className="text-center py-20 text-silver uppercase text-[10px] tracking-widest font-bold border border-white/10 rounded-3xl bg-graphite/40 max-w-md mx-auto space-y-4">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <p className="text-chalk font-bold">NO VEHICLES AVAILABLE</p>
              <p className="text-silver/60">No vehicles available in this category.</p>
            </div>
          ) : (
            <div className="space-y-12">

              {/* Primary Feature Showcase (Currently Featured Vehicle) */}
              <div
                key={featuredCar._id}
                className="bg-graphite/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center group hover:border-neon-accent/40 hover:shadow-2xl hover:shadow-neon-accent/5 transition-all duration-500 relative overflow-hidden animate-page-enter"
              >
                <div className="absolute top-0 right-0 w-32 h-[2px] bg-gradient-to-l from-neon-accent/80 to-transparent" />

                {/* Left Column Info */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-neon-accent/10 border border-neon-accent/30 rounded-full text-[9px] font-extrabold text-neon-accent uppercase tracking-widest">
                      FEATURED SELECTION ({currentIdx + 1} OF {currentPool.length})
                    </span>
                    <span className="text-[9px] font-bold text-silver/60 uppercase tracking-widest">
                      {featuredCar.category || 'Standard'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold text-silver/50 uppercase tracking-widest block">
                      {featuredCar.brand}
                    </span>
                    <h3 className="text-3xl sm:text-5xl font-display text-chalk uppercase tracking-wide font-extrabold group-hover:text-neon-accent transition-colors duration-200 mt-1">
                      {featuredCar.model}
                    </h3>
                  </div>

                  {/* Specification Pills */}
                  <div className="flex flex-wrap gap-2 text-[9px] font-bold text-silver/80 uppercase tracking-wider">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-neon-accent" /> {featuredCar.specifications?.transmission || featuredCar.transmission || 'Automatic'}
                    </span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg flex items-center gap-1.5">
                      <Fuel className="w-3.5 h-3.5 text-neon-accent" /> {featuredCar.specifications?.fuelType || featuredCar.fuel || 'Petrol'}
                    </span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-neon-accent" /> {featuredCar.specifications?.seats || 5} Seats
                    </span>
                  </div>

                  <div className="pt-2 flex items-baseline gap-2">
                    <span className="text-xs font-bold text-silver/60 uppercase tracking-widest block">DAILY RATE:</span>
                    <span className="text-3xl font-extrabold text-neon-accent font-sans">
                      ₹{featuredCar.pricePerDay?.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-silver/60 uppercase tracking-wider">/ day</span>
                  </div>

                  <div className="pt-2">
                    <Link to={`/cars/${featuredCar._id}`}>
                      <Button className="bg-neon-accent hover:bg-chalk text-asphalt font-extrabold text-xs px-6 py-3.5 uppercase tracking-widest rounded-xl flex items-center gap-2 shadow-lg cursor-pointer">
                        <span>EXPLORE {featuredCar.model}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right Column Image */}
                <div className="lg:col-span-7 aspect-[16/10] w-full overflow-hidden bg-asphalt rounded-2xl border border-white/10 relative group/img">
                  <img
                    src={featuredCar.images?.[0] || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'}
                    alt={`${featuredCar.brand} ${featuredCar.model}`}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-700 ease-out"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'; }}
                  />
                  {featuredCar.location && (
                    <div className="absolute bottom-4 left-4 bg-asphalt/90 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-lg text-[9px] font-bold text-silver uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neon-accent" />
                      <span>{Array.isArray(featuredCar.location) ? 'All Major Hubs' : featuredCar.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Secondary Fleet Cards Grid */}
              {secondaryCars.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {secondaryCars.map((car, idx) => (
                    <div
                      key={car._id}
                      className="bg-graphite/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden p-6 flex flex-col justify-between hover:border-neon-accent/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group shadow-md"
                    >
                      <div className="space-y-4">
                        {/* Header Badges */}
                        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-silver">
                          <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-chalk">
                            {car.category || 'Standard'}
                          </span>
                          <span className="text-[9px] font-mono text-neon-accent font-extrabold">
                            POOL VEHICLE
                          </span>
                        </div>

                        {/* Image Showcase */}
                        <div className="aspect-[16/10] w-full overflow-hidden bg-asphalt rounded-xl relative">
                          <img
                            src={car.images?.[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'}
                            alt={`${car.brand} ${car.model}`}
                            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-500 ease-out"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'; }}
                          />
                        </div>

                        {/* Details */}
                        <div>
                          <span className="text-[9px] font-bold text-silver/60 uppercase tracking-widest block">
                            {car.brand}
                          </span>
                          <h4 className="text-xl font-display text-chalk uppercase tracking-wide font-bold group-hover:text-neon-accent transition-colors line-clamp-1 mt-0.5">
                            {car.model}
                          </h4>
                        </div>
                      </div>

                      {/* Footer Rate & CTA Link */}
                      <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-[8px] text-silver/50 font-bold uppercase tracking-widest block">DAILY RATE</span>
                          <span className="text-lg font-extrabold text-neon-accent font-sans">
                            ₹{car.pricePerDay?.toLocaleString()}
                          </span>
                        </div>

                        <Link to={`/cars/${car._id}`}>
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-chalk text-asphalt hover:bg-neon-accent transition-colors rounded-xl text-[9px] font-bold uppercase tracking-wider group/btn cursor-pointer shadow-sm active:scale-95">
                            <span>DETAILS</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom CTA to Fleet Showroom */}
              <div className="pt-6 flex justify-center sm:justify-end">
                <Link to="/cars">
                  <Button className="bg-white/5 hover:bg-white/10 border border-white/15 text-chalk text-xs px-6 py-3 uppercase tracking-widest rounded-xl flex items-center gap-2 cursor-pointer shadow-md">
                    <span>VIEW FULL FLEET SHOWROOM ({featuredCars.length}+ VEHICLES)</span>
                    <ArrowRight className="w-4 h-4 text-neon-accent" />
                  </Button>
                </Link>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* 4. CHOOSE YOUR MOOD SECTION (EXPERIENTIAL MOOD FILTER) */}
      <section className="bg-graphite py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-6 self-center">
            <span className="text-[9px] font-bold text-silver tracking-widest uppercase block">EXPERIENCE</span>
            <h2 className="text-3xl font-display uppercase tracking-widest text-chalk">WHAT'S YOUR DRIVE?</h2>
            <p className="text-[10px] text-silver tracking-widest uppercase">Match your road configuration to your exact mindset parameters.</p>

            <div className="flex flex-col gap-3 pt-6">
              {Object.keys(moodSpecs).map(mood => (
                <button
                  key={mood}
                  onClick={() => setActiveMood(mood)}
                  className={`text-left text-[11px] font-bold uppercase tracking-[0.2em] py-2 border-l-2 pl-4 transition-all ${activeMood === mood ? 'border-neon-accent text-neon-accent' : 'border-white/5 text-silver hover:text-chalk'
                    }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="aspect-[21/9] w-full overflow-hidden bg-asphalt border border-white/5">
              <img
                src={moodSpecs[activeMood].image}
                alt=""
                className="w-full h-full object-cover opacity-60"
              />
            </div>
            <p className="text-sm font-sans tracking-wide text-chalk/80 leading-relaxed italic max-w-xl">
              "{moodSpecs[activeMood].desc}"
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
