import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password
      });
      
      const userData = response.data.user;
      setUser(userData);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'dummy-token'); // In real app, use JWT
      
      return { success: true, data: userData };
    } catch (error) {
      return { success: false, error: error.response?.data || 'Login failed' };
    }
  };

  const register = async (userData) => {
  console.log('🔍 register function called with:', userData);
  
  try {
    console.log('📤 Making API call to backend...');
    
    const response = await axios.post('http://localhost:8080/api/auth/register', userData);
    
    console.log('✅ Backend response:', response.data);
    return { success: true, data: response.data };
    
  } catch (error) {
    console.error('❌ Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      code: error.code,
      stack: error.stack
    });
    return { success: false, error: error.response?.data || 'Registration failed' };
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};