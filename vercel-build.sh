#!/bin/bash

# This script is used for Vercel deployment

# Install dependencies
npm install

# Build the client with ESLint disabled and CI=false to prevent warnings from being treated as errors
cd client
DISABLE_ESLINT_PLUGIN=true CI=false npm run build
cd ..

echo "Build completed successfully for Vercel deployment"
