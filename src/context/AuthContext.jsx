import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        // First check localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // If no stored user, try to fetch from server
          const { data } = await api.get('/auth/me');
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        }
      } catch (error) {
        console.error('Not authenticated', error);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (googleData) => {
    try {
      const { data } = await api.post('/auth/google', {
        credential: googleData.credential || googleData
      });
      const userData = data.user || data; // Handle different response formats
      setUser(userData);
      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  // Email/password login
  const loginWithEmail = async ({ email, password }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const userData = data.user || data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Email login failed', error?.response?.data || error);
      throw error;
    }
  };

  // Email/password register
  const register = async ({ name, email, password }) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      const userData = data.user || data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Register failed', error?.response?.data || error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed', error);
    } finally {
      // Clear user data regardless of API call result
      setUser(null);
      localStorage.removeItem('user');
      navigate('/signin');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithEmail, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
