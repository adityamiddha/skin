/**
 * Production Deployment Server for Render
 * This server focuses on reliability and robustness for production deployment.
 */

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Log server startup details
console.log('🚀 Starting production server...');
console.log('📂 Current directory:', process.cwd());
console.log('📂 Server directory:', __dirname);
console.log('🔧 Node environment:', process.env.NODE_ENV);
console.log('🔧 PORT:', PORT);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Configure CORS
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Check against allowed origins
    const allowedOrigins = [
      process.env.FRONTEND_URL, 
      'https://skin-sxau.onrender.com', 
      'http://localhost:3000'
    ];
    
    if (allowedOrigins.includes(origin) || origin.endsWith('.onrender.com')) {
      callback(null, true);
    } else {
      callback(null, true); // In production, we'll allow all origins for now
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Import routes
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const scanResultsRoutes = require('./routes/scanResultsRoutes');
const aiRoutes = require('./routes/aiRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/scans', scanResultsRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      status: dbStatus
    }
  });
});

// Quick health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug route to see all paths
app.get('/api/debug/paths', (req, res) => {
  const buildPaths = [
    path.join(process.cwd(), 'client/build'),
    path.join(process.cwd(), 'build'),
    '/opt/render/project/src/client/build',
    '/opt/render/project/src/build',
    '/tmp/client-build'
  ];
  
  const results = {};
  
  buildPaths.forEach(buildPath => {
    try {
      const exists = fs.existsSync(buildPath);
      const files = exists ? fs.readdirSync(buildPath).slice(0, 10) : [];
      
      results[buildPath] = {
        exists,
        files
      };
    } catch (err) {
      results[buildPath] = {
        exists: false,
        error: err.message
      };
    }
  });
  
  res.json({
    cwd: process.cwd(),
    dirname: __dirname,
    buildPaths: results,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT
    }
  });
});

// Function to serve static files with fallback
const serveStaticFiles = () => {
  // List of potential build directories in order of preference
  const buildPaths = [
    path.join(process.cwd(), 'client/build'),
    path.join(process.cwd(), 'build'),
    '/opt/render/project/src/client/build',
    '/opt/render/project/src/build',
    '/tmp/client-build'
  ];
  
  let staticServed = false;
  
  // Try each path
  for (const buildPath of buildPaths) {
    try {
      if (fs.existsSync(buildPath) && fs.existsSync(path.join(buildPath, 'index.html'))) {
        console.log(`✅ Serving static files from: ${buildPath}`);
        app.use(express.static(buildPath));
        staticServed = true;
        break;
      }
    } catch (err) {
      console.error(`❌ Error checking build path ${buildPath}:`, err.message);
    }
  }
  
  if (!staticServed) {
    console.warn('⚠️ No build directory found. Using fallback HTML.');
    
    // Create a fallback directory
    const fallbackDir = '/tmp/fallback-build';
    try {
      if (!fs.existsSync(fallbackDir)) {
        fs.mkdirSync(fallbackDir, { recursive: true });
      }
      
      // Generate basic fallback HTML
      const fallbackHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SkinCare AI - Maintenance</title>
  <style>
    body { font-family: -apple-system, system-ui, sans-serif; line-height: 1.5; padding: 2rem; max-width: 800px; margin: 0 auto; }
    .header { margin-bottom: 2rem; border-bottom: 1px solid #eee; padding-bottom: 1rem; }
    .status { padding: 1rem; background: #f8f9fa; border-radius: 4px; margin: 1rem 0; }
    .footer { margin-top: 2rem; font-size: 0.9rem; color: #6c757d; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧴 SkinCare AI</h1>
  </div>
  <div class="content">
    <div class="status">
      <h2>Application Status</h2>
      <p>The API is running, but static files were not found.</p>
      <p>Please check server logs for more information.</p>
    </div>
    <div class="api-status">
      <h3>API Status</h3>
      <p>You can check the API health at: <a href="/api/health">/api/health</a></p>
    </div>
  </div>
  <div class="footer">
    <p>© ${new Date().getFullYear()} SkinCare AI</p>
  </div>
</body>
</html>`;
      
      fs.writeFileSync(path.join(fallbackDir, 'index.html'), fallbackHTML);
      console.log(`✅ Created fallback HTML at ${fallbackDir}/index.html`);
      
      app.use(express.static(fallbackDir));
    } catch (err) {
      console.error('❌ Error creating fallback HTML:', err.message);
    }
  }
  
  // Catch-all route handler
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // Find and serve index.html from one of our build paths
    for (const buildPath of buildPaths) {
      try {
        const indexPath = path.join(buildPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          return res.sendFile(indexPath);
        }
      } catch (err) {
        console.error(`Error checking ${buildPath}/index.html:`, err.message);
      }
    }
    
    // Fallback to the fallback HTML
    const fallbackPath = path.join('/tmp/fallback-build', 'index.html');
    try {
      if (fs.existsSync(fallbackPath)) {
        return res.sendFile(fallbackPath);
      }
    } catch (err) {
      console.error('Error serving fallback HTML:', err.message);
    }
    
    // Ultimate fallback: send a simple message
    res.send('SkinCare AI API is running, but the frontend is not available.');
  });
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI environment variable not set');
      return;
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
};

// Serve static files
serveStaticFiles();

// Start the server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Access your app at: http://localhost:${PORT}`);
  
  // Connect to MongoDB
  await connectDB();
});

module.exports = app;
