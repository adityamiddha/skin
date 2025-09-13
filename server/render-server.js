/**
 * This is a specialized server file for Render deployment.
 * It focuses on robustness with simplified static file serving.
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { fallbackHTML } = require('./fallbackReact');

// Import routes
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const ScanResultsRoutes = require('./routes/scanResultsRoutes');
const aiRoutes = require('./routes/aiRoutes');
const healthRoutes = require('./routes/healthRoutes');

// Create Express app
const app = express();

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Trust proxy for Render
app.set('trust proxy', 1);

// Configure CORS
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    const allowedOrigins = [
      process.env.FRONTEND_URL, 
      'https://skin-sxau.onrender.com', 
      'http://localhost:3000'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.onrender.com')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
};
app.use(cors(corsOptions));

// Body parsers
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/scans', ScanResultsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/health', healthRoutes);

// Environment logs
console.log('🔍 Environment Information:');
console.log('- Working Directory:', process.cwd());
console.log('- Server Directory:', __dirname);
console.log('- Node Environment:', process.env.NODE_ENV);
console.log('- Port:', process.env.PORT || 5000);

// Ensure build directory is valid and serve static files
let staticFilesServed = false;

// Function to try serving static files from a directory
const tryServeStatic = (directory) => {
  if (staticFilesServed || !directory) return false;
  
  try {
    if (fs.existsSync(directory)) {
      console.log(`✅ Serving static files from: ${directory}`);
      app.use(express.static(directory));
      staticFilesServed = true;
      return true;
    }
  } catch (error) {
    console.error(`❌ Error checking ${directory}:`, error.message);
  }
  return false;
};

// Try serving static files from multiple potential locations
const potentialBuildPaths = [
  // Environment variable
  process.env.REACT_APP_BUILD_PATH,
  // Render specific paths
  '/opt/render/project/src/client/build',
  '/opt/render/project/client/build',
  '/opt/render/project/src/server/client/build',
  // Local paths
  path.join(__dirname, '../client/build'),
  path.join(__dirname, '../../client/build'),
  path.join(process.cwd(), 'client/build'),
  // Root paths
  path.join(process.cwd(), 'build'),
  // Absolute root-relative paths (Render specific)
  '/opt/render/project/src/build',
  // Fallback paths
  '/tmp/client-build',
  '/tmp/fallback-build'
];

// Try each path
for (const buildPath of potentialBuildPaths) {
  if (tryServeStatic(buildPath)) break;
}

// If no static files could be served, log warning
if (!staticFilesServed) {
  console.warn('⚠️ Could not find a valid build directory. Fallback HTML will be used.');
}

// Create fallback directory as a last resort
const fallbackDir = '/tmp/fallback-build';
try {
  if (!fs.existsSync(fallbackDir)) {
    fs.mkdirSync(fallbackDir, { recursive: true });
  }
  
  const fallbackPath = path.join(fallbackDir, 'index.html');
  fs.writeFileSync(fallbackPath, fallbackHTML);
  console.log(`✅ Created fallback HTML at ${fallbackPath}`);
  
  // Only serve from fallback if no other directory worked
  if (!staticFilesServed) {
    app.use(express.static(fallbackDir));
    staticFilesServed = true;
  }
} catch (error) {
  console.error('❌ Error creating fallback directory:', error.message);
}

// Serve React app (with fallback)
const serveReactApp = (req, res) => {
  // Try each potential location for index.html
  for (const buildPath of potentialBuildPaths) {
    try {
      if (!buildPath) continue;
      
      const indexPath = path.join(buildPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }
    } catch (error) {
      console.error(`Error checking ${buildPath}/index.html:`, error.message);
    }
  }
  
  // Try the fallback HTML file
  try {
    const fallbackPath = path.join(fallbackDir, 'index.html');
    if (fs.existsSync(fallbackPath)) {
      return res.sendFile(fallbackPath);
    }
  } catch (error) {
    console.error('Error serving fallback HTML file:', error.message);
  }
  
  // If all else fails, serve the HTML string directly
  res.send(fallbackHTML);
};

// Root route - serves React app
app.get('/', serveReactApp);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});

// Catch-all route for SPA
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // Serve the React app for all other routes
  serveReactApp(req, res);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Access your app at: http://localhost:${PORT}`);
  
  // Connect to MongoDB
  if (process.env.MONGO_URI) {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log('✅ MongoDB connected successfully'))
      .catch(err => console.error('❌ MongoDB connection error:', err));
  } else {
    console.log('❌ MONGO_URI not found in environment variables');
  }
});

module.exports = app;
