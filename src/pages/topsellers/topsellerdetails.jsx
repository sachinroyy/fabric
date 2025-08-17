import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TopsellerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://fabricadmin.onrender.com/api/topsellers/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        
        const data = await response.json();
        // Support multiple possible response shapes
        const prod = data.product || data.topSeller || data.topseller || data.data || data;
        if (!prod) {
          throw new Error('Product not found in response');
        }
        setProduct(prod);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const addToCart = () => {
    console.log('Adding to cart:', product);
    // Here you can implement your cart logic
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-lg">Loading product details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg mb-4">Product not found</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center text-gray-600 hover:text-black transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden text-black">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="bg-gray-50">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x800';
                }}
              />
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Title & Price */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold leading-snug">{product.name}</h1>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-2xl md:text-3xl font-extrabold">₹{product.price?.toLocaleString()}</p>
                </div>
              </div>

              {/* Badges & Rating */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {product.category && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {product.category}
                  </span>
                )}
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  In stock
                </span>
                <span className="ml-auto text-sm text-yellow-600">★ ★ ★ ★ ☆</span>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mt-6">
                  <h2 className="text-base md:text-lg font-semibold mb-2">Description</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Details */}
              <div className="mt-6">
                <h2 className="text-base md:text-lg font-semibold mb-3">Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.material && (
                    <div className="flex">
                      <span className="text-gray-600 w-24 shrink-0">Material:</span>
                      <span className="font-medium">{product.material}</span>
                    </div>
                  )}
                  {product.color && (
                    <div className="flex items-center">
                      <span className="text-gray-600 w-24 shrink-0">Color:</span>
                      <span className="w-5 h-5 rounded-full border border-gray-300 mr-2" style={{ backgroundColor: product.color }}></span>
                      <span className="font-medium">{product.color}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={addToCart}
                  className="inline-flex justify-center items-center w-full sm:w-auto bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center items-center w-full sm:w-auto border border-gray-300 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => navigate('/topsellers')}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopsellerDetails;