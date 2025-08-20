import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actingId, setActingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!user) {
          navigate('/signin');
          return;
        }
        const { data } = await api.get('/cart');
        setCart(data.cart || { items: [] });
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, navigate]);

  const reloadCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCart(data.cart || { items: [] });
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load cart');
    }
  };

  const increment = async (item) => {
    try {
      setActingId(item._id);
      await api.post('/cart/add', {
        productId: item?.product?._id || item?.product,
        quantity: 1,
        selectedSize: item.selectedSize || '',
        selectedColor: item.selectedColor || '',
      });
      await reloadCart();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to update cart');
    } finally {
      setActingId(null);
    }
  };

  const decrement = async (item) => {
    try {
      setActingId(item._id);
      await api.post('/cart/decrement', {
        productId: item?.product?._id || item?.product,
        selectedSize: item.selectedSize || '',
        selectedColor: item.selectedColor || '',
      });
      await reloadCart();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to update cart');
    } finally {
      setActingId(null);
    }
  };

  const subtotal = (cart.items || []).reduce((sum, i) => sum + (Number(i.priceSnapshot || 0)) * (Number(i.quantity || 1)), 0);

  if (loading) {
    return (
      <div className="pt-24 flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 max-w-3xl mx-auto p-4 text-red-600">{error}</div>
    );
  }

  return (
    <div className="pt-24 max-w-5xl mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-6 text-white">Your Cart</h1>
      {(!cart.items || cart.items.length === 0) ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-black text-white rounded-md">Continue Shopping</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow p-4 flex gap-4">
                <img
                  src={item.imageSnapshot || item?.product?.image || 'https://via.placeholder.com/120x120?text=No+Image'}
                  alt={item.nameSnapshot || item?.product?.name || 'Product'}
                  className="w-24 h-24 object-cover rounded"
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/120x120?text=No+Image'; }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.nameSnapshot || item?.product?.name}</h3>
                  <p className="text-sm text-gray-600">{item.selectedColor && `Color: ${item.selectedColor}`} {item.selectedSize && `Size: ${item.selectedSize}`}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrement(item)}
                        className="px-3 py-1 border rounded disabled:opacity-50 text-white"
                        disabled={actingId === item._id}
                        aria-label={`Decrease quantity for ${item?.nameSnapshot || item?.product?.name}`}
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => increment(item)}
                        className="px-3 py-1 border rounded disabled:opacity-50 text-white"
                        disabled={actingId === item._id}
                        aria-label={`Increase quantity for ${item?.nameSnapshot || item?.product?.name}`}
                      >
                        +
                      </button>
                    </div>
                    <span className="font-medium">${Number(item.priceSnapshot || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow p-4 h-fit">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-3">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button className="mt-4 w-full bg-black text-white py-2 rounded-md">Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
