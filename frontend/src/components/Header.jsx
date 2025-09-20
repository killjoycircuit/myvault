import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Consistent MyVault Logo Component
const MyVaultLogo = ({ size = "default" }) => {
  const dimensions = size === "small" ? "w-8 h-8" : "w-10 h-10";
  const innerSize = size === "small" ? "w-4 h-4" : "w-6 h-6";
  const dotSize = size === "small" ? "w-2 h-2" : "w-3 h-3";
  
  return (
    <div className="relative">
      <div className={`${dimensions} bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg`}>
        <div className={`${innerSize} bg-white rounded-lg flex items-center justify-center`}>
          <div className={`${dotSize} bg-gradient-to-br from-violet-600 to-indigo-600 rounded transform rotate-45`}></div>
        </div>
      </div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full"></div>
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform duration-200">
            <MyVaultLogo />
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              MyVault
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200"
            >
              Features
            </button>
            <button 
              onClick={handleSignIn}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg font-medium hover:shadow-xl hover:scale-105"
            >
              Sign In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white animate-in slide-in-from-top-2 duration-200">
            <div className="py-4 space-y-3">
              <button
                onClick={() => {
                  scrollToSection('features');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg mx-4 transition-colors duration-200"
              >
                Features
              </button>
              <button
                onClick={() => {
                  handleSignIn();
                  setIsMenuOpen(false);
                }}
                className="block w-full px-4 py-2 bg-indigo-600 text-white rounded-lg mx-4 text-center font-medium hover:bg-indigo-700 transition-colors duration-200"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;