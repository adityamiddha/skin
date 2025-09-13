# 🧴 SkinCare AI Project - Deployment Guide

## 📋 Simplified Deployment on Render

This project is configured for reliable deployment on [Render](https://render.com) with a focus on simplicity and robustness.

### Step 1: Repository Setup
- Fork/clone the repository
- Ensure build files are not committed to Git

### Step 2: Create Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the following settings:
   - **Name**: skincare-ai (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm run start:deploy`

### Step 3: Configure Environment Variables
Add the following environment variables in the Render dashboard:
- `NODE_ENV`: production
- `PORT`: 3000
- `RENDER`: true
- `REACT_APP_BUILD_PATH`: /opt/render/project/src/build
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT tokens
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

### Step 4: Deploy
Click "Create Web Service" and Render will automatically deploy your application.

## 🔧 Deployment Architecture

### Key Components

1. **deploy-server.js**: A simplified, production-focused server that:
   - Reliably serves static files from multiple potential locations
   - Provides fallback HTML when build files can't be found
   - Includes comprehensive health check endpoints
   - Handles MongoDB connection errors gracefully

2. **post-build.sh**: A robust script that:
   - Copies build files to multiple locations
   - Creates a root-level `/build` directory
   - Creates a fallback in `/tmp/client-build` directory
   - Sets environment variables

3. **Build Path Strategy**:
   - Multiple fallback paths for maximum reliability
   - Environment variable configuration
   - Temporary fallback directory
   - Root-level `/build` directory

### Debugging Tools

- `/api/health`: Check application health status
- `/api/debug/paths`: View all build paths and their status
- `npm run debug-render`: Run detailed diagnostics
- `npm run debug-paths`: Check file paths

## 🖥️ Local Development

### Setup
1. Clone the repository
2. Run `npm run setup` to set up environment variables
3. Start development with `npm run dev:all`

### Development Scripts
- `npm run dev`: Start backend only
- `npm run dev:frontend`: Start frontend only
- `npm run dev:all`: Start both with proxy
- `npm run build`: Build the entire application
- `npm run build-and-start`: Build and start in production mode

## 📝 Troubleshooting

### Build Files Not Found
If the application shows the fallback page:
1. Check Render logs for build path information
2. Verify the post-build.sh script executed successfully
3. Check if files exist in the `/build` directory

### MongoDB Connection Issues
If the database connection fails:
1. Verify the MONGO_URI environment variable
2. Check MongoDB Atlas network access settings
3. The API will still function with fallback behavior

### Health Checks
Use these endpoints to verify application status:
- `/health`: Simple status check
- `/api/health`: Detailed health information
- `/api/debug/paths`: Build path diagnostics
