#!/bin/bash

# This script builds the client with ESLint disabled to avoid conflicts
cd client
DISABLE_ESLINT_PLUGIN=true npm run build
