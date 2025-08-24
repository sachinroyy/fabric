import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
const logo = '/images/logo.png';


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
    <>
    <style>{`
      @keyframes logoPan {
        0% { transform: translateX(-3%); }
        50% { transform: translateX(3%); }
        100% { transform: translateX(-3%); }
      }
      .animate-logo-pan { animation: logoPan 20s ease-in-out infinite; will-change: transform; }
    `}</style>
    <header 
      className={`fixed w-full z-30 transition-all duration-300 bg-cover bg-center ${
        scrolled ? 'shadow-md' : ''
      }`}
      style={{ backgroundImage: "url('/images/header.jpg')" }}
    >
      <div className="container mx-auto px-8 h-16 py-3">
        <div className="relative flex justify-between items-center ">
          {/* Left: Mobile hamburger + Brand (mobile center via absolute) */}
          <div className="flex items-center">
            {/* Mobile menu button (left) */}
            <IconButton
              onClick={toggleMenu}
              className="lg:hidden"
              aria-label="Toggle menu"
              disableRipple
              sx={{
                color: 'black',
                '&:hover': { backgroundColor: 'transparent' },
                p: { xs: 1.5, sm: 1 }
              }}
            >
              {isOpen ? (
                <CloseIcon sx={{ fontSize: { xs: 28, sm: 24 } }} />
              ) : (
                <MenuIcon sx={{ fontSize: { xs: 28, sm: 24 } }} />
              )}
            </IconButton>

            {/* Brand (shown on lg+, hidden on mobile because we center it below) */}
            <div className="hidden lg:flex items-center ml-2">
              <a href="/" className="text-left inline-flex items-center">
                <img src={logo} alt="FABRIC" className="h-16 w-auto animate-logo-pan" />
              </a>
            </div>
          </div>

          {/* Centered brand on mobile */}
          <div className="absolute inset-x-0 flex justify-left lg:hidden pl-20 text-bold">
            <a href="/" className="text-left inline-flex items-center">
              <img src={logo} alt="FABRIC" className="h-10 w-auto animate-logo-pan" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-12 text-bold ">
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
          <div className="flex items-center space-x-2 lg:space-x-3">
            <Tooltip title="Search">
              <IconButton
                disableRipple
                sx={{
                  color: 'black',
                  '&:hover': { backgroundColor: 'transparent' },
                  p: { xs: 1.5, sm: 1.25 },
                  '& .MuiSvgIcon-root': { fontSize: { xs: 28, sm: 24 } }
                }}
                aria-label="Search"
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Wishlist">
              <IconButton
                disableRipple
                sx={{
                  color: 'black',
                  '&:hover': { backgroundColor: 'transparent' },
                  p: { xs: 1.5, sm: 1.25 },
                  '& .MuiSvgIcon-root': { fontSize: { xs: 28, sm: 24 } }
                }}
                aria-label="Wishlist"
              >
                <FavoriteBorderIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sign in">
              <IconButton
                onClick={() => navigate('/signin')}
                disableRipple
                sx={{
                  color: 'black',
                  '&:hover': { backgroundColor: 'transparent' },
                  p: { xs: 1.5, sm: 1.25 },
                  '& .MuiSvgIcon-root': { fontSize: { xs: 28, sm: 24 } }
                }}
                aria-label="Sign in"
              >
                <PersonOutlineIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cart">
              <IconButton
                onClick={() => navigate('/cart')}
                disableRipple
                sx={{
                  color: 'black',
                  '&:hover': { backgroundColor: 'transparent' },
                  p: { xs: 1.5, sm: 1.25 },
                  '& .MuiSvgIcon-root': { fontSize: { xs: 28, sm: 24 } }
                }}
                aria-label="Open cart"
              >
                <Badge
                  badgeContent={cartCount || 0}
                  max={99}
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#4f46e5',
                      color: '#fff',
                      minWidth: { xs: '22px', sm: '20px' },
                      height: { xs: '22px', sm: '20px' },
                      fontSize: { xs: '0.75rem', sm: '0.7rem' }
                    }
                  }}
                >
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </div>
        </div>

      </div>
    </header>

    {/* Mobile Drawer (outside header to ensure top-most) */}
    {/* Overlay */}
    <div 
      className={`fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      onClick={() => setIsOpen(false)}
      aria-hidden={!isOpen}
    />
    {/* Drawer panel */}
    <aside
      className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      role="dialog"
      aria-modal="true"
    >
      <div className="p-4 flex items-center justify-between border-b">
        <span className="text-xl font-bold">FABRIC</span>
        <IconButton
          aria-label="Close menu"
          onClick={() => setIsOpen(false)}
          disableRipple
          sx={{ color: 'black', '&:hover': { backgroundColor: 'transparent' }, p: 1 }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <nav className="p-4 space-y-2">
        {['Home', 'Shop', 'Categories', 'About', 'Contact'].map((item) => (
          <a
            key={item}
            href="#"
            className="block py-3 px-3 rounded-md text-black hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            {item}
          </a>
        ))}
      </nav>
    </aside>
    </>
  );
};

export default Header;