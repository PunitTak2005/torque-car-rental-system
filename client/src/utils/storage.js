// src/utils/storage.js
/**
 * Safe, centralized wrapper around window.localStorage with JSON handling,
 * error protection, and domain-specific key management.
 */

const KEYS = {
  TOKEN: 'token',
  THEME: 'torque_theme',
  LEGACY_THEME: 'theme',
  FAVORITES: 'torque_favorites',
  RECENTLY_VIEWED: 'torque_recently_viewed'
};

const safeParse = (raw, defaultValue = null) => {
  if (raw === null || raw === undefined) return defaultValue;
  try {
    return JSON.parse(raw);
  } catch (e) {
    // If it's a raw unquoted string (e.g., JWT token or theme string), return it directly
    return raw || defaultValue;
  }
};

const storage = {
  KEYS,

  /**
   * Retrieve a value from localStorage safely.
   */
  get(key, defaultValue = null) {
    try {
      const raw = window.localStorage.getItem(key);
      return safeParse(raw, defaultValue);
    } catch (e) {
      console.warn(`localStorage get failed for key "${key}":`, e);
      return defaultValue;
    }
  },

  /**
   * Store a value in localStorage safely.
   */
  set(key, value) {
    try {
      if (value === null || value === undefined) {
        window.localStorage.removeItem(key);
        return;
      }
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
    } catch (e) {
      console.error(`localStorage set failed for key "${key}":`, e);
    }
  },

  /**
   * Remove a single key from localStorage safely.
   */
  remove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`localStorage remove failed for key "${key}":`, e);
    }
  },

  /**
   * Safely clear ONLY authentication session keys on logout.
   * Does NOT call localStorage.clear(), preserving user theme & preferences.
   */
  clearAuthStorage() {
    this.remove(KEYS.TOKEN);
  },

  /**
   * Get user favorites array safely.
   */
  getFavorites(userId = 'guest') {
    const key = `${KEYS.FAVORITES}_${userId}`;
    const favs = this.get(key, []);
    return Array.isArray(favs) ? favs : [];
  },

  /**
   * Toggle a car ID in user favorites.
   */
  toggleFavorite(carId, userId = 'guest') {
    if (!carId) return [];
    const favs = this.getFavorites(userId);
    const updated = favs.includes(carId)
      ? favs.filter(id => id !== carId)
      : [...favs, carId];
    
    const key = `${KEYS.FAVORITES}_${userId}`;
    this.set(key, updated);
    return updated;
  },

  /**
   * Check if a car ID is favorited.
   */
  isFavorite(carId, userId = 'guest') {
    if (!carId) return false;
    const favs = this.getFavorites(userId);
    return favs.includes(carId);
  }
};

export default storage;
