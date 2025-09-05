const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });


const AppError = require('../utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const ScanResultsRoutes = require('./routes/scanResultsRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
app.use(cors());
app.use(express.json());
// Serve static files from React build
const buildPath = path.join(__dirname, '../client/build');
console.log('🔍 Static files path:', buildPath);
console.log('🔍 Current directory (__dirname):', __dirname);
console.log('🔍 Resolved build path:', path.resolve(buildPath));

// Check if build directory exists
if (fs.existsSync(buildPath)) {
  console.log('✅ Build directory found');
  app.use(express.static(buildPath));
} else {
  console.log('❌ Build directory NOT found at:', buildPath);
  console.log('❌ Absolute path:', path.resolve(buildPath));
}

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/scans', ScanResultsRoutes);
app.use('/api/ai', aiRoutes);

// Serve React app for root route
app.get('/', (req, res) => {
  try {
    console.log('🔍 Root route hit!');
    const indexPath = path.join(__dirname, '../client/build/index.html');
    console.log('🔍 Serving index.html from:', indexPath);
    
    // Check if file exists
    if (fs.existsSync(indexPath)) {
      console.log('✅ index.html file found, serving...');
      res.sendFile(indexPath);
    } else {
      console.log('❌ index.html file NOT found at:', indexPath);
      res.status(404).send('React app not built. Please run: npm run build-client');
    }
  } catch (error) {
    console.error('❌ Error serving root route:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add a test route to see if routing is working
app.get('/test', (req, res) => {
  console.log('🔍 Test route hit!');
  res.json({ message: 'Test route working!' });
});

// HANDLE UNDEFINED ROUTES - This should come BEFORE error handler
app.use((req, res) => {
  console.log('🔍 Catch-all route hit for:', req.originalUrl);
  const indexPath = path.join(__dirname, '../client/build/index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('React app not found');
  }
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

// Debug environment variables
console.log('🔍 Environment variables:');
console.log('🔍 PORT:', process.env.PORT);
console.log('🔍 MONGO_URI:', process.env.MONGO_URI ? '✅ Found' : '❌ Missing');
console.log('🔍 CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Found' : '❌ Missing');

// Start the server first, then try to connect to MongoDB
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Access your app at: http://localhost:${PORT}`);
  console.log(`📁 Static files served from: ${buildPath}`);
  
  // Try to connect to MongoDB after server starts
  if (process.env.MONGO_URI) {
    console.log('🔍 Attempting to connect to MongoDB...');
    console.log('🔍 URI starts with:', process.env.MONGO_URI.substring(0, 20) + '...');
    
    mongoose.connect(process.env.MONGO_URI)
      .then(() => {
        console.log('✅ MongoDB connected successfully');
      })
      .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        console.log('⚠️  Server is running but database features won\'t work');
      });
  } else {
    console.log('❌ MONGO_URI not found in environment variables');
  }
});