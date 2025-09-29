import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  Trash2, 
  Edit3, 
  Youtube, 
  Twitter, 
  MessageCircle, 
  FileText, 
  Globe,
  Calendar,
  Eye
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

const ContentCard = ({ content, onDelete, onEdit }) => {
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Get content type icon and color
  const getTypeConfig = (type) => {
    switch (type) {
      case 'youtube':
        return { icon: Youtube, color: '#EF4444', bgColor: 'bg-red-50', textColor: 'text-red-700' };
      case 'twitter':
        return { icon: Twitter, color: '#1DA1F2', bgColor: 'bg-blue-50', textColor: 'text-blue-700' };
      case 'reddit':
        return { icon: MessageCircle, color: '#FF4500', bgColor: 'bg-orange-50', textColor: 'text-orange-700' };
      case 'article':
        return { icon: FileText, color: '#3B82F6', bgColor: 'bg-indigo-50', textColor: 'text-indigo-700' };
      default:
        return { icon: Globe, color: '#6B7280', bgColor: 'bg-gray-50', textColor: 'text-gray-700' };
    }
  };

  // Extract YouTube video ID
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Extract Reddit post ID
  const getRedditId = (url) => {
    const regExp = /reddit\.com\/r\/[^\/]+\/comments\/([a-zA-Z0-9]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Fetch article preview
  const fetchArticlePreview = async () => {
    if (content.type !== 'article' && content.type !== 'other') return;
    
    setIsLoading(true);
    try {
      // Simple metadata extraction using a CORS proxy
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(content.link)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (data.contents) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
        const preview = {
          title: doc.querySelector('meta[property="og:title"]')?.content || 
                 doc.querySelector('title')?.textContent || content.title,
          description: doc.querySelector('meta[property="og:description"]')?.content || 
                      doc.querySelector('meta[name="description"]')?.content || '',
          image: doc.querySelector('meta[property="og:image"]')?.content || 
                doc.querySelector('meta[name="twitter:image"]')?.content || null,
          siteName: doc.querySelector('meta[property="og:site_name"]')?.content || 
                   new URL(content.link).hostname,
          favicon: `https://www.google.com/s2/favicons?domain=${new URL(content.link).hostname}&sz=32`
        };
        
        setPreview(preview);
      }
    } catch (error) {
      console.error('Error fetching preview:', error);
      // Fallback preview
      try {
        const url = new URL(content.link);
        setPreview({
          title: content.title,
          description: '',
          image: null,
          siteName: url.hostname,
          favicon: `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`
        });
      } catch (e) {
        console.error('Error creating fallback preview:', e);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (content.type === 'article' || content.type === 'other') {
      fetchArticlePreview();
    }
  }, [content]);

  const typeConfig = getTypeConfig(content.type);
  const IconComponent = typeConfig.icon;
  const videoId = content.type === 'youtube' ? getYouTubeId(content.link) : null;
  const redditId = content.type === 'reddit' ? getRedditId(content.link) : null;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  // Determine card height based on content type and available content
  const getCardHeight = () => {
    if (content.type === 'youtube' && videoId) return 'auto'; // YouTube videos need more space
    if (content.type === 'reddit' && redditId) return 'auto'; // Reddit posts can be tall
    if (preview?.image) return 'auto'; // Articles with images need more space
    return 'auto'; // Default flexible height
  };

  return (
    <div 
      className={`group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden break-inside-avoid hover:border-gray-300 ${getCardHeight()}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className={`p-2 rounded-lg ${typeConfig.bgColor} flex-shrink-0`}>
              {preview?.favicon && (content.type === 'article' || content.type === 'other') ? (
                <img 
                  src={preview.favicon} 
                  alt="Site favicon" 
                  className="w-5 h-5"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <div className={preview?.favicon && (content.type === 'article' || content.type === 'other') ? 'hidden' : 'block'}>
                <IconComponent className="w-5 h-5" style={{ color: typeConfig.color }} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-gray-800 transition-colors">
                {preview?.title || content.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeConfig.bgColor} ${typeConfig.textColor}`}>
                  {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                </span>
                {content.createdAt && (
                  <span className="text-xs text-gray-400 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(content.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className={`flex items-center space-x-1 transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
            <a 
              href={content.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
              title="Open link"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            {onEdit && (
              <button 
                onClick={() => onEdit(content)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                title="Edit content"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={() => onDelete(content._id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Delete content"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tags */}
        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {content.tags.map(tag => (
              <span
                key={tag._id}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white shadow-sm"
                style={{ 
                  backgroundColor: tag.color || '#6B7280',
                  boxShadow: `0 1px 2px ${tag.color || '#6B7280'}20`
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Content Preview */}
        <div className="space-y-3">
          {/* YouTube Video */}
          {content.type === 'youtube' && videoId && (
            <div className="relative w-full rounded-lg overflow-hidden bg-gray-100 group-hover:shadow-md transition-shadow duration-300">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                  allowFullScreen
                  title={content.title}
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {/* Twitter/X Post */}
          {content.type === 'twitter' && (
            <div className="w-full overflow-hidden rounded-lg bg-gray-50 p-3 group-hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center space-x-2 mb-2">
                <Twitter className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Twitter Post</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {preview?.description || 'Click to view the full tweet'}
              </p>
              <a 
                href={content.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View on Twitter
              </a>
            </div>
          )}

          {/* Reddit Post */}
          {content.type === 'reddit' && (
            <div className="w-full overflow-hidden rounded-lg bg-orange-50 p-3 group-hover:bg-orange-100 transition-colors duration-200">
              <div className="flex items-center space-x-2 mb-2">
                <MessageCircle className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Reddit Post</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {preview?.description || 'Click to view the full Reddit post'}
              </p>
              <a 
                href={content.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-orange-600 hover:text-orange-700"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View on Reddit
              </a>
            </div>
          )}

          {/* Article/Link Preview */}
          {(content.type === 'article' || content.type === 'other') && (
            <div className="space-y-2">
              {isLoading && (
                <div className="w-full h-24 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                  <div className="text-gray-400 text-xs">Loading preview...</div>
                </div>
              )}
              
              {preview && !isLoading && (
                <div className="border border-gray-200 rounded-lg overflow-hidden group-hover:border-gray-300 transition-colors duration-200">
                  {preview.image && (
                    <div className="relative w-full h-32 bg-gray-100">
                      <img 
                        src={preview.image} 
                        alt={preview.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="p-3 bg-white">
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                      {preview.title}
                    </h4>
                    {preview.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {preview.description}
                      </p>
                    )}
                    <div className="flex items-center text-xs text-gray-500">
                      {preview.favicon && (
                        <img 
                          src={preview.favicon} 
                          alt="" 
                          className="w-3 h-3 mr-1"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      <span>{preview.siteName}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;