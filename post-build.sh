#!/bin/bash
# post-build.sh - Ensures build files are available in various locations on Render

echo "� Running post-build script..."

# Source build directory
SOURCE_BUILD_DIR="client/build"

# Check if source build directory exists
if [ ! -d "$SOURCE_BUILD_DIR" ]; then
  echo "❌ ERROR: Source build directory not found at: $SOURCE_BUILD_DIR"
  echo "🔎 Current directory: $(pwd)"
  echo "📋 Directory contents: $(ls -la)"
  exit 1
fi

echo "✅ Source build directory found at: $SOURCE_BUILD_DIR"
echo "📋 Build directory contents: $(ls -la $SOURCE_BUILD_DIR | wc -l) files"

# Ensure build files are copied to the root /build directory for simpler path handling
echo "🔧 Creating root build directory..."
mkdir -p build
cp -r "$SOURCE_BUILD_DIR"/* build/
echo "✅ Copied build files to ./build directory"

# Define all potential locations Render might look for build files
RENDER_BUILD_PATHS=(
  "/opt/render/project/src/client/build"
  "/opt/render/project/src/build"
  "/opt/render/project/client/build" 
  "/opt/render/project/build"
)

# Try to create and copy to all potential Render paths
for target_path in "${RENDER_BUILD_PATHS[@]}"; do
  echo "� Setting up build path: $target_path"
  
  # Create parent directory
  parent_dir=$(dirname "$target_path")
  mkdir -p "$parent_dir" || { echo "⚠️ Could not create directory: $parent_dir"; }
  
  # Copy files
  if [ ! -d "$target_path" ]; then
    mkdir -p "$target_path"
    cp -r "$SOURCE_BUILD_DIR"/* "$target_path/" || { echo "⚠️ Could not copy to: $target_path"; }
    echo "✅ Copied build files to: $target_path"
  fi
done

# Create fallback in /tmp which is always writable
echo "� Creating fallback build in /tmp directory..."
mkdir -p /tmp/client-build
cp -r "$SOURCE_BUILD_DIR"/* /tmp/client-build/ || { echo "⚠️ Could not copy to /tmp/client-build"; }
echo "✅ Created fallback build in /tmp/client-build"

# Set environment variable
export REACT_APP_BUILD_PATH="$(pwd)/build"
echo "✅ Set REACT_APP_BUILD_PATH=$REACT_APP_BUILD_PATH"

echo "✅ Post-build setup completed successfully"
echo "� Deployment paths:"
for path in "./build" "$SOURCE_BUILD_DIR" "${RENDER_BUILD_PATHS[@]}" "/tmp/client-build"; do
  if [ -d "$path" ]; then
    echo "  ✅ $path: $(ls -la $path | wc -l) files"
  else
    echo "  ❌ $path: Not available"
  fi
done
