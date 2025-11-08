const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userProfileSchema = new mongoose.Schema({
  gender: {
    type: String,
    trim: true,
    default: ''
  },
  phone_number: {
    type: String,
    trim: true,
    default: ''
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [150, 'Age seems invalid']
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  is_phone_verified: {
    type: Boolean,
    default: false
  }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [50, 'Username cannot exceed 50 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  first_name: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters long'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  last_name: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters long'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  role: {
    type: String,
    enum: ['user', 'psychologist', 'admin'],
    default: 'user',
    lowercase: true
  },
  is_staff: {
    type: Boolean,
    default: false
  },
  profile: {
    type: userProfileSchema,
    default: () => ({})
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Create indexes for faster queries
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user has a specific role
userSchema.methods.hasRole = function(role) {
  return this.role === role;
};

// Method to check if user is admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Method to check if user is psychologist
userSchema.methods.isPsychologist = function() {
  return this.role === 'psychologist';
};

// Method to get user object without password
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);