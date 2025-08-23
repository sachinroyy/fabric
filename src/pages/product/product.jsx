import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Product = () => {
  const [products, setProducts] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [qtyById, setQtyById] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart = { items: [] }, refreshCart } = useCart() || {};

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fabricadmin.onrender.com/api/products');
        // const response = await fetch('http://localhost:8000/api/products');

        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data);
        // initialize quantity map to 1 for each product (for pre-add UX if needed)
        const map = {};
        (data.products || []).forEach(p => { if (p && p._id) map[p._id] = 1; });
        setQtyById(map);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getQty = (id) => Math.max(1, Number(qtyById?.[id] || 1));
  const getCartQty = (id) => {
    try {
      return (cart.items || [])
        .filter(i => (i.product && (i.product._id === id || i.product === id)))
        .reduce((sum, i) => sum + (i.quantity || 0), 0);
    } catch {
      return 0;
    }
  };

  const incQty = (e, id) => {
    e.stopPropagation();
    setQtyById((prev) => ({ ...prev, [id]: getQty(id) + 1 }));
  };

  const decQty = (e, id) => {
    e.stopPropagation();
    setQtyById((prev) => ({ ...prev, [id]: Math.max(1, getQty(id) - 1) }));
  };

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
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-black uppercase">New Arrival</h1>
      <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.products && products.products.map((product) => (
          <div 
            key={product._id} 
            onClick={() => navigate(`/product/${product._id}`)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-90 h-90 sm:h-56 md:h-64 object-cover p-5"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300';
                }}
              />
              <div className="absolute inset-0 hidden sm:flex items-center justify-center opacity-0 hover:opacity-100">
                <span className="bg-white text-black px-4 py-2 rounded-full font-medium">View Details</span>
              </div>
            </div>
            <div className="p-4 text-center">
              <h2 className="text-xl font-semibold mb-2 uppercase text-black">{product.name}</h2>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                <span className="text-lg font-bold text-black">₹{product.price?.toLocaleString()}</span>
                {getCartQty(product._id) > 0 ? (
                  <div className="flex items-center justify-center gap-2 text-black ">
                    <button
                      onClick={(e) => { e.stopPropagation(); decrementInCart(product); }}
                      className="px-3 py-1 border rounded disabled:opacity-50 text-white "
                      disabled={addingId === product._id}
                      aria-label={`Decrease quantity for  ${product.name}`}
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center ">{getCartQty(product._id)}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); incrementInCart(product); }}
                      className="px-3 py-1 border rounded disabled:opacity-50 text-white"
                      disabled={addingId === product._id}
                      aria-label={`Increase quantity for ${product.name}`}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                    className="bg-black text-white px-4 py-2.5 rounded hover:bg-gray-800 transition-colors w-full sm:w-auto text-sm sm:text-base disabled:opacity-60"
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

export default Product;