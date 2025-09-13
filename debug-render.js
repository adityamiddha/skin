#!/usr/bin/env node

// This script helps debug Render deployment issues by detecting paths and environment

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

console.log('\n======= DEBUG INFO FOR RENDER DEPLOYMENT =======\n');

// Environment info
console.log('ENVIRONMENT:');
console.log('  Process CWD:', process.cwd());
console.log('  __dirname:', __dirname);
console.log('  Platform:', os.platform());
console.log('  Node version:', process.version);
console.log('  Environment variables:');
Object.keys(process.env)
  .filter(key => !key.includes('SECRET') && !key.includes('KEY') && !key.includes('TOKEN') && !key.includes('PASSWORD')) // Don't log sensitive data
  .forEach(key => {
    console.log(`    ${key}=${process.env[key]}`);
  });

// Check for Render specific environment
console.log('\nRENDER DETECTION:');
console.log('  RENDER env var:', process.env.RENDER ? 'Set' : 'Not set');
console.log('  Is Render environment:', process.env.RENDER === 'true' ? 'Yes' : 'No');
console.log('  Is production environment:', process.env.NODE_ENV === 'production' ? 'Yes' : 'No');

// Path checks
console.log('\nPATH CHECKS:');
const pathsToCheck = [
  // Render specific paths
  '/opt/render/project/src/client/build',
  '/opt/render/project/src/client/build/index.html',
  '/opt/render/project/client/build',
  '/opt/render/project/client/build/index.html',
  '/opt/render/project/src/server/client/build',
  '/opt/render/project/src/server/client/build/index.html',
  '/opt/build/client/build',
  '/opt/build/client/build/index.html',
  // New paths we're trying
  '/opt/render/project/src/build',
  '/opt/render/project/src/build/index.html',
  '/opt/render/project/build',
  '/opt/render/project/build/index.html',
  // Temp location
  '/tmp/client-build',
  '/tmp/client-build/index.html',
  '/tmp/fallback-build',
  '/tmp/fallback-build/index.html',
  // Relative paths
  './client/build',
  './client/build/index.html',
  './build',
  './build/index.html',
  '../client/build',
  '../client/build/index.html',
  // Absolute paths based on cwd
  path.join(process.cwd(), 'client/build'),
  path.join(process.cwd(), 'client/build/index.html'),
  path.join(process.cwd(), 'build'),
  path.join(process.cwd(), 'build/index.html'),
  path.join(process.cwd(), '../client/build'),
  path.join(process.cwd(), '../client/build/index.html'),
  // Server relative paths
  path.join(__dirname, '../client/build'),
  path.join(__dirname, '../client/build/index.html'),
  path.join(__dirname, '../../client/build'),
  path.join(__dirname, '../../client/build/index.html'),
  path.join(__dirname, '../../../client/build'),
  path.join(__dirname, '../../../client/build/index.html'),
  path.join(__dirname, '../../../../client/build'),
  path.join(__dirname, '../../../../client/build/index.html'),
  // Temp path checks
  '/tmp/build-check/build',
  '/tmp/build-check/build/index.html',
  '/tmp/client-build-link',
  '/tmp/client-build-link/index.html'
];

pathsToCheck.forEach(pathToCheck => {
  try {
    const exists = fs.existsSync(pathToCheck);
    console.log(`  ${pathToCheck}: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
    
    if (exists) {
      const stats = fs.statSync(pathToCheck);
      console.log(`    Type: ${stats.isDirectory() ? 'Directory' : 'File'}`);
      console.log(`    Size: ${stats.size} bytes`);
      console.log(`    Modified: ${stats.mtime}`);
      
      if (stats.isDirectory()) {
        try {
          const files = fs.readdirSync(pathToCheck);
          console.log(`    Contains ${files.length} files/directories`);
          if (files.length < 10) {
            console.log(`    Contents: ${files.join(', ')}`);
          }
        } catch (err) {
          console.log(`    Error reading directory: ${err.message}`);
        }
      }
    }
  } catch (err) {
    console.log(`  ${pathToCheck}: ERROR - ${err.message}`);
  }
});

// Try to create symbolic links to help Render find the build
try {
  console.log('\nCREATING SYMBOLIC LINKS:');
  const symlinkTargets = [
    { from: path.join(process.cwd(), 'client/build'), to: '/opt/render/project/src/client/build' },
    { from: path.join(process.cwd(), 'client/build'), to: '/opt/render/project/client/build' }
  ];
  
  for (const { from, to } of symlinkTargets) {
    try {
      // Ensure parent directory exists
      const parentDir = path.dirname(to);
      if (!fs.existsSync(parentDir)) {
        console.log(`  Creating parent directory: ${parentDir}`);
        execSync(`mkdir -p ${parentDir}`);
      }
      
      // Only create symlink if target exists and symlink doesn't
      if (fs.existsSync(from) && !fs.existsSync(to)) {
        console.log(`  Creating symlink from ${from} to ${to}`);
        fs.symlinkSync(from, to, 'dir');
        console.log('  ✅ Symlink created successfully');
      } else if (!fs.existsSync(from)) {
        console.log(`  ❌ Cannot create symlink: source ${from} does not exist`);
      } else if (fs.existsSync(to)) {
        console.log(`  ⚠️ Destination ${to} already exists`);
      }
    } catch (err) {
      console.log(`  ❌ Error creating symlink ${from} to ${to}: ${err.message}`);
    }
  }
} catch (err) {
  console.log(`  ❌ Error during symlink creation: ${err.message}`);
}

// List environment directories
console.log('\nDIRECTORY LISTINGS:');
[
  process.cwd(),
  path.join(process.cwd(), 'client'),
  path.join(process.cwd(), 'client/build'),
  path.join(process.cwd(), 'server'),
  '/opt/render/project',
  '/opt/render/project/src',
  '/opt/render/project/src/client',
  '/opt/render',
  '/opt'
].forEach(dirPath => {
  try {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      console.log(`  ${dirPath}:`);
      console.log(`    Contains ${files.length} files/directories`);
      console.log(`    Contents: ${files.slice(0, 15).join(', ')}${files.length > 15 ? '...' : ''}`);
    } else {
      console.log(`  ${dirPath}: NOT FOUND`);
    }
  } catch (err) {
    console.log(`  ${dirPath}: ERROR - ${err.message}`);
  }
});

// Try to copy the build directory to standard locations
try {
  console.log('\nCOPYING BUILD FILES:');
  if (fs.existsSync(path.join(process.cwd(), 'client/build'))) {
    const copyTargets = [
      '/opt/render/project/src/client/build',
      '/opt/render/project/client/build'
    ];
    
    for (const target of copyTargets) {
      try {
        // Create the parent directory if it doesn't exist
        const parentDir = path.dirname(target);
        if (!fs.existsSync(parentDir)) {
          console.log(`  Creating directory: ${parentDir}`);
          execSync(`mkdir -p ${parentDir}`);
        }
        
        // Copy the build directory if it doesn't exist at the target
        if (!fs.existsSync(target)) {
          console.log(`  Copying build to: ${target}`);
          execSync(`cp -r ${path.join(process.cwd(), 'client/build')} ${target}`);
          console.log('  ✅ Build files copied successfully');
        } else {
          console.log(`  ⚠️ Target already exists: ${target}`);
        }
      } catch (err) {
        console.log(`  ❌ Error copying to ${target}: ${err.message}`);
      }
    }
  } else {
    console.log('  ❌ Source build directory not found');
  }
} catch (err) {
  console.log(`  ❌ Error during copy operation: ${err.message}`);
}

console.log('\n======= END DEBUG INFO =======\n');
