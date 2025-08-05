import React, { useState, useEffect, createContext, useContext } from 'react';
import { Search, Plus, Menu, X, Edit3, Trash2, Pin, FolderOpen, Tag, LogOut, User, Eye, EyeOff } from 'lucide-react';
// import VaultIcon from /assets/VaultIcon

// API service
const API_BASE_URL = 'http://localhost:5000/api';

const api = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },
  
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },
  
  getNotes: async (params = {}, token) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/notes?${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },
  
  createNote: async (noteData, token) => {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(noteData)
    });
    return response.json();
  },
  
  updateNote: async (id, noteData, token) => {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(noteData)
    });
    return response.json();
  },
  
  deleteNote: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },
  
  restoreNote: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/notes/${id}/restore`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },
  
  permanentDeleteNote: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/notes/${id}/permanent`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },
  
  getTrash: async (token) => {
    const response = await fetch(`${API_BASE_URL}/notes/trash`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },
  
  getFolders: async (token) => {
    const response = await fetch(`${API_BASE_URL}/notes/folders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },
  
  getTags: async (token) => {
    const response = await fetch(`${API_BASE_URL}/notes/tags`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },
  
  searchNotes: async (query, token) => {
    const response = await fetch(`${API_BASE_URL}/notes/search?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  }
};

// Auth Context
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
          setToken(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (userData, userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Login Component
const Login = ({ onToggleMode }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.login(formData);
      if (response.token) {
        login(response.user, response.token);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your Vault account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button onClick={onToggleMode} className="toggle-btn">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Register Component
const Register = ({ onToggleMode }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.register(formData);
      if (response.token) {
        login(response.user, response.token);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join Vault and start organizing your notes</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button onClick={onToggleMode} className="toggle-btn">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ currentView, onViewChange, folders, tags, onNewNote, isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'notes', label: 'All Notes', icon: Edit3 },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-content">
        <div className="sidebar-header">
          <div className="sidebar-title">
          
            <h1>MYVault</h1>
            <button onClick={onClose} className="sidebar-close">
              <X size={20} />
            </button>
          </div>
          <div className="user-info">
            <div className="user-avatar">
              <User size={16} />
            </div>
            <div className="user-details">
              <p className="username">{user?.username}</p>
              <p className="email">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="sidebar-body">
          <button onClick={onNewNote} className="new-note-btn">
            <Plus size={20} />
            <span>New Note</span>
          </button>

          <div className="menu-items">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`menu-item ${currentView === item.id ? 'active' : ''}`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {folders.length > 0 && (
            <div className="sidebar-section">
              <h3>Folders</h3>
              <div className="section-items">
                {folders.map((folder) => (
                  <button
                    key={folder}
                    onClick={() => onViewChange('notes', { folder })}
                    className="section-item"
                  >
                    <FolderOpen size={16} />
                    <span>{folder}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {tags.length > 0 && (
            <div className="sidebar-section">
              <h3>Tags</h3>
              <div className="section-items">
                {tags.slice(0, 10).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onViewChange('notes', { tags: [tag] })}
                    className="section-item"
                  >
                    <Tag size={16} />
                    <span>#{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Note Card Component
const NoteCard = ({ note, onEdit, onDelete, onPin, onRestore, onPermanentDelete, isTrash = false }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <div 
      className="note-card"
      style={{ backgroundColor: note.color !== '#ffffff' ? note.color : undefined }}
    >
      <div className="note-header">
        <div className="note-title-section">
          <div className="note-title-row">
            {note.isPinned && !isTrash && (
              <Pin size={16} className="pinned-icon" />
            )}
            <h3 className="note-title">{note.title}</h3>
          </div>
          <p className="note-content">{truncateContent(note.content)}</p>
        </div>
        
        <div className="note-actions">
          {!isTrash ? (
            <>
              <button
                onClick={() => onPin(note._id, !note.isPinned)}
                className={`action-btn ${note.isPinned ? 'pinned' : ''}`}
                title={note.isPinned ? 'Unpin note' : 'Pin note'}
              >
                <Pin size={16} />
              </button>
              <button
                onClick={() => onEdit(note)}
                className="action-btn edit"
                title="Edit note"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => onDelete(note._id)}
                className="action-btn delete"
                title="Move to trash"
              >
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onRestore(note._id)}
                className="action-btn restore"
                title="Restore note"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => onPermanentDelete(note._id)}
                className="action-btn permanent-delete"
                title="Delete permanently"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="note-footer">
        <div className="note-meta">
          {note.folder && (
            <div className="meta-item">
              <FolderOpen size={12} />
              <span>{note.folder}</span>
            </div>
          )}
          {note.tags && note.tags.length > 0 && (
            <div className="meta-item">
              <Tag size={12} />
              <span>#{note.tags.slice(0, 2).join(' #')}</span>
            </div>
          )}
        </div>
        <span className="note-date">{formatDate(note.updatedAt)}</span>
      </div>
    </div>
  );
};

// Note Modal Component
const NoteModal = ({ note, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    folder: note?.folder || 'General',
    tags: note?.tags ? note.tags.join(', ') : '',
    color: note?.color || '#ffffff',
    isPinned: note?.isPinned || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    onSave({
      ...formData,
      tags: tagsArray
    });
  };

  const colorOptions = [
    '#ffffff', '#fef3c7', '#fde68a', '#fed7aa', '#fecaca',
    '#f3e8ff', '#e0e7ff', '#dbeafe', '#a7f3d0', '#d1fae5'
  ];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{note ? 'Edit Note' : 'New Note'}</h2>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter note title..."
              required
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              placeholder="Write your note content here..."
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Folder</label>
              <input
                type="text"
                value={formData.folder}
                onChange={(e) => setFormData({ ...formData, folder: e.target.value })}
                placeholder="Enter folder name..."
              />
            </div>

            <div className="form-group">
              <label>Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Enter tags separated by commas..."
              />
            </div>
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-options">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`color-option ${formData.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="isPinned"
              checked={formData.isPinned}
              onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
            />
            <label htmlFor="isPinned">Pin this note</label>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {note ? 'Update Note' : 'Create Note'}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { token } = useAuth();
  const [currentView, setCurrentView] = useState('notes');
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});

  useEffect(() => {
    if (token) {
      loadNotes();
      loadFolders();
      loadTags();
    }
  }, [token, currentView, currentFilters]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      let response;
      
      if (currentView === 'trash') {
        response = await api.getTrash(token);
      } else {
        response = await api.getNotes(currentFilters, token);
      }
      
      setNotes(response.notes || []);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const response = await api.getFolders(token);
      setFolders(response.folders || []);
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  const loadTags = async () => {
    try {
      const response = await api.getTags(token);
      setTags(response.tags || []);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      loadNotes();
      return;
    }

    try {
      setLoading(true);
      const response = await api.searchNotes(query, token);
      setNotes(response.notes || []);
    } catch (error) {
      console.error('Error searching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (view, filters = {}) => {
    setCurrentView(view);
    setCurrentFilters(filters);
    setSidebarOpen(false);
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setShowNoteModal(true);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setShowNoteModal(true);
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (selectedNote) {
        await api.updateNote(selectedNote._id, noteData, token);
      } else {
        await api.createNote(noteData, token);
      }
      
      setShowNoteModal(false);
      setSelectedNote(null);
      loadNotes();
      loadFolders();
      loadTags();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Move this note to trash?')) {
      try {
        await api.deleteNote(noteId, token);
        loadNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const handlePinNote = async (noteId, isPinned) => {
    try {
      const note = notes.find(n => n._id === noteId);
      await api.updateNote(noteId, { ...note, isPinned }, token);
      loadNotes();
    } catch (error) {
      console.error('Error pinning note:', error);
    }
  };

  const handleRestoreNote = async (noteId) => {
    try {
      await api.restoreNote(noteId, token);
      loadNotes();
    } catch (error) {
      console.error('Error restoring note:', error);
    }
  };

  const handlePermanentDelete = async (noteId) => {
    if (window.confirm('Permanently delete this note? This action cannot be undone.')) {
      try {
        await api.permanentDeleteNote(noteId, token);
        loadNotes();
      } catch (error) {
        console.error('Error permanently deleting note:', error);
      }
    }
  };

  const getViewTitle = () => {
    if (currentView === 'trash') return 'Trash';
    if (currentFilters.folder) return `Folder: ${currentFilters.folder}`;
    if (currentFilters.tags && currentFilters.tags.length > 0) {
      return `Tag: #${currentFilters.tags[0]}`;
    }
    return 'All Notes';
  };

  return (
    <div className="dashboard">
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        folders={folders}
        tags={tags}
        onNewNote={handleNewNote}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <button
              onClick={() => setSidebarOpen(true)}
              className="menu-btn"
            >
              <Menu size={20} />
            </button>
            <h1>{getViewTitle()}</h1>
          </div>

          <div className="header-right">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
            </div>

            <button onClick={handleNewNote} className="new-note-header-btn">
              <Plus size={20} />
              <span>New Note</span>
            </button>
          </div>
        </header>

        <main className="content">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>{currentView === 'trash' ? 'Trash is empty' : 'No notes yet'}</h3>
              <p>
                {currentView === 'trash' 
                  ? 'Deleted notes will appear here.' 
                  : 'Create your first note to get started.'
                }
              </p>
              {currentView !== 'trash' && (
                <button onClick={handleNewNote} className="create-note-btn">
                  Create Note
                </button>
              )}
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onPin={handlePinNote}
                  onRestore={handleRestoreNote}
                  onPermanentDelete={handlePermanentDelete}
                  isTrash={currentView === 'trash'}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {showNoteModal && (
        <NoteModal
          note={selectedNote}
          onSave={handleSaveNote}
          onClose={() => {
            setShowNoteModal(false);
            setSelectedNote(null);
          }}
        />
      )}
    </div>
  );
};

// Auth Wrapper Component
const AuthWrapper = () => {
  const { user, loading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return isLoginMode ? (
      <Login onToggleMode={() => setIsLoginMode(false)} />
    ) : (
      <Register onToggleMode={() => setIsLoginMode(true)} />
    );
  }

  return <Dashboard />;
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
};

export default App;