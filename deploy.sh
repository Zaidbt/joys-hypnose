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

# Create deployment directory if it doesn't exist
mkdir -p $REMOTE_DIR

# Navigate to the directory
cd $REMOTE_DIR

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

# Install PM2 if not already installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Start or restart the application with PM2
echo "🚀 Starting/Restarting the application..."
pm2 restart joys-hypnose || pm2 start npm --name "joys-hypnose" -- start

# Save PM2 process list
pm2 save

echo "✅ Deployment completed!"
ENDSSH