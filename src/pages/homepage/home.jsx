import React from 'react';
import Product from '../product/product';
import AdsSlider from '../../components/adsslider';
import Topsellers from '../topsellers/topsellers';
import Dressstyle from '../Dressstyle/dreshstyle';
import ReviewSection from '../../components/review';
const Home = () => {


  return (
    <div className="bg-white">
      {/* Local styles for slow background pan */}
      <style>{`
        @keyframes slowPan {
          0% { transform: translateX(-1%); }
          50% { transform: translateX(1%); }
          100% { transform: translateX(-1%); }
        }
        .slow-pan { animation: slowPan 30s ease-in-out infinite; will-change: transform; }
      `}</style>
      {/* Hero Section */}
      <div className="relative bg-gray-900 h-[150vh] md:h-[100vh] lg:h-[100vh] xl:h-[100vh]  flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden ">
          <img 
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
            alt="Fashion Model"
            className="h-[380vh] w-[100%] max-w-none object-cover object-center slow-pan"
          />
          {/* Full-screen glassmorphism overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm md:backdrop-blur-md ring-1 ring-inset ring-white/10"></div>
        </div>
        {/* GIF overlay: top-right on md+, below content on mobile */}
        <img
          src="/images/animation.gif" 
          alt="Animated badge"
          className="hidden md:block absolute top-6 right-6 w-28 h-28 rounded-full z-10"
        />
        
        {/* Content */}
        <div className="container  mx-auto px-4 md:px-20 relative z-10 mt-20 md:mt-20 py-12 md:py-16 h-full flex flex-col items-center justify-center text-center ">
          <div className="max-w-3xl w-full mb-8 md:mb-10 bg-black/30 hover:bg-black/40 transition-colors duration-300 backdrop-blur-md border border-white/20 ring-1 ring-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10">
            <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-9xl font-extrabold text-white mb-4 md:mb-6 leading-tight md:leading-none">
              NEW SEASON
            </h1>
            <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-8xl font-bold text-white mb-6 md:mb-8 leading-tight">
              NEW COLLECTION    
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 md:mb-8 mx-auto max-w-xl">
              Check out the latest trends in fashion and upgrade your wardrobe with our new collection.
            </p>
            <button className="border border-white text-white hover:bg-white hover:text-black transition-all duration-200 font-medium px-8 py-4 md:px-8 md:py-3 rounded-full text-base sm:text-lg md:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/60">
              Shop Now
            </button>
          </div>
          {/* Mobile GIF below content */}
          {/* <div className="w-full flex md:hidden items-center justify-center  pl-150">
            <img src="/images/animation.gif" alt="Animated badge" className="w-200 h-200 rounded-full" />
          </div> */}
          
          
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-5 bg-gray-100">
      </div>
      
      <AdsSlider />
      <Product />

      <Topsellers />

      <Dressstyle />
      <ReviewSection />
    </div>
    
  );
};

export default Home;