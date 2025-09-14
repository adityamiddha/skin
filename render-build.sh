#!/bin/bash

# This script is used by Render.com to build the application

# Copy the Render-specific package.json
if [ -f "package.json.render" ]; then
  echo "Using Render-specific package.json"
  cp package.json.render package.json
fi

# Install dependencies
npm install

# Build the client with ESLint disabled
npm run build-client-no-lint

echo "Build completed successfully"
