import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  Camera, 
  Save, 
  Eye, 
  EyeOff, 
  Mail, 
  UserCircle,
  Palette,
  Monitor,
  Sun,
  Moon,
  Grid3X3,
  List,
  Bell,
  Shield,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: '', email: '', avatar: '' });
  const [settings, setSettings] = useState({
    theme: 'light',
    defaultView: 'grid',
    autoPreview: true,
    notifications: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // API Base URL
  const API_BASE = API_BASE_URL;

  // Get auth token from localStorage
  const getAuthToken = () => localStorage.getItem('token');

  // API Headers
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'token': getAuthToken()
  });

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/profile`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Load settings from localStorage
  const loadSettings = () => {
    const savedSettings = localStorage.getItem('myvault-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('myvault-settings', JSON.stringify(settings));
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchUserProfile();
      loadSettings();
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          username: user.username,
          avatar: user.avatar
        })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        alert('Profile updated successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
    setIsSaving(false);
  };

  // Handle settings update
  const handleSettingsUpdate = () => {
    saveSettings();
    alert('Settings saved successfully!');
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    setIsSaving(true);
    try {
      // Note: This endpoint would need to be implemented in the backend
      const response = await fetch(`${API_BASE}/change-password`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        alert('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again.');
    }
    setIsSaving(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'preferences', label: 'Preferences', icon: Monitor },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/homepage')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500">Manage your account and preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200">
              <nav className="p-4 space-y-1">
                {tabs.map(tab => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
                    
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="relative">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <UserCircle className="w-10 h-10 text-white" />
                          </div>
                        )}
                        <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                          <Camera className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{user.username}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={user.username}
                          onChange={(e) => setUser(prev => ({ ...prev, username: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Avatar URL
                        </label>
                        <input
                          type="url"
                          value={user.avatar}
                          onChange={(e) => setUser(prev => ({ ...prev, avatar: e.target.value }))}
                          placeholder="https://example.com/avatar.jpg"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleProfileUpdate}
                      disabled={isSaving}
                      className="mt-6 flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Theme
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'light', label: 'Light', icon: Sun },
                            { value: 'dark', label: 'Dark', icon: Moon },
                            { value: 'system', label: 'System', icon: Monitor }
                          ].map(theme => {
                            const IconComponent = theme.icon;
                            return (
                              <button
                                key={theme.value}
                                onClick={() => setSettings(prev => ({ ...prev, theme: theme.value }))}
                                className={`p-4 border rounded-lg text-center transition-colors ${
                                  settings.theme === theme.value
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <IconComponent className="w-6 h-6 mx-auto mb-2" />
                                <span className="text-sm font-medium">{theme.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Default View
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { value: 'grid', label: 'Grid View', icon: Grid3X3 },
                            { value: 'list', label: 'List View', icon: List }
                          ].map(view => {
                            const IconComponent = view.icon;
                            return (
                              <button
                                key={view.value}
                                onClick={() => setSettings(prev => ({ ...prev, defaultView: view.value }))}
                                className={`p-4 border rounded-lg text-center transition-colors ${
                                  settings.defaultView === view.value
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <IconComponent className="w-6 h-6 mx-auto mb-2" />
                                <span className="text-sm font-medium">{view.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSettingsUpdate}
                      className="mt-6 flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Appearance</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Auto Preview</h3>
                          <p className="text-sm text-gray-500">Automatically generate previews for new content</p>
                        </div>
                        <button
                          onClick={() => setSettings(prev => ({ ...prev, autoPreview: !prev.autoPreview }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.autoPreview ? 'bg-indigo-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.autoPreview ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                          <p className="text-sm text-gray-500">Receive notifications about your content</p>
                        </div>
                        <button
                          onClick={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.notifications ? 'bg-indigo-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.notifications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleSettingsUpdate}
                      className="mt-6 flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Preferences</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Change Password</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <Eye className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        <button
                          onClick={handlePasswordChange}
                          disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                          className="mt-4 flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          <span>{isSaving ? 'Changing...' : 'Change Password'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;