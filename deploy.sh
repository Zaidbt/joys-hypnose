#!/bin/bash

# Build the application
npm run build

# Create the deployment directory structure
mkdir -p .next/standalone
mkdir -p .next/static

# Copy necessary files
cp -r .next/standalone/* .next/
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/
cp .env.local .next/standalone/
cp ecosystem.config.js .next/standalone/

# Create a deployment package
cd .next/standalone
zip -r ../../deployment.zip .

echo "Deployment package created: deployment.zip" 