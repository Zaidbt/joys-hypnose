#!/bin/bash

# Remove Prisma files
rm -rf prisma/
rm -f .env

# Remove Sanity files
rm -rf sanity/
rm -rf sanity.config.ts
rm -rf sanity.cli.ts

# Uninstall dependencies
npm uninstall @prisma/client @sanity/image-url @sanity/vision next-sanity sanity
npm uninstall -D prisma

echo "Cleanup completed successfully!" 