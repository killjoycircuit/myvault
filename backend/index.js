const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { body, query, validationResult } = require('express-validator');
require('dotenv').config();

const User = require('./models/User');
const Note = require('./models/Note');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// JWT Token Generation
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Auth Middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token - user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

// Validation Rules
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const noteValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('content')
    .notEmpty()
    .withMessage('Content is required'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('folder')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Folder name cannot exceed 50 characters'),
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex color')
];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'MYVault API is running!' });
});

// Auth Routes
app.post('/api/auth/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(400).json({ 
        message: `User with this ${field} already exists` 
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email
    }
  });
});

// Notes Routes - Specific routes BEFORE parameterized routes
app.get('/api/notes/search', authenticateToken, [
  query('q').trim().notEmpty().withMessage('Search query is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const searchQuery = req.query.q;
    
    const notes = await Note.find({
      author: req.user._id,
      isDeleted: false,
      $text: { $search: searchQuery }
    })
    .sort({ score: { $meta: 'textScore' } })
    .populate('author', 'username email');

    res.json({ notes });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error while searching notes' });
  }
});

app.get('/api/notes/folders', authenticateToken, async (req, res) => {
  try {
    const folders = await Note.distinct('folder', { 
      author: req.user._id, 
      isDeleted: false 
    });
    
    res.json({ folders: folders.filter(f => f) });
  } catch (error) {
    console.error('Get folders error:', error);
    res.status(500).json({ message: 'Server error while fetching folders' });
  }
});

app.get('/api/notes/tags', authenticateToken, async (req, res) => {
  try {
    const tags = await Note.distinct('tags', { 
      author: req.user._id, 
      isDeleted: false 
    });
    
    res.json({ tags: tags.filter(t => t) });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ message: 'Server error while fetching tags' });
  }
});

app.get('/api/notes/trash', authenticateToken, async (req, res) => {
  try {
    const notes = await Note.find({ 
      author: req.user._id, 
      isDeleted: true 
    })
    .sort({ deletedAt: -1 })
    .populate('author', 'username email');
    
    res.json({ notes });
  } catch (error) {
    console.error('Get trash error:', error);
    res.status(500).json({ message: 'Server error while fetching trash' });
  }
});

// General notes routes
app.get('/api/notes', authenticateToken, [
  query('folder').optional().trim(),
  query('tags').optional(),
  query('search').optional().trim(),
  query('includeDeleted').optional().isBoolean(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { folder, tags, search, includeDeleted = 'false', page = 1, limit = 20 } = req.query;
    
    const query = { author: req.user._id };
    
    if (includeDeleted !== 'true') {
      query.isDeleted = false;
    }

    if (folder) {
      query.folder = folder;
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    let noteQuery = Note.find(query);

    if (search) {
      noteQuery = Note.find({
        ...query,
        $text: { $search: search }
      }).sort({ score: { $meta: 'textScore' } });
    } else {
      noteQuery = noteQuery.sort({ isPinned: -1, updatedAt: -1 });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    noteQuery = noteQuery.skip(skip).limit(parseInt(limit));

    const notes = await noteQuery.populate('author', 'username email');
    const total = await Note.countDocuments(query);

    res.json({
      notes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalNotes: total,
        hasNextPage: skip + notes.length < total,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error while fetching notes' });
  }
});

app.post('/api/notes', authenticateToken, noteValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, content, tags = [], folder = 'General', color = '#ffffff', isPinned = false } = req.body;

    const note = new Note({
      title,
      content,
      author: req.user._id,
      tags: tags.map(tag => tag.toLowerCase().trim()).filter(tag => tag),
      folder: folder.trim() || 'General',
      color,
      isPinned
    });

    await note.save();
    await note.populate('author', 'username email');

    res.status(201).json({
      message: 'Note created successfully',
      note
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error while creating note' });
  }
});

// Parameterized routes - AFTER specific routes
app.get('/api/notes/:id', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      author: req.user._id
    }).populate('author', 'username email');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ note });
  } catch (error) {
    console.error('Get note error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid note ID format' });
    }
    res.status(500).json({ message: 'Server error while fetching note' });
  }
});

app.put('/api/notes/:id', authenticateToken, noteValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, content, tags, folder, color, isPinned } = req.body;

    const note = await Note.findOne({
      _id: req.params.id,
      author: req.user._id,
      isDeleted: false
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.title = title;
    note.content = content;
    if (tags !== undefined) {
      note.tags = tags.map(tag => tag.toLowerCase().trim()).filter(tag => tag);
    }
    if (folder !== undefined) {
      note.folder = folder.trim() || 'General';
    }
    if (color !== undefined) {
      note.color = color;
    }
    if (isPinned !== undefined) {
      note.isPinned = isPinned;
    }

    await note.save();
    await note.populate('author', 'username email');

    res.json({
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    console.error('Update note error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid note ID format' });
    }
    res.status(500).json({ message: 'Server error while updating note' });
  }
});

app.put('/api/notes/:id/restore', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      author: req.user._id,
      isDeleted: true
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found in trash' });
    }

    await note.restore();

    res.json({ message: 'Note restored successfully' });
  } catch (error) {
    console.error('Restore note error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid note ID format' });
    }
    res.status(500).json({ message: 'Server error while restoring note' });
  }
});

app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      author: req.user._id,
      isDeleted: false
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await note.softDelete();

    res.json({ message: 'Note moved to trash successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid note ID format' });
    }
    res.status(500).json({ message: 'Server error while deleting note' });
  }
});

app.delete('/api/notes/:id/permanent', authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
      isDeleted: true
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found in trash' });
    }

    res.json({ message: 'Note permanently deleted' });
  } catch (error) {
    console.error('Permanent delete error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid note ID format' });
    }
    res.status(500).json({ message: 'Server error while permanently deleting note' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler - MUST be last route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

module.exports = app;