import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Normalize and persist auth so other pages (e.g., HomePage) can use it
        const normalizedEmail = (formData.email || '').toLowerCase().trim();
        const userPayload = {
          id: data.user?.id,
          username: data.user?.username || '',
          email: data.user?.email || normalizedEmail,
          avatar: data.user?.avatar || ''
        };

        // Persist for authenticated API calls
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        localStorage.setItem('user', JSON.stringify(userPayload));

        console.log('Login successful:', data.message);
        console.log('Token received:', data.token ? 'Yes' : 'No');

        // Call the parent component's success handler
        if (onLoginSuccess) {
          onLoginSuccess({ token: data.token, ...userPayload });
        }

        // Navigate to homepage
        navigate('/homepage');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error. Please check if the backend server is running on port 3000.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-indigo-600 flex items-center justify-center">
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Welcome Back
            </h1>
            <p className="text-gray-500">Sign in to your Vault</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-5" onKeyPress={handleKeyPress}>
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 
                           placeholder-gray-400 focus:outline-none focus:border-indigo-500 
                           focus:ring-1 focus:ring-indigo-500 transition-colors text-gray-900"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 
                           placeholder-gray-400 focus:outline-none focus:border-indigo-500 
                           focus:ring-1 focus:ring-indigo-500 transition-colors text-gray-900"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 
                           text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.email || !formData.password}
              className={`w-full py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-medium
                       hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                       focus:ring-offset-2 transition-colors
                       ${isSubmitting || !formData.email || !formData.password ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Additional Links */}
            <div className="text-center pt-4">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="h-px flex-1 bg-gray-200"></div>
                <span className="text-sm text-gray-500">or</span>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>
              
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/signup"
                  className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;