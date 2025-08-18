#!/bin/sh

# Set default port if not provided
export PORT=${PORT:-8080}

# Print environment info for debugging
echo "=== Deployment Info ==="
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Port: $PORT"
echo "Working directory: $(pwd)"
echo "Files in current directory:"
ls -la
echo "========================"

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "ERROR: dist directory not found! Build may have failed."
    exit 1
fi

# Start the application
echo "Starting application on port $PORT..."
npm start
