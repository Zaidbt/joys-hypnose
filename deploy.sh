#!/bin/bash

# Configuration
SERVER="root@77.37.122.81"
REMOTE_DIR="/var/www/joyshypnose"
REPO_URL="https://github.com/Zaidbt/joys-hypnose.git"

echo "🚀 Starting deployment process..."

# First, push local changes to GitHub
echo "📤 Pushing local changes to GitHub..."
git add .
git commit -m "Deployment update $(date +%Y-%m-%d_%H-%M-%S)" || true
git push

echo "🚀 Deploying to $SERVER..."

# Connect to the server and execute deployment commands
ssh $SERVER << 'ENDSSH'
# Configuration
REMOTE_DIR="/var/www/joyshypnose"
REPO_URL="https://github.com/Zaidbt/joys-hypnose.git"
UPLOADS_BACKUP="/var/www/uploads_backup"

# Create deployment directory if it doesn't exist
mkdir -p $REMOTE_DIR
mkdir -p $UPLOADS_BACKUP

# Navigate to the directory
cd $REMOTE_DIR

# Backup existing uploads if they exist
if [ -d "public/uploads" ]; then
    echo "📦 Backing up existing uploads..."
    cp -r public/uploads/* $UPLOADS_BACKUP/
fi

# Check if the repository exists
if [ ! -d ".git" ]; then
    echo "📦 Cloning repository..."
    git clone $REPO_URL .
else
    echo "⬇️ Pulling latest changes..."
    git fetch --all
    git reset --hard origin/main
fi

# Install dependencies
echo "📚 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

# Create uploads directory and restore uploads
echo "📦 Restoring uploads..."
mkdir -p public/uploads
mkdir -p .next/standalone/public/uploads
if [ -d "$UPLOADS_BACKUP" ]; then
    cp -r $UPLOADS_BACKUP/* public/uploads/
    cp -r $UPLOADS_BACKUP/* .next/standalone/public/uploads/
fi

# Copy public directory to standalone output
echo "📦 Copying public directory to standalone output..."
cp -r public/* .next/standalone/public/

# Install PM2 if not already installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Start or restart the application with PM2
echo "🚀 Starting/Restarting the application..."
pm2 delete joys-hypnose || true
pm2 start npm --name "joys-hypnose" -- start

# Save PM2 process list
pm2 save

echo "✅ Deployment completed!"
ENDSSH