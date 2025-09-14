# 🧴 SkinCare AI Project - Deployment Guide

This guide provides instructions for both local development and production deployment.

## 📋 Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Cloudinary account (for image upload functionality)

### Step 1: Clone the Repository
```bash
git clone https://github.com/adityamiddha/skin.git
cd skin
```

### Step 2: Setup Environment Variables
Create a `.env` file in the root directory with the following variables:
```
NODE_ENV=development
PORT=4000
FRONTEND_PORT=3000
DEV_PROXY_PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Alternatively, run the setup script:
```bash
npm run setup
```

### Step 3: Install Dependencies
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client && npm install
```

### Step 4: Run the Application

#### Development Mode
To run both the frontend and backend in development mode:
```bash
npm run dev:all
```

This will start:
- Backend server on port 4000
- Frontend dev server on port 3000
- A proxy server on port 8080 that routes API requests to the backend

#### Individual Components
To run the backend only:
```bash
npm run dev
```

To run the frontend only:
```bash
npm run dev:frontend
```

## 🚀 Production Deployment

### Prerequisites
- Node.js v16+ installed on the server
- MongoDB Atlas account or other MongoDB hosting service
- Cloudinary account for image storage
- Domain name (optional, but recommended)

### Option 1: Manual Deployment

#### Step 1: Prepare Your Environment

1. Clone the repository to your server:
   ```bash
   git clone https://github.com/adityamiddha/skin.git
   cd skin
   ```

2. Create a production `.env` file:
   ```bash
   cp .env.production.example .env
   ```

3. Edit the `.env` file with your production values:
   - Set `NODE_ENV=production`
   - Set `PORT` to your desired port (default is 4000)
   - Set `FRONTEND_URL` to your production domain
   - Update MongoDB connection string
   - Set a strong, secure `JWT_SECRET`
   - Add your Cloudinary credentials

#### Step 2: Build and Deploy

1. Install dependencies and build the application:
   ```bash
   npm run build
   ```

2. Start the application:
   ```bash
   npm run production
   ```

   Alternatively, you can use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server/server.js --name "skin-care-ai"
   ```

#### Step 3: Setting Up with Reverse Proxy (Optional but Recommended)

For production environments, it's recommended to use a reverse proxy like Nginx:

1. Install Nginx:
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. Create an Nginx configuration file:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. Enable SSL with Let's Encrypt:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

### Option 2: Cloud Deployment

#### Render Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment Variables: Add all variables from your `.env.production.example` file

#### Heroku Deployment

1. Create a new app on Heroku
2. Connect your GitHub repository
3. Set environment variables in the Heroku dashboard
4. Deploy the application

## 🛠️ Available Scripts

- `npm run dev`: Run backend in development mode
- `npm run dev:frontend`: Run frontend in development mode
- `npm run dev:proxy`: Run proxy server for development
- `npm run dev:all`: Run all components in development mode
- `npm run setup`: Setup environment variables
- `npm run build-client`: Build the frontend
- `npm run build`: Install dependencies and build the frontend
- `npm run build-and-start`: Build and run in production mode
- `npm run production`: Run in production mode
- `npm start`: Start the production server

## 📁 Project Structure

- `/client`: React frontend
- `/server`: Express backend
  - `/controllers`: API controllers
  - `/middlewares`: Express middlewares
  - `/models`: Mongoose models
  - `/routes`: API routes
- `/utils`: Shared utility functions

## ⚠️ Important Production Considerations

1. **Security**:
   - Use a strong JWT secret in production
   - Ensure MongoDB connection is secure
   - Keep API keys and secrets safe

2. **Performance**:
   - Consider using a CDN for static assets
   - Implement caching where appropriate

3. **Monitoring**:
   - Set up monitoring for your application
   - Configure logging for debugging

4. **Backup**:
   - Regularly backup your MongoDB database
