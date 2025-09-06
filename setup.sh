#!/bin/bash

# AI Career Compass J&K Setup Script
# This script helps set up the complete application with all dependencies

echo "🚀 Setting up AI Career Compass J&K..."
echo "=================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
echo "✅ Backend dependencies installed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install @clerk/clerk-react axios lucide-react
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✅ Frontend dependencies installed"

# Copy environment files
echo "⚙️ Setting up environment files..."

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Backend .env file created from example"
    echo "⚠️ Please update backend/.env with your actual values:"
    echo "   - DATABASE_URL (Neon PostgreSQL connection string)"
    echo "   - CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY"
    echo "   - GEMINI_API_KEY is already set"
else
    echo "ℹ️ Backend .env file already exists"
fi

if [ ! -f frontend/.env ]; then
    echo "✅ Frontend .env file already exists"
else
    echo "ℹ️ Frontend .env file already exists"
fi

# Database setup instructions
echo ""
echo "🗄️ Database Setup Instructions:"
echo "================================"
echo "1. Create a Neon PostgreSQL database at https://neon.tech"
echo "2. Copy the connection string to backend/.env as DATABASE_URL"
echo "3. Run the schema: psql \$DATABASE_URL -f database/schema.sql"
echo "4. Load sample data: psql \$DATABASE_URL -f database/sample_data.sql"

# Clerk setup instructions
echo ""
echo "🔐 Clerk Authentication Setup:"
echo "=============================="
echo "1. Create a Clerk account at https://clerk.com"
echo "2. Create a new application"
echo "3. Copy your publishable key to:"
echo "   - backend/.env as CLERK_PUBLISHABLE_KEY"
echo "   - frontend/.env as VITE_CLERK_PUBLISHABLE_KEY"
echo "4. Copy your secret key to backend/.env as CLERK_SECRET_KEY"

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo "Next steps:"
echo "1. Update your environment variables as mentioned above"
echo "2. Set up your Neon database and run the SQL files"
echo "3. Configure Clerk authentication"
echo "4. Start the backend: cd backend && npm run dev"
echo "5. Start the frontend: cd frontend && npm run dev"
echo ""
echo "📧 Contact: wajiddaudtamboli123@gmail.com"
echo "📞 Phone: 9667033839"
echo "🏫 Address: N.K. Orchid College of Engineering and Technology, Solapur"
