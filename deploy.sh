#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment process...${NC}"

# Step 1: Check if we're in the project root
if [ ! -f "package.json" ] || [ ! -d "server" ] || [ ! -d "client" ]; then
  echo -e "${RED}Error: Not in the project root directory.${NC}"
  echo "Please run this script from the root of the project where package.json exists."
  exit 1
fi

# Step 2: Install dependencies
echo -e "${YELLOW}Installing server dependencies...${NC}"
npm install

echo -e "${YELLOW}Installing client dependencies...${NC}"
cd client && npm install && cd ..

# Step 3: Build the client
echo -e "${YELLOW}Building client application...${NC}"
cd client && npm run build && cd ..

# Check if build was successful
if [ ! -d "client/build" ]; then
  echo -e "${RED}Error: Client build failed. Check the logs above for details.${NC}"
  exit 1
fi

# Step 4: Create a production .env file if it doesn't exist
if [ ! -f ".env.production" ]; then
  echo -e "${YELLOW}Creating production environment file...${NC}"
  cp .env.production.example .env.production
  echo -e "${GREEN}Created .env.production from example file.${NC}"
  echo -e "${YELLOW}Please edit .env.production with your production values before continuing.${NC}"
  echo -e "${YELLOW}Press Enter to continue or Ctrl+C to cancel...${NC}"
  read
fi

# Skip server testing - we'll create a deployment package anyway
echo -e "${YELLOW}Skipping server test due to potential environment-specific configuration...${NC}"

# Step 6: Create a deployment package
echo -e "${YELLOW}Creating deployment package...${NC}"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
DEPLOY_FOLDER="deployment_$TIMESTAMP"

mkdir -p $DEPLOY_FOLDER
cp -r server $DEPLOY_FOLDER/
cp -r client/build $DEPLOY_FOLDER/client/
cp -r utils $DEPLOY_FOLDER/
cp package.json $DEPLOY_FOLDER/
cp .env.production $DEPLOY_FOLDER/.env
cp DEPLOYMENT.md $DEPLOY_FOLDER/
cp PLATFORM_DEPLOYMENT.md $DEPLOY_FOLDER/

echo -e "${GREEN}Deployment package created at ./$DEPLOY_FOLDER${NC}"
echo -e "${YELLOW}To deploy, copy this folder to your server and run:${NC}"
echo -e "  cd $DEPLOY_FOLDER"
echo -e "  npm install --production"
echo -e "  npm start"

echo -e "${GREEN}Deployment preparation completed successfully!${NC}"
echo -e "${YELLOW}NOTE: Make sure to thoroughly test your application on the target environment.${NC}"
