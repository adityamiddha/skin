const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

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
  process.exit(1);
}

// API routes (simplified for now)
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Serve React app for all routes
app.use((req, res) => {
  console.log('🌐 Serving React app for:', req.path);
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving React app from: ${buildPath}`);
  console.log(`🌐 Open your browser and go to: http://localhost:${PORT}`);
});

// Handle errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});
