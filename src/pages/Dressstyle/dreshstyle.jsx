import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dressstyle = () => {
  const [dressStyles, setDressStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDressStyles = async () => {
      try {
        const response = await axios.get('https://fabricadmin.onrender.com/api/dressstyles');
        // const response = await axios.get('http://localhost:8000/api/dressstyles');
        setDressStyles(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching dress styles:', err);
        setError('Failed to load dress styles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDressStyles();
  }, []);

  const handleStyleSelect = (style) => {
    navigate(`/dressstyle/${style._id}`, { state: { style } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-lg">Loading dress styles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p className="text-xl font-semibold">Error loading styles</p>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  if (!dressStyles || dressStyles.length === 0) {
    return (
      <div className="text-center p-12">
        <h1 className="text-3xl font-bold mb-4 text-black">DRESS STYLES</h1>
        <p className="text-gray-600">No dress styles available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12 text-black">DRESS STYLES</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {dressStyles.map((style, index) => (
          <div 
            key={style._id || index} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => handleStyleSelect(style)}
          >
            <div className="h-64 bg-gray-100 overflow-hidden">
              <img 
                src={style.image} 
                alt={style.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/placeholder-style.jpg';
                }}
              />
            </div>
            
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-1 text-center">
                {style.name}
              </h2>
              {/* <p className="text-center text-black font-bold mt-1">
                ₹{Number(style.price || 0).toLocaleString()}
              </p> */}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dressstyle;