import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('harish_portfolio_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('harish_portfolio_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const res = await api.auth.getMe();
          setUser(res.user);
          localStorage.setItem('harish_portfolio_user', JSON.stringify(res.user));
        } catch (err) {
          console.error("Token invalid or expired", err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, [token]);

  const login = async (username, password) => {
    const data = await api.auth.login(username, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('harish_portfolio_token', data.token);
    localStorage.setItem('harish_portfolio_user', JSON.stringify(data.user));
    return data;
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      // ignore
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('harish_portfolio_token');
    localStorage.removeItem('harish_portfolio_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
