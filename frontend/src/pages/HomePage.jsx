import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Share2, 
  Grid3X3, 
  List, 
  Columns3, 
  Youtube, 
  Twitter, 
  Hash,
  ExternalLink,
  Calendar,
  Tag,
  User,
  Filter,
  X,
  Edit3,
  Trash2,
  Palette,
  Globe,
  BookOpen,
  Settings,
  ChevronDown,
  Check,
  LogOut,
  FileText
} from 'lucide-react';
import { Card } from '../assets/Card';

const HomePage = () => {
  // State management
  const [content, setContent] = useState([]);
  const [tags, setTags] = useState([]);
  const [user, setUser] = useState({ username: '', email: '', avatar: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Form states
  const [newTag, setNewTag] = useState({ name: '', color: '#3B82F6' });
  const [editingTag, setEditingTag] = useState(null);
  const [newContent, setNewContent] = useState({
    title: '',
    link: '',
    type: 'article',
    tags: []
  });
  const [contentPreview, setContentPreview] = useState(null);

  // Content types configuration
  const contentTypes = [
    { value: 'all', label: 'All Content', icon: Globe, color: '#6B7280' },
    { value: 'article', label: 'Articles', icon: FileText, color: '#3B82F6' },
    { value: 'youtube', label: 'YouTube', icon: Youtube, color: '#EF4444' },
    { value: 'twitter', label: 'Twitter', icon: Twitter, color: '#1DA1F2' },
    { value: 'other', label: 'Other', icon: Hash, color: '#6B7280' }
  ];

  // API Base URL - replace with your backend URL
  const API_BASE = 'http://localhost:3000/api/v1';

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

  // Fetch content from API
  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_BASE}/content`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setContent(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  // Fetch tags from API
  const fetchTags = async () => {
    try {
      const response = await fetch(`${API_BASE}/tags`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setTags(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchUserProfile(),
        fetchContent(),
        fetchTags()
      ]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Filter content based on search, tags, and type
  const filteredContent = content.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.link.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tagId => item.tags.some(tag => tag._id === tagId));
    
    const matchesType = selectedType === 'all' || item.type === selectedType;
    
    return matchesSearch && matchesTags && matchesType;
  });

  // Get content counts for each type
  const getContentCounts = () => {
    const counts = { all: content.length };
    contentTypes.slice(1).forEach(type => {
      counts[type.value] = content.filter(item => item.type === type.value).length;
    });
    return counts;
  };
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  // Handle share vault
  const handleShareVault = async () => {
    try {
      const response = await fetch(`${API_BASE}/brain/share`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ shareLink: true })
      });
      
      if (response.ok) {
        const data = await response.json();
        const shareUrl = `${window.location.origin}/share/${data.hash}`;
        await navigator.clipboard.writeText(shareUrl);
        alert('Share link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error creating share link:', error);
    }
    setShowShareModal(false);
  };
  // Handle tag creation
  const handleCreateTag = async () => {
    if (!newTag.name.trim()) return;
    
    try {
      const response = await fetch(`${API_BASE}/tags`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newTag)
      });
      
      if (response.ok) {
        const data = await response.json();
        setTags(prev => [...prev, data.data]);
        setNewTag({ name: '', color: '#3B82F6' });
        setShowTagModal(false);
      }
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  // Handle tag deletion
  const handleDeleteTag = async (tagId) => {
    try {
      const response = await fetch(`${API_BASE}/tags`, {
        method: 'DELETE',
        headers: getHeaders(),
        body: JSON.stringify({ tagId })
      });
      
      if (response.ok) {
        setTags(prev => prev.filter(tag => tag._id !== tagId));
        setSelectedTags(prev => prev.filter(id => id !== tagId));
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  // Toggle tag selection
  const toggleTag = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // Toggle content tag selection in add modal
  const toggleContentTag = (tagId) => {
    setNewContent(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  // Generate content preview based on type and URL
  const generatePreview = (type, link) => {
    switch (type) {
      case 'youtube':
        const videoId = getYouTubeId(link);
        return videoId ? {
          type: 'youtube',
          videoId,
          embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`
        } : null;
        
      case 'twitter':
        return {
          type: 'twitter',
          url: link
        };
        
      default:
        return {
          type: 'article',
          url: link
        };
    }
  };

  // Extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Handle content preview update
  useEffect(() => {
    if (newContent.link && newContent.type) {
      const preview = generatePreview(newContent.type, newContent.link);
      setContentPreview(preview);
    } else {
      setContentPreview(null);
    }
  }, [newContent.link, newContent.type]);

  // Handle content creation
  const handleCreateContent = async () => {
    if (!newContent.title.trim() || !newContent.link.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/content`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newContent)
      });
      
      if (response.ok) {
        await fetchContent(); // Refresh content list
        setNewContent({ title: '', link: '', type: 'article', tags: [] });
        setContentPreview(null);
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error creating content:', error);
    }
  };

  const counts = getContentCounts();
  const selectedTypeConfig = contentTypes.find(t => t.value === selectedType);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-gradient-to-br from-violet-600 to-indigo-600 rounded transform rotate-45"></div>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                MyVault
              </h1>
              <p className="text-xs text-gray-500">Your Digital Library</p>
            </div>
          </div>
        </div>

        {/* Content Type Navigation */}
        <div className="flex-1 p-4">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Browse</h3>
            <nav className="space-y-1">
              {contentTypes.map(type => {
                const IconComponent = type.icon;
                const count = counts[type.value] || 0;
                return (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-left rounded-lg transition-colors ${
                      selectedType === type.value 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-5 h-5" style={{ color: type.color }} />
                      <span className="font-medium">{type.label}</span>
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tags Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</h3>
              <button
                onClick={() => setShowTagModal(true)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {tags.map(tag => (
                <div key={tag._id} className="group flex items-center justify-between">
                  <button
                    onClick={() => toggleTag(tag._id)}
                    className={`flex-1 flex items-center space-x-2 px-2 py-1.5 text-left rounded transition-colors ${
                      selectedTags.includes(tag._id) 
                        ? 'bg-gray-100' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    ></div>
                    <span className="text-sm text-gray-700 truncate">{tag.name}</span>
                    {selectedTags.includes(tag._id) && <Check className="w-3 h-3 text-indigo-600" />}
                  </button>
                  
                  <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
                    <button
                      onClick={() => setEditingTag(tag)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit3 className="w-3 h-3 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag._id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
              
              {tags.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No tags yet. Create one to get started!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.username || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email || 'user@example.com'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    // Add settings navigation here
                    console.log('Navigate to settings');
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <span>My Content</span>
                {selectedType !== 'all' && selectedTypeConfig && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-lg" style={{ color: selectedTypeConfig.color }}>
                      {selectedTypeConfig.label}
                    </span>
                  </>
                )}
              </h2>
              <p className="text-gray-600">
                {filteredContent.length} of {content.length} items
                {selectedTags.length > 0 && ` • ${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''} selected`}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Vault</span>
              </button>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Content</span>
              </button>
            </div>
          </div>

          {/* Search and View Controls */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search your content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Tag Filter Toggle */}
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`flex items-center space-x-2 px-3 py-2 border rounded-lg transition-colors ${
                showFilterPanel ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Tags</span>
              {selectedTags.length > 0 && (
                <span className="bg-indigo-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {selectedTags.length}
                </span>
              )}
            </button>

            {/* View Mode Toggles */}
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('columns')}
                className={`p-2 ${viewMode === 'columns' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
              >
                <Columns3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tag Filter Panel */}
          {showFilterPanel && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Filter by Tags</h3>
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? (
                  tags.map(tag => (
                    <button
                      key={tag._id}
                      onClick={() => toggleTag(tag._id)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                        selectedTags.includes(tag._id)
                          ? 'ring-2 ring-offset-1 shadow-sm'
                          : 'hover:scale-105'
                      }`}
                      style={{ 
                        backgroundColor: tag.color + (selectedTags.includes(tag._id) ? 'FF' : '20'),
                        color: selectedTags.includes(tag._id) ? 'white' : tag.color,
                        ringColor: selectedTags.includes(tag._id) ? tag.color : 'transparent'
                      }}
                    >
                      {tag.name}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No tags available. Create some tags first!</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || selectedTags.length > 0 || selectedType !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start by adding your first piece of content'
                }
              </p>
              {!searchQuery && selectedTags.length === 0 && selectedType === 'all' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Your First Content</span>
                </button>
              )}
            </div>
          ) : (
            <div className={`${
              viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' :
              viewMode === 'columns' ? 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6' :
              'space-y-4'
            }`}>
              {filteredContent.map(item => (
                <Card
                  key={item._id}
                  type={item.type}
                  link={item.link}
                  title={item.title}
                  contentId={item._id}
                  tags={item.tags || []}
                  createdAt={item.createdAt}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Content Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Content</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewContent({ title: '', link: '', type: 'article', tags: [] });
                  setContentPreview(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter content title"
                  value={newContent.title}
                  onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL *
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={newContent.link}
                  onChange={(e) => setNewContent(prev => ({ ...prev, link: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <div className="flex space-x-2">
                  {contentTypes.slice(1).map(type => {
                    const IconComponent = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setNewContent(prev => ({ ...prev, type: type.value }))}
                        className={`flex items-center space-x-2 px-3 py-2 border rounded-lg transition-colors ${
                          newContent.type === type.value
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" style={{ color: type.color }} />
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Content Preview */}
              {contentPreview && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                  {contentPreview.type === 'youtube' && contentPreview.videoId && (
                    <div className="relative w-full rounded-lg overflow-hidden bg-gray-100">
                      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={contentPreview.embedUrl}
                          allowFullScreen
                          title="YouTube Preview"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}
                  
                  {contentPreview.type === 'twitter' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Twitter post preview</p>
                      <a 
                        href={contentPreview.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        {contentPreview.url}
                      </a>
                    </div>
                  )}
                  
                  {contentPreview.type === 'article' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Article link</span>
                      </div>
                      <a 
                        href={contentPreview.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm break-all"
                      >
                        {contentPreview.url}
                      </a>
                    </div>
                  )}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                {tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-[60px] bg-gray-50">
                    {tags.map(tag => (
                      <button
                        key={tag._id}
                        onClick={() => toggleContentTag(tag._id)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                          newContent.tags.includes(tag._id)
                            ? 'ring-2 ring-offset-1 shadow-sm'
                            : 'hover:scale-105'
                        }`}
                        style={{ 
                          backgroundColor: tag.color + (newContent.tags.includes(tag._id) ? 'FF' : '20'),
                          color: newContent.tags.includes(tag._id) ? 'white' : tag.color,
                          ringColor: newContent.tags.includes(tag._id) ? tag.color : 'transparent'
                        }}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
                    <p className="text-sm text-gray-500 mb-2">No tags available</p>
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        setShowTagModal(true);
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      Create your first tag
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewContent({ title: '', link: '', type: 'article', tags: [] });
                    setContentPreview(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateContent}
                  disabled={!newContent.title.trim() || !newContent.link.trim()}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Add Content
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Vault Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share Your Vault</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Share2 className="w-8 h-8 text-indigo-600" />
              </div>
              
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Share Your Knowledge Vault
              </h4>
              <p className="text-gray-600 mb-6">
                Generate a public link to share your curated content collection with others.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShareVault}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create & Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tag Management Modal */}
      {(showTagModal || editingTag) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingTag ? 'Edit Tag' : 'Create New Tag'}
              </h3>
              <button
                onClick={() => {
                  setShowTagModal(false);
                  setEditingTag(null);
                  setNewTag({ name: '', color: '#3B82F6' });
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tag Name
                </label>
                <input
                  type="text"
                  placeholder="Enter tag name"
                  value={editingTag ? editingTag.name : newTag.name}
                  onChange={(e) => {
                    if (editingTag) {
                      setEditingTag({ ...editingTag, name: e.target.value });
                    } else {
                      setNewTag({ ...newTag, name: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={editingTag ? editingTag.color : newTag.color}
                    onChange={(e) => {
                      if (editingTag) {
                        setEditingTag({ ...editingTag, color: e.target.value });
                      } else {
                        setNewTag({ ...newTag, color: e.target.value });
                      }
                    }}
                    className="w-12 h-10 border border-gray-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex-1">
                    <div 
                      className="px-3 py-2 rounded-lg text-sm font-medium text-center"
                      style={{ 
                        backgroundColor: (editingTag ? editingTag.color : newTag.color) + '20',
                        color: editingTag ? editingTag.color : newTag.color
                      }}
                    >
                      {(editingTag ? editingTag.name : newTag.name) || 'Tag Preview'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowTagModal(false);
                    setEditingTag(null);
                    setNewTag({ name: '', color: '#3B82F6' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingTag ? handleUpdateTag : handleCreateTag}
                  disabled={!(editingTag ? editingTag.name.trim() : newTag.name.trim())}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {editingTag ? 'Update Tag' : 'Create Tag'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside handlers */}
      {showTypeDropdown && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowTypeDropdown(false)}
        ></div>
      )}
      
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowProfileMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default HomePage;