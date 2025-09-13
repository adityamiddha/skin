const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const AppError = require('../utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const ScanResultsRoutes = require('./routes/scanResultsRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
// behind Render's proxy; needed for secure cookies and req.secure
app.set('trust proxy', 1);

// ✅ Proper CORS setup for all devices and environments
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://skin-sxau.onrender.com",
  "https://skin-sxau.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      // allow exact matches in whitelist
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // allow any onrender.com subdomain (mobile browsers can rewrite to regional domains)
      const onrenderRegex = /^https?:\/\/[a-z0-9-]+\.onrender\.com$/i;
      if (onrenderRegex.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  })
);


// ✅ Parse JSON
app.use(express.json());
// ✅ Parse cookies for auth middleware
app.use(cookieParser());

// Serve static files from React build
const buildPath = path.join(__dirname, '../client/build');
console.log('🔍 Static files path:', buildPath);

if (fs.existsSync(buildPath)) {
  console.log('✅ Build directory found');
  app.use(express.static(buildPath));
} else {
  console.log('❌ Build directory NOT found at:', buildPath);
}

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/scans', ScanResultsRoutes);
app.use('/api/ai', aiRoutes);

// Root route serves React app
app.get('/', (req, res) => {
  try {
    const indexPath = path.join(__dirname, '../client/build/index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('React app not built. Please run: npm run build-client');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});

// Catch-all for React Router
app.use((req, res) => {
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

console.log('🔍 Environment variables:');
console.log('🔍 PORT:', process.env.PORT);
console.log('🔍 MONGO_URI:', process.env.MONGO_URI ? '✅ Found' : '❌ Missing');
console.log( 'mongo uri =',process.env.MONGO_URI);
console.log('🔍 CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Found' : '❌ Missing');

// Start server then connect MongoDB
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Access your app at: http://localhost:${PORT}`);
  if (process.env.MONGO_URI) {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log('✅ MongoDB connected successfully'))
      .catch(err => console.error('❌ MongoDB connection error:', err));
  } else {
    console.log('❌ MONGO_URI not found in environment variables');
  }
});
