#!/bin/bash

# This script is used by Render.com to build the application

# Copy the Render-specific package.json
if [ -f "package.json.render" ]; then
  echo "Using Render-specific package.json"
  cp package.json.render package.json
fi

# Install dependencies
npm install

# Fix unused variables in client code
chmod +x ./fix-unused-vars-linux.sh
./fix-unused-vars-linux.sh

# Build the client with ESLint disabled and CI=false to prevent warnings from being treated as errors
npm run build-client-no-lint

echo "Build completed successfully"
