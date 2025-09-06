#!/usr/bin/env node

/**
 * Environment Configuration Helper for J&K Career Navigator
 * This script helps set up environment variables correctly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class EnvironmentSetup {
  constructor() {
    this.envPath = path.join(__dirname, '.env');
    this.envExamplePath = path.join(__dirname, '.env.example');
  }

  async setupEnvironment() {
    console.log('🔧 J&K Career Navigator - Environment Setup');
    console.log('='.repeat(50));
    console.log('');

    // Check if .env exists
    if (!fs.existsSync(this.envPath)) {
      console.log('📄 Creating .env file...');
      this.createDefaultEnv();
    }

    console.log('Current environment status:');
    await this.checkEnvironment();
    console.log('');

    const needsSetup = await this.askQuestion('Do you want to configure environment variables now? (y/n): ');
    
    if (needsSetup.toLowerCase() === 'y' || needsSetup.toLowerCase() === 'yes') {
      await this.interactiveSetup();
    } else {
      this.showManualInstructions();
    }

    rl.close();
  }

  createDefaultEnv() {
    const defaultEnv = `# Backend Environment Variables
PORT=5002
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Gemini AI API Key - Get from https://makersuite.google.com/app/apikey
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Neon PostgreSQL Database - Get from https://console.neon.tech
# Format: postgresql://username:password@host/database?sslmode=require
DATABASE_URL=YOUR_NEON_DATABASE_URL_HERE

# Clerk Authentication - Get from https://clerk.com
CLERK_PUBLISHABLE_KEY=pk_test_placeholder
CLERK_SECRET_KEY=sk_test_placeholder

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Contact Information
CONTACT_EMAIL=your-email@example.com
CONTACT_PHONE=+91-XXXXXXXXXX
CONTACT_ADDRESS=Your Address, J&K, India
`;

    fs.writeFileSync(this.envPath, defaultEnv);
    console.log('✅ .env file created with default values');
  }

  async checkEnvironment() {
    if (!fs.existsSync(this.envPath)) {
      console.log('❌ .env file not found');
      return;
    }

    const envContent = fs.readFileSync(this.envPath, 'utf8');
    const lines = envContent.split('\n');
    const variables = {};

    for (const line of lines) {
      if (line.includes('=') && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        variables[key.trim()] = valueParts.join('=').trim();
      }
    }

    const checks = [
      { key: 'DATABASE_URL', required: true, placeholder: 'YOUR_NEON_DATABASE_URL_HERE' },
      { key: 'GEMINI_API_KEY', required: true, placeholder: 'YOUR_GEMINI_API_KEY_HERE' },
      { key: 'CLERK_SECRET_KEY', required: false, placeholder: 'sk_test_placeholder' },
      { key: 'PORT', required: true, placeholder: null }
    ];

    for (const check of checks) {
      const value = variables[check.key];
      const isConfigured = value && value !== check.placeholder && !value.includes('YOUR_');
      const status = isConfigured ? '✅' : (check.required ? '❌' : '⚠️');
      const label = check.required ? 'Required' : 'Optional';
      
      console.log(`${status} ${check.key}: ${isConfigured ? 'Configured' : 'Not configured'} (${label})`);
    }
  }

  async interactiveSetup() {
    console.log('\n🔧 Interactive Environment Setup');
    console.log('-'.repeat(35));

    // Database URL
    console.log('\n📊 Database Configuration (Neon PostgreSQL)');
    console.log('1. Sign up at https://console.neon.tech');
    console.log('2. Create a new project');
    console.log('3. Copy the connection string');
    console.log('Format: postgresql://username:password@host/database?sslmode=require');
    
    const databaseUrl = await this.askQuestion('\nEnter your Neon database URL (or press Enter to skip): ');
    if (databaseUrl.trim()) {
      this.updateEnvVariable('DATABASE_URL', databaseUrl.trim());
    }

    // Gemini API Key
    console.log('\n🤖 AI Configuration (Google Gemini)');
    console.log('1. Go to https://makersuite.google.com/app/apikey');
    console.log('2. Create an API key');
    console.log('3. Copy the key');
    
    const geminiKey = await this.askQuestion('\nEnter your Gemini API key (or press Enter to skip): ');
    if (geminiKey.trim()) {
      this.updateEnvVariable('GEMINI_API_KEY', geminiKey.trim());
    }

    // Clerk (Optional)
    const setupClerk = await this.askQuestion('\nDo you want to configure Clerk authentication? (y/n): ');
    if (setupClerk.toLowerCase() === 'y') {
      console.log('\n🔐 Authentication Configuration (Clerk)');
      console.log('1. Sign up at https://clerk.com');
      console.log('2. Create a new application');
      console.log('3. Copy the keys from your dashboard');
      
      const clerkSecret = await this.askQuestion('\nEnter your Clerk secret key: ');
      if (clerkSecret.trim()) {
        this.updateEnvVariable('CLERK_SECRET_KEY', clerkSecret.trim());
      }
    }

    console.log('\n✅ Environment setup completed!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run setup-db');
    console.log('2. Run: npm run dev');
  }

  updateEnvVariable(key, value) {
    const envContent = fs.readFileSync(this.envPath, 'utf8');
    const lines = envContent.split('\n');
    let updated = false;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith(`${key}=`)) {
        lines[i] = `${key}=${value}`;
        updated = true;
        break;
      }
    }

    if (!updated) {
      lines.push(`${key}=${value}`);
    }

    fs.writeFileSync(this.envPath, lines.join('\n'));
    console.log(`✅ Updated ${key}`);
  }

  showManualInstructions() {
    console.log('\n📝 Manual Setup Instructions');
    console.log('-'.repeat(30));
    console.log('');
    console.log('1. Edit the .env file in backend/ directory');
    console.log('2. Replace placeholder values with actual credentials:');
    console.log('   - DATABASE_URL: Your Neon PostgreSQL connection string');
    console.log('   - GEMINI_API_KEY: Your Google Gemini API key');
    console.log('   - CLERK_SECRET_KEY: Your Clerk secret key (optional)');
    console.log('');
    console.log('3. Get credentials from:');
    console.log('   - Neon Database: https://console.neon.tech');
    console.log('   - Gemini API: https://makersuite.google.com/app/apikey');
    console.log('   - Clerk Auth: https://clerk.com');
    console.log('');
    console.log('4. After configuration, run: npm run setup-db');
  }

  askQuestion(question) {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new EnvironmentSetup();
  setup.setupEnvironment().catch(console.error);
}

export default EnvironmentSetup;
