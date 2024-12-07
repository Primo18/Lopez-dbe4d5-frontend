#!/bin/bash

echo "Setting up the NoteApp Frontend..."

# Step 0: Check and install pnpm if not installed
if ! command -v pnpm &> /dev/null
then
    echo "pnpm not found, installing..."
    npm install -g pnpm
else
    echo "pnpm is already installed."
fi

# Step 1: Install dependencies
echo "Installing dependencies..."
pnpm install

# Step 2: Create the .env file
echo "Creating .env file..."
cat <<EOT > .env
VITE_BASE_URL=https://lopez-dbe4d5-backend.onrender.com/api
EOT

echo ".env file created."

# Step 3: Start the frontend development server
echo "Starting the frontend development server..."
pnpm dev

echo "Frontend setup complete! Open http://localhost:5173 in your browser to view the app."
