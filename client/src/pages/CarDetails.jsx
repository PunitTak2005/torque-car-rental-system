import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCarDetails, getCarReviews, getCars } from '../services/api';
import { CarDetailsSkeleton } from '../components/SkeletonLoader';
import CarCard from '../components/CarCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useFavorites } from '../context/FavoritesContext';
import {
  MapPin,
  Star,
  FileText,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Users,
  Fuel,
  Gauge,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Shield,
  Clock,
  Heart
} from 'lucide-react';
import Breadcrumbs from '../components/car-details/Breadcrumbs';
import ReviewsSection from '../components/car-details/ReviewsSection';
import Button from '../components/common/Button';
import PickupHubSelect from '../components/common/PickupHubSelect';
import CalendarCard from '../components/common/CalendarCard';
import storage from '../utils/storage';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedCars, setRelatedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [isFav, setIsFav] = useState(false);

  const userId = user?._id || 'guest';

  useEffect(() => {
    if (id) {
      setIsFav(storage.isFavorite(id, userId));
    }
  }, [id, userId]);

  // Rental date picker variables
  const [pickupLoc, setPickupLoc] = useState('');
  const [dropoffLoc, setDropoffLoc] = useState('');
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
  const defaultReturn = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
  const [returnDate, setReturnDate] = useState(defaultReturn);
  const [numDays, setNumDays] = useState(3);

  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      setCar(null);
      setGalleryImages([]);
      setActiveImage('');
      setReviews([]);
      setRelatedCars([]);
      try {
        const carRes = await getCarDetails(id);
        if (carRes.data.success && carRes.data.car) {
          const fetchedCar = carRes.data.car;
          setCar(fetchedCar);
          const imgs = (fetchedCar.images || []).filter(Boolean);
          setGalleryImages(imgs);
          setActiveImage(imgs[0] || 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80');
          const primaryLoc = Array.isArray(fetchedCar.location) ? fetchedCar.location[0] : (fetchedCar.location || 'Delhi');
          setPickupLoc(primaryLoc);
          setDropoffLoc(primaryLoc);

          // Save to recently viewed cars in LocalStorage
          const recent = storage.get(storage.KEYS.RECENTLY_VIEWED, []);
          const updatedRecent = [fetchedCar._id, ...recent.filter(item => item !== fetchedCar._id)].slice(0, 10);
          storage.set(storage.KEYS.RECENTLY_VIEWED, updatedRecent);

          if (carRes.data.reviews) {
            setReviews(carRes.data.reviews);
          } else {
            try {
              const revRes = await getCarReviews(id);
              if (revRes.data.success) {
                setReviews(revRes.data.reviews || []);
              }
            } catch (rErr) {
              console.warn('Reviews fetch warning:', rErr.message);
            }
          }
        } else {
          setError('Vehicle not found');
        }
      } catch (err) {
        console.error('CarDetails fetch error:', err);
        const status = err.response?.status;
        if (status === 404) {
          setError('Vehicle not found');
        } else {
          setError(err.response?.data?.message || 'Unable to load vehicle details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  useEffect(() => {
    if (!car) return;
    const fetchRelated = async () => {
      try {
        const { data } = await getCars({ category: car.category, limit: 3 });
        if (data.success) {
          setRelatedCars(data.cars.filter(item => item._id !== car._id));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRelated();
  }, [car]);

  useEffect(() => {
    if (!pickupDate || !returnDate) {
      setNumDays(0);
      return;
    }
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const timeDiff = end.getTime() - start.getTime();
    if (timeDiff <= 0) {
      setNumDays(0);
      return;
    }
    const days = Math.max(Math.ceil(timeDiff / (1000 * 3600 * 24)), 1);
    setNumDays(days);
  }, [pickupDate, returnDate]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 bg-asphalt">
        <CarDetailsSkeleton />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-asphalt pt-28 pb-16 px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-graphite/40 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-asphalt border border-white/15 rounded-2xl flex items-center justify-center mx-auto text-neon-accent">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-display uppercase tracking-wide text-chalk">
              {error || 'Vehicle Not Found'}
            </h2>
            <p className="text-xs text-silver/70 leading-relaxed font-sans">
              The requested vehicle configuration could not be loaded from our active fleet database. Please return to the fleet gallery to explore available vehicles.
            </p>
          </div>
          <Link
            to="/cars"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neon-accent text-asphalt font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-chalk transition-colors w-full shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO FLEET GALLERY</span>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = car.pricePerDay * numDays;
  const taxes = Math.round(subtotal * 0.08);
  const deposit = car.securityDeposit || 3000;
  const total = subtotal + taxes + deposit;

  const handleBookRedirect = () => {
    const query = new URLSearchParams();
    query.append('pickupLocation', pickupLoc || 'Delhi');
    query.append('dropoffLocation', dropoffLoc || pickupLoc || 'Delhi');
    query.append('pickupDate', pickupDate);
    query.append('returnDate', returnDate);

    navigate(`/booking/${id}?${query.toString()}`);
  };

  return (
    <div className="bg-asphalt min-h-screen pb-24 pt-20 text-chalk animate-page-enter">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero Section: Vehicle Image Showcase */}
        <div className="space-y-4 animate-stagger-1">
          <div className="relative aspect-[16/9] w-full bg-graphite/40 border border-white/10 rounded-3xl overflow-hidden shadow-2xl group">
            <img
              src={activeImage}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'; }}
            />
            {/* Status & Category Overlay Badges */}
            <div className="absolute top-6 left-6 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                AVAILABLE
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-asphalt/80 border border-white/15 text-chalk text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                {car.category}
              </span>
              <button
                onClick={async () => {
                  if (car?._id) {
                    await toggleFavorite(car._id, car);
                  }
                }}
                className={`p-2 rounded-full border backdrop-blur-md transition-all cursor-pointer ${
                  isFavorite(car?._id || id) ? 'bg-rose-500/20 border-rose-500/50 text-rose-500' : 'bg-asphalt/80 border-white/15 text-silver hover:text-chalk'
                }`}
                aria-label={isFavorite(car?._id || id) ? 'Remove from favorites' : 'Add to favorites'}
                title={isFavorite(car?._id || id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-4 h-4 ${isFavorite(car?._id || id) ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Daily Price Tag Overlay */}
            <div className="absolute bottom-6 right-6 px-5 py-3 rounded-2xl bg-asphalt/90 border border-white/15 backdrop-blur-md text-right shadow-xl">
              <span className="text-[9px] font-bold text-silver uppercase tracking-widest block">DAILY RENTAL RATE</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-neon-accent font-sans">
                ₹{car.pricePerDay?.toLocaleString()}
                <span className="text-xs text-silver font-normal font-sans"> / day</span>
              </span>
            </div>
          </div>

          {/* Thumbnail Gallery Row */}
          {galleryImages && galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-28 aspect-[16/10] rounded-2xl overflow-hidden border shrink-0 bg-graphite transition-all cursor-pointer ${
                    activeImage === img ? 'border-neon-accent ring-2 ring-neon-accent/30 scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    onError={() => setGalleryImages((prev) => prev.filter((url) => url !== img))}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Automotive Layout Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-stagger-2">
          
          {/* Left Main Content */}
          <main className="lg:col-span-8 space-y-8">
            
            {/* Header Title Block */}
            <div className="bg-graphite/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-bold text-silver uppercase tracking-widest block">{car.brand}</span>
                  <h1 className="text-3xl sm:text-5xl font-display text-chalk uppercase tracking-wide mt-1">
                    {car.model}
                  </h1>
                  <p className="text-xs text-silver uppercase tracking-widest mt-2 flex items-center gap-1.5 font-sans">
                    <MapPin className="w-4 h-4 text-neon-accent" />
                    <span>Available in: All Major Cities (Delhi, Mumbai, Jaipur, Udaipur, etc.)</span>
                  </p>
                </div>

                {car.numReviews > 0 && car.rating > 0 ? (
                  <div className="inline-flex items-center gap-2 bg-asphalt/80 border border-white/15 px-4 py-2 rounded-2xl text-neon-accent font-extrabold text-xs uppercase tracking-widest shrink-0 self-start sm:self-auto shadow-md">
                    <Star className="w-4 h-4 fill-current text-neon-accent" />
                    <span>{car.rating.toFixed(1)} ({car.numReviews} REVIEWS)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-asphalt/80 border border-white/15 px-4 py-2 rounded-2xl text-silver/70 font-bold text-xs uppercase tracking-widest shrink-0 self-start sm:self-auto shadow-md">
                    <span>NO REVIEWS YET</span>
                  </div>
                )}
              </div>

              {/* Specifications Matrix Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-silver flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-neon-accent" />
                  <span>VEHICLE SPECIFICATIONS</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-asphalt/60 border border-white/10 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 text-silver text-[9px] font-bold uppercase tracking-widest">
                      <Users className="w-3.5 h-3.5 text-neon-accent" /> SEATING
                    </div>
                    <p className="text-sm font-extrabold text-chalk uppercase tracking-wide">{car.specifications?.seats || 5} Seats</p>
                  </div>

                  <div className="p-4 bg-asphalt/60 border border-white/10 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 text-silver text-[9px] font-bold uppercase tracking-widest">
                      <Gauge className="w-3.5 h-3.5 text-neon-accent" /> GEARBOX
                    </div>
                    <p className="text-sm font-extrabold text-chalk uppercase tracking-wide">{car.specifications?.transmission || 'Automatic'}</p>
                  </div>

                  <div className="p-4 bg-asphalt/60 border border-white/10 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 text-silver text-[9px] font-bold uppercase tracking-widest">
                      <Fuel className="w-3.5 h-3.5 text-neon-accent" /> FUEL TYPE
                    </div>
                    <p className="text-sm font-extrabold text-chalk uppercase tracking-wide">{car.specifications?.fuelType || 'Diesel'}</p>
                  </div>

                  <div className="p-4 bg-asphalt/60 border border-white/10 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 text-silver text-[9px] font-bold uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5 text-neon-accent" /> MODEL YEAR
                    </div>
                    <p className="text-sm font-extrabold text-chalk uppercase tracking-wide">{car.year || 2026}</p>
                  </div>
                </div>
              </div>

              {/* Description Block */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-silver">VEHICLE OVERVIEW</h3>
                <p className="text-silver/80 text-xs sm:text-sm leading-relaxed font-sans">
                  {car.description || `${car.brand} ${car.model} offers unmatched luxury, executive performance, and state-of-the-art safety features designed for smooth intercity drives and premium urban comfort.`}
                </p>
              </div>

              {/* Features List */}
              {car.features && car.features.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-silver">PREMIUM HIGHLIGHTS & EQUIPMENT</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {car.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-chalk bg-asphalt/60 px-3 py-2.5 rounded-xl border border-white/10 uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Prerequisites */}
            <div className="bg-graphite/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-widest text-silver flex items-center gap-2">
                <FileText className="w-4 h-4 text-neon-accent" />
                <span>RENTAL PREREQUISITES</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-silver/90 font-sans">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-accent" /> Valid Original Driving License (Minimum 1 Year Active)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-accent" /> Government-issued Photo Identity Proof (Aadhaar / Passport)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-accent" /> Refundable Security Deposit (₹{deposit.toLocaleString()}) upon pickup
                </li>
              </ul>
            </div>

            {/* Guest Reviews Section with Rating Summary & Interactive Form */}
            <ReviewsSection
              carId={id}
              reviews={reviews}
              onReviewAdded={(newRev, allRevs) => setReviews(allRevs)}
            />

          </main>

          {/* Right Configurator Sidebar Panel */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="bg-graphite/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="pb-4 border-b border-white/10">
                <span className="text-[10px] font-bold text-silver uppercase tracking-widest block">DAILY HIRE PRICE</span>
                <div className="flex items-baseline mt-1">
                  <span className="text-3xl font-extrabold text-neon-accent font-sans">₹{car.pricePerDay?.toLocaleString()}</span>
                  <span className="text-silver text-[10px] ml-1 uppercase font-bold tracking-widest">/ day</span>
                </div>
              </div>

              {/* Quick Configurator Inputs */}
              <div className="space-y-4">
                <PickupHubSelect
                  value={pickupLoc}
                  onChange={(val) => setPickupLoc(val)}
                  label="PICKUP HUB"
                  placeholder="Select Pickup Hub"
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-silver uppercase tracking-widest">START DATE</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="block w-full px-3 py-2.5 bg-asphalt border border-white/15 text-xs text-chalk focus:outline-none rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-silver uppercase tracking-widest">END DATE</label>
                    <input
                      type="date"
                      required
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="block w-full px-3 py-2.5 bg-asphalt border border-white/15 text-xs text-chalk focus:outline-none rounded-xl"
                    />
                  </div>
                </div>

                {/* Real-time Vehicle Availability Calendar */}
                <CalendarCard
                  selectedCity={pickupLoc}
                  selectedCarId={car._id}
                  pickupDate={pickupDate}
                  returnDate={returnDate}
                  onDateSelect={(pDate, rDate) => {
                    setPickupDate(pDate);
                    setReturnDate(rDate);
                  }}
                />
              </div>

              {/* Estimated Total Calculation Matrix */}
              <div className="p-4 bg-asphalt/60 border border-white/10 rounded-2xl space-y-2 text-xs font-bold uppercase tracking-wider">
                <div className="flex justify-between text-silver">
                  <span>DURATION:</span>
                  <span className="text-chalk">{numDays} {numDays === 1 ? 'Day' : 'Days'}</span>
                </div>
                <div className="flex justify-between text-silver">
                  <span>BASE RATE:</span>
                  <span className="text-chalk">₹{subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-silver">
                  <span>SECURITY DEPOSIT:</span>
                  <span className="text-chalk">₹{deposit?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-silver">
                  <span>TAXES (8%):</span>
                  <span className="text-chalk">₹{taxes?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-3 text-sm text-chalk items-baseline">
                  <span>ESTIMATED TOTAL:</span>
                  <span className="text-neon-accent font-sans text-xl">₹{total?.toLocaleString()}</span>
                </div>
              </div>

              {/* Main Booking CTA */}
              <Button
                onClick={handleBookRedirect}
                className="w-full py-4 text-xs font-extrabold tracking-widest shadow-xl flex items-center justify-center gap-2"
              >
                <span>BOOK THIS CAR</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-2 justify-center text-[9px] text-silver/60 font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Instant Authorization & Guarantee</span>
              </div>
            </div>
          </aside>

        </div>

        {/* Recommended Similar Fleet */}
        {relatedCars.length > 0 && (
          <div className="space-y-6 border-t border-white/10 pt-12">
            <h2 className="text-xl font-display text-chalk uppercase tracking-widest">RECOMMENDED IN CATEGORY</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedCars.map(item => (
                <CarCard key={item._id} car={item} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CarDetails;
