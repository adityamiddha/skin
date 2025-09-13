# 🧴 SkinCare AI Project - Deployment Guide

## 📋 Deployment on Render

This project is configured for easy deployment on [Render](https://render.com). Follow these steps to deploy:

### Step 1: Fork/Clone the Repository
Make sure you have a clean copy of the repository without build files committed.

### Step 2: Create a New Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the following settings:
   - **Name**: skincare-ai (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm run start:render`

### Step 3: Configure Environment Variables
Add the following environment variables in the Render dashboard:
- `NODE_ENV`: production
- `PORT`: 3000
- `RENDER`: true
- `REACT_APP_BUILD_PATH`: /opt/render/project/src/build
- `FALLBACK_ENABLED`: true
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT tokens
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

### Step 4: Deploy
Click "Create Web Service" and Render will automatically deploy your application.

## 🖥️ Local Development

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Python 3.8+ (for AI model)
- Cloudinary account

### Setup
1. Clone the repository
2. Run the setup script: `npm run setup`
3. Update the `.env` file with your credentials
4. Start the development servers:
   ```
   npm run dev:all
   ```
   
### Alternative Development Modes
- Backend only: `npm run dev`
- Frontend only: `cd client && npm start`
- Production build locally: `npm run build-and-start`

## 📁 Project Structure
- `/client`: React frontend
- `/server`: Express backend
- `/ai-model`: Python AI model
- `/utils`: Shared utility functions

## 📚 Available Scripts
- `npm run dev`: Start backend in development mode
- `npm run dev:frontend`: Start frontend in development mode
- `npm run dev:all`: Start both frontend and backend
- `npm run build`: Build the project for production
- `npm run start`: Run the production server
- `npm run start:render`: Run the specialized Render server
- `npm run render-build`: Build script for Render deployment
- `npm run health-check`: Check API health status
- `npm run debug-paths`: Debug build path issues
- `npm run debug-render`: Debug Render deployment issues

## 🔧 Specialized Render Deployment

This project includes several specialized components for robust deployment on Render:

### 1. Specialized Render Server
The `render-server.js` file provides:
- Enhanced path detection for build files
- Fallback HTML generation when build files aren't found
- Comprehensive health check endpoints
- Better error handling for deployment

### 2. Fallback Mechanism
If build files can't be found in the expected locations:
- The server will generate a fallback HTML page
- Basic functionality will still be available
- API health will be displayed
- Users will be informed of the deployment status

### 3. Post-Build Script
The `post-build.sh` script runs after the build to:
- Copy build files to multiple potential locations
- Create symbolic links for easier access
- Set environment variables for path detection
- Create a temporary fallback location in `/tmp`
- Copy build files to the root `/build` directory for easier access

### 4. Build Path Strategy
The application implements multiple fallback mechanisms to find build files:
- Tries multiple potential paths where build files might be located
- Uses environment variables to specify build paths
- Creates symbolic links to ensure accessibility
- Maintains a backup copy in `/tmp` directory
- Creates a copy in the root `/build` directory

### 5. Health Check Routes
The application includes several health check endpoints:
- `/api/health`: Comprehensive health check for all components
- `/health`: Quick status check
- `/api/debug/paths`: Debug information about build paths

### Debugging Render Deployment
If you encounter issues with deployment:
1. Check the Render logs for path detection information
2. Access the health check endpoints
3. Try using the fallback server: `npm run start:render`
4. Verify that the post-build script executed correctly
5. Run the debug-render.js script to see file paths
