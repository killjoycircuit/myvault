import React from 'react';
import { Github, Mail, Linkedin, ExternalLink } from 'lucide-react';

// Custom Twitter X Icon Component
const TwitterXIcon = ({ className = "w-5 h-5", ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    version="1.1" 
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/> 
  </svg>
);

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

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <MyVaultLogo size="default" />
              <span className="text-2xl font-bold">MyVault</span>
            </div>
            <p className="text-gray-300 text-lg mb-6 max-w-md leading-relaxed">
              Transform scattered bookmarks into a powerful knowledge vault. Your second brain, organized and accessible.
            </p>
            <div className="flex items-center space-x-6">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl hover:bg-indigo-600 transition-all duration-300 hover:scale-110"
              >
                <Github className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
              </a>

              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl hover:bg-indigo-600 transition-all duration-300 hover:scale-110"
              >
                <TwitterXIcon className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
              </a>

              <a
                href="https://linkedin.com/in/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl hover:bg-indigo-600 transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
              </a>

              <a
                href="mailto:hello@myvault.com"
                className="group flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl hover:bg-indigo-600 transition-all duration-300 hover:scale-110"
              >
                <Mail className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Product</h3>
            <ul className="space-y-4">
              <li>
                <button className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                  Features
                  <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                  Pricing
                  <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                  API
                  <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                  Documentation
                  <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Support</h3>
            <ul className="space-y-4">
              <li>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="w-5 h-5 text-indigo-400" />
                  <a href="mailto:hello@myvault.com" className="hover:text-white transition-colors">
                    myvault@gmail.com
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Usually responds in 24 hours</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col lg:flex-row items-center justify-between">
          <span className="text-gray-400 text-sm">
            &copy; 2024 MyVault. All rights reserved.
          </span>
          <div className="flex items-center space-x-6 mt-4 lg:mt-0">
            <span className="text-gray-400 text-sm">Built with ❤️ for knowledge workers</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-400 text-sm">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;