import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { getUserFavorites, toggleUserFavorite, removeUserFavorite } from '../services/api';
import storage from '../utils/storage';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoriteCars, setFavoriteCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = user?._id || 'guest';

  // Fetch favorites from API if authenticated, else fallback to storage
  const syncFavorites = useCallback(async () => {
    setLoading(true);
    if (user && user._id) {
      try {
        const { data } = await getUserFavorites();
        if (data.success) {
          const ids = data.carIds || [];
          const cars = data.cars || [];
          setFavoriteIds(ids);
          setFavoriteCars(cars);
          storage.set(`${storage.KEYS.FAVORITES}_${user._id}`, ids);
        }
      } catch (err) {
        console.warn('Backend favorites sync fallback to storage:', err.message);
        const cachedIds = storage.getFavorites(user._id);
        setFavoriteIds(cachedIds);
      }
    } else {
      // Guest mode
      const cachedIds = storage.getFavorites('guest');
      setFavoriteIds(cachedIds);
      setFavoriteCars([]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    syncFavorites();
  }, [syncFavorites]);

  // Check if a vehicle ID is favorited
  const isFavorite = useCallback((carId) => {
    if (!carId) return false;
    return favoriteIds.includes(carId.toString());
  }, [favoriteIds]);

  // Toggle favorite with optimistic state update & error rollback
  const toggleFavorite = async (carId, carObject = null) => {
    if (!carId) return false;

    const currentlyFav = isFavorite(carId);
    const newFavState = !currentlyFav;

    // Optimistic UI state update
    const previousIds = [...favoriteIds];
    const previousCars = [...favoriteCars];

    const updatedIds = newFavState
      ? [...favoriteIds, carId.toString()]
      : favoriteIds.filter(id => id.toString() !== carId.toString());

    setFavoriteIds(updatedIds);
    if (!newFavState) {
      setFavoriteCars(prev => prev.filter(c => c._id?.toString() !== carId.toString()));
    } else if (carObject) {
      setFavoriteCars(prev => [...prev, carObject]);
    }

    // Persist to local storage namespace
    storage.toggleFavorite(carId, userId);

    if (user && user._id) {
      try {
        const { data } = await toggleUserFavorite(carId);
        if (data.success) {
          addToast(data.message || (newFavState ? 'Added to saved favorites' : 'Removed from saved favorites'), 'info');
        }
      } catch (err) {
        console.error('Failed to update favorite on server:', err);
        // Rollback state on failure
        setFavoriteIds(previousIds);
        setFavoriteCars(previousCars);
        storage.toggleFavorite(carId, userId); // Rollback local storage
        addToast('Failed to update favorite. Please try again.', 'error');
        return currentlyFav;
      }
    } else {
      addToast(newFavState ? 'Saved to favorites' : 'Removed from favorites', 'info');
    }

    return newFavState;
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        favoriteCars,
        isFavorite,
        toggleFavorite,
        syncFavorites,
        loading
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
