import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaPinterestP } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import { BsTelephone } from 'react-icons/bs';
import { FaLocationDot } from 'react-icons/fa6';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would typically handle the subscription logic
      console.log('Subscribed with:', email);
      setIsSubscribed(true);
      setEmail('');
      // Reset subscription message after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#1A1C1F] text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
            <div className="flex items-start space-x-3">
              <FaLocationDot className="text-gray-400 mt-1 flex-shrink-0" />
              <p>123 Street, Old Trafford, NewYork, USA</p>
            </div>
            <div className="flex items-center space-x-3">
              <BsTelephone className="text-gray-400" />
              <p>+ 457 789 789 65</p>
            </div>
            <div className="flex items-center space-x-3">
              <IoMdMail className="text-gray-400 text-lg" />
              <p>yourmail@gmail.com</p>
            </div>
            
            <div className="flex space-x-4 mt-4">
              <a href="#" className="bg-[#2D2F32] p-2 rounded-full hover:bg-primary transition-colors">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href="#" className="bg-[#2D2F32] p-2 rounded-full hover:bg-primary transition-colors">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="bg-[#2D2F32] p-2 rounded-full hover:bg-primary transition-colors">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="bg-[#2D2F32] p-2 rounded-full hover:bg-primary transition-colors">
                <FaLinkedinIn className="w-4 h-4" />
              </a>
              <a href="#" className="bg-[#2D2F32] p-2 rounded-full hover:bg-primary transition-colors">
                <FaYoutube className="w-4 h-4" />
              </a>
              <a href="#" className="bg-[#2D2F32] p-2 rounded-full hover:bg-primary transition-colors">
                <FaPinterestP className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Blogs', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {['Fashion', 'Food', 'Gadgets', 'Lifestyle', 'Sports'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter and get our newest updates right on your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="bg-[#2D2F32] text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary flex-grow"
                required
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-r-md transition-colors"
              >
                Subscribe
              </button>
            </form>
            {isSubscribed && (
              <p className="text-green-400 mt-2 text-sm">Thank you for subscribing!</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} All Rights Reserved by Your Company
          </div>
          <div className="flex space-x-6
          ">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookies Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;