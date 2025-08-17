import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Topsellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const addToCart = (product) => {
    console.log('Adding to cart:', product);
    // Here you can implement your cart logic
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
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-black">TOP SELLERS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                className="w-full h-64 object-cover"
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors  text-black"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div> 
    </div>
  );
};

export default Topsellers;