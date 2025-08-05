const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  folder: {
    type: String,
    trim: true,
    default: 'General'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#ffffff',
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color']
  }
}, {
  timestamps: true
});

// Create text index for search functionality
noteSchema.index({ 
  title: 'text', 
  content: 'text', 
  tags: 'text' 
});

// Index for better query performance
noteSchema.index({ author: 1, isDeleted: 1 });
noteSchema.index({ author: 1, folder: 1, isDeleted: 1 });
noteSchema.index({ author: 1, tags: 1, isDeleted: 1 });
noteSchema.index({ author: 1, isPinned: 1, updatedAt: -1 });

// Soft delete method
noteSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// Restore method
noteSchema.methods.restore = function() {
  this.isDeleted = false;
  this.deletedAt = null;
  return this.save();
};

// Virtual for checking if note is in trash
noteSchema.virtual('inTrash').get(function() {
  return this.isDeleted;
});

// Ensure virtual fields are serialized
noteSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Note', noteSchema);