const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint for the application
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Check MongoDB connection
    const dbStatus = mongoose.connection.readyState === 1 
      ? 'connected' 
      : mongoose.connection.readyState === 2 
        ? 'connecting' 
        : 'disconnected';
    
    // Check environment variables
    const envCheck = {
      nodeEnv: process.env.NODE_ENV || 'not set',
      port: process.env.PORT || 'not set',
      mongoUri: process.env.MONGO_URI ? 'set' : 'not set',
      jwtSecret: process.env.JWT_SECRET ? 'set' : 'not set',
      cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'not set',
      cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ? 'set' : 'not set',
      cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'not set',
    };
    
    // Check disk space
    let diskSpace = 'unknown';
    try {
      const { execSync } = require('child_process');
      diskSpace = execSync('df -h / | tail -1 | awk \'{print $5}\'', { encoding: 'utf8' }).trim();
    } catch (err) {
      diskSpace = 'error checking';
    }
    
    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const formatMemory = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB';
    
    const healthStatus = {
      status: 'online',
      timestamp: new Date().toISOString(),
      uptime: process.uptime() + ' seconds',
      server: {
        node: process.version,
        platform: process.platform,
        memory: {
          rss: formatMemory(memoryUsage.rss),
          heapTotal: formatMemory(memoryUsage.heapTotal),
          heapUsed: formatMemory(memoryUsage.heapUsed),
          external: formatMemory(memoryUsage.external)
        },
        diskUsage: diskSpace,
      },
      database: {
        status: dbStatus,
        name: mongoose.connection.name || 'not connected'
      },
      environment: envCheck
    };
    
    res.json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
