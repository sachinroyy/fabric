
import React from 'react';
import Product from '../product/product';
import AdsSlider from '../../components/adsslider';
import Topsellers from '../topsellers/topsellers';
import Dressstyle from '../Dressstyle/dreshstyle';
import ReviewSection from '../../components/review';
const Home = () => {


  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
            alt="Fashion Model"
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 md:px-20 relative z-10 py-16 h-full flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-3xl mb-12 md:mb-0">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-black mb-6 leading-none">
              NEW SEASON
            </h1>
            <h2 className="text-6xl md:text-5xl lg:text-7xl font-bold text-black mb-8 leading-tight">
              NEW COLLECTION    
            </h2>
            <p className="text-2xl text-black mb-8 max-w-md">
              Check out the latest trends in fashion and upgrade your wardrobe with our new collection.
            </p>
            <button className="bg-black hover:bg-gray-100 text-white font-medium px-8 py-3 rounded-none text-sm uppercase tracking-wider">
              Shop Now
            </button>
          </div>
          
          
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-5 bg-gray-100">
      </div>
      
      <AdsSlider />
      <Product />
      <Dressstyle />
      <Topsellers />
      <ReviewSection />
    </div>
    
  );
};

export default Home;