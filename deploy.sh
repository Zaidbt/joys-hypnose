#!/bin/bash

# Stop any running PM2 processes
pm2 stop all

# Pull latest changes
git pull

# Install dependencies
npm install

# Build the application
npm run build

# Start the application with PM2
pm2 start npm --name "joys-hypnose" -- start

# Save PM2 process list
pm2 save

# Display status
pm2 status 