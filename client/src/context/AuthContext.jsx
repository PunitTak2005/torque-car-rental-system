import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProfile, loginUser, registerUser, getNotifications, markNotificationRead } from '../services/api';
import storage from '../utils/storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);

  // Load user profile if token exists on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = storage.get(storage.KEYS.TOKEN);
      if (token) {
        try {
          const { data } = await getProfile();
          if (data.success) {
            setUser(data.user || data);
            await fetchNotifications();
          } else {
            storage.clearAuthStorage();
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          storage.clearAuthStorage();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await getNotifications();
      if (data.success) {
        setNotifications(data.notifications || []);
        setNotificationsCount((data.notifications || []).filter(n => !n.read).length);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const login = async (userObj, tokenStr) => {
    if (tokenStr) {
      storage.set(storage.KEYS.TOKEN, tokenStr);
      setUser(userObj);
      await fetchNotifications();
      return { success: true, user: userObj };
    } else {
      const { data } = await loginUser(userObj);
      if (data.success) {
        const uData = data.user || data;
        storage.set(storage.KEYS.TOKEN, data.token);
        setUser(uData);
        await fetchNotifications();
      }
      return data;
    }
  };

  const register = async (userData) => {
    const { data } = await registerUser(userData);
    if (data.success) {
      const uData = data.user || data;
      storage.set(storage.KEYS.TOKEN, data.token);
      setUser(uData);
      await fetchNotifications();
    }
    return data;
  };

  const logout = () => {
    // Selectively remove authentication token without calling localStorage.clear()
    storage.clearAuthStorage();
    setUser(null);
    setNotifications([]);
    setNotificationsCount(0);
  };

  const updateUserInfo = (updatedData) => {
    setUser((prev) => ({
      ...prev,
      ...updatedData
    }));
  };

  const markRead = async (id) => {
    try {
      const { data } = await markNotificationRead(id);
      if (data.success) {
        setNotifications(prev => 
          prev.map(n => n._id === id ? { ...n, read: true } : n)
        );
        setNotificationsCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUserInfo,
        notifications,
        notificationsCount,
        fetchNotifications,
        markRead
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
