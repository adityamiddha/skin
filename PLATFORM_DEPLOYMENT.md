# Platform-Specific Deployment Guides

This document provides detailed deployment instructions for specific platforms.

## Deploying to Render

Render is a cloud platform that makes it easy to deploy applications. Here's how to deploy your SkinCare AI application:

### Step 1: Create a Web Service

1. Sign up or log in to [Render](https://render.com)
2. Click on "New" and select "Web Service"
3. Connect your GitHub repository

### Step 2: Configure the Service

1. Name: `skincare-ai` (or your preferred name)
2. Environment: `Node`
3. Build Command: `./render-build.sh`
4. Start Command: `npm start`
5. Region: Choose the closest to your users
6. Branch: `main` (or your deployment branch)
7. Plan: Select an appropriate plan (Free tier works for testing)

### Step 3: Configure Environment Variables

Make sure to set the following environment variables in Render:

- `PORT`: 10000 (or any port, Render will assign its own port with $PORT)
- `NODE_ENV`: production
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret key
- `JWT_EXPIRES_IN`: 7d
- `JWT_COOKIE_EXPIRES_IN`: 7
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `FRONTEND_URL`: Your application URL (e.g., https://your-app.onrender.com)

You can add these by going to the "Environment" tab in your Render dashboard.

### Step 4: Deploy

Click "Create Web Service" and Render will automatically deploy your application.

### Troubleshooting Render Deployment

If you encounter issues during deployment on Render, try these solutions:

1. **Path-to-regexp errors**: We've addressed this by downgrading Express to version 4.18.2 in our package.json.render file.

2. **Build fails**: Check the build logs for specific errors. You may need to adjust the render-build.sh script.

3. **Application errors after deployment**: Check the logs in the Render dashboard to identify the issue.

4. **Static file serving issues**: Make sure your server.js is correctly set up to serve static files from the client/build directory.

5. **Environment variable issues**: Double-check that all required environment variables are set correctly in the Render dashboard.

6. **Port binding errors**: Render assigns its own port via the PORT environment variable, so make sure your application listens on process.env.PORT.

7. **Health check failures**: The application includes a health check endpoint at `/api/health` that can be used to verify the application is running correctly. You can set this as a health check URL in Render by going to the "Health" tab.

If issues persist, contact Render support or check their documentation for specific troubleshooting guidance.

## Deploying to Heroku

Heroku is another popular platform for deploying Node.js applications:

### Step 1: Prepare Your Application

1. Make sure you have the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
2. Login to Heroku:
   ```bash
   heroku login
   ```
3. Initialize a Git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Heroku deployment"
   ```

### Step 2: Create a Heroku Application

```bash
heroku create skincare-ai
```

### Step 3: Add Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set JWT_EXPIRES_IN=7d
heroku config:set JWT_COOKIE_EXPIRES_IN=7
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
heroku config:set CLOUDINARY_API_KEY=your_cloudinary_api_key
heroku config:set CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Step 4: Deploy to Heroku

```bash
git push heroku main
```

## Deploying to DigitalOcean App Platform

DigitalOcean's App Platform provides a simple way to deploy applications:

### Step 1: Create a New App

1. Log in to your DigitalOcean account
2. Navigate to the App Platform section
3. Click "Create App"
4. Select your GitHub repository

### Step 2: Configure the App

1. Select the repository and branch
2. Configure as a Web Service
3. Build Command: `npm run build`
4. Run Command: `npm start`

### Step 3: Add Environment Variables

Add all the environment variables from your `.env.production` file.

### Step 4: Finalize and Deploy

1. Choose a plan
2. Review settings
3. Click "Launch App"

## Deploying to AWS Elastic Beanstalk

AWS Elastic Beanstalk is a service for deploying and scaling web applications:

### Step 1: Install EB CLI

```bash
pip install awsebcli
```

### Step 2: Initialize EB CLI

```bash
eb init
```

Follow the prompts to configure your application.

### Step 3: Create Environment

```bash
eb create production-environment
```

### Step 4: Configure Environment Variables

Use the AWS Management Console to set environment variables.

### Step 5: Deploy

```bash
eb deploy
```

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Heroku Node.js Documentation](https://devcenter.heroku.com/categories/nodejs-support)
- [DigitalOcean App Platform Documentation](https://docs.digitalocean.com/products/app-platform/)
- [AWS Elastic Beanstalk Documentation](https://docs.aws.amazon.com/elasticbeanstalk/)
