import storage from '../../utils/storage';

/**
 * Storage Service wrapper for centralized LocalStorage access
 */
export const storageService = {
  getToken: () => storage.get('token'),
  setToken: (token) => storage.set('token', token),
  removeToken: () => storage.remove('token'),

  getUser: () => storage.get('user'),
  setUser: (user) => storage.set('user', user),
  removeUser: () => storage.remove('user'),

  getTheme: () => storage.get('theme', 'light'),
  setTheme: (theme) => storage.set('theme', theme),

  clearAll: () => {
    storage.remove('token');
    storage.remove('user');
  }
};

export default storageService;
