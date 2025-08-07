import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const result = await response.json();
        console.log('API Response:', result); // Log the full response
        console.log('Product ID:', result.data.product.id);
        console.log('Product Name:', result.data.product.name);
       
        setProduct(result.data.product);
        // Set default color and size if available in the product data
        setSelectedColor(result.data.product.colors?.[0] || '');
        setSelectedSize(result.data.product.sizes?.[0] || '');
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = () => {
    // Add to cart logic here
    console.log('Added to cart:', { ...product, selectedSize, selectedColor, quantity });
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p className="text-xl font-semibold">{error}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center p-8">
        <p className="text-xl">Product not found</p>
        <button 
          onClick={() => navigate('/')} 
          className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // Function to render object properties recursively
  const renderObject = (obj, level = 0) => {
    if (!obj || typeof obj !== 'object') {
      return <span className="text-blue-600">{String(obj)}</span>;
    }

    return (
      <div className={`pl-${level * 4} mt-1`}>
        {Object.entries(obj).map(([key, value]) => (
          <div key={key} className="mb-1">
            <span className="font-semibold text-gray-800">{key}:</span>
            {typeof value === 'object' ? (
              <div className="ml-4 border-l-2 border-gray-200 pl-2">
                {renderObject(value, level + 1)}
              </div>
            ) : (
              <span className="ml-2 text-gray-700">
                {typeof value === 'boolean' ? value.toString() : value || 'null'}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {product ? (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2 p-6 bg-gray-50 flex items-center justify-center">
              <img 
                src={product.image || 'https://via.placeholder.com/500x500?text=No+Image+Available'} 
                alt={product.name || 'Product Image'}
                className="max-h-96 w-auto object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/500x500?text=Image+Not+Available';
                }}
              />
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name || 'Product Name'}
              </h1>
              
              {/* Price */}
              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price || '0.00'}
                </span>
                {product.originalPrice && (
                  <span className="ml-3 text-lg text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

          {/* Rating */}
          <div className="flex items-center mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <StarIcon
                  key={rating}
                  className={`h-5 w-5 ${
                    rating <= (product.rating || 0)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {product.reviewCount || 0} reviews
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700">{product.description || 'No description available.'}</p>
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? 'border-black' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100 hover:bg-gray-200"
              >
                -
              </button>
              <span className="px-4 py-1 border-t border-b border-gray-300 text-center w-12">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={addToCart}
            className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Add to Cart
          </button>

          {/* Additional Info */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Product Details</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>Price: ${product.price || 'N/A'}</p>
              <p>Material: {product.material || 'Not specified'}</p>
              <p>Care Instructions: {product.careInstructions || 'Machine wash cold, tumble dry low'}</p>
              <p>SKU: {product.id || 'N/A'}</p>
              <p>Added: {new Date(product.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
        {/* Reviews would be mapped here */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
          </div>
              </div>
            </div>
        ) : (
          <div className="text-center p-12">
            <p className="text-xl text-gray-600">Loading product details...</p>
          </div>
        )}
      
      {/* Raw Product Data (Collapsible) */}
      {product && (
        <div className="mt-8 max-w-4xl mx-auto">
          <details className="bg-white rounded-lg shadow-md overflow-hidden">
            <summary className="px-6 py-4 bg-gray-50 cursor-pointer font-medium text-gray-700">
              View Raw Product Data
            </summary>
            <div className="p-6 border-t">
              <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
                <div className="font-mono text-sm">
                  {renderObject(product)}
                </div>
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
