// import { useEffect, useState } from "react";
// import { DeleteIcon, ShareIcon, TwitterIcon, YoutubeIcon, LinkIcon } from "./icons";
// import axios from "axios";
// import { BACKEND_URL } from "../../config";

// export const Card = ({ type, link, title, contentId, tags = [], createdAt }) => {
//     const [isHovered, setIsHovered] = useState(false);
//     const [linkPreview, setLinkPreview] = useState(null);
//     const [previewLoading, setPreviewLoading] = useState(false);
//     const [previewError, setPreviewError] = useState(false);

//     useEffect(() => {
//         if (type === "twitter") {
//             const script = document.createElement("script");
//             script.src = "https://platform.twitter.com/widgets.js";
//             script.async = true;
//             document.body.appendChild(script);
//             return () => {
//                 if (document.body.contains(script)) {
//                     document.body.removeChild(script);
//                 }
//             };
//         }
//     }, [type]);

//     // Fetch link preview for article/link types
//     useEffect(() => {
//         if (type === "article" || type === "link" || (!["youtube", "twitter"].includes(type))) {
//             fetchLinkPreview();
//         }
//     }, [type, link]);

//     const fetchLinkPreview = async () => {
//         if (!link || previewLoading) return;
        
//         setPreviewLoading(true);
//         setPreviewError(false);
        
//         try {
//             // Using a CORS proxy service to fetch metadata
//             const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(link)}`;
//             const response = await fetch(proxyUrl);
//             const data = await response.json();
            
//             if (data.contents) {
//                 const parser = new DOMParser();
//                 const doc = parser.parseFromString(data.contents, 'text/html');
                
//                 const preview = {
//                     title: doc.querySelector('meta[property="og:title"]')?.content || 
//                            doc.querySelector('title')?.textContent || title,
//                     description: doc.querySelector('meta[property="og:description"]')?.content || 
//                                doc.querySelector('meta[name="description"]')?.content || '',
//                     image: doc.querySelector('meta[property="og:image"]')?.content || 
//                           doc.querySelector('meta[name="twitter:image"]')?.content || null,
//                     siteName: doc.querySelector('meta[property="og:site_name"]')?.content || 
//                              new URL(link).hostname,
//                     favicon: doc.querySelector('link[rel="icon"]')?.href || 
//                             doc.querySelector('link[rel="shortcut icon"]')?.href || null
//                 };
                
//                 setLinkPreview(preview);
//             }
//         } catch (error) {
//             console.error('Error fetching link preview:', error);
//             setPreviewError(true);
//             // Fallback preview
//             try {
//                 const url = new URL(link);
//                 setLinkPreview({
//                     title: title,
//                     description: '',
//                     image: null,
//                     siteName: url.hostname,
//                     favicon: `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`
//                 });
//             } catch (e) {
//                 setPreviewError(true);
//             }
//         } finally {
//             setPreviewLoading(false);
//         }
//     };

//     const getYouTubeId = (url) => {
//         const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//         const match = url.match(regExp);
//         return match && match[2].length === 11 ? match[2] : null;
//     };

//     const videoId = type === "youtube" ? getYouTubeId(link) : null;

//     async function deleteContent() {
//         if (!confirm("Are you sure you want to delete this content?")) {
//             return;
//         }
        
//         try {
//             const token = localStorage.getItem("token");
//             await axios.delete(`${BACKEND_URL}/api/v1/content`, {
//                 headers: {
//                     token: token
//                 },
//                 data: {
//                     contentId: contentId
//                 }
//             });
//             window.location.reload();
//         } catch (error) {
//             console.error("Error deleting content:", error);
//             alert("Error deleting content. Please try again.");
//         }
//     }

//     const copyToClipboard = async (text) => {
//         try {
//             await navigator.clipboard.writeText(text);
//             // You could add a toast notification here
//         } catch (err) {
//             console.error('Failed to copy: ', err);
//         }
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', { 
//             month: 'short', 
//             day: 'numeric',
//             year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
//         });
//     };

//     const getTypeIcon = () => {
//         switch (type) {
//             case 'twitter':
//                 return <TwitterIcon />;
//             case 'youtube':
//                 return <YoutubeIcon />;
//             default:
//                 return <LinkIcon />;
//         }
//     };

//     const getTypeColor = () => {
//         switch (type) {
//             case 'twitter':
//                 return 'bg-slate-100 group-hover:bg-slate-200';
//             case 'youtube':
//                 return 'bg-red-50 group-hover:bg-red-100';
//             default:
//                 return 'bg-blue-50 group-hover:bg-blue-100';
//         }
//     };

//     const getTypeBadge = () => {
//         switch (type) {
//             case 'youtube':
//                 return 'bg-red-50 text-red-700 border-red-100';
//             case 'twitter':
//                 return 'bg-slate-50 text-slate-700 border-slate-100';
//             default:
//                 return 'bg-blue-50 text-blue-700 border-blue-100';
//         }
//     };

//     const getTypeLabel = () => {
//         switch (type) {
//             case 'youtube':
//                 return 'YouTube';
//             case 'twitter':
//                 return 'X (Twitter)';
//             default:
//                 return linkPreview?.siteName || 'Article';
//         }
//     };

//     return (
//         <div 
//             className={`
//                 group relative bg-white rounded-2xl border border-slate-200/60 
//                 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden
//                 break-inside-avoid hover:border-slate-300/60
//                 ${isHovered ? 'transform scale-[1.02]' : ''}
//             `}
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >
//             {/* Gradient overlay on hover */}
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
//             <div className="relative p-6">
//                 {/* Header */}
//                 <div className="flex justify-between items-start mb-4">
//                     <div className="flex items-center gap-3 flex-1 min-w-0">
//                         <div className={`p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 ${getTypeColor()}`}>
//                             {linkPreview?.favicon && type !== 'twitter' && type !== 'youtube' ? (
//                                 <img 
//                                     src={linkPreview.favicon} 
//                                     alt="Site favicon" 
//                                     className="w-5 h-5"
//                                     onError={(e) => {
//                                         e.target.style.display = 'none';
//                                         e.target.nextElementSibling.style.display = 'block';
//                                     }}
//                                 />
//                             ) : null}
//                             <div className={linkPreview?.favicon && type !== 'twitter' && type !== 'youtube' ? 'hidden' : 'block'}>
//                                 {getTypeIcon()}
//                             </div>
//                         </div>
//                         <div className="min-w-0 flex-1">
//                             <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-slate-800 transition-colors">
//                                 {linkPreview?.title || title}
//                             </h3>
//                             {linkPreview?.description && (
//                                 <p className="text-xs text-slate-500 mt-1 line-clamp-2">
//                                     {linkPreview.description}
//                                 </p>
//                             )}
//                             {createdAt && (
//                                 <p className="text-xs text-slate-400 mt-1">
//                                     {formatDate(createdAt)}
//                                 </p>
//                             )}
//                         </div>
//                     </div>
                    
//                     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 ml-2">
//                         <a 
//                             href={link} 
//                             target="_blank" 
//                             rel="noopener noreferrer"
//                             className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
//                             title="Open link"
//                         >
//                             <ShareIcon />
//                         </a>
//                         <button 
//                             onClick={deleteContent}
//                             className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
//                             title="Delete content"
//                         >
//                             <DeleteIcon />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Tags */}
//                 {tags && tags.length > 0 && (
//                     <div className="flex flex-wrap gap-2 mb-4">
//                         {tags.map(tag => (
//                             <span
//                                 key={tag._id}
//                                 className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white shadow-sm"
//                                 style={{ 
//                                     backgroundColor: tag.color || '#0ea5e9',
//                                     boxShadow: `0 1px 3px ${tag.color || '#0ea5e9'}20`
//                                 }}
//                             >
//                                 {tag.name}
//                             </span>
//                         ))}
//                     </div>
//                 )}

//                 {/* Content Preview */}
//                 <div className="space-y-4">
//                     {/* YouTube Video */}
//                     {type === "youtube" && videoId && (
//                         <div className="relative w-full rounded-xl overflow-hidden bg-slate-100 group-hover:shadow-lg transition-shadow duration-300">
//                             <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
//                                 <iframe
//                                     className="absolute top-0 left-0 w-full h-full"
//                                     src={`https://www.youtube-nocookie.com/embed/${videoId}`}
//                                     allowFullScreen
//                                     title={title}
//                                     loading="lazy"
//                                 />
//                             </div>
//                         </div>
//                     )}

//                     {/* Twitter/X Post */}
//                     {type === "twitter" && (
//                         <div className="w-full overflow-hidden rounded-xl bg-slate-50 p-4 group-hover:bg-slate-100 transition-colors duration-200">
//                             <blockquote className="twitter-tweet" data-theme="light" style={{ maxWidth: "100%" }}>
//                                 <a href={link.replace("x.com", "twitter.com")}>View Tweet</a>
//                             </blockquote>
//                         </div>
//                     )}

//                     {/* Article/Link Preview */}
//                     {!["youtube", "twitter"].includes(type) && (
//                         <div className="space-y-3">
//                             {previewLoading && (
//                                 <div className="w-full h-32 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center">
//                                     <div className="text-slate-400 text-sm">Loading preview...</div>
//                                 </div>
//                             )}
                            
//                             {linkPreview && !previewLoading && (
//                                 <div className="border border-slate-200 rounded-xl overflow-hidden group-hover:border-slate-300 transition-colors duration-200">
//                                     {linkPreview.image && (
//                                         <div className="relative w-full h-40 bg-slate-100">
//                                             <img 
//                                                 src={linkPreview.image} 
//                                                 alt={linkPreview.title}
//                                                 className="w-full h-full object-cover"
//                                                 loading="lazy"
//                                                 onError={(e) => {
//                                                     e.target.style.display = 'none';
//                                                 }}
//                                             />
//                                         </div>
//                                     )}
                                    
//                                     <div className="p-4 bg-white">
//                                         <h4 className="font-medium text-slate-900 text-sm line-clamp-2 mb-1">
//                                             {linkPreview.title}
//                                         </h4>
//                                         {linkPreview.description && (
//                                             <p className="text-xs text-slate-600 line-clamp-3 mb-2">
//                                                 {linkPreview.description}
//                                             </p>
//                                         )}
//                                         <div className="flex items-center text-xs text-slate-500">
//                                             {linkPreview.favicon && (
//                                                 <img 
//                                                     src={linkPreview.favicon} 
//                                                     alt="" 
//                                                     className="w-4 h-4 mr-2"
//                                                     onError={(e) => e.target.style.display = 'none'}
//                                                 />
//                                             )}
//                                             <span>{linkPreview.siteName}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
                            
//                             {previewError && !previewLoading && (
//                                 <div className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 text-center">
//                                     <LinkIcon />
//                                     <p className="text-slate-600 text-sm mt-2">Preview not available</p>
//                                     <p className="text-slate-500 text-xs mt-1">Click to visit link</p>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>

//                 {/* Footer */}
//                 <div className="mt-4 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                     <div className="flex items-center justify-between">
//                         <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeBadge()}`}>
//                             {getTypeLabel()}
//                         </span>
//                         <button 
//                             onClick={() => copyToClipboard(link)}
//                             className="text-xs text-slate-500 hover:text-blue-600 transition-colors duration-200"
//                             title="Copy link"
//                         >
//                             Copy Link
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };






// import { useEffect, useState } from "react";
// import { DeleteIcon, ShareIcon, TwitterIcon, YoutubeIcon, LinkIcon } from "./icons";
// import axios from "axios";
// import { BACKEND_URL } from "../../config";

// export const Card = ({ type, link, title, contentId, tags = [], createdAt }) => {
//     const [isHovered, setIsHovered] = useState(false);
//     const [linkPreview, setLinkPreview] = useState(null);
//     const [previewLoading, setPreviewLoading] = useState(false);
//     const [previewError, setPreviewError] = useState(false);

//     useEffect(() => {
//         if (type === "twitter") {
//             const script = document.createElement("script");
//             script.src = "https://platform.twitter.com/widgets.js";
//             script.async = true;
//             document.body.appendChild(script);
//             return () => {
//                 if (document.body.contains(script)) {
//                     document.body.removeChild(script);
//                 }
//             };
//         }
//     }, [type]);

//     // Fetch link preview for article/link types
//     useEffect(() => {
//         if (type === "article" || type === "link" || (!["youtube", "twitter"].includes(type))) {
//             fetchLinkPreview();
//         }
//     }, [type, link]);

//     const fetchLinkPreview = async () => {
//         if (!link || previewLoading) return;
        
//         setPreviewLoading(true);
//         setPreviewError(false);
        
//         try {
//             // Try multiple CORS proxy services for better reliability
//             const proxies = [
//                 `https://api.allorigins.win/get?url=${encodeURIComponent(link)}`,
//                 `https://cors-anywhere.herokuapp.com/${link}`,
//                 `https://thingproxy.freeboard.io/fetch/${link}`
//             ];

//             let data = null;
//             let success = false;

//             // Try each proxy service
//             for (let i = 0; i < proxies.length && !success; i++) {
//                 try {
//                     console.log(`Trying proxy ${i + 1}: ${proxies[i]}`);
//                     const response = await fetch(proxies[i]);
                    
//                     if (response.ok) {
//                         if (i === 0) {
//                             // allorigins.win returns JSON with contents
//                             const jsonData = await response.json();
//                             if (jsonData.contents) {
//                                 data = { contents: jsonData.contents };
//                                 success = true;
//                             }
//                         } else {
//                             // Other proxies return HTML directly
//                             const htmlText = await response.text();
//                             data = { contents: htmlText };
//                             success = true;
//                         }
//                     }
//                 } catch (proxyError) {
//                     console.log(`Proxy ${i + 1} failed:`, proxyError.message);
//                     continue;
//                 }
//             }

//             if (success && data?.contents) {
//                 const parser = new DOMParser();
//                 const doc = parser.parseFromString(data.contents, 'text/html');
                
//                 // Extract metadata with better fallbacks
//                 const getMetaContent = (selectors) => {
//                     for (const selector of selectors) {
//                         const element = doc.querySelector(selector);
//                         if (element && element.content && element.content.trim()) {
//                             return element.content.trim();
//                         }
//                     }
//                     return null;
//                 };

//                 const getTitleContent = () => {
//                     // Try Open Graph title first, then regular title
//                     return getMetaContent(['meta[property="og:title"]']) || 
//                            doc.querySelector('title')?.textContent?.trim() || 
//                            title;
//                 };

//                 const getDescriptionContent = () => {
//                     return getMetaContent([
//                         'meta[property="og:description"]',
//                         'meta[name="description"]',
//                         'meta[name="twitter:description"]'
//                     ]);
//                 };

//                 const getImageContent = () => {
//                     const imageUrl = getMetaContent([
//                         'meta[property="og:image"]',
//                         'meta[name="twitter:image"]',
//                         'meta[name="twitter:image:src"]'
//                     ]);
                    
//                     // Ensure image URL is absolute
//                     if (imageUrl) {
//                         try {
//                             if (imageUrl.startsWith('http')) {
//                                 return imageUrl;
//                             } else if (imageUrl.startsWith('//')) {
//                                 return `https:${imageUrl}`;
//                             } else if (imageUrl.startsWith('/')) {
//                                 const urlObj = new URL(link);
//                                 return `${urlObj.protocol}//${urlObj.host}${imageUrl}`;
//                             } else {
//                                 const urlObj = new URL(link);
//                                 return `${urlObj.protocol}//${urlObj.host}/${imageUrl}`;
//                             }
//                         } catch (e) {
//                             return null;
//                         }
//                     }
//                     return null;
//                 };

//                 const getFaviconUrl = () => {
//                     try {
//                         const urlObj = new URL(link);
//                         const hostname = urlObj.hostname;
                        
//                         // Try to find favicon in HTML
//                         const faviconSelectors = [
//                             'link[rel="icon"]',
//                             'link[rel="shortcut icon"]',
//                             'link[rel="apple-touch-icon"]'
//                         ];
                        
//                         for (const selector of faviconSelectors) {
//                             const element = doc.querySelector(selector);
//                             if (element && element.href) {
//                                 let faviconUrl = element.href;
//                                 if (faviconUrl.startsWith('http')) {
//                                     return faviconUrl;
//                                 } else if (faviconUrl.startsWith('//')) {
//                                     return `https:${faviconUrl}`;
//                                 } else if (faviconUrl.startsWith('/')) {
//                                     return `${urlObj.protocol}//${urlObj.host}${faviconUrl}`;
//                                 } else {
//                                     return `${urlObj.protocol}//${urlObj.host}/${faviconUrl}`;
//                                 }
//                             }
//                         }
                        
//                         // Fallback to Google's favicon service
//                         return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
//                     } catch (e) {
//                         return null;
//                     }
//                 };

//                 const getSiteName = () => {
//                     return getMetaContent(['meta[property="og:site_name"]']) ||
//                            new URL(link).hostname;
//                 };

//                 const preview = {
//                     title: getTitleContent(),
//                     description: getDescriptionContent(),
//                     image: getImageContent(),
//                     siteName: getSiteName(),
//                     favicon: getFaviconUrl()
//                 };
                
//                 setLinkPreview(preview);
//                 console.log('Preview generated:', preview);
//             } else {
//                 throw new Error('No valid response from any proxy service');
//             }
//         } catch (error) {
//             console.error('Error fetching link preview:', error);
//             setPreviewError(true);
            
//             // Enhanced fallback preview
//             try {
//                 const url = new URL(link);
//                 const hostname = url.hostname;
                
//                 setLinkPreview({
//                     title: title || hostname,
//                     description: `Visit ${hostname}`,
//                     image: null,
//                     siteName: hostname,
//                     favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
//                 });
//             } catch (e) {
//                 console.error('Fallback preview creation failed:', e);
//                 setPreviewError(true);
//             }
//         } finally {
//             setPreviewLoading(false);
//         }
//     };

//     const getYouTubeId = (url) => {
//         const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//         const match = url.match(regExp);
//         return match && match[2].length === 11 ? match[2] : null;
//     };

//     const videoId = type === "youtube" ? getYouTubeId(link) : null;

//     async function deleteContent() {
//         if (!confirm("Are you sure you want to delete this content?")) {
//             return;
//         }
        
//         try {
//             const token = localStorage.getItem("token");
//             await axios.delete(`${BACKEND_URL}/api/v1/content`, {
//                 headers: {
//                     token: token
//                 },
//                 data: {
//                     contentId: contentId
//                 }
//             });
//             window.location.reload();
//         } catch (error) {
//             console.error("Error deleting content:", error);
//             alert("Error deleting content. Please try again.");
//         }
//     }

//     const copyToClipboard = async (text) => {
//         try {
//             await navigator.clipboard.writeText(text);
//             // You could add a toast notification here
//         } catch (err) {
//             console.error('Failed to copy: ', err);
//         }
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', { 
//             month: 'short', 
//             day: 'numeric',
//             year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
//         });
//     };

//     const getTypeIcon = () => {
//         switch (type) {
//             case 'twitter':
//                 return <TwitterIcon />;
//             case 'youtube':
//                 return <YoutubeIcon />;
//             default:
//                 return <LinkIcon />;
//         }
//     };

//     const getTypeColor = () => {
//         switch (type) {
//             case 'twitter':
//                 return 'bg-slate-100 group-hover:bg-slate-200';
//             case 'youtube':
//                 return 'bg-red-50 group-hover:bg-red-100';
//             default:
//                 return 'bg-blue-50 group-hover:bg-blue-100';
//         }
//     };

//     const getTypeBadge = () => {
//         switch (type) {
//             case 'youtube':
//                 return 'bg-red-50 text-red-700 border-red-100';
//             case 'twitter':
//                 return 'bg-slate-50 text-slate-700 border-slate-100';
//             default:
//                 return 'bg-blue-50 text-blue-700 border-blue-100';
//         }
//     };

//     const getTypeLabel = () => {
//         switch (type) {
//             case 'youtube':
//                 return 'YouTube';
//             case 'twitter':
//                 return 'X (Twitter)';
//             default:
//                 return linkPreview?.siteName || 'Article';
//         }
//     };

//     return (
//         <div 
//             className={`
//                 group relative bg-white rounded-2xl border border-slate-200/60 
//                 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden
//                 break-inside-avoid hover:border-slate-300/60
//                 ${isHovered ? 'transform scale-[1.02]' : ''}
//             `}
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >
//             {/* Gradient overlay on hover */}
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
//             <div className="relative p-6">
//                 {/* Header */}
//                 <div className="flex justify-between items-start mb-4">
//                     <div className="flex items-center gap-3 flex-1 min-w-0">
//                         <div className={`p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 ${getTypeColor()}`}>
//                             {linkPreview?.favicon && type !== 'twitter' && type !== 'youtube' ? (
//                                 <img 
//                                     src={linkPreview.favicon} 
//                                     alt="Site favicon" 
//                                     className="w-5 h-5"
//                                     onError={(e) => {
//                                         e.target.style.display = 'none';
//                                         e.target.nextElementSibling.style.display = 'block';
//                                     }}
//                                 />
//                             ) : null}
//                             <div className={linkPreview?.favicon && type !== 'twitter' && type !== 'youtube' ? 'hidden' : 'block'}>
//                                 {getTypeIcon()}
//                             </div>
//                         </div>
//                         <div className="min-w-0 flex-1">
//                             <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-slate-800 transition-colors">
//                                 {linkPreview?.title || title}
//                             </h3>
//                             {linkPreview?.description && (
//                                 <p className="text-xs text-slate-500 mt-1 line-clamp-2">
//                                     {linkPreview.description}
//                                 </p>
//                             )}
//                             {createdAt && (
//                                 <p className="text-xs text-slate-400 mt-1">
//                                     {formatDate(createdAt)}
//                                 </p>
//                             )}
//                         </div>
//                     </div>
                    
//                     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 ml-2">
//                         <a 
//                             href={link} 
//                             target="_blank" 
//                             rel="noopener noreferrer"
//                             className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
//                             title="Open link"
//                         >
//                             <ShareIcon />
//                         </a>
//                         <button 
//                             onClick={deleteContent}
//                             className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
//                             title="Delete content"
//                         >
//                             <DeleteIcon />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Tags */}
//                 {tags && tags.length > 0 && (
//                     <div className="flex flex-wrap gap-2 mb-4">
//                         {tags.map(tag => (
//                             <span
//                                 key={tag._id}
//                                 className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white shadow-sm"
//                                 style={{ 
//                                     backgroundColor: tag.color || '#0ea5e9',
//                                     boxShadow: `0 1px 3px ${tag.color || '#0ea5e9'}20`
//                                 }}
//                             >
//                                 {tag.name}
//                             </span>
//                         ))}
//                     </div>
//                 )}

//                 {/* Content Preview */}
//                 <div className="space-y-4">
//                     {/* YouTube Video */}
//                     {type === "youtube" && videoId && (
//                         <div className="relative w-full rounded-xl overflow-hidden bg-slate-100 group-hover:shadow-lg transition-shadow duration-300">
//                             <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
//                                 <iframe
//                                     className="absolute top-0 left-0 w-full h-full"
//                                     src={`https://www.youtube-nocookie.com/embed/${videoId}`}
//                                     allowFullScreen
//                                     title={title}
//                                     loading="lazy"
//                                 />
//                             </div>
//                         </div>
//                     )}

//                     {/* Twitter/X Post */}
//                     {type === "twitter" && (
//                         <div className="w-full overflow-hidden rounded-xl bg-slate-50 p-4 group-hover:bg-slate-100 transition-colors duration-200">
//                             <blockquote className="twitter-tweet" data-theme="light" style={{ maxWidth: "100%" }}>
//                                 <a href={link.replace("x.com", "twitter.com")}>View Tweet</a>
//                             </blockquote>
//                         </div>
//                     )}

//                     {/* Article/Link Preview */}
//                     {!["youtube", "twitter"].includes(type) && (
//                         <div className="space-y-3">
//                             {previewLoading && (
//                                 <div className="w-full h-32 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center">
//                                     <div className="text-slate-400 text-sm">Loading preview...</div>
//                                 </div>
//                             )}
                            
//                             {linkPreview && !previewLoading && (
//                                 <div className="border border-slate-200 rounded-xl overflow-hidden group-hover:border-slate-300 transition-colors duration-200">
//                                     {linkPreview.image && (
//                                         <div className="relative w-full h-40 bg-slate-100">
//                                             <img 
//                                                 src={linkPreview.image} 
//                                                 alt={linkPreview.title}
//                                                 className="w-full h-full object-cover"
//                                                 loading="lazy"
//                                                 onError={(e) => {
//                                                     console.log('Image failed to load:', linkPreview.image);
//                                                     e.target.style.display = 'none';
//                                                     e.target.parentElement.style.display = 'none';
//                                                 }}
//                                             />
//                                         </div>
//                                     )}
                                    
//                                     <div className="p-4 bg-white">
//                                         <h4 className="font-medium text-slate-900 text-sm line-clamp-2 mb-1">
//                                             {linkPreview.title}
//                                         </h4>
//                                         {linkPreview.description && (
//                                             <p className="text-xs text-slate-600 line-clamp-3 mb-2">
//                                                 {linkPreview.description}
//                                             </p>
//                                         )}
//                                         <div className="flex items-center text-xs text-slate-500">
//                                             {linkPreview.favicon && (
//                                                 <img 
//                                                     src={linkPreview.favicon} 
//                                                     alt="" 
//                                                     className="w-4 h-4 mr-2"
//                                                     onError={(e) => e.target.style.display = 'none'}
//                                                 />
//                                             )}
//                                             <span>{linkPreview.siteName}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
                            
//                             {previewError && !previewLoading && !linkPreview && (
//                                 <div className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 text-center">
//                                     <div className="flex justify-center mb-2">
//                                         <LinkIcon />
//                                     </div>
//                                     <p className="text-slate-600 text-sm mt-2">Preview not available</p>
//                                     <p className="text-slate-500 text-xs mt-1">Click to visit link</p>
//                                     <a 
//                                         href={link} 
//                                         target="_blank" 
//                                         rel="noopener noreferrer"
//                                         className="text-blue-600 hover:text-blue-700 text-xs break-all mt-2 block"
//                                     >
//                                         {link}
//                                     </a>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>

//                 {/* Footer */}
//                 <div className="mt-4 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                     <div className="flex items-center justify-between">
//                         <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeBadge()}`}>
//                             {getTypeLabel()}
//                         </span>
//                         <button 
//                             onClick={() => copyToClipboard(link)}
//                             className="text-xs text-slate-500 hover:text-blue-600 transition-colors duration-200"
//                             title="Copy link"
//                         >
//                             Copy Link
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };




// import { useEffect, useState } from "react";
// import { DeleteIcon, ShareIcon, TwitterIcon, YoutubeIcon, LinkIcon } from "./icons";
// import axios from "axios";
// import { BACKEND_URL } from "../../config";

// export const Card = ({ type, link, title, contentId, tags = [], createdAt }) => {
//     const [isHovered, setIsHovered] = useState(false);
//     const [linkPreview, setLinkPreview] = useState(null);
//     const [previewLoading, setPreviewLoading] = useState(false);
//     const [previewError, setPreviewError] = useState(false);

//     useEffect(() => {
//         // Load Twitter widgets script if the card is a Twitter type
//         if (type === "twitter") {
//             const script = document.createElement("script");
//             script.src = "https://platform.twitter.com/widgets.js";
//             script.async = true;
//             script.charset = "utf-8";
//             document.body.appendChild(script);

//             // This ensures the Twitter widget loads if the component remounts or the link changes
//             if (window.twttr) {
//                 window.twttr.widgets.load();
//             }

//             return () => {
//                 if (document.body.contains(script)) {
//                     document.body.removeChild(script);
//                 }
//             };
//         }
//     }, [type]);

//     // Fetch link preview for article/link types
//     useEffect(() => {
//         if (["article", "link"].includes(type)) {
//             fetchLinkPreview();
//         }
//     }, [type, link]);

//     const fetchLinkPreview = async () => {
//         if (!link || previewLoading) return;
        
//         setPreviewLoading(true);
//         setPreviewError(false);
        
//         try {
//             const proxies = [
//                 `https://api.allorigins.win/get?url=${encodeURIComponent(link)}`,
//                 // Note: cors-anywhere is often unreliable and may require a Heroku deploy
//                 // `https://cors-anywhere.herokuapp.com/${link}`, 
//                 `https://thingproxy.freeboard.io/fetch/${link}`
//             ];

//             let data = null;
//             let success = false;

//             for (let i = 0; i < proxies.length && !success; i++) {
//                 try {
//                     const response = await fetch(proxies[i]);
                    
//                     if (response.ok) {
//                         if (i === 0) {
//                             const jsonData = await response.json();
//                             if (jsonData.contents) {
//                                 data = { contents: jsonData.contents };
//                                 success = true;
//                             }
//                         } else {
//                             const htmlText = await response.text();
//                             data = { contents: htmlText };
//                             success = true;
//                         }
//                     }
//                 } catch (proxyError) {
//                     continue;
//                 }
//             }

//             if (success && data?.contents) {
//                 const parser = new DOMParser();
//                 const doc = parser.parseFromString(data.contents, 'text/html');
                
//                 const getMetaContent = (selectors) => {
//                     for (const selector of selectors) {
//                         const element = doc.querySelector(selector);
//                         if (element?.content?.trim()) {
//                             return element.content.trim();
//                         }
//                     }
//                     return null;
//                 };

//                 const getTitleContent = () => {
//                     return getMetaContent(['meta[property="og:title"]']) || doc.querySelector('title')?.textContent?.trim() || title;
//                 };

//                 const getDescriptionContent = () => {
//                     return getMetaContent([
//                         'meta[property="og:description"]',
//                         'meta[name="description"]',
//                         'meta[name="twitter:description"]'
//                     ]);
//                 };

//                 const getImageContent = () => {
//                     const imageUrl = getMetaContent([
//                         'meta[property="og:image"]',
//                         'meta[name="twitter:image"]',
//                         'meta[name="twitter:image:src"]'
//                     ]);
                    
//                     if (imageUrl) {
//                         try {
//                             const urlObj = new URL(imageUrl, link);
//                             return urlObj.href;
//                         } catch (e) {
//                             return null;
//                         }
//                     }
//                     return null;
//                 };

//                 const getFaviconUrl = () => {
//                     try {
//                         const urlObj = new URL(link);
//                         const hostname = urlObj.hostname;
//                         const faviconSelectors = [
//                             'link[rel="icon"]',
//                             'link[rel="shortcut icon"]',
//                             'link[rel="apple-touch-icon"]'
//                         ];
                        
//                         for (const selector of faviconSelectors) {
//                             const element = doc.querySelector(selector);
//                             if (element?.href) {
//                                 const faviconUrlObj = new URL(element.href, link);
//                                 return faviconUrlObj.href;
//                             }
//                         }
                        
//                         return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
//                     } catch (e) {
//                         return null;
//                     }
//                 };

//                 const getSiteName = () => {
//                     return getMetaContent(['meta[property="og:site_name"]']) || new URL(link).hostname;
//                 };

//                 const preview = {
//                     title: getTitleContent(),
//                     description: getDescriptionContent(),
//                     image: getImageContent(),
//                     siteName: getSiteName(),
//                     favicon: getFaviconUrl()
//                 };
                
//                 setLinkPreview(preview);
//             } else {
//                 throw new Error('No valid response from any proxy service');
//             }
//         } catch (error) {
//             setPreviewError(true);
//             try {
//                 const url = new URL(link);
//                 const hostname = url.hostname;
//                 setLinkPreview({
//                     title: title || hostname,
//                     description: `Visit ${hostname}`,
//                     image: null,
//                     siteName: hostname,
//                     favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
//                 });
//             } catch (e) {
//                 setPreviewError(true);
//             }
//         } finally {
//             setPreviewLoading(false);
//         }
//     };

//     const getYouTubeId = (url) => {
//         const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
//         const match = url.match(regExp);
//         return (match && match[1]) ? match[1] : null;
//     };

//     const videoId = type === "youtube" ? getYouTubeId(link) : null;

//     async function deleteContent() {
//         if (!confirm("Are you sure you want to delete this content?")) {
//             return;
//         }
        
//         try {
//             const token = localStorage.getItem("token");
//             await axios.delete(`${BACKEND_URL}/api/v1/content`, {
//                 headers: {
//                     token: token
//                 },
//                 data: {
//                     contentId: contentId
//                 }
//             });
//             window.location.reload();
//         } catch (error) {
//             console.error("Error deleting content:", error);
//             alert("Error deleting content. Please try again.");
//         }
//     }

//     const copyToClipboard = async (text) => {
//         try {
//             await navigator.clipboard.writeText(text);
//         } catch (err) {
//             console.error('Failed to copy: ', err);
//         }
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', { 
//             month: 'short', 
//             day: 'numeric',
//             year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
//         });
//     };

//     const getTypeIcon = () => {
//         switch (type) {
//             case 'twitter':
//                 return <TwitterIcon />;
//             case 'youtube':
//                 return <YoutubeIcon />;
//             default:
//                 return <LinkIcon />;
//         }
//     };

//     const getTypeColor = () => {
//         switch (type) {
//             case 'twitter':
//                 return 'bg-slate-100 group-hover:bg-slate-200';
//             case 'youtube':
//                 return 'bg-red-50 group-hover:bg-red-100';
//             default:
//                 return 'bg-blue-50 group-hover:bg-blue-100';
//         }
//     };

//     const getTypeBadge = () => {
//         switch (type) {
//             case 'youtube':
//                 return 'bg-red-50 text-red-700 border-red-100';
//             case 'twitter':
//                 return 'bg-slate-50 text-slate-700 border-slate-100';
//             default:
//                 return 'bg-blue-50 text-blue-700 border-blue-100';
//         }
//     };

//     const getTypeLabel = () => {
//         switch (type) {
//             case 'youtube':
//                 return 'YouTube';
//             case 'twitter':
//                 return 'X (Twitter)';
//             default:
//                 return linkPreview?.siteName || 'Article';
//         }
//     };

//     return (
//         <div 
//             className={`
//                 group relative bg-white rounded-2xl border border-slate-200/60 
//                 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden
//                 break-inside-avoid hover:border-slate-300/60
//                 ${isHovered ? 'transform scale-[1.02]' : ''}
//             `}
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >
//             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
//             <div className="relative p-6">
//                 <div className="flex justify-between items-start mb-4">
//                     <div className="flex items-center gap-3 flex-1 min-w-0">
//                         <div className={`p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 ${getTypeColor()}`}>
//                             {linkPreview?.favicon && type !== 'twitter' && type !== 'youtube' ? (
//                                 <img 
//                                     src={linkPreview.favicon} 
//                                     alt="Site favicon" 
//                                     className="w-5 h-5"
//                                     onError={(e) => {
//                                         e.target.style.display = 'none';
//                                         e.target.nextElementSibling.style.display = 'block';
//                                     }}
//                                 />
//                             ) : null}
//                             <div className={linkPreview?.favicon && type !== 'twitter' && type !== 'youtube' ? 'hidden' : 'block'}>
//                                 {getTypeIcon()}
//                             </div>
//                         </div>
//                         <div className="min-w-0 flex-1">
//                             <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-slate-800 transition-colors">
//                                 {linkPreview?.title || title}
//                             </h3>
//                             {linkPreview?.description && (
//                                 <p className="text-xs text-slate-500 mt-1 line-clamp-2">
//                                     {linkPreview.description}
//                                 </p>
//                             )}
//                             {createdAt && (
//                                 <p className="text-xs text-slate-400 mt-1">
//                                     {formatDate(createdAt)}
//                                 </p>
//                             )}
//                         </div>
//                     </div>
                    
//                     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 ml-2">
//                         <a 
//                             href={link} 
//                             target="_blank" 
//                             rel="noopener noreferrer"
//                             className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
//                             title="Open link"
//                         >
//                             <ShareIcon />
//                         </a>
//                         <button 
//                             onClick={deleteContent}
//                             className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
//                             title="Delete content"
//                         >
//                             <DeleteIcon />
//                         </button>
//                     </div>
//                 </div>

//                 {tags && tags.length > 0 && (
//                     <div className="flex flex-wrap gap-2 mb-4">
//                         {tags.map(tag => (
//                             <span
//                                 key={tag._id}
//                                 className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white shadow-sm"
//                                 style={{ 
//                                     backgroundColor: tag.color || '#0ea5e9',
//                                     boxShadow: `0 1px 3px ${tag.color || '#0ea5e9'}20`
//                                 }}
//                             >
//                                 {tag.name}
//                             </span>
//                         ))}
//                     </div>
//                 )}

//                 <div className="space-y-4">
//                     {type === "youtube" && videoId && (
//                         <div className="relative w-full rounded-xl overflow-hidden bg-slate-100 group-hover:shadow-lg transition-shadow duration-300">
//                             <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
//                                 <iframe
//                                     className="absolute top-0 left-0 w-full h-full"
//                                     src={`https://www.youtube-nocookie.com/embed/${videoId}`}
//                                     allowFullScreen
//                                     title={title}
//                                     loading="lazy"
//                                 />
//                             </div>
//                         </div>
//                     )}

//                     {type === "twitter" && (
//                         <div className="w-full overflow-hidden rounded-xl bg-slate-50 p-4 group-hover:bg-slate-100 transition-colors duration-200">
//                             <blockquote className="twitter-tweet" data-theme="light" style={{ maxWidth: "100%" }}>
//                                 <a href={link.replace("x.com", "twitter.com")}>View Tweet</a>
//                             </blockquote>
//                         </div>
//                     )}

//                     {/* Only show link preview for non-special types */}
//                     {!["youtube", "twitter"].includes(type) && (
//                         <div className="space-y-3">
//                             {previewLoading && (
//                                 <div className="w-full h-32 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center">
//                                     <div className="text-slate-400 text-sm">Loading preview...</div>
//                                 </div>
//                             )}
                            
//                             {linkPreview && !previewLoading && (
//                                 <div className="border border-slate-200 rounded-xl overflow-hidden group-hover:border-slate-300 transition-colors duration-200">
//                                     {linkPreview.image && (
//                                         <div className="relative w-full h-40 bg-slate-100">
//                                             <img 
//                                                 src={linkPreview.image} 
//                                                 alt={linkPreview.title}
//                                                 className="w-full h-full object-cover"
//                                                 loading="lazy"
//                                                 onError={(e) => {
//                                                     e.target.style.display = 'none';
//                                                     e.target.parentElement.style.display = 'none';
//                                                 }}
//                                             />
//                                         </div>
//                                     )}
                                    
//                                     <div className="p-4 bg-white">
//                                         <h4 className="font-medium text-slate-900 text-sm line-clamp-2 mb-1">
//                                             {linkPreview.title}
//                                         </h4>
//                                         {linkPreview.description && (
//                                             <p className="text-xs text-slate-600 line-clamp-3 mb-2">
//                                                 {linkPreview.description}
//                                             </p>
//                                         )}
//                                         <div className="flex items-center text-xs text-slate-500">
//                                             {linkPreview.favicon && (
//                                                 <img 
//                                                     src={linkPreview.favicon} 
//                                                     alt="" 
//                                                     className="w-4 h-4 mr-2"
//                                                     onError={(e) => e.target.style.display = 'none'}
//                                                 />
//                                             )}
//                                             <span>{linkPreview.siteName}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
                            
//                             {previewError && !previewLoading && !linkPreview && (
//                                 <div className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 text-center">
//                                     <div className="flex justify-center mb-2">
//                                         <LinkIcon />
//                                     </div>
//                                     <p className="text-slate-600 text-sm mt-2">Preview not available</p>
//                                     <p className="text-slate-500 text-xs mt-1">Click to visit link</p>
//                                     <a 
//                                         href={link} 
//                                         target="_blank" 
//                                         rel="noopener noreferrer"
//                                         className="text-blue-600 hover:text-blue-700 text-xs break-all mt-2 block"
//                                     >
//                                         {link}
//                                     </a>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>

//                 <div className="mt-4 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                     <div className="flex items-center justify-between">
//                         <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeBadge()}`}>
//                             {getTypeLabel()}
//                         </span>
//                         <button 
//                             onClick={() => copyToClipboard(link)}
//                             className="text-xs text-slate-500 hover:text-blue-600 transition-colors duration-200"
//                             title="Copy link"
//                         >
//                             Copy Link
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };








import { useEffect, useState } from "react";
import { DeleteIcon, ShareIcon, TwitterIcon, YoutubeIcon, LinkIcon } from "./icons";
import axios from "axios";
import { BACKEND_URL } from "../../config";

export const Card = ({ type, link, title, contentId, tags = [], createdAt }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [linkPreview, setLinkPreview] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState(false);

    // Effect to handle Twitter widgets script
    useEffect(() => {
        if (type === "twitter") {
            const script = document.createElement("script");
            script.src = "https://platform.twitter.com/widgets.js";
            script.async = true;
            script.charset = "utf-8";
            document.body.appendChild(script);

            // This ensures the Twitter widget loads if the component remounts or the link changes
            if (window.twttr) {
                window.twttr.widgets.load();
            }

            return () => {
                if (document.body.contains(script)) {
                    document.body.removeChild(script);
                }
            };
        }
    }, [type]);

    // Fetch link preview for article/link types
    useEffect(() => {
        if (["article", "link"].includes(type)) {
            fetchLinkPreview();
        }
    }, [type, link]);

    const fetchLinkPreview = async () => {
        if (!link || previewLoading) return;
        
        setPreviewLoading(true);
        setPreviewError(false);
        
        try {
            const proxies = [
                `https://api.allorigins.win/get?url=${encodeURIComponent(link)}`,
                `https://thingproxy.freeboard.io/fetch/${link}`
            ];

            let data = null;
            let success = false;

            for (let i = 0; i < proxies.length && !success; i++) {
                try {
                    const response = await fetch(proxies[i]);
                    
                    if (response.ok) {
                        if (i === 0) {
                            const jsonData = await response.json();
                            if (jsonData.contents) {
                                data = { contents: jsonData.contents };
                                success = true;
                            }
                        } else {
                            const htmlText = await response.text();
                            data = { contents: htmlText };
                            success = true;
                        }
                    }
                } catch (proxyError) {
                    continue;
                }
            }

            if (success && data?.contents) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data.contents, 'text/html');
                
                const getMetaContent = (selectors) => {
                    for (const selector of selectors) {
                        const element = doc.querySelector(selector);
                        if (element?.content?.trim()) {
                            return element.content.trim();
                        }
                    }
                    return null;
                };

                const getTitleContent = () => {
                    return getMetaContent(['meta[property="og:title"]']) || doc.querySelector('title')?.textContent?.trim() || title;
                };

                const getDescriptionContent = () => {
                    return getMetaContent([
                        'meta[property="og:description"]',
                        'meta[name="description"]',
                        'meta[name="twitter:description"]'
                    ]);
                };

                const getImageContent = () => {
                    const imageUrl = getMetaContent([
                        'meta[property="og:image"]',
                        'meta[name="twitter:image"]',
                        'meta[name="twitter:image:src"]'
                    ]);
                    
                    if (imageUrl) {
                        try {
                            const urlObj = new URL(imageUrl, link);
                            return urlObj.href;
                        } catch (e) {
                            return null;
                        }
                    }
                    return null;
                };

                const getFaviconUrl = () => {
                    try {
                        const urlObj = new URL(link);
                        const hostname = urlObj.hostname;
                        const faviconSelectors = [
                            'link[rel="icon"]',
                            'link[rel="shortcut icon"]',
                            'link[rel="apple-touch-icon"]'
                        ];
                        
                        for (const selector of faviconSelectors) {
                            const element = doc.querySelector(selector);
                            if (element?.href) {
                                const faviconUrlObj = new URL(element.href, link);
                                return faviconUrlObj.href;
                            }
                        }
                        
                        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
                    } catch (e) {
                        return null;
                    }
                };

                const getSiteName = () => {
                    return getMetaContent(['meta[property="og:site_name"]']) || new URL(link).hostname;
                };

                const preview = {
                    title: getTitleContent(),
                    description: getDescriptionContent(),
                    image: getImageContent(),
                    siteName: getSiteName(),
                    favicon: getFaviconUrl()
                };
                
                setLinkPreview(preview);
            } else {
                throw new Error('No valid response from any proxy service');
            }
        } catch (error) {
            setPreviewError(true);
            try {
                const url = new URL(link);
                const hostname = url.hostname;
                setLinkPreview({
                    title: title || hostname,
                    description: `Visit ${hostname}`,
                    image: null,
                    siteName: hostname,
                    favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
                });
            } catch (e) {
                setPreviewError(true);
            }
        } finally {
            setPreviewLoading(false);
        }
    };

    const getYouTubeId = (url) => {
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regExp);
        return (match && match[1]) ? match[1] : null;
    };

    const videoId = type === "youtube" ? getYouTubeId(link) : null;

    async function deleteContent() {
        if (!confirm("Are you sure you want to delete this content?")) {
            return;
        }
        
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${BACKEND_URL}/api/v1/content`, {
                headers: {
                    token: token
                },
                data: {
                    contentId: contentId
                }
            });
            window.location.reload();
        } catch (error) {
            console.error("Error deleting content:", error);
            alert("Error deleting content. Please try again.");
        }
    }

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        });
    };

    const getTypeIcon = () => {
        switch (type) {
            case 'twitter':
                return <TwitterIcon />;
            case 'youtube':
                return <YoutubeIcon />;
            default:
                return <LinkIcon />;
        }
    };

    const getTypeColor = () => {
        switch (type) {
            case 'twitter':
                return 'bg-slate-100 group-hover:bg-slate-200';
            case 'youtube':
                return 'bg-red-50 group-hover:bg-red-100';
            default:
                return 'bg-blue-50 group-hover:bg-blue-100';
        }
    };

    const getTypeBadge = () => {
        switch (type) {
            case 'youtube':
                return 'bg-red-50 text-red-700 border-red-100';
            case 'twitter':
                return 'bg-slate-50 text-slate-700 border-slate-100';
            default:
                return 'bg-blue-50 text-blue-700 border-blue-100';
        }
    };

    const getTypeLabel = () => {
        switch (type) {
            case 'youtube':
                return 'YouTube';
            case 'twitter':
                return 'X (Twitter)';
            default:
                return linkPreview?.siteName || 'Article';
        }
    };

    return (
        <div 
            className={`
                group relative bg-white rounded-2xl border border-slate-200/60 
                shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden
                break-inside-avoid hover:border-slate-300/60
                ${isHovered ? 'transform scale-[1.02]' : ''}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className="relative p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 ${getTypeColor()}`}>
                            {linkPreview?.favicon && type !== 'twitter' && type !== 'youtube' ? (
                                <img 
                                    src={linkPreview.favicon} 
                                    alt="Site favicon" 
                                    className="w-5 h-5"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextElementSibling.style.display = 'block';
                                    }}
                                />
                            ) : null}
                            <div className={linkPreview?.favicon && type !== 'twitter' && type !== 'youtube' ? 'hidden' : 'block'}>
                                {getTypeIcon()}
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-slate-800 transition-colors">
                                {linkPreview?.title || title}
                            </h3>
                            {linkPreview?.description && (
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                    {linkPreview.description}
                                </p>
                            )}
                            {createdAt && (
                                <p className="text-xs text-slate-400 mt-1">
                                    {formatDate(createdAt)}
                                </p>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 ml-2">
                        <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Open link"
                        >
                            <ShareIcon />
                        </a>
                        <button 
                            onClick={deleteContent}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete content"
                        >
                            <DeleteIcon />
                        </button>
                    </div>
                </div>

                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map(tag => (
                            <span
                                key={tag._id}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white shadow-sm"
                                style={{ 
                                    backgroundColor: tag.color || '#0ea5e9',
                                    boxShadow: `0 1px 3px ${tag.color || '#0ea5e9'}20`
                                }}
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}

                <div className="space-y-4">
                    {type === "youtube" && videoId && (
                        <div className="relative w-full rounded-xl overflow-hidden bg-slate-100 group-hover:shadow-lg transition-shadow duration-300">
                            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full"
                                    src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                                    allowFullScreen
                                    title={title}
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    )}

                    {type === "twitter" && (
                        <div className="w-full overflow-hidden rounded-xl bg-slate-50 p-4 group-hover:bg-slate-100 transition-colors duration-200">
                            <blockquote className="twitter-tweet" data-theme="light" style={{ maxWidth: "100%" }}>
                                <a href={link.replace("x.com", "twitter.com")}>View Tweet</a>
                            </blockquote>
                        </div>
                    )}

                    {!["youtube", "twitter"].includes(type) && (
                        <div className="space-y-3">
                            {previewLoading && (
                                <div className="w-full h-32 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center">
                                    <div className="text-slate-400 text-sm">Loading preview...</div>
                                </div>
                            )}
                            
                            {linkPreview && !previewLoading && (
                                <div className="border border-slate-200 rounded-xl overflow-hidden group-hover:border-slate-300 transition-colors duration-200">
                                    {linkPreview.image && (
                                        <div className="relative w-full h-40 bg-slate-100">
                                            <img 
                                                src={linkPreview.image} 
                                                alt={linkPreview.title}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="p-4 bg-white">
                                        <h4 className="font-medium text-slate-900 text-sm line-clamp-2 mb-1">
                                            {linkPreview.title}
                                        </h4>
                                        {linkPreview.description && (
                                            <p className="text-xs text-slate-600 line-clamp-3 mb-2">
                                                {linkPreview.description}
                                            </p>
                                        )}
                                        <div className="flex items-center text-xs text-slate-500">
                                            {linkPreview.favicon && (
                                                <img 
                                                    src={linkPreview.favicon} 
                                                    alt="" 
                                                    className="w-4 h-4 mr-2"
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            )}
                                            <span>{linkPreview.siteName}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {previewError && !previewLoading && !linkPreview && (
                                <div className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 text-center">
                                    <div className="flex justify-center mb-2">
                                        <LinkIcon />
                                    </div>
                                    <p className="text-slate-600 text-sm mt-2">Preview not available</p>
                                    <p className="text-slate-500 text-xs mt-1">Click to visit link</p>
                                    <a 
                                        href={link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 text-xs break-all mt-2 block"
                                    >
                                        {link}
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeBadge()}`}>
                            {getTypeLabel()}
                        </span>
                        <button 
                            onClick={() => copyToClipboard(link)}
                            className="text-xs text-slate-500 hover:text-blue-600 transition-colors duration-200"
                            title="Copy link"
                        >
                            Copy Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
