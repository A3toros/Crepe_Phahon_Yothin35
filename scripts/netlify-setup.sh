#!/bin/bash

# Netlify Setup Script for Crepe Phahon Yothin35
# This script helps set up Netlify CLI and deploy the application

echo "🍰 Crepe Phahon Yothin35 - Netlify Setup"
echo "========================================"

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -D netlify-cli
else
    echo "✅ Netlify CLI is installed"
fi

# Check if user is logged in
echo "🔐 Checking Netlify authentication..."
if ! netlify status &> /dev/null; then
    echo "🔑 Please login to Netlify:"
    netlify login
else
    echo "✅ Already logged in to Netlify"
fi

# Check if site is linked
echo "🔗 Checking site link..."
if ! netlify status &> /dev/null; then
    echo "🔗 Linking to Netlify site..."
    echo "Choose an option:"
    echo "1) Link to existing site"
    echo "2) Create new site"
    read -p "Enter choice (1 or 2): " choice
    
    case $choice in
        1)
            netlify link
            ;;
        2)
            netlify init
            ;;
        *)
            echo "Invalid choice. Exiting."
            exit 1
            ;;
    esac
else
    echo "✅ Site is already linked"
fi

# Build the application
echo "🏗️ Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Deploy to preview
echo "🚀 Deploying to preview..."
netlify deploy

if [ $? -eq 0 ]; then
    echo "✅ Preview deployment successful"
    echo "🌐 Preview URL: $(netlify status --json | jq -r '.site.url')"
else
    echo "❌ Preview deployment failed"
    exit 1
fi

# Ask if user wants to deploy to production
read -p "🚀 Deploy to production? (y/n): " deploy_prod

if [ "$deploy_prod" = "y" ] || [ "$deploy_prod" = "Y" ]; then
    echo "🚀 Deploying to production..."
    netlify deploy --prod
    
    if [ $? -eq 0 ]; then
        echo "✅ Production deployment successful"
        echo "🌐 Production URL: $(netlify status --json | jq -r '.site.url')"
    else
        echo "❌ Production deployment failed"
        exit 1
    fi
else
    echo "ℹ️ Skipping production deployment"
fi

echo "🎉 Setup complete!"
echo "📊 View your site: netlify open"
echo "📋 Check status: netlify status"
echo "📝 View logs: netlify logs"
