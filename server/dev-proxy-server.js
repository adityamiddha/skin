/**
 * Development Proxy Server
 *
 * This server serves as a development proxy that:
 * 1. Forwards API requests to the backend server
 * 2. Serves React frontend from the development server
 * 3. Handles CORS automatically
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.DEV_PROXY_PORT || 8080;
const API_PORT = process.env.PORT || 5000;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;

// Proxy middleware options
const apiProxy = createProxyMiddleware('/api', {
  target: `http://localhost:${API_PORT}`,
  changeOrigin: true,
  cookieDomainRewrite: 'localhost',
  withCredentials: true,
  onProxyReq: (proxyReq, req, res) => {
    // Copy any cookies to the proxy request
    if (req.cookies) {
      const cookieString = Object.entries(req.cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');
      if (cookieString) {
        proxyReq.setHeader('Cookie', cookieString);
      }
    }
  },
});

// Frontend proxy middleware
const frontendProxy = createProxyMiddleware({
  target: `http://localhost:${FRONTEND_PORT}`,
  changeOrigin: true,
  ws: true, // Enable WebSocket proxying for hot module replacement
});

// Use the API proxy for any /api routes
app.use('/api', apiProxy);

// Use the frontend proxy for all other routes
app.use('/', frontendProxy);

// Start the proxy server
app.listen(PORT, () => {
  console.log(`
🚀 Development Proxy Server running on port ${PORT}

🔀 Proxying API requests to http://localhost:${API_PORT}
🔀 Proxying frontend requests to http://localhost:${FRONTEND_PORT}

📱 Access your app at: http://localhost:${PORT}
`);
});
