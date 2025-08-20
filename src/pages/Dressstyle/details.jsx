import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const DressStyleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [style, setStyle] = useState(location.state?.style || null);
  const [loading, setLoading] = useState(!location.state?.style);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useAuth();
  const { cart = { items: [] }, refreshCart } = useCart() || {};
  const [acting, setActing] = useState(false);

  useEffect(() => {
    const fetchDressStyle = async () => {
      if (location.state?.style) return; // Skip if we already have the data
      
      try {
        setLoading(true);
        const response = await axios.get(`https://fabricadmin.onrender.com/api/dressstyles/${id}`);
        setStyle(response.data);
      } catch (err) {
        console.error('Error fetching dress style details:', err);
        setError('Failed to load dress style details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (!style) {
      fetchDressStyle();
    }
  }, [id, location.state, style]);

  // Initialize selected image when style data is ready
  useEffect(() => {
    if (style) {
      const imgs = Array.isArray(style.images) && style.images.length ? style.images : (style.image ? [style.image] : []);
      setSelectedImage(imgs[0] || null);
    }
  }, [style]);

  // ensure cart is loaded so quantity controls reflect current state
  useEffect(() => {
    if (user && refreshCart) refreshCart();
  }, [user, refreshCart]);

  // helpers to read cart qty for this style id
  const getCartQty = () => {
    try {
      const idStr = String(id);
      return (cart.items || [])
        .filter(i => {
          const prod = i.product;
          const pid = typeof prod === 'object' ? prod?._id : prod;
          return String(pid) === idStr;
        })
        .reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
    } catch {
      return 0;
    }
  };

  const addToCart = async () => {
    try {
      if (!user) return navigate('/signin');
      setActing(true);
      await api.post('/cart/add', {
        productId: id,
        quantity: 1,
        selectedSize: '',
        selectedColor: ''
      });
      if (refreshCart) await refreshCart();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to add to cart');
    } finally {
      setActing(false);
    }
  };

  const incrementInCart = async () => {
    try {
      setActing(true);
      await api.post('/cart/add', {
        productId: id,
        quantity: 1,
        selectedSize: '',
        selectedColor: ''
      });
      if (refreshCart) await refreshCart();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to update cart');
    } finally {
      setActing(false);
    }
  };

  const decrementInCart = async () => {
    try {
      setActing(true);
      await api.post('/cart/decrement', {
        productId: id,
        selectedSize: '',
        selectedColor: ''
      });
      if (refreshCart) await refreshCart();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to update cart');
    } finally {
      setActing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-lg">Loading dress style details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!style) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-lg mb-4">Dress style not found</p>
        <button 
          onClick={() => navigate('/dressstyle')} 
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Back to Styles
        </button>
      </div>
    );
  }

  // Compute images and price/discount
  const images = (Array.isArray(style?.images) && style.images.length) ? style.images : (style?.image ? [style.image] : []);
  const hasOriginal = Number(style?.originalPrice) > 0;
  const hasPrice = style?.price !== undefined && style?.price !== null;
  const discountPct = hasOriginal && hasPrice
    ? Math.round(((Number(style.originalPrice) - Number(style.price || 0)) / Number(style.originalPrice)) * 100)
    : null;

  return (
    <div className="w-full px-4 md:px-8 py-8 pt-24 text-black">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-gray-600 hover:text-black transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Styles
      </button>

      <div className="w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Gallery */}
          <div className="md:w-1/2 p-6 bg-gray-50 flex">
            {/* Thumbnails */}
            <div className="w-20 mr-4 hidden sm:flex flex-col space-y-3 overflow-auto">
              {(images.length ? images : [selectedImage]).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border ${
                    selectedImage === img ? 'border-black' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`thumbnail-${idx}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/150x150?text=No+Image';
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={selectedImage || style?.image || 'https://via.placeholder.com/500x500?text=No+Image+Available'}
                alt={style?.name || 'Style Image'}
                className="max-h-96 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/500x500?text=Image+Not+Available';
                }}
              />
            </div>
          </div>

          {/* Info Panel */}
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 uppercase tracking-tight">
              {style?.name || 'DRESS STYLE'}
            </h1>

            {/* Price Row */}
            <div className="flex items-center mb-6">
              {hasPrice && (
                <span className="text-2xl font-bold text-gray-900 mr-3">
                  ₹{Number(style.price).toLocaleString()}
                </span>
              )}
              {hasOriginal && (
                <>
                  <span className="text-lg text-gray-500 line-through mr-3">
                    ₹{Number(style.originalPrice).toLocaleString()}
                  </span>
                  {discountPct > 0 && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">-{discountPct}%</span>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            {style?.description && (
              <div className="mb-6">
                <p className="text-gray-700">{style.description}</p>
              </div>
            )}

            {/* Colors */}
            {Array.isArray(style?.colors) && style.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Select Colors</h3>
                <div className="flex space-x-3">
                  {style.colors.map((color) => (
                    <span
                      key={color}
                      className="w-8 h-8 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {Array.isArray(style?.sizes) && style.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Choose Size</h3>
                <div className="flex flex-wrap gap-2">
                  {style.sizes.map((size) => (
                    <span key={size} className="px-4 py-2 border rounded-md border-gray-300 text-gray-700">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity / Add to Cart */}
            <div className="mb-6">
              <div className="flex items-center gap-4">
                {getCartQty() > 0 ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={decrementInCart}
                      className="px-3 py-1 rounded bg-black text-white disabled:opacity-50"
                      disabled={acting}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center">{getCartQty()}</span>
                    <button
                      onClick={incrementInCart}
                      className="px-3 py-1 rounded bg-black text-white disabled:opacity-50"
                      disabled={acting}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={addToCart}
                    className="flex-1 bg-black text-white py-3 px-6 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-60"
                    disabled={acting}
                    aria-label="Add to cart"
                  >
                    {acting ? 'Adding...' : 'Add to Cart'}
                  </button>
                )}
              </div>
            </div>

            {/* Meta Info */}
            <div className="mt-6 border-t border-gray-200 pt-4 text-sm text-gray-600 space-y-2">
              {style?.category && <p>Category: <span className="font-medium text-gray-800">{style.category}</span></p>}
              {style?.material && <p>Material: <span className="font-medium text-gray-800">{style.material}</span></p>}
              {style?.occasion && <p>Occasion: <span className="font-medium text-gray-800">{style.occasion}</span></p>}
              {style?.createdAt && <p>Added on: <span className="font-medium text-gray-800">{new Date(style.createdAt).toLocaleDateString()}</span></p>}
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate('/contact', { state: { interestedIn: style?.name } })}
              className="mt-6 w-full bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition-colors font-medium uppercase"
            >
              Pre Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DressStyleDetails;