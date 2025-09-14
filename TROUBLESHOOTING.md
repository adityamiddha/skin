# Troubleshooting Deployment Issues

This document provides solutions for common deployment issues.

## ESLint Conflicts During Build

If you encounter ESLint conflicts during the build process, especially on platforms like Render, try the following solutions:

### Problem: ESLint Plugin Conflicts

Error message example:
```
Failed to compile.
[eslint] Plugin "react" was conflicted between "../.eslintrc.js" and "BaseConfig » /opt/render/project/src/client/node_modules/eslint-config-react-app/base.js".
```

This happens because the root-level ESLint configuration conflicts with the Create React App's built-in ESLint configuration.

### Solutions:

1. **Use the no-lint build scripts**:
   ```bash
   # For local development
   npm run build-no-lint
   
   # For production
   npm run production-no-lint
   ```

2. **For Render deployment**:
   The `render-build.sh` script has been updated to use the no-lint build process automatically.

3. **Manually disable ESLint during build**:
   ```bash
   # Set this environment variable before building
   DISABLE_ESLINT_PLUGIN=true npm run build
   ```

## Client Build Issues

If you encounter other build issues with the React client:

1. **Clear node_modules and reinstall**:
   ```bash
   cd client
   rm -rf node_modules
   npm install
   ```

2. **Check for dependency conflicts**:
   ```bash
   npm ls react react-dom
   ```

3. **Check for browser compatibility issues**:
   The browserslist configuration in client/package.json determines which browsers your build supports. More browser support can lead to larger bundle sizes.

## Server Start Issues

If the server fails to start after deployment:

1. **Check environment variables**:
   Make sure all required environment variables are set correctly.

2. **Check port configuration**:
   Ensure the server is configured to listen on the port provided by the platform (usually available as `process.env.PORT`).

3. **Check logs**:
   Most platforms provide access to application logs, which can help identify the cause of startup failures.

## Database Connection Issues

If your application can't connect to MongoDB:

1. **Check MongoDB connection string**:
   Ensure the connection string is correctly formatted and includes the username, password, and database name.

2. **Check MongoDB network access**:
   Make sure your deployment platform's IP addresses are allowed in MongoDB Atlas (or your MongoDB provider).

3. **Test the connection locally**:
   ```bash
   mongosh "your-connection-string"
   ```

## File Upload Issues

If Cloudinary image uploads aren't working:

1. **Check Cloudinary credentials**:
   Verify that CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set correctly.

2. **Check request size limits**:
   Some deployment platforms limit the size of incoming requests. Check if your uploads exceed these limits.
