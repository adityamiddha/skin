/**
 * This file contains a minimal React application that can be used as a fallback
 * when the static build files cannot be found on Render.
 */

// A basic but complete HTML structure for the fallback React app
const fallbackHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="SkinCare AI Application" />
  <title>SkinCare AI</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: #f8f9fa;
    }
    .app {
      text-align: center;
      padding: 20px;
    }
    .header {
      background-color: #ffffff;
      border-bottom: 1px solid #e1e4e8;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .content {
      max-width: 800px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      font-size: 2rem;
      color: #333;
    }
    .status {
      margin: 20px 0;
      padding: 15px;
      border-radius: 4px;
    }
    .status.error {
      background-color: #ffebee;
      color: #c62828;
      border: 1px solid #ef9a9a;
    }
    .status.success {
      background-color: #e8f5e9;
      color: #2e7d32;
      border: 1px solid #a5d6a7;
    }
    .message {
      font-size: 1.1rem;
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .actions {
      margin-top: 30px;
    }
    .button {
      display: inline-block;
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      margin: 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      text-decoration: none;
    }
    .button:hover {
      background-color: #0056b3;
    }
    .button.secondary {
      background-color: #6c757d;
    }
    .button.secondary:hover {
      background-color: #5a6268;
    }
    .api-status {
      margin-top: 30px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 4px;
      border: 1px solid #e1e4e8;
    }
    .footer {
      margin-top: 40px;
      padding: 20px;
      color: #6c757d;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="app">
      <header class="header">
        <h1>🧴 SkinCare AI</h1>
      </header>
      <main class="content">
        <div class="status error">
          <p>We're experiencing some technical difficulties with our frontend application.</p>
        </div>
        
        <div class="message">
          <p>The server is running, but we couldn't find the static files for the React application.</p>
          <p>This is a temporary fallback page to provide essential functionality.</p>
        </div>
        
        <div class="api-status">
          <h2>API Status</h2>
          <p id="api-message">Checking API status...</p>
          <div id="api-details"></div>
        </div>
        
        <div class="actions">
          <a href="/api/health" class="button">Check API Health</a>
          <a href="/test" class="button secondary">Test API</a>
        </div>
      </main>
      <footer class="footer">
        <p>© ${new Date().getFullYear()} SkinCare AI. All rights reserved.</p>
      </footer>
    </div>
  </div>
  <script>
    // Simple function to check API health
    async function checkApiHealth() {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        
        document.getElementById('api-message').textContent = 
          data.status === 'online' ? '✅ API is online and working correctly' : '⚠️ API is responding but may have issues';
        
        // Display some details from the health check
        const details = document.createElement('div');
        
        if (data.database && data.database.status) {
          const dbStatus = document.createElement('p');
          dbStatus.textContent = 'Database: ' + (data.database.status === 'connected' ? '✅ Connected' : '❌ Not connected');
          details.appendChild(dbStatus);
        }
        
        if (data.environment) {
          const envStatus = document.createElement('p');
          envStatus.textContent = 'Environment: ' + data.environment.nodeEnv;
          details.appendChild(envStatus);
        }
        
        document.getElementById('api-details').appendChild(details);
      } catch (error) {
        document.getElementById('api-message').textContent = '❌ API health check failed: ' + error.message;
      }
    }
    
    // Run API health check when page loads
    window.addEventListener('DOMContentLoaded', checkApiHealth);
  </script>
</body>
</html>`;

module.exports = { fallbackHTML };
