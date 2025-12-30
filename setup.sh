#!/bin/bash
cd /home/maro/astro-portfolio

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Start dev server
echo "Starting development server..."
pnpm dev

