// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';
import storage from '../utils/storage';

/**
 * Hook that synchronizes a state value with localStorage.
 * @param {string} key - Storage key.
 * @param {*} defaultValue - Value used when no stored value exists.
 * @returns {[any, function]} current value and setter function.
 */
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => storage.get(key, defaultValue));

  useEffect(() => {
    storage.set(key, value);
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
