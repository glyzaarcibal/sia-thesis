const mongoose = require('mongoose');

const moodTrackerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  mood: {
    type: String,
    required: true,
    enum: [
      // Positive moods - Low energy
      'Calm',
      'Relaxed', 
      'Content',
      'Peaceful',
      'Grateful',
      // Positive moods - High energy
      'Excited',
      'Joyful',
      'Thrilled',
      'Inspired',
      'Playful',
      // Negative moods - Low energy
      'Depressed',
      'Tired',
      'Disappointed',
      'Annoyed',
      'Bored',
      // Negative moods - High energy
      'Anxious',
      'Overwhelmed',
      'Panicked',
      'Irritated',
      'Frustrated'
    ]
  },
  mood_tone: {
    type: String,
    required: true,
    enum: ['positive', 'negative']
  },
  mood_energy: {
    type: String,
    required: true,
    enum: ['low', 'high']
  },
  cause: {
    type: String,
    trim: true,
    maxlength: 500
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for faster queries
moodTrackerSchema.index({ user_id: 1, timestamp: -1 });
moodTrackerSchema.index({ mood_tone: 1, mood_energy: 1 });

// Helper method to get mood classification
moodTrackerSchema.methods.getMoodClassification = function() {
  return {
    mood: this.mood,
    tone: this.mood_tone,
    energy: this.mood_energy
  };
};

// Static method to get mood statistics for a user
moodTrackerSchema.statics.getUserMoodStats = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const stats = await this.aggregate([
    {
      $match: {
        user_id: mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$mood',
        count: { $sum: 1 },
        tone: { $first: '$mood_tone' },
        energy: { $first: '$mood_energy' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  return stats;
};

// Static method to detect mood patterns/spirals
moodTrackerSchema.statics.detectMoodSpiral = async function(userId, limit = 5) {
  const recentMoods = await this.find({ user_id: userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .select('mood mood_tone timestamp');

  if (recentMoods.length < 3) {
    return { spiral: 'insufficient_data' };
  }

  const tones = recentMoods.map(m => m.mood_tone);
  const positiveCount = tones.filter(t => t === 'positive').length;
  const negativeCount = tones.filter(t => t === 'negative').length;

  if (positiveCount >= limit * 0.7) {
    return { spiral: 'upward', strength: 'strong' };
  } else if (positiveCount >= limit * 0.6) {
    return { spiral: 'upward', strength: 'moderate' };
  } else if (negativeCount >= limit * 0.7) {
    return { spiral: 'downward', strength: 'strong' };
  } else if (negativeCount >= limit * 0.6) {
    return { spiral: 'downward', strength: 'moderate' };
  }

  return { spiral: 'mixed', strength: 'neutral' };
};

const MoodTracker = mongoose.model('MoodTracker', moodTrackerSchema);

module.exports = MoodTracker;