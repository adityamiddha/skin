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

// Log current working directory and environment
console.log('🔍 Current working directory:', process.cwd());
console.log('🔍 Server directory:', __dirname);
console.log('🔍 Environment:', process.env.NODE_ENV);
console.log('🔍 Render environment:', process.env.RENDER ? 'Yes' : 'No');
console.log('🔍 Build path from env:', process.env.REACT_APP_BUILD_PATH || 'Not set');

// Check for environment variable first (highest priority)
if (process.env.REACT_APP_BUILD_PATH && fs.existsSync(process.env.REACT_APP_BUILD_PATH)) {
  buildPath = process.env.REACT_APP_BUILD_PATH;
  console.log(`🚀 Using build path from environment variable: ${buildPath}`);
}
// Check for temp directory that our post-build script creates
else if (fs.existsSync('/tmp/client-build')) {
  buildPath = '/tmp/client-build';
  console.log(`🚀 Using temp build directory: ${buildPath}`);
}
// Check for Render-specific paths first
const renderPaths = [
  '/opt/render/project/src/client/build',
  '/opt/render/project/client/build',
  '/opt/render/project/src/server/client/build',
  '/opt/render/project/src/client/build',
  '/opt/render/project/client/build',
  '/opt/build/client/build',
  path.join(process.cwd(), 'client/build'),
  path.join(process.cwd(), '../client/build')
];

// Check if any Render paths exist
for (const renderPath of renderPaths) {
  if (fs.existsSync(renderPath)) {
    buildPath = renderPath;
    console.log(`🚀 Found build directory at Render path: ${buildPath}`);
    break;
  }
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
    path.join(process.cwd(), 'client/build'),
    path.join(process.cwd(), '../client/build'),
    path.join(__dirname, '../client/build'),
    path.join(__dirname, '../../client/build'),
    path.join(__dirname, '../../../client/build'),
    path.join(__dirname, '../../../../client/build')
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
  
  // Try Render's paths
  const renderPaths = [
    '/opt/render/project/src/client/build/index.html',
    '/opt/render/project/client/build/index.html',
    '/opt/render/project/src/server/client/build/index.html',
    '/opt/render/project/src/client/build/index.html',
    '/opt/render/project/client/build/index.html',
    '/opt/build/client/build/index.html'
  ];
  
  for (const renderPath of renderPaths) {
    console.log('🔍 Trying Render index path:', renderPath);
    if (fs.existsSync(renderPath)) {
      console.log('✅ Found index.html at Render path');
      return res.sendFile(renderPath);
    }
  }
  
  // Try common alternatives
  const altPaths = [
    path.join(__dirname, '../client/build/index.html'),
    path.join(__dirname, '../../client/build/index.html'),
    path.join(__dirname, '../../../client/build/index.html'),
    path.join(__dirname, '../../../../client/build/index.html'),
    path.join(process.cwd(), 'client/build/index.html'),
    path.join(process.cwd(), '../client/build/index.html')
  ];
  
  for (const altPath of altPaths) {
    console.log('🔍 Trying alternative index path:', altPath);
    if (fs.existsSync(altPath)) {
      console.log('✅ Found index.html at alternative path');
      return res.sendFile(altPath);
    }
  }
  
  // If we reach here, we couldn't find the file
  console.log('❌ Could not find index.html in any location');
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
