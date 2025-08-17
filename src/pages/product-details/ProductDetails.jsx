import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarIcon, HeartIcon, CheckIcon } from '@heroicons/react/24/solid';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://fabricadmin.onrender.com/api/products/${id}`);
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
        setSelectedImage(
          result.data.product?.images?.[0] ||
            result.data.product?.image ||
            'https://via.placeholder.com/500x500?text=No+Image+Available'
        );
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

  // Compute images array and discount for display
  const images = product?.images?.length
    ? product.images
    : product?.image
    ? [product.image]
    : [];
  const hasOriginal = Number(product?.originalPrice) > 0;
  const discountPct = hasOriginal
    ? Math.round(((Number(product.originalPrice) - Number(product.price || 0)) / Number(product.originalPrice)) * 100)
    : null;

  return (
    <div className="w-full px-4 md:px-8 py-8 pt-24">
      {product ? (
        <div className="w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Product Gallery */}
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
                  src={selectedImage || product.image || 'https://via.placeholder.com/500x500?text=No+Image+Available'}
                  alt={product.name || 'Product Image'}
                  className="max-h-96 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/500x500?text=Image+Not+Available';
                  }}
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2 uppercase tracking-tight">
                {product.name || 'Product Name'}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center mb-3">
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
                  {(product.rating || 0).toFixed ? (product.rating || 0).toFixed(1) : product.rating || 0}/5
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price || '0.00'}
                </span>
                {hasOriginal && (
                  <>
                    <span className="ml-3 text-lg text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                    {discountPct > 0 && (
                      <span className="ml-3 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">-{discountPct}%</span>
                    )}
                  </>
                )}
              </div>

          {/* Reviews Count */}
          <div className="flex items-center mb-6 text-sm text-gray-600">
            <span>{product.reviewCount || 0} reviews</span>
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
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-8 h-8 rounded-full border-2 transition ring-offset-2 ${
                      selectedColor === color ? 'ring-2 ring-black border-black' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={color}
                  >
                    {selectedColor === color && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <CheckIcon className="w-4 h-4 text-white" />
                      </span>
                    )}
                  </button>
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
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2  text-black">
              Quantity
            </label>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100 hover:bg-gray-200 text-black"
              >
                -
              </button>
              <span className="px-4 py-1 border-t border-b border-gray-300 text-center w-12 text-black">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200 text-black"
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a 2 2 0 11-4 0 2 2 0 014 0z"
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

