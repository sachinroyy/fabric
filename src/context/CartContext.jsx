import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchingRef = useRef(false);
  const lastFetchRef = useRef(0);

  const cartCount = useMemo(() => {
    return (cart.items || []).reduce((sum, i) => sum + (i.quantity || 0), 0);
  }, [cart]);

  const refreshCart = async (opts = {}) => {
    const { force = false } = opts || {};
    if (!user) {
      setCart({ items: [] });
      return;
    }
    // Collapse bursts and skip duplicate concurrent fetches
    const now = Date.now();
    if (!force && now - lastFetchRef.current < 800) {
      return; // cooldown window
    }
    if (fetchingRef.current) {
      return; // already in-flight
    }
    fetchingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/cart');
      setCart(data.cart || { items: [] });
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load cart');
    } finally {
      lastFetchRef.current = Date.now();
      fetchingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    // load when user changes
    refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const value = { cart, cartCount, loading, error, refreshCart, setCart };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
