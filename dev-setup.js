#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up SkinCare AI Project...\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log(`✅ Node.js version: ${nodeVersion.trim()}`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js first.');
  process.exit(1);
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('npm install', { cwd: './client', stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('\n📝 Creating .env file...');
  const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/skincare-ai

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created');
  console.log('⚠️  Please update the .env file with your actual credentials');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Update the .env file with your MongoDB and Cloudinary credentials');
console.log('2. Start MongoDB service');
console.log('3. Run the following commands to start the application:');
console.log('\n   # Terminal 1 - Start backend server');
console.log('   npm start');
console.log('\n   # Terminal 2 - Start frontend (development mode)');
console.log('   cd client && npm start');
console.log('\n   # Or build and serve frontend from backend');
console.log('   cd client && npm run build && cd .. && npm start');
console.log('\n🌐 Access the application:');
console.log('   - Frontend (dev): http://localhost:3000');
console.log('   - Backend API: http://localhost:5000');
console.log('   - Production: http://localhost:5000');

