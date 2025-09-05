const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

console.log('🚀 Starting working server...');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Enable CORS
app.use(cors());

// Parse JSON
app.use(express.json());

// Serve static files from React build
const buildPath = path.join(__dirname, '../client/build');
console.log('🔍 Build path:', buildPath);

// Check if build exists
const fs = require('fs');
if (fs.existsSync(buildPath)) {
  console.log('✅ Build directory found!');
  app.use(express.static(buildPath));
} else {
  console.log('❌ Build directory NOT found!');
  console.log('Please run: npm run build-client first');
}

// Import routes
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const ScanResultsRoutes = require('./routes/scanResultsRoutes');
const aiRoutes = require('./routes/aiRoutes');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/scans', ScanResultsRoutes);
app.use('/api/ai', aiRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Serve React app for all routes
app.use((req, res) => {
  console.log('🌐 Serving React app for:', req.path);
  
  if (fs.existsSync(buildPath)) {
    res.sendFile(path.join(buildPath, 'index.html'));
  } else {
    res.status(404).send('React app not built. Please run: npm run build-client');
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving React app from: ${buildPath}`);
  console.log(`🌐 Open your browser and go to: http://localhost:${PORT}`);
  console.log('🔄 Server is running... Press Ctrl+C to stop');
  
  // Try to connect to MongoDB after server starts
  if (process.env.MONGO_URI) {
    console.log('🔍 Attempting to connect to MongoDB...');
    console.log('🔍 Full MONGO_URI:', process.env.MONGO_URI);
    console.log('🔍 URI length:', process.env.MONGO_URI.length);
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

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

// Handle process signals
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  console.log('🔄 Server will continue running...');
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  console.log('🔄 Server will continue running...');
});

console.log('🔧 Server setup complete, starting...');
