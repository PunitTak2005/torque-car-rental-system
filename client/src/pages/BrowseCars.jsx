import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getCars, getCarBrands, getCarLocations } from '../services/api';
import Button from '../components/common/Button';
import { 
  Search, 
  SlidersHorizontal, 
  RefreshCw, 
  AlertCircle, 
  Car, 
  Fuel, 
  Users, 
  MapPin, 
  Sparkles, 
  X, 
  ArrowRight,
  Gauge,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const LargeVehicleShowcase = ({ car, index, totalCars, selectedLocation }) => {
  const formattedIdx = index < 10 ? `0${index}` : index;
  const formattedTotal = totalCars < 10 ? `0${totalCars}` : totalCars;
  const isAvailable = car.availability === true;

  const displayLocation = selectedLocation ? selectedLocation : (Array.isArray(car.location) ? 'All Cities' : car.location);

  return (
    <div className="w-full bg-graphite/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden flex flex-col lg:flex-row group hover:border-neon-accent/50 hover:shadow-2xl hover:shadow-neon-accent/10 hover:-translate-y-1 transition-all duration-300 relative min-h-[380px]">
      
      {/* 1. Fixed Aspect Ratio Large Vehicle Visual (Left ~58% Width) */}
      <div className="relative lg:w-7/12 aspect-[16/10] lg:aspect-[16/9] min-h-[280px] sm:min-h-[360px] overflow-hidden bg-asphalt shrink-0">
        <img
          src={car.images?.[0]}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500 ease-out"
          onError={(e) => { 
            e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'; 
          }}
        />

        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <span className="bg-asphalt/90 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold text-neon-accent uppercase tracking-widest shadow-md">
            SHOWCASE NO. {formattedIdx} / {formattedTotal}
          </span>
          <span className="bg-asphalt/80 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full text-[10px] font-bold text-chalk uppercase tracking-wider">
            {car.category || 'Standard'}
          </span>
        </div>

        {car.location && (
          <div className="absolute bottom-4 left-4 bg-asphalt/85 backdrop-blur-md border border-white/15 px-3 py-1 rounded-lg text-[9px] font-bold text-silver uppercase tracking-wider flex items-center gap-1.5 z-10">
            <MapPin className="w-3.5 h-3.5 text-neon-accent" />
            <span>{displayLocation}</span>
          </div>
        )}
      </div>

      {/* 2. Uniform Vehicle Detail Panel (Right ~42% Width) */}
      <div className="lg:w-5/12 p-6 sm:p-8 flex flex-col justify-between h-full bg-gradient-to-b from-graphite/40 to-asphalt/80 border-t lg:border-t-0 lg:border-l border-white/10 space-y-6">
        
        {/* Top Details Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-[10px] font-bold text-silver/60 uppercase tracking-widest">
            <span>MACHINE SPECS</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] border font-bold flex items-center gap-1.5 ${
              isAvailable 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              {isAvailable ? 'AVAILABLE' : 'RESERVED'}
            </span>
          </div>

          {/* Reserved Brand & Model Title Block */}
          <div className="min-h-[56px] flex flex-col justify-center">
            <span className="text-xs font-bold text-silver/70 uppercase tracking-widest block">{car.brand}</span>
            <h2 className="text-2xl sm:text-3xl font-display text-chalk uppercase tracking-wide group-hover:text-neon-accent transition-colors line-clamp-1 mt-0.5">
              {car.model}
            </h2>
          </div>

          {/* Reserved Description Block */}
          <p className="text-xs text-silver/70 leading-relaxed font-sans line-clamp-2 min-h-[36px]">
            {car.description || 'Precision engineering with premium interior luxury, smooth gear shifts, and exceptional road dynamics.'}
          </p>

          {/* Reserved Specifications Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] font-bold text-silver uppercase tracking-wider">
            <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
              <Gauge className="w-4 h-4 text-neon-accent shrink-0" />
              <div className="truncate">
                <span className="text-[7px] text-silver/50 block">TRANSMISSION</span>
                <span className="truncate">{car.specifications?.transmission || 'Automatic'}</span>
              </div>
            </div>

            <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
              <Fuel className="w-4 h-4 text-neon-accent shrink-0" />
              <div className="truncate">
                <span className="text-[7px] text-silver/50 block">FUEL ENGINE</span>
                <span className="truncate">{car.specifications?.fuelType || 'Petrol'}</span>
              </div>
            </div>

            <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 col-span-2">
              <Users className="w-4 h-4 text-neon-accent shrink-0" />
              <div className="truncate">
                <span className="text-[7px] text-silver/50 block">SEATING CONFIGURATION</span>
                <span className="truncate">{car.specifications?.seats || 5} Passengers ({car.specifications?.doors || 4} Doors)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Pricing & Aligned CTA Section (pushed to bottom with mt-auto) */}
        <div className="pt-5 border-t border-white/10 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[8px] text-silver/50 font-bold uppercase tracking-widest block">DAILY RENTAL RATE</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-neon-accent font-sans">
                ₹{car.pricePerDay?.toLocaleString()}
              </span>
              <span className="text-xs text-silver/60 font-bold uppercase tracking-wider">/ day</span>
            </div>
          </div>

          <Link to={`/cars/${car._id}`}>
            <span className="inline-flex items-center gap-2 px-5 py-3 bg-chalk text-asphalt hover:bg-neon-accent transition-colors rounded-xl text-xs font-bold uppercase tracking-wider group/btn cursor-pointer shadow-lg">
              <span>VIEW DETAILS</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

      </div>

    </div>
  );
};

const BrowseCars = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterTrackRef = useRef(null);

  const searchVal = searchParams.get('search') || '';
  const locationVal = searchParams.get('location') || '';
  const pickupVal = searchParams.get('pickupDate') || '';
  const returnVal = searchParams.get('returnDate') || '';
  const categoryParam = searchParams.get('category');

  const [searchInputValue, setSearchInputValue] = useState(searchVal);
  const [searchTerm, setSearchTerm] = useState(searchVal);

  // Local Filter States
  const [selectedLocation, setSelectedLocation] = useState(locationVal);
  const [selectedCategories, setSelectedCategories] = useState(categoryParam ? categoryParam.split(',') : []);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  const [cars, setCars] = useState([]);
  const [totalCars, setTotalCars] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [brands, setBrands] = useState([]);
  const [locations, setLocations] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const s = searchParams.get('search') || '';
    setSearchInputValue(s);
    setSearchTerm(s);
    setSelectedLocation(searchParams.get('location') || '');
    const c = searchParams.get('category');
    setSelectedCategories(c ? c.split(',') : []);
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInputValue);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInputValue]);

  useEffect(() => {
    const loadDistinct = async () => {
      try {
        const [brandRes, locRes] = await Promise.all([getCarBrands(), getCarLocations()]);
        if (brandRes.data.success) setBrands(brandRes.data.brands);
        if (locRes.data.success) setLocations(locRes.data.locations);
      } catch (err) {
        console.error(err);
      }
    };
    loadDistinct();
  }, []);

  useEffect(() => {
    const fetchCarsList = async () => {
      setLoading(true);
      setApiError(false);
      try {
        const queryParams = {
          search: searchTerm || undefined,
          location: selectedLocation || undefined,
          pickupDate: pickupVal || undefined,
          returnDate: returnVal || undefined,
          category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
          brand: selectedBrand || undefined,
          fuelType: selectedFuel || undefined,
          transmission: selectedTransmission || undefined,
          priceMin: minPrice > 0 ? minPrice : undefined,
          priceMax: maxPrice < 15000 ? maxPrice : undefined,
          availability: selectedAvailability || undefined,
          sort: sortBy,
          page: currentPage,
          limit: 9
        };

        const { data } = await getCars(queryParams);
        if (data.success) {
          setCars(data.cars);
          setTotalCars(data.pagination.total);
          setTotalPages(data.pagination.pages);
        }
      } catch (error) {
        console.error(error);
        setApiError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCarsList();
  }, [
    searchTerm,
    selectedLocation,
    pickupVal,
    returnVal,
    selectedCategories,
    selectedBrand,
    selectedFuel,
    selectedTransmission,
    minPrice,
    maxPrice,
    selectedAvailability,
    sortBy,
    currentPage
  ]);

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedLocation !== '' ||
    selectedCategories.length > 0 ||
    selectedBrand !== '' ||
    selectedFuel !== '' ||
    selectedTransmission !== '' ||
    minPrice > 0 ||
    maxPrice < 15000 ||
    selectedAvailability !== '' ||
    sortBy !== 'recommended';

  const resetFilters = () => {
    setSearchInputValue('');
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedCategories([]);
    setSelectedBrand('');
    setSelectedFuel('');
    setSelectedTransmission('');
    setMinPrice(0);
    setMaxPrice(15000);
    setSelectedAvailability('');
    setSortBy('recommended');
    setSearchParams({});
    setCurrentPage(1);
  };

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  };

  return (
    <div className="bg-asphalt min-h-screen pb-24 pt-20 text-chalk animate-page-enter">
      
      {/* Showroom Header */}
      <div className="relative border-b border-white/10 bg-gradient-to-b from-graphite/80 via-asphalt to-asphalt overflow-hidden py-16 sm:py-20">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-neon-accent/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-neon-accent" />
              <span className="text-[10px] font-bold text-silver tracking-[0.25em] uppercase">HORIZONTALLY SCROLLABLE SHOWROOM</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-widest text-chalk leading-none">
              THE TORQUE FLEET
            </h1>
            <p className="text-xs sm:text-sm text-silver/70 tracking-wide leading-relaxed font-sans max-w-xl">
              Experience each machine in uniform, large cinematic detail. Filter effortlessly using the horizontal showroom carousel.
            </p>
          </div>
          
          {/* Quick Search Bar */}
          <div className="relative w-full lg:max-w-md shrink-0">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-silver/60 pointer-events-none" />
              <input
                type="text"
                placeholder="SEARCH MACHINE (E.G. SCORPIO, LEXUS, THAR)..."
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                className="w-full pl-11 pr-10 py-4 bg-graphite/80 backdrop-blur-md border border-white/15 rounded-2xl text-xs text-chalk placeholder-silver/40 focus:outline-none focus:border-neon-accent transition-all uppercase tracking-wider font-semibold shadow-xl shadow-black/50"
              />
              {searchInputValue && (
                <button
                  onClick={() => setSearchInputValue('')}
                  className="absolute right-3.5 text-silver/50 hover:text-chalk"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10">
        
        {/* HORIZONTALLY SCROLLABLE SHOWROOM FILTERS BAR */}
        <div className="mb-10 bg-graphite/50 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-2xl shadow-2xl relative">
          
          {/* Header Row: Title, Count, Reset & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal className="w-4 h-4 text-neon-accent" />
              <span className="font-bold text-xs tracking-wider uppercase text-chalk">SHOWROOM FILTERS</span>
              <span className="text-[10px] font-extrabold text-silver/60 uppercase tracking-widest ml-1">
                {loading ? (
                  <span className="inline-flex items-center gap-1.5 text-neon-accent">
                    <RefreshCw className="w-3 h-3 animate-spin" /> LOADING...
                  </span>
                ) : (
                  `(${totalCars} MACHINES SHOWCASED)`
                )}
              </span>
            </div>

            <div className="flex items-center gap-3 justify-between sm:justify-end">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-[10px] font-bold text-neon-accent uppercase tracking-widest hover:underline cursor-pointer flex items-center gap-1 bg-neon-accent/10 border border-neon-accent/30 px-3 py-1.5 rounded-xl transition-all"
                >
                  <X className="w-3.5 h-3.5" /> RESET ALL
                </button>
              )}
              
              {/* Sort Select */}
              <select
                value={sortBy}
                aria-label="Sort vehicles list"
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="bg-asphalt border border-white/15 rounded-xl px-3.5 py-1.5 text-xs font-bold text-chalk uppercase tracking-wider focus:outline-none focus:border-neon-accent cursor-pointer shadow-inner"
              >
                <option value="recommended" className="bg-graphite">SORT: RECOMMENDED</option>
                <option value="priceAsc" className="bg-graphite">PRICE: LOW TO HIGH</option>
                <option value="priceDesc" className="bg-graphite">PRICE: HIGH TO LOW</option>
                <option value="nameAsc" className="bg-graphite">NAME: A–Z</option>
                <option value="nameDesc" className="bg-graphite">NAME: Z–A</option>
              </select>
            </div>
          </div>

          {/* Horizontally Scrollable Filter Track with Chevron Scroll Controls */}
          <div className="relative group/track flex items-center">
            
            {/* Left Scroll Indicator Button */}
            <button
              onClick={() => filterTrackRef.current?.scrollBy({ left: -260, behavior: 'smooth' })}
              aria-label="Scroll filters left"
              className="absolute left-0 z-20 w-8 h-8 rounded-full bg-asphalt/90 border border-white/20 text-silver hover:text-neon-accent hover:border-neon-accent flex items-center justify-center shadow-lg transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Track Container */}
            <div 
              ref={filterTrackRef}
              className="flex flex-nowrap items-center gap-3 overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-none py-1 px-9 w-full"
            >
              {/* 1. All Vehicles Pill */}
              <button
                onClick={resetFilters}
                className={`shrink-0 px-4 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  !hasActiveFilters
                    ? 'bg-neon-accent text-asphalt border-neon-accent font-extrabold shadow-md shadow-neon-accent/20'
                    : 'text-silver border-white/10 bg-asphalt/50 hover:bg-white/10'
                }`}
              >
                <span>ALL MACHINES</span>
              </button>

              {/* 2. City Filter Dropdown Pill */}
              <div className="shrink-0 relative">
                <select
                  value={selectedLocation}
                  aria-label="Filter by location"
                  onChange={(e) => { setSelectedLocation(e.target.value); setCurrentPage(1); }}
                  className={`appearance-none pr-8 pl-4 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider cursor-pointer focus:outline-none transition-all ${
                    selectedLocation !== ''
                      ? 'bg-neon-accent text-asphalt border-neon-accent font-extrabold shadow-md shadow-neon-accent/20'
                      : 'text-silver border-white/10 bg-asphalt/50 hover:bg-white/10'
                  }`}
                >
                  <option value="" className="bg-graphite text-chalk">CITY: ALL LOCATIONS</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc} className="bg-graphite text-chalk">CITY: {loc.toUpperCase()}</option>
                  ))}
                </select>
                <MapPin className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" />
              </div>

              {/* 3. Transmission Filter Pills */}
              <div className="shrink-0 flex items-center bg-asphalt/50 border border-white/10 rounded-xl p-1 gap-1">
                <span className="text-[9px] font-bold text-silver/60 uppercase tracking-widest px-2 flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-neon-accent" /> GEAR:
                </span>
                {['All', 'Automatic', 'Manual'].map(trans => {
                  const isSelected = (trans === 'All' && !selectedTransmission) || selectedTransmission === trans;
                  return (
                    <button
                      key={trans}
                      onClick={() => {
                        setSelectedTransmission(trans === 'All' ? '' : (selectedTransmission === trans ? '' : trans));
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-neon-accent text-asphalt font-extrabold shadow-sm'
                          : 'text-silver hover:text-chalk hover:bg-white/5'
                      }`}
                    >
                      {trans}
                    </button>
                  );
                })}
              </div>

              {/* 4. Category Filters Pills */}
              {['City', 'Sedan', 'SUV', 'Luxury', 'Performance', 'Electric', 'Adventure', 'MPV'].map(cat => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`shrink-0 px-4 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected 
                        ? 'bg-neon-accent text-asphalt border-neon-accent font-extrabold shadow-md shadow-neon-accent/20' 
                        : 'text-silver border-white/10 bg-asphalt/50 hover:bg-white/10'
                    }`}
                  >
                    <Car className="w-3 h-3 opacity-70" />
                    <span>{cat}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-asphalt ml-1" />}
                  </button>
                );
              })}

              {/* 5. Fuel Type Filter Selector */}
              <div className="shrink-0 relative">
                <select
                  value={selectedFuel}
                  aria-label="Filter by fuel type"
                  onChange={(e) => { setSelectedFuel(e.target.value); setCurrentPage(1); }}
                  className={`appearance-none pr-8 pl-4 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider cursor-pointer focus:outline-none transition-all ${
                    selectedFuel !== ''
                      ? 'bg-neon-accent text-asphalt border-neon-accent font-extrabold shadow-md shadow-neon-accent/20'
                      : 'text-silver border-white/10 bg-asphalt/50 hover:bg-white/10'
                  }`}
                >
                  <option value="" className="bg-graphite text-chalk">FUEL: ALL TYPES</option>
                  {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map(f => (
                    <option key={f} value={f} className="bg-graphite text-chalk">FUEL: {f.toUpperCase()}</option>
                  ))}
                </select>
                <Fuel className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" />
              </div>

              {/* 6. Max Price Slider Pill */}
              <div className="shrink-0 flex items-center gap-2 bg-asphalt/50 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold text-silver">
                <span className="uppercase tracking-widest text-[9px] text-silver/60">MAX RATE:</span>
                <span className="text-neon-accent font-extrabold">₹{maxPrice.toLocaleString()}</span>
                <input
                  type="range"
                  min="2000"
                  max="15000"
                  step="500"
                  value={maxPrice}
                  aria-label="Filter by max price"
                  onChange={(e) => { setMaxPrice(Number(e.target.value)); setCurrentPage(1); }}
                  className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-neon-accent"
                />
              </div>

            </div>

            {/* Right Scroll Indicator Button */}
            <button
              onClick={() => filterTrackRef.current?.scrollBy({ left: 260, behavior: 'smooth' })}
              aria-label="Scroll filters right"
              className="absolute right-0 z-20 w-8 h-8 rounded-full bg-asphalt/90 border border-white/20 text-silver hover:text-neon-accent hover:border-neon-accent flex items-center justify-center shadow-lg transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* LARGE VEHICLE SHOWCASE CONTAINER (FULL WIDTH 100%) */}
        <main className="w-full space-y-10">
          
          {apiError ? (
            <div className="border border-white/10 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 bg-graphite/40 backdrop-blur-md">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-chalk">SYNCHRONIZATION ERROR</h3>
              <p className="text-xs text-silver/60">Failed to fetch fleet catalog. Please check server connection.</p>
              <Button onClick={() => setCurrentPage(1)} className="mx-auto mt-2">
                Retry Connection
              </Button>
            </div>
          ) : loading ? (
            /* Skeleton Loader State (9 Large Full-Width Blocks) */
            <div className="space-y-10">
              {Array.from({ length: 9 }).map((_, idx) => (
                <div 
                  key={idx} 
                  className="w-full h-[380px] bg-white/5 border border-white/10 rounded-3xl animate-pulse"
                />
              ))}
            </div>
          ) : cars.length === 0 ? (
            /* Professional Empty State */
            <div className="text-center py-20 px-6 bg-graphite/40 border border-white/10 rounded-3xl space-y-5 backdrop-blur-md">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                <Car className="w-8 h-8 text-silver/40" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-display text-chalk uppercase tracking-widest">NO MATCHING VEHICLES FOUND</h3>
                <p className="text-silver/60 text-xs font-sans leading-relaxed">
                  We couldn't find any vehicle matching your selected search or filter criteria. Try clearing filters or searching for another model.
                </p>
              </div>
              {hasActiveFilters && (
                <Button onClick={resetFilters} className="mx-auto mt-2">
                  Reset All Filters
                </Button>
              )}
            </div>
          ) : (
            /* ALL 9 VEHICLES DISPLAYED WITH 100% UNIFORM LARGE SHOWCASE TEMPLATE */
            <div className="space-y-10">
              {cars.map((car, idx) => {
                const globalIdx = (currentPage - 1) * 9 + idx + 1;
                return (
                  <LargeVehicleShowcase 
                    key={car._id} 
                    car={car} 
                    index={globalIdx} 
                    totalCars={totalCars} 
                    selectedLocation={selectedLocation}
                  />
                );
              })}
            </div>
          )}

          {/* Pagination Component (Strict 9 Cars Per Page) */}
          {!loading && !apiError && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-10 border-t border-white/10">
              <span className="text-xs font-bold text-silver/60 uppercase tracking-widest">
                SHOWING PAGE {currentPage} OF {totalPages} ({totalCars} TOTAL MACHINES SHOWCASED)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={currentPage === 1}
                  className="px-4 py-2.5 border border-white/15 bg-graphite/60 rounded-xl text-xs font-bold uppercase tracking-wider text-chalk hover:border-neon-accent hover:text-neon-accent transition-colors disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-chalk cursor-pointer"
                >
                  PREV
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-9 h-9 border rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                      currentPage === page
                        ? 'bg-neon-accent text-asphalt border-neon-accent font-extrabold shadow-lg shadow-neon-accent/20 scale-105'
                        : 'bg-graphite/60 text-silver border-white/15 hover:border-white/40'
                    }`}
                  >
                    {page < 10 ? `0${page}` : page}
                  </button>
                ))}

                <button
                  onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2.5 border border-white/15 bg-graphite/60 rounded-xl text-xs font-bold uppercase tracking-wider text-chalk hover:border-neon-accent hover:text-neon-accent transition-colors disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-chalk cursor-pointer"
                >
                  NEXT
                </button>
              </div>
            </div>
          )}

        </main>

      </div>

    </div>
  );
};

export default BrowseCars;
