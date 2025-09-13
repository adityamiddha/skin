#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting Render deployment preparation...${NC}"

# 1. Check if we have uncommitted changes
echo -e "${YELLOW}Checking for uncommitted changes...${NC}"
if [[ -n $(git status -s) ]]; then
  echo -e "${GREEN}✅ Uncommitted changes found.${NC}"
else
  echo -e "${RED}No uncommitted changes found. Have you made the necessary changes?${NC}"
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Aborting.${NC}"
    exit 1
  fi
fi

# 2. Make sure build files are not tracked
echo -e "${YELLOW}Removing build files from git tracking...${NC}"
git rm -r --cached client/build 2>/dev/null || echo -e "${GREEN}✅ Build files already untracked.${NC}"

# 3. Add the updated files
echo -e "${YELLOW}Adding updated files...${NC}"
git add .gitignore package.json render.yaml README.md DEPLOYMENT.md

# 4. Commit the changes
echo -e "${YELLOW}Committing changes...${NC}"
git commit -m "Fix repository structure for Render deployment"

# 5. Instructions for pushing
echo -e "${GREEN}✅ Repository prepared for Render deployment!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Push changes to your repository:"
echo -e "   ${GREEN}git push origin main${NC}"
echo -e "2. Set up your web service on Render following instructions in DEPLOYMENT.md"
echo -e "3. Add required environment variables on Render"
echo
echo -e "${GREEN}Happy coding! 🎉${NC}"
