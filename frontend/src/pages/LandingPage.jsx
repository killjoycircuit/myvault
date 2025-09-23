import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  FileText,
  Youtube, 
  Tag,
  Share2,
  Search,
  Zap,
  Star,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

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

const LandingPage = () => {
  const [isStarFilled, setIsStarFilled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const navigate = useNavigate();

  // Scroll handler for subtle parallax effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Subtle parallax transforms
  const y1 = scrollY * -0.1;
  const opacity = Math.max(1 - scrollY / 300, 0);

  const contentTypes = [
    { icon: FileText, name: 'Articles', color: '#3B82F6', delay: 0 },
    { icon: Youtube, name: 'Videos', color: '#EF4444', delay: 0.1 },
    { icon: TwitterXIcon, name: 'X Posts', color: '#000000', delay: 0.2 },
    { icon: Search, name: 'Websites', color: '#10B981', delay: 0.3 }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Add content with a single click. Our smart system automatically categorizes and tags your saves.',
      color: '#F59E0B'
    },
    {
      icon: Tag,
      title: 'Smart Organization',
      description: 'Create custom tags and filters to organize your knowledge exactly the way you think.',
      color: '#8B5CF6'
    },
    {
      icon: Search,
      title: 'Powerful Search',
      description: 'Find anything instantly with our intelligent search that understands context and content.',
      color: '#06B6D4'
    },
    {
      icon: Share2,
      title: 'Share & Collaborate',
      description: 'Share your curated collections with others and discover new perspectives.',
      color: '#EF4444'
    }
  ];

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div 
            style={{ opacity }}
            className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-25 to-indigo-50 -z-10"
          />
          
          {/* Subtle Floating Elements */}
          <div
            style={{ transform: `translateY(${y1}px)` }}
            className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full opacity-40 blur-xl"
          />
          <div
            style={{ transform: `translateY(${y1 * 0.8}px)` }}
            className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full opacity-30 blur-xl"
          />

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Text */}
            <div 
              data-animate
              id="hero-text"
              className={`text-center lg:text-left transition-all duration-700 ease-out ${
                isVisible['hero-text'] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div
                className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-6 cursor-pointer hover:bg-indigo-200 transition-colors duration-200"
                onClick={() => setIsStarFilled(!isStarFilled)}
              >
                <Star 
                  className={`w-4 h-4 mr-2 transition-all duration-300 ${
                    isStarFilled 
                      ? 'fill-current text-yellow-500' 
                      : 'text-indigo-800'
                  }`} 
                />
                Your Second Brain, Organized
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Capture, Organize & 
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent"> Share</span> 
                <br />Your Knowledge
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform scattered bookmarks into a powerful knowledge vault. Save articles, videos, and insights with intelligent tagging and lightning-fast search.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={handleGetStarted}
                  className="group px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Start Building Your Vault</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <button 
                  onClick={() => scrollToSection('features')}
                  className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-colors duration-200"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Hero Visual - Simplified Card */}
            <div 
              data-animate
              id="hero-card"
              className={`relative transition-all duration-700 ease-out delay-200 ${
                isVisible['hero-card'] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Main Card */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 relative z-10 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-500 font-medium">MyVault</div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { title: 'AI Revolution in Design', icon: FileText, color: 'bg-blue-100', iconColor: 'text-blue-600', time: '2 hours ago' },
                    { title: 'React Best Practices 2024', icon: Youtube, color: 'bg-red-100', iconColor: 'text-red-500', time: '5 hours ago' },
                    { title: 'The Future of Web Development', icon: TwitterXIcon, color: 'bg-gray-100', iconColor: 'text-gray-800', time: '1 day ago' }
                  ].map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                          <IconComponent className={`w-6 h-6 ${item.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-sm mb-1">{item.title}</div>
                          <div className="text-xs text-gray-500">Saved {item.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Simple Floating Content Types */}
              <div className="absolute inset-0 pointer-events-none">
                {contentTypes.map((type, index) => {
                  const IconComponent = type.icon;
                  return (
                    <div
                      key={type.name}
                      className={`absolute w-14 h-14 rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                        index === 0 ? '-top-4 -right-4' :
                        index === 1 ? '-bottom-6 -left-6' :
                        index === 2 ? 'top-1/4 -right-10' :
                        'bottom-1/3 -left-10'
                      }`}
                      style={{ 
                        backgroundColor: type.color + '15', 
                        border: `2px solid ${type.color}30`
                      }}
                    >
                      <IconComponent className="w-6 h-6" style={{ color: type.color }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Simple Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center text-gray-400">
            <span className="text-sm mb-2 font-medium">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div 
            data-animate
            id="features-header"
            className={`text-center mb-16 transition-all duration-700 ${
              isVisible['features-header'] 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to build your 
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent"> knowledge empire</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to make saving, organizing, and sharing knowledge effortless
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 hover:scale-105"
                  style={{ backgroundColor: feature.color + '20' }}
                >
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - No Animation */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-violet-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to build your knowledge vault?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of professionals who've already transformed their learning workflow
          </p>
          <button 
            onClick={handleGetStarted}
            className="group px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-200 inline-flex items-center space-x-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
        
        {/* Simple background elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-white opacity-5 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white opacity-5 rounded-full"></div>
      </section>

      <Footer />
    </div>
  );
};
export default LandingPage;