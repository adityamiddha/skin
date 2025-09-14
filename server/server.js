/**
 * Main Express Server
 * Simplified to avoid path-to-regexp issues
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const AppError = require('../utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const scanResultsRoutes = require('./routes/scanResultsRoutes');
const aiRoutes = require('./routes/aiRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable trust proxy for secure cookies behind reverse proxies
app.set('trust proxy', 1);

// Simple CORS setup
app.use(
  cors({
    credentials: true,
    origin: true, // Allow all origins
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Log server startup
console.log('🚀 Starting server...');
console.log('📂 Current directory:', process.cwd());
console.log('📂 Server directory:', __dirname);
console.log('🔧 Node environment:', process.env.NODE_ENV || 'development');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/scans', scanResultsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/health', healthRoutes);

// Production static file serving
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../client/build');
  console.log('📂 Serving static files from:', buildPath);

  // Serve static files
  app.use(express.static(buildPath));

  // Handle react routing - send all non-api requests to index.html
  app.use(function (req, res, next) {
    if (req.url.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// 404 handler - must come after all routes and static files
app.use(function (req, res, next) {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Access your API at: http://localhost:${PORT}/api`);

  // Connect to MongoDB
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
});

module.exports = app;
