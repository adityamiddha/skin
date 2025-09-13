#!/usr/bin/env node

// This script helps debug Render deployment issues by detecting paths and environment

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('\n======= DEBUG INFO FOR RENDER DEPLOYMENT =======\n');

// Environment info
console.log('ENVIRONMENT:');
console.log('  Process CWD:', process.cwd());
console.log('  __dirname:', __dirname);
console.log('  Platform:', os.platform());
console.log('  Node version:', process.version);
console.log('  Environment variables:');
Object.keys(process.env)
  .filter(key => !key.includes('SECRET') && !key.includes('KEY') && !key.includes('TOKEN')) // Don't log sensitive data
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
  // Relative paths
  './client/build',
  './client/build/index.html',
  '../client/build',
  '../client/build/index.html',
  // Absolute paths based on cwd
  path.join(process.cwd(), 'client/build'),
  path.join(process.cwd(), 'client/build/index.html'),
  // Server relative paths
  path.join(__dirname, '../client/build'),
  path.join(__dirname, '../client/build/index.html'),
  path.join(__dirname, '../../client/build'),
  path.join(__dirname, '../../client/build/index.html'),
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

// List environment directories
console.log('\nDIRECTORY LISTINGS:');
[
  process.cwd(),
  path.join(process.cwd(), 'client'),
  '/opt/render/project/src',
  '/opt/render/project/src/client',
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

console.log('\n======= END DEBUG INFO =======\n');
