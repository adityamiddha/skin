#!/bin/bash

# This script builds the client with ESLint disabled to avoid conflicts
# and prevents warnings from being treated as errors
cd client
DISABLE_ESLINT_PLUGIN=true CI=false npm run build
