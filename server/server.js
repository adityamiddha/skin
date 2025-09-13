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
const healthRoutes = require('./routes/healthRoutes');

const app = express();
// Enable trust proxy for secure cookies behind reverse proxies
app.set('trust proxy', 1);

// ✅ Proper CORS setup for all environments
const corsOptions = {
  // In production, we'll restrict origins
  origin: process.env.NODE_ENV === 'production'
    ? [
        // Add your production domains here
        process.env.FRONTEND_URL || 'https://skin-sxau.onrender.com',
        /\.onrender\.com$/  // Allow any onrender.com subdomain
      ]
    : [
        // In development, allow local development servers
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173'
      ],
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
};

app.use(cors(corsOptions));


// ✅ Parse JSON
app.use(express.json());
// ✅ Parse cookies for auth middleware
app.use(cookieParser());

// Determine the static files path based on environment
// For Render deployment, the path is /opt/render/project/src/client/build
// For local development, it's ../client/build relative to server directory
let buildPath = path.join(__dirname, '../client/build');

// Check if we're in Render environment
if (process.env.RENDER && fs.existsSync('/opt/render/project/src/client/build')) {
  buildPath = '/opt/render/project/src/client/build';
  console.log('🚀 Running in Render environment');
}

console.log('🔍 Static files path:', buildPath);

if (fs.existsSync(buildPath)) {
  console.log('✅ Build directory found');
  app.use(express.static(buildPath));
} else {
  console.log('❌ Build directory NOT found at:', buildPath);
  // Try alternative paths for build directory
  const altPaths = [
    path.join(__dirname, '../../client/build'),
    path.join(process.cwd(), 'client/build')
  ];
  
  for (const altPath of altPaths) {
    console.log('🔍 Trying alternative path:', altPath);
    if (fs.existsSync(altPath)) {
      console.log('✅ Build directory found at alternative path');
      app.use(express.static(altPath));
      buildPath = altPath; // Update buildPath to the working path
      break;
    }
  }
}

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/scans', ScanResultsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/health', healthRoutes);

// Function to serve index.html from the correct build path
const serveIndexHtml = (res) => {
  // First try using the established buildPath
  const indexPath = path.join(buildPath, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  // Try Render's path
  if (process.env.RENDER) {
    const renderPath = '/opt/render/project/src/client/build/index.html';
    if (fs.existsSync(renderPath)) {
      return res.sendFile(renderPath);
    }
  }
  
  // Try common alternatives
  const altPaths = [
    path.join(__dirname, '../client/build/index.html'),
    path.join(__dirname, '../../client/build/index.html'),
    path.join(process.cwd(), 'client/build/index.html')
  ];
  
  for (const altPath of altPaths) {
    if (fs.existsSync(altPath)) {
      return res.sendFile(altPath);
    }
  }
  
  // If we reach here, we couldn't find the file
  return res.status(404).send('React app not built. Please run: npm run build-client');
};

// Root route serves React app
app.get('/', (req, res) => {
  try {
    serveIndexHtml(res);
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
  try {
    serveIndexHtml(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

console.log('🔍 Environment variables:');
console.log('🔍 NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('🔍 PORT:', PORT);
console.log('🔍 MONGO_URI:', process.env.MONGO_URI ? '✅ Found' : '❌ Missing');
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
