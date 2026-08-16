import React, { useEffect, useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { getCars } from '../services/api';
import CarCard from '../components/CarCard';
import EmptyState from '../components/common/EmptyState';
import { Heart, Sparkles, Car } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { favoriteIds, favoriteCars, loading: favLoading } = useFavorites();
  const { user } = useAuth();
  
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteVehicles = async () => {
      setLoading(true);
      if (favoriteIds.length === 0) {
        setVehicles([]);
        setLoading(false);
        return;
      }

      // If favoriteCars already populated from API
      if (favoriteCars && favoriteCars.length === favoriteIds.length) {
        setVehicles(favoriteCars);
        setLoading(false);
        return;
      }

      try {
        const { data } = await getCars({ limit: 100 });
        if (data.success) {
          const matched = data.cars.filter(car => favoriteIds.includes(car._id?.toString()));
          setVehicles(matched);
        }
      } catch (err) {
        console.error('Error fetching favorite vehicles details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteVehicles();
  }, [favoriteIds, favoriteCars]);

  if (loading || favLoading) {
    return (
      <div className="min-h-[80vh] bg-asphalt flex flex-col items-center justify-center gap-4 text-chalk pt-20">
        <div className="w-8 h-8 border-2 border-stone border-t-neon-accent rounded-full animate-spin" />
        <span className="text-[10px] font-bold text-silver uppercase tracking-widest">LOADING SAVED FAVORITES...</span>
      </div>
    );
  }

  return (
    <div className="bg-asphalt min-h-screen pt-24 pb-24 text-chalk animate-page-enter">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-6 space-y-10">
        
        {/* Page Header */}
        <div className="space-y-3 border-b border-white/10 pb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span className="text-[10px] font-bold text-silver uppercase tracking-widest">PERSONAL WISHLIST</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display uppercase tracking-widest text-chalk">
              SAVED FAVORITES
            </h1>
            <p className="text-xs sm:text-sm text-silver/70 tracking-wide font-sans max-w-xl">
              Your curated collection of saved performance, luxury, and everyday machines ready for immediate rental.
            </p>
          </div>

          <div className="px-4 py-2 bg-graphite border border-white/10 rounded-2xl text-xs font-bold text-silver uppercase tracking-wider">
            <span className="text-neon-accent font-extrabold">{vehicles.length}</span> {vehicles.length === 1 ? 'VEHICLE SAVED' : 'VEHICLES SAVED'}
          </div>
        </div>

        {/* Saved Vehicles Grid or Empty State */}
        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map(car => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <div className="bg-graphite/40 border border-white/10 rounded-3xl p-12 text-center space-y-6 max-w-2xl mx-auto shadow-2xl">
            <div className="w-16 h-16 bg-asphalt border border-white/15 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
              <Heart className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-display uppercase tracking-widest text-chalk">NO FAVORITES SAVED YET</h2>
              <p className="text-xs text-silver/70 font-sans max-w-md mx-auto leading-relaxed">
                Save vehicles you love by clicking the <strong className="text-rose-400 font-sans">❤️ heart icon</strong> on any vehicle card in our fleet gallery or car details page.
              </p>
            </div>
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-neon-accent text-asphalt font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-chalk transition-all shadow-lg shadow-neon-accent/20"
            >
              <Car className="w-4 h-4" />
              <span>EXPLORE FLEET GALLERY →</span>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default Favorites;
