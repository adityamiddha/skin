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

// Simple CORS setup - only needed for development API testing without the proxy
// In production or when using the proxy server, this is not strictly necessary
app.use(cors({
  credentials: true,
  origin: true // This allows the server to accept requests from any origin
}));

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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../client/build');
  console.log('📂 Serving static files from:', buildPath);
  app.use(express.static(buildPath));
  
  // Serve index.html for all non-API routes in production
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.join(buildPath, 'index.html'));
    }
  });
}

// Error handling middleware
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

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
