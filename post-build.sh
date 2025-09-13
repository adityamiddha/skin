#!/bin/bash

# This script helps ensure the build directory is available in all potential locations Render might look

echo "🔍 Post-build directory setup..."

# The build directory that should exist after the build process
SOURCE_BUILD_DIR="client/build"

if [ ! -d "$SOURCE_BUILD_DIR" ]; then
  echo "❌ Source build directory not found at: $SOURCE_BUILD_DIR"
  exit 1
fi

echo "✅ Source build directory found at: $SOURCE_BUILD_DIR"

# Define all the potential locations Render might look for the build directory
RENDER_BUILD_PATHS=(
  "/opt/render/project/src/client/build"
  "/opt/render/project/client/build"
  "/opt/render/project/src/server/client/build"
  "/opt/build/client/build"
)

# Create parent directories and copy build files
for target_path in "${RENDER_BUILD_PATHS[@]}"; do
  echo "🔍 Checking target path: $target_path"
  
  # Create parent directory if it doesn't exist
  parent_dir=$(dirname "$target_path")
  if [ ! -d "$parent_dir" ]; then
    echo "  Creating parent directory: $parent_dir"
    mkdir -p "$parent_dir" || { echo "❌ Failed to create directory: $parent_dir"; continue; }
  fi
  
  # Copy the build directory if it doesn't exist at target
  if [ ! -d "$target_path" ]; then
    echo "  Copying build files to: $target_path"
    cp -r "$SOURCE_BUILD_DIR" "$parent_dir/" || { echo "❌ Failed to copy to: $target_path"; continue; }
    echo "  ✅ Build files copied successfully to: $target_path"
  else
    echo "  ⚠️ Target already exists: $target_path"
  fi
done

# Try to create symbolic links as an alternative approach
echo "🔍 Creating symbolic links..."
for target_path in "${RENDER_BUILD_PATHS[@]}"; do
  if [ ! -d "$target_path" ] && [ ! -L "$target_path" ]; then
    echo "  Creating symbolic link to: $target_path"
    ln -sf "$(pwd)/$SOURCE_BUILD_DIR" "$target_path" || echo "❌ Failed to create symlink to: $target_path"
  fi
done

# Create temporary build location in /tmp which is always writable
TMP_BUILD_DIR="/tmp/client-build"
echo "🔍 Creating temporary build location: $TMP_BUILD_DIR"
mkdir -p "$TMP_BUILD_DIR" || { echo "❌ Failed to create temp directory"; }
cp -r "$SOURCE_BUILD_DIR"/* "$TMP_BUILD_DIR/" || { echo "❌ Failed to copy to temp directory"; }

# Copy build files to a location that Render will definitely see
echo "🔍 Copying build files to current directory for absolute paths"
mkdir -p "./build" || { echo "❌ Failed to create ./build directory"; }
cp -r "$SOURCE_BUILD_DIR"/* "./build/" || { echo "❌ Failed to copy to ./build"; }

# Set environment variable in the current session (will need to be propagated to child processes)
export REACT_APP_BUILD_PATH="$(pwd)/$SOURCE_BUILD_DIR"
echo "✅ Set environment variable: REACT_APP_BUILD_PATH=$REACT_APP_BUILD_PATH"

# List all the directories where we attempted to place build files
echo "🔍 Build directories:"
for target_path in "${RENDER_BUILD_PATHS[@]}"; do
  if [ -d "$target_path" ] || [ -L "$target_path" ]; then
    echo "  ✅ $target_path: $(ls -la "$target_path" | wc -l) files"
  else
    echo "  ❌ $target_path: Not available"
  fi
done

echo "✅ Post-build setup completed"
