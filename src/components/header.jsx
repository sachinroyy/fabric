import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiSearch, FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';


const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart() || { cartCount: 0 };

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-4xl font-bold text-black !text-black">
              Fabric
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 ">
            <a href="#" className="text-black hover:text-black font-medium transition-colors !text-black">
              Home
            </a>
            <a href="#" className="text-black hover:text-black font-medium transition-colors !text-black">
              Shop
            </a>
            <a href="#" className="text-black hover:text-black font-medium transition-colors !text-black">
              Categories
            </a>
            <a href="#" className="text-black hover:text-black font-medium transition-colors !text-black">
              About
            </a>
            <a href="#" className="text-black hover:text-black font-medium transition-colors !text-black">
                Contact
            </a>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-white hover:text-white transition-colors">
              <FiSearch className="w-5 h-5" />
            </button>
            <button className="p-2 text-white hover:text-white transition-colors">
              <FiHeart className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/signin')}
              className="p-2 text-white hover:text-white transition-colors"
            >
              <FiUser className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="p-2 text-white hover:text-white transition-colors relative"
              aria-label="Open cart"
            >
              <FiShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                {cartCount || 0}
              </span>
            </button>
            
            {/* Mobile menu button */}
            <button 
              onClick={toggleMenu}
              className="lg:hidden p-2 text-black hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              {['Home', 'Shop', 'Categories', 'About', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="block py-2 px-4 text-black hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;