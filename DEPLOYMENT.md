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
   - **Start Command**: `npm start`

### Step 3: Configure Environment Variables
Add the following environment variables in the Render dashboard:
- `NODE_ENV`: production
- `PORT`: 5000
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
- `npm run render-build`: Build script for Render deployment
