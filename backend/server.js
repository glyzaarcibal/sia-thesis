const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📂 Database: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// MongoDB connection event handlers
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

// Import User model
const User = require('./models/User');

// JWT Helper
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// Auth Middleware
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the API',
    status: 'Server is running',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      profile: {
        get: 'GET /api/user/profile',
        update: 'PUT /api/user/profile'
      },
      users: {
        getAll: 'GET /api/users',
        getOne: 'GET /api/users/:id',
        update: 'PATCH /api/users/:id',
        delete: 'DELETE /api/users/:id'
      }
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// ============================================
// AUTH ROUTES
// ============================================

// @route   POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, first_name, last_name, password, role, gender, phone_number, age, location } = req.body;

    // Validation
    if (!email || !first_name || !last_name || !password) {
      return res.status(400).json({ 
        message: 'Please provide all required fields',
        errors: {
          missingEmail: !email,
          missingFirstName: !first_name,
          missingLastName: !last_name,
          passwordLength: !password || password.length < 8
        }
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters',
        errors: {
          passwordLength: true
        }
      });
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please enter a valid email',
        errors: {
          invalidEmail: true
        }
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email already exists',
        errors: {
          userAlreadyExists: true
        }
      });
    }

    // Generate username from email (before @)
    const username = email.split('@')[0];
    
    // Check if username already exists, if so append random number
    let finalUsername = username;
    let usernameExists = await User.findOne({ username: finalUsername });
    let counter = 1;
    while (usernameExists) {
      finalUsername = `${username}${counter}`;
      usernameExists = await User.findOne({ username: finalUsername });
      counter++;
    }

    // Validate role
    const validRoles = ['user', 'psychologist'];
    const userRole = role && validRoles.includes(role.toLowerCase()) ? role.toLowerCase() : 'user';

    // Create user
    const user = new User({
      username: finalUsername,
      email,
      first_name,
      last_name,
      password,
      role: userRole,
      is_staff: userRole === 'psychologist',
      profile: {
        gender: gender || '',
        phone_number: phone_number || '',
        age: age || null,
        location: location || '',
        is_phone_verified: false
      }
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        isAdmin: user.is_staff,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    });
  }
});

// @route   POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: email },
        { username: email }
      ]
    });

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        isAdmin: user.is_staff,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    });
  }
});

// @route   GET /api/auth/me
app.get('/api/auth/me', protect, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        role: req.user.role,
        isAdmin: req.user.is_staff,
        profile: req.user.profile
      }
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// PROFILE ROUTES
// ============================================

// @route   GET /api/user/profile
app.get('/api/user/profile', protect, async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      role: req.user.role,
      profile: req.user.profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/user/profile
app.put('/api/user/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update profile fields
    if (req.body.gender !== undefined) user.profile.gender = req.body.gender;
    if (req.body.age !== undefined) user.profile.age = req.body.age;
    if (req.body.location !== undefined) user.profile.location = req.body.location;
    if (req.body.phone_number !== undefined) user.profile.phone_number = req.body.phone_number;

    const updatedUser = await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      profile: updatedUser.profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// USER ROUTES
// ============================================

// GET all users
app.get('/api/users', protect, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single user by ID
app.get('/api/users/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE user
app.patch('/api/users/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic fields
    if (req.body.username != null) user.username = req.body.username;
    if (req.body.email != null) user.email = req.body.email;
    if (req.body.first_name != null) user.first_name = req.body.first_name;
    if (req.body.last_name != null) user.last_name = req.body.last_name;
    
    // Update password if provided
    if (req.body.password != null) {
      user.password = req.body.password; // Will be hashed by pre-save hook
    }

    // Update role
    if (req.body.role != null) {
      user.role = req.body.role;
      user.is_staff = req.body.role === 'psychologist';
    }

    // Update profile fields
    if (req.body.gender != null) user.profile.gender = req.body.gender;
    if (req.body.phone_number != null) user.profile.phone_number = req.body.phone_number;
    if (req.body.age != null) user.profile.age = req.body.age;
    if (req.body.location != null) user.profile.location = req.body.location;

    const updatedUser = await user.save();
    
    // Return user without password
    const userResponse = updatedUser.toObject();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE user
app.delete('/api/users/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============================================
// ERROR HANDLERS
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close();
  process.exit(0);
});