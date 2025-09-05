const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001; // Different port to avoid conflicts

console.log('🚀 Starting test server...');

// Basic route
app.get('/', (req, res) => {
  res.send('Hello! Test server is working!');
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working!', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  console.log(`🌐 Open your browser and go to: http://localhost:${PORT}`);
});

