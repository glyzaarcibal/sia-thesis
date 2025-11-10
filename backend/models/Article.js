// ============================================
// models/Article.js
// ============================================
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  article_type: {
    type: String,
    enum: ['internal', 'external'],
    default: 'external'
  },
  content: {
    type: String,
    default: ''
  },
  external_url: {
    type: String,
    default: ''
  },
  external_source: {
    type: String,
    default: ''
  },
  original_author: {
    type: String,
    default: ''
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300
  },
  category: {
    type: String,
    required: true,
    default: 'mental-health'
  },
  tags: [{
    type: String
  }],
  featured_image: {
    type: String,
    default: ''
  },
  reading_time: {
    type: Number,
    default: 5
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published'
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for search
articleSchema.index({ title: 'text', excerpt: 'text', category: 'text' });

module.exports = mongoose.model('Article', articleSchema);