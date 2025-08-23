import React, { useEffect, useState } from 'react';
import Product from '../product/product';
import AdsSlider from '../../components/adsslider';
import Topsellers from '../topsellers/topsellers';
import Dressstyle from '../Dressstyle/dreshstyle';
import ReviewSection from '../../components/review';
import ImageSlider from '../../components/slider';
const Home = () => {
  // Random images for right-side collage (use public/ paths in Vite)
  const collageImages = [
    '/images/homeslider01.png',
    '/images/homeslider02.png',
    '/images/homeslider03.png',
    '/images/homeslider04.png',
    '/images/homeslider05.png',
  ];
  const [order, setOrder] = useState([0, 1, 2, 3, 4]);

  useEffect(() => {
    const t = setInterval(() => {
      setOrder((prev) => {
        const next = [...prev];
        // rotate array: move first to end
        next.push(next.shift());
        return next;
      });
    }, 3000);
    return () => clearInterval(t);
  }, []);


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
      <div className="relative bg-gray-900 h-screen md:h-[100vh] lg:h-[100vh] xl:h-[100vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden ">
          <img 
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
            alt="Fashion Model"
            className="h-full w-full max-w-none object-cover object-center slow-pan"
          />
        </div>
        {/* Right-side collage (md+) */}
        <div className="hidden md:block absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 z-20 pt-10">
          <div className="relative h-[420px] w-[420px] lg:h-[440px] lg:w-[480px]">
            {order.map((idx, i) => {
              // Fan layout positions
              const layouts = [
                { x: 0, y: 30, r: -6, z: 2 },
                { x: 70, y: 0, r: -2, z: 3 },
                { x: 140, y: -20, r: 1, z: 4 },
                { x: 210, y: 10, r: 3, z: 3 },
                { x: 280, y: 40, r: 6, z: 2 },
              ];
              const L = layouts[i];
              return (
                <div
                  key={`${idx}-${i}`}
                  className="absolute rounded-xl shadow-xl ring-1 ring-white/30 overflow-hidden bg-white/20 backdrop-blur-sm "
                  style={{
                    left: `${L.x}px`,
                    top: `${L.y}px`,
                    transform: `rotate(${L.r}deg)`,
                    zIndex: L.z,
                    width: i === 2 ? '150px' : '140px',
                    height: i === 2 ? '320px' : '300px',
                  }}
                >
                  <img
                    src={collageImages[idx]}
                    alt={`look ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>
       
        
        {/* Content */}
        <div className="container mx-auto px-4 md:px-20 relative z-10 mt-20 md:mt-20 py-12 md:py-16 h-full flex flex-col items-start justify-center text-left ">
          <div className="max-w-3xl w-full mb-8 md:mb-10 text-black">
            <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-9xl font-extrabold text-black mb-4 md:mb-6 leading-tight md:leading-none">
              NEW SEASON
            </h1>
            <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-8xl font-bold text-black mb-6 md:mb-8 leading-tight">
              NEW COLLECTION    
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-black/90 mb-6 md:mb-8 mx-auto max-w-xl">
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
      
      {/* <AdsSlider /> */}
      <ImageSlider />
      <Product />

      <Topsellers />

      <Dressstyle />
      <ReviewSection />
      
    </div>
    
  );
};

export default Home;