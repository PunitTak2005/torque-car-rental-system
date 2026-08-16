import React from 'react';
import { Link } from 'react-router-dom';
import { Gauge, Fuel, Users, MapPin, ArrowRight, Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

const CarCard = ({ car }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!car) return null;

  const {
    _id,
    brand,
    model,
    category,
    images,
    specifications,
    pricePerDay,
    availability,
    location
  } = car;

  const isFav = isFavorite(_id);

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80';
  };

  const isAvailable = availability === true;

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(_id, car);
  };

  return (
    <div className="bg-graphite/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between h-full group hover:border-neon-accent/40 hover:shadow-2xl hover:shadow-neon-accent/10 hover:-translate-y-1 transition-all duration-300 relative">
      <div className="p-5 space-y-4">
        
        {/* Header Badges & Favorite Toggle */}
        <div className="flex justify-between items-center text-[10px] font-bold text-silver/70 uppercase tracking-widest">
          <span className="px-2.5 py-0.5 rounded-full text-[9px] border font-bold flex items-center gap-1 bg-white/5 border-white/10 text-chalk">
            {category || 'Standard'}
          </span>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] border font-bold flex items-center gap-1 ${
              isAvailable 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              {isAvailable ? 'AVAILABLE' : 'RESERVED'}
            </span>

            {/* Favorite Button with Micro-Interaction */}
            <button
              onClick={handleToggleFavorite}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-1.5 rounded-full border transition-all cursor-pointer active:scale-125 duration-200 ${
                isFav
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-500'
                  : 'bg-white/5 border-white/10 text-silver hover:text-chalk'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 transition-transform duration-200 ${isFav ? 'fill-rose-500 scale-110' : ''}`} />
            </button>
          </div>
        </div>

        {/* Vehicle Image Container */}
        <div className="aspect-[16/10] w-full overflow-hidden bg-asphalt rounded-xl relative">
          <img
            src={images?.[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'}
            alt={`${brand} ${model}`}
            onError={handleImageError}
            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-500 ease-out"
            loading="lazy"
          />

          {location && (
            <div className="absolute bottom-3 left-3 bg-asphalt/85 backdrop-blur-md border border-white/15 px-2.5 py-0.5 rounded-md text-[8px] font-bold text-silver uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3 text-neon-accent" />
              <span>{Array.isArray(location) ? 'All Major Hubs' : location}</span>
            </div>
          )}
        </div>

        {/* Detail Body */}
        <div className="pt-1">
          <span className="text-[9px] font-bold text-silver/60 uppercase tracking-widest block">
            {brand}
          </span>
          <h3 className="font-display text-lg text-chalk uppercase tracking-wide group-hover:text-neon-accent transition-colors duration-200 line-clamp-1">
            {model}
          </h3>

          {/* Specifications Pills */}
          <div className="flex flex-wrap gap-2 mt-3 text-[9px] font-bold text-silver/80 uppercase tracking-wider">
            <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md flex items-center gap-1">
              <Gauge className="w-3 h-3 text-silver/50" /> {specifications?.transmission || 'Auto'}
            </span>
            <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md flex items-center gap-1">
              <Fuel className="w-3 h-3 text-silver/50" /> {specifications?.fuelType || 'Petrol'}
            </span>
            <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md flex items-center gap-1">
              <Users className="w-3 h-3 text-silver/50" /> {specifications?.seats || 5} Seats
            </span>
          </div>
        </div>

      </div>

      {/* Footer Pricing & CTA */}
      <div className="p-5 pt-4 border-t border-white/10 bg-asphalt/30 flex items-center justify-between">
        <div>
          <span className="text-[8px] text-silver/50 font-bold uppercase tracking-widest block">DAILY RATE</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-neon-accent font-sans">
              ₹{pricePerDay?.toLocaleString() || pricePerDay}
            </span>
            <span className="text-[9px] text-silver/60 font-bold uppercase tracking-wider">/ day</span>
          </div>
        </div>

        <Link to={`/cars/${_id}`}>
          <span className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-chalk text-asphalt hover:bg-neon-accent transition-colors duration-200 rounded-xl text-[10px] font-bold uppercase tracking-wider group/btn cursor-pointer shadow-md active:scale-95">
            <span>DETAILS</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
          </span>
        </Link>
      </div>

    </div>
  );
};

export default CarCard;
