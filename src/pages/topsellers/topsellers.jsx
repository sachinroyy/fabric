import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Topsellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart = { items: [] }, refreshCart } = useCart() || {};
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fabricadmin.onrender.com/api/topsellers');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.topSellers || []);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Make sure cart is loaded so quantity controls can appear
  useEffect(() => {
    if (user && refreshCart) {
      refreshCart();
    }
  }, [user, refreshCart]);

  const addToCart = async (product) => {
    try {
      if (!user) {
        navigate('/signin');
        return;
      }
      setAddingId(product._id);
      await api.post('/cart/add', {
        productId: product._id,
        quantity: 1,
        selectedSize: product.selectedSize || '',
        selectedColor: product.selectedColor || ''
      });
      if (refreshCart) await refreshCart();
    } catch (err) {
      console.error('Add to cart error:', err);
      alert(err?.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingId(null);
    }
  };

  // Determine how many of this product are currently in the cart
  const getCartQty = (id) => {
    try {
      const idStr = String(id);
      return (cart.items || [])
        .filter(i => {
          const prod = i.product;
          if (!prod) return false;
          const pid = typeof prod === 'object' ? prod._id : prod;
          return String(pid) === idStr;
        })
        .reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
    } catch {
      return 0;
    }
  };

  const incrementInCart = async (product) => {
    try {
      setAddingId(product._id);
      await api.post('/cart/add', {
        productId: product._id,
        quantity: 1,
        selectedSize: product.selectedSize || '',
        selectedColor: product.selectedColor || ''
      });
      if (refreshCart) await refreshCart();
    } catch (err) {
      console.error('Increment cart error:', err);
      alert(err?.response?.data?.message || 'Failed to update cart');
    } finally {
      setAddingId(null);
    }
  };

  const decrementInCart = async (product) => {
    try {
      setAddingId(product._id);
      await api.post('/cart/decrement', {
        productId: product._id,
        selectedSize: product.selectedSize || '',
        selectedColor: product.selectedColor || ''
      });
      if (refreshCart) await refreshCart();
    } catch (err) {
      console.error('Decrement cart error:', err);
      alert(err?.response?.data?.message || 'Failed to update cart');
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-lg">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-black">TOP SELLERS</h1>
      {/* 2 cards per row on mobile, scale up on larger screens */}
      <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products && products.map((product) => (
          <div 
            key={product._id} 
            onClick={() => navigate(`/topsellers/${product._id}`)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-90 sm:h-48 md:h-56 lg:h-64 object-cover p-5"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300';
                }}
              />
              <div className="absolute inset-0  flex items-center justify-center opacity-0 hover:opacity-100">
                <span className="bg-white text-black px-4 py-2 rounded-full font-medium">View Details</span>
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-black">{product.name}</h2>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-black">₹{product.price?.toLocaleString()}</span>
                {getCartQty(product._id) > 0 ? (
                  <div className="flex items-center justify-center gap-2 text-black ">
                    <button
                      onClick={(e) => { e.stopPropagation(); decrementInCart(product); }}
                      className="px-3 py-1 rounded disabled:opacity-50 bg-black text-white"
                      disabled={addingId === product._id}
                      aria-label={`Decrease quantity for  ${product.name}`}
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center ">{getCartQty(product._id)}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); incrementInCart(product); }}
                      className="px-3 py-1 rounded disabled:opacity-50 bg-black text-white"
                      disabled={addingId === product._id}
                      aria-label={`Increase quantity for ${product.name}`}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm disabled:opacity-60"
                    disabled={addingId === product._id}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    {addingId === product._id ? 'Adding...' : 'Add to Cart'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div> 
    </div>
  );
};

export default Topsellers;