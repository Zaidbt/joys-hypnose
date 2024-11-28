#!/bin/bash

# Exit on error
set -e

# Load environment variables
set -a
source .env.production
set +a

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building Next.js application..."
npm run build

# Create ecosystem file for PM2
echo "Creating PM2 ecosystem file..."
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [
    {
      name: 'joys-hypnose',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
        HOSTNAME: '0.0.0.0',
        NEXTAUTH_URL: '${NEXTAUTH_URL}',
        NEXTAUTH_SECRET: '${NEXTAUTH_SECRET}',
        ADMIN_EMAIL: '${ADMIN_EMAIL}',
        MONGODB_URI: '${MONGODB_URI}'
      },
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
}
EOL

# Copy environment file to standalone directory
echo "Copying environment file..."
cp .env.production .next/standalone/.env.production

# Ensure correct permissions
echo "Setting correct permissions..."
chmod 755 .next/standalone
chmod 755 .next/static

# Create backup of current deployment if it exists
if [ -d "/var/www/joys-hypnose" ]; then
  echo "Creating backup of current deployment..."
  timestamp=$(date +%Y%m%d_%H%M%S)
  mv /var/www/joys-hypnose "/var/www/joys-hypnose_backup_$timestamp"
fi

echo "Deployment script completed successfully!" 