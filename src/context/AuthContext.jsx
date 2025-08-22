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
        const token = localStorage.getItem('auth_token');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else if (token) {
          // If token exists, fetch from server to restore session
          const { data } = await api.get('/auth/me');
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        } // If no stored user and no token, remain logged out
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
    // googleData is CredentialResponse from @react-oauth/google
    try {
      const credential = googleData?.credential || (typeof googleData === 'string' ? googleData : null);
      if (!credential) {
        const err = new Error('No Google credential received');
        err.code = 'NO_CREDENTIAL';
        throw err;
      }

      const { data } = await api.post('/auth/google', { credential });

      const userData = data?.user || data; // backend returns { user }
      if (!userData || (!userData.email && !userData.id)) {
        const err = new Error('Login response missing user data');
        err.code = 'BAD_RESPONSE';
        throw err;
      }

      // Save in state and storage
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      if (data.token) localStorage.setItem('auth_token', data.token);

      // Verify cookie-based session now works
      try {
        const me = await api.get('/auth/me');
        if (me?.data?.user) {
          setUser(me.data.user);
          localStorage.setItem('user', JSON.stringify(me.data.user));
        }
      } catch (meErr) {
        // Helpful log if cookies/CORS prevented session
        console.warn('Cookie session verification failed after Google login. Check CORS, SameSite=None, and frontend origin.', meErr?.response?.data || meErr);
      }

      return userData;
    } catch (error) {
      const serverMsg = error?.response?.data?.message || error.message || 'Login failed';
      console.error('Login failed:', serverMsg, error?.response?.data || error);
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
      if (data.token) localStorage.setItem('auth_token', data.token);
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
      if (data.token) localStorage.setItem('auth_token', data.token);
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
      localStorage.removeItem('auth_token');
      navigate('/');
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
