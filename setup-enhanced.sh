#!/bin/bash

# Enhanced Setup Script for J&K Career Navigator
# Complete dynamic, data-driven architecture with Gemini API integration

echo "🚀 J&K Career Navigator - Enhanced Dynamic System Setup"
echo "======================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
        return 0
    else
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        return 1
    fi
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm is installed: $NPM_VERSION"
        return 0
    else
        print_error "npm is not installed. Please install npm and try again."
        return 1
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend || { print_error "Backend directory not found!"; exit 1; }
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Backend dependencies installed successfully"
    else
        print_error "Failed to install backend dependencies"
        return 1
    fi
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from .env.example..."
        if [ -f .env.example ]; then
            cp .env.example .env
            print_warning "Please update .env file with your actual configuration before proceeding"
        else
            print_warning "No .env.example found. You'll need to create .env manually"
        fi
    fi
    
    cd ..
    return 0
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend || { print_error "Frontend directory not found!"; exit 1; }
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        return 1
    fi
    
    cd ..
    return 0
}

# Initialize database
setup_database() {
    print_status "Setting up enhanced database..."
    
    cd backend || { print_error "Backend directory not found!"; exit 1; }
    
    # Run database setup
    print_status "Initializing dynamic schema and sample data..."
    node db/enhanced-database-manager.js setup
    
    if [ $? -eq 0 ]; then
        print_success "Database setup completed successfully"
    else
        print_warning "Database setup had issues - check your DATABASE_URL in .env"
        print_warning "You can run 'npm run db:setup' later to retry"
    fi
    
    cd ..
}

# Test backend API
test_backend() {
    print_status "Testing backend API..."
    
    cd backend || { print_error "Backend directory not found!"; exit 1; }
    
    # Start backend in background
    print_status "Starting backend server for testing..."
    npm start &
    BACKEND_PID=$!
    
    # Wait for server to start
    sleep 10
    
    # Test health endpoint
    print_status "Testing health endpoint..."
    HEALTH_RESPONSE=$(curl -s http://localhost:5002/health)
    
    if [[ $HEALTH_RESPONSE == *"healthy"* ]]; then
        print_success "Backend health check passed"
    else
        print_warning "Backend health check failed - server might need more time to start"
    fi
    
    # Test enhanced API endpoints
    print_status "Testing enhanced API endpoints..."
    
    # Test content blocks
    CONTENT_RESPONSE=$(curl -s http://localhost:5002/api/v1/content-blocks/)
    if [[ $CONTENT_RESPONSE == *"success"* ]]; then
        print_success "Content blocks API working"
    else
        print_warning "Content blocks API test failed"
    fi
    
    # Test careers API
    CAREERS_RESPONSE=$(curl -s http://localhost:5002/api/v1/careers)
    if [[ $CAREERS_RESPONSE == *"success"* ]]; then
        print_success "Careers API working"
    else
        print_warning "Careers API test failed"
    fi
    
    # Test Gemini API (might fail without internet)
    GEMINI_RESPONSE=$(curl -s http://localhost:5002/api/gemini/health)
    if [[ $GEMINI_RESPONSE == *"success"* ]]; then
        print_success "Gemini API integration working"
    else
        print_warning "Gemini API test failed - check internet connection"
    fi
    
    # Stop backend
    kill $BACKEND_PID 2>/dev/null
    print_status "Backend test completed"
    
    cd ..
}

# Create necessary directories and files
create_project_structure() {
    print_status "Ensuring project structure..."
    
    # Create logs directory
    mkdir -p logs
    
    # Create uploads directory (for future file uploads)
    mkdir -p uploads
    
    # Create .gitignore if it doesn't exist
    if [ ! -f .gitignore ]; then
        cat > .gitignore << EOF
# Dependencies
node_modules/
*/node_modules/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Build outputs
dist/
build/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Uploads
uploads/
EOF
        print_success "Created .gitignore file"
    fi
    
    # Create README if it doesn't exist
    if [ ! -f README.md ]; then
        cat > README.md << EOF
# J&K Career Navigator - Enhanced Dynamic System

A comprehensive, data-driven career guidance platform for Jammu & Kashmir with real-time content management and cryptocurrency integration.

## Features

- 🎯 Dynamic Content Management System
- 💰 Real-time Cryptocurrency Data (Gemini API)
- 🤖 AI-Powered Career Guidance
- 📊 Comprehensive Analytics & Reporting
- 🎓 Interactive Career Assessment Quiz
- 🏫 College and University Database
- 📱 Responsive Design with Tailwind CSS
- 🔐 Secure Authentication with Clerk

## Quick Start

1. Run the setup script: \`./setup-enhanced.sh\`
2. Start backend: \`cd backend && npm start\`
3. Start frontend: \`cd frontend && npm start\`
4. Open http://localhost:3000

## API Endpoints

- Enhanced API: http://localhost:5002/api/v1
- Gemini Crypto API: http://localhost:5002/api/gemini
- Health Check: http://localhost:5002/health

## Documentation

See the \`/docs\` directory for detailed documentation.
EOF
        print_success "Created README.md file"
    fi
}

# Create package.json scripts
update_package_scripts() {
    print_status "Updating package.json scripts..."
    
    cd backend || return 1
    
    # Add useful scripts to backend package.json
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts = {
        ...pkg.scripts,
        'start': 'node server.js',
        'dev': 'nodemon server.js',
        'test': 'node --test',
        'db:setup': 'node db/enhanced-database-manager.js setup',
        'db:schema': 'node db/enhanced-database-manager.js schema',
        'db:data': 'node db/enhanced-database-manager.js data',
        'db:validate': 'node db/enhanced-database-manager.js validate',
        'db:health': 'node db/enhanced-database-manager.js health'
    };
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    "
    
    print_success "Backend scripts updated"
    cd ..
    
    cd frontend || return 1
    
    # Add useful scripts to frontend package.json
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts = {
        ...pkg.scripts,
        'start': 'vite',
        'build': 'vite build',
        'preview': 'vite preview',
        'dev': 'vite --host',
        'test': 'vitest'
    };
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    "
    
    print_success "Frontend scripts updated"
    cd ..
}

# Display final instructions
display_final_instructions() {
    echo ""
    echo "🎉 Enhanced J&K Career Navigator Setup Complete!"
    echo "=============================================="
    echo ""
    echo -e "${GREEN}Next Steps:${NC}"
    echo ""
    echo "1. Configure Environment:"
    echo "   • Update backend/.env with your database URL and API keys"
    echo "   • Set CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY for authentication"
    echo "   • Set GEMINI_API_KEY for AI features"
    echo ""
    echo "2. Start the Development Servers:"
    echo "   • Backend:  cd backend && npm start"
    echo "   • Frontend: cd frontend && npm start"
    echo ""
    echo "3. Access the Application:"
    echo "   • Frontend: http://localhost:3000"
    echo "   • Backend API: http://localhost:5002"
    echo "   • API Health: http://localhost:5002/health"
    echo ""
    echo "4. Enhanced Features:"
    echo "   • Dynamic Content: http://localhost:5002/api/v1/content-blocks"
    echo "   • Crypto Prices: http://localhost:5002/api/gemini/prices"
    echo "   • Career Data: http://localhost:5002/api/v1/careers"
    echo ""
    echo "5. Database Management:"
    echo "   • Setup: npm run db:setup (in backend directory)"
    echo "   • Validate: npm run db:validate"
    echo "   • Health: npm run db:health"
    echo ""
    echo -e "${BLUE}Documentation:${NC}"
    echo "   • API Documentation: Check the /docs directory"
    echo "   • Component Documentation: Check frontend/src/components"
    echo ""
    echo -e "${YELLOW}Note:${NC} Make sure to update your .env file with actual credentials before starting!"
    echo ""
}

# Main setup process
main() {
    echo "Starting enhanced setup process..."
    echo ""
    
    # Check prerequisites
    check_node || exit 1
    check_npm || exit 1
    
    # Create project structure
    create_project_structure
    
    # Setup backend
    setup_backend || exit 1
    
    # Setup frontend
    setup_frontend || exit 1
    
    # Update package scripts
    update_package_scripts
    
    # Setup database
    setup_database
    
    # Test backend (optional)
    read -p "Do you want to test the backend API? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        test_backend
    fi
    
    # Display final instructions
    display_final_instructions
}

# Run main function
main
