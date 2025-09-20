import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Upload, Camera, Link2 } from 'lucide-react';

const SignupPage = ({ onSignupSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    avatar: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.username) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (formData.password.length > 20) {
      setError('Password must be no more than 20 characters long');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validate avatar URL if provided
    if (formData.avatar && formData.avatar.trim()) {
      try {
        new URL(formData.avatar);
      } catch (e) {
        setError('Please enter a valid URL for the avatar');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');
    setSuccess(false);
    
    try {
      const signupData = {
        username: formData.username.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        avatar: formData.avatar.trim() || ""
      };

      const response = await fetch('http://localhost:3000/api/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data.message);
        setSuccess(true);
        
        // Show success message briefly, then automatically sign in the user
        setTimeout(async () => {
          try {
            // Automatically sign in after successful signup
            const signinResponse = await fetch('http://localhost:3000/api/v1/signin', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: formData.email.toLowerCase().trim(),
                password: formData.password
              })
            });

            const signinData = await signinResponse.json();

            if (signinResponse.ok) {
              // Store user data in memory for the session (removed localStorage)
              const userData = {
                token: signinData.token,
                email: formData.email.toLowerCase().trim(),
                username: formData.username.trim(),
                avatar: formData.avatar.trim() || ""
              };
              
              console.log('Auto-signin successful, token received:', signinData.token ? 'Yes' : 'No');
              
              // Call parent success handler
              if (onSignupSuccess) {
                onSignupSuccess(userData);
              }
              
              // Navigate directly to HomePage after successful signup and auto-signin
              navigate('/homepage');
            } else {
              // If auto-signin fails, redirect to login page
              setTimeout(() => {
                navigate('/login');
              }, 1000);
            }
          } catch (autoSigninError) {
            console.error('Auto signin error:', autoSigninError);
            // Redirect to login page if auto-signin fails
            setTimeout(() => {
              navigate('/login');
            }, 1000);
          }
        }, 1500);
        
      } else {
        // Handle different error cases with improved messaging
        if (response.status === 409) {
          if (data.action === 'signin') {
            setError('This email is already registered. Please sign in instead.');
            // Optionally auto-redirect to login after a delay
            setTimeout(() => {
              navigate('/login');
            }, 3000);
          } else {
            setError('An account with this email already exists.');
          }
        } else if (response.status === 400) {
          if (data.errors && Array.isArray(data.errors)) {
            // Handle validation errors array
            setError(data.errors.join(', '));
          } else if (data.error && Array.isArray(data.error)) {
            // Handle Zod validation errors
            const errorMessages = data.error.map(err => err.message).join(', ');
            setError(errorMessages);
          } else {
            setError(data.message || 'Invalid data provided');
          }
        } else {
          setError(data.message || 'Registration failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Unable to connect to server. Please check if the backend is running on port 3000.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-indigo-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Create Account
            </h1>
            <p className="text-gray-500">Join your Second Brain</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-200 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-700">Account created successfully! Signing you in...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Avatar Preview */}
          {formData.avatar && (
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  src={formData.avatar}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-20 h-20 bg-gray-100 rounded-full border-2 border-gray-200 flex items-center justify-center" style={{ display: 'none' }}>
                  <Camera className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-5" onKeyPress={handleKeyPress}>
            
            {/* Username Field */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting || success}
                  placeholder="Choose a username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 
                             placeholder-gray-400 focus:outline-none focus:border-indigo-500 
                             focus:ring-1 focus:ring-indigo-500 transition-colors text-gray-900
                             disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

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
                  disabled={isSubmitting || success}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 
                             placeholder-gray-400 focus:outline-none focus:border-indigo-500 
                             focus:ring-1 focus:ring-indigo-500 transition-colors text-gray-900
                             disabled:bg-gray-50 disabled:cursor-not-allowed"
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
                  disabled={isSubmitting || success}
                  placeholder="Create a strong password (6-20 chars)"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 
                             placeholder-gray-400 focus:outline-none focus:border-indigo-500 
                             focus:ring-1 focus:ring-indigo-500 transition-colors text-gray-900
                             disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={isSubmitting || success}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 
                             text-gray-400 hover:text-gray-600 transition-colors
                             disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Avatar URL Field */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Avatar URL (Optional)
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  disabled={isSubmitting || success}
                  placeholder="https://example.com/your-avatar.jpg"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 
                             placeholder-gray-400 focus:outline-none focus:border-indigo-500 
                             focus:ring-1 focus:ring-indigo-500 transition-colors text-gray-900
                             disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
            
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || success || !formData.email || !formData.password || !formData.username}
              className={`w-full py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-medium
                         hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                         focus:ring-offset-2 transition-colors
                         ${isSubmitting || success || !formData.email || !formData.password || !formData.username ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Creating Account...
                </div>
              ) : success ? (
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Account Created!
                </div>
              ) : (
                'Create Account'
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
                Already have an account?{' '}
                <Link 
                  to="/login"
                  className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                >
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;