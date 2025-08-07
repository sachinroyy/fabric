import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    console.log('Adding to cart:', product);
    alert(`${product.name} added to cart!`);
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
      <div className="text-center p-8 text-red-600">
        <p className="text-xl font-semibold">{error}</p>
        <p className="mt-2">Please check your connection and try again.</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center p-8">
        <p className="text-xl">No products available</p>
        <p className="text-gray-600 mt-2">Check back later for new arrivals!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">NEW ARRIVALS</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {/* Product Image */}
            <div className="h-68 bg-gray-200 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${product.id}`);
                }}
              />
            </div>
            
            {/* Product Info */}
            <div 
              className="p-4"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product.id}`);
              }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-1 hover:text-gray-600">{product.name}</h2>
              <p className="text-gray-600 font-medium text-lg mb-3">${product.price}</p>
              
             
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;