#!/bin/bash

echo "Stopping PM2 processes..."
pm2 stop all
pm2 delete all
pm2 save

echo "Backing up .env file if it exists..."
if [ -f .env ]; then
    cp .env ../env_backup_$(date +%Y%m%d)
    echo "Backed up .env file"
fi

echo "Cleaning up old files..."
cd ..
rm -rf joys-hypnose
mkdir joys-hypnose
cd joys-hypnose

echo "Initializing fresh Git repository..."
git init
git remote add origin <your-repo-url>
git fetch
git checkout main

echo "Cleanup complete! Ready for fresh deployment."
echo "Don't forget to restore your .env file from backup if needed." 