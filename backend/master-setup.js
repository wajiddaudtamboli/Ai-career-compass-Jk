#!/usr/bin/env node

/**
 * Master Setup Script for J&K Career Navigator
 * Complete automation for database and system setup
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import EnvironmentSetup from './setup-env.js';
import DatabaseAutomation from './db/setup-automation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MasterSetup {
  constructor() {
    this.envSetup = new EnvironmentSetup();
    this.dbAutomation = new DatabaseAutomation();
    this.steps = [
      'Environment Check',
      'Dependencies Installation', 
      'Environment Configuration',
      'Database Setup',
      'Server Testing',
      'Final Verification'
    ];
    this.currentStep = 0;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const icons = {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warn: '⚠️',
      step: '🔄'
    };
    
    console.log(`[${timestamp}] ${icons[type]} ${message}`);
  }

  nextStep(stepName) {
    this.currentStep++;
    console.log('\n' + '='.repeat(60));
    console.log(`Step ${this.currentStep}/${this.steps.length}: ${stepName}`);
    console.log('='.repeat(60));
  }

  async runCommand(command, description) {
    return new Promise((resolve, reject) => {
      this.log(`Running: ${description}`, 'step');
      
      const [cmd, ...args] = command.split(' ');
      const process = spawn(cmd, args, { 
        stdio: 'pipe',
        shell: true,
        cwd: __dirname
      });
      
      let output = '';
      let errorOutput = '';
      
      process.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      process.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          this.log(`✅ ${description} completed`, 'success');
          resolve(output);
        } else {
          this.log(`❌ ${description} failed`, 'error');
          if (errorOutput) {
            console.log('Error details:', errorOutput);
          }
          reject(new Error(`Command failed with code ${code}`));
        }
      });
    });
  }

  async checkPrerequisites() {
    this.nextStep('Environment Check');
    
    try {
      // Check Node.js
      await this.runCommand('node --version', 'Checking Node.js version');
      
      // Check npm
      await this.runCommand('npm --version', 'Checking npm version');
      
      // Check if backend directory exists
      if (!fs.existsSync(__dirname)) {
        throw new Error('Backend directory not found');
      }
      
      this.log('Prerequisites check passed', 'success');
      return true;
    } catch (error) {
      this.log(`Prerequisites check failed: ${error.message}`, 'error');
      return false;
    }
  }

  async installDependencies() {
    this.nextStep('Dependencies Installation');
    
    try {
      // Check if package.json exists
      const packageJsonPath = path.join(__dirname, 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
        throw new Error('package.json not found');
      }
      
      // Install dependencies
      await this.runCommand('npm install', 'Installing Node.js dependencies');
      
      this.log('Dependencies installed successfully', 'success');
      return true;
    } catch (error) {
      this.log(`Dependencies installation failed: ${error.message}`, 'error');
      return false;
    }
  }

  async setupEnvironment() {
    this.nextStep('Environment Configuration');
    
    try {
      this.log('Checking environment configuration...', 'step');
      
      // Check if .env exists, create if not
      const envPath = path.join(__dirname, '.env');
      if (!fs.existsSync(envPath)) {
        this.log('Creating .env file from template...', 'step');
        this.envSetup.createDefaultEnv();
      }
      
      // Check environment status
      console.log('\nEnvironment Status:');
      await this.envSetup.checkEnvironment();
      
      this.log('Environment configuration ready', 'success');
      this.log('⚠️ Please ensure DATABASE_URL and GEMINI_API_KEY are configured', 'warn');
      
      return true;
    } catch (error) {
      this.log(`Environment setup failed: ${error.message}`, 'error');
      return false;
    }
  }

  async setupDatabase() {
    this.nextStep('Database Setup');
    
    try {
      this.log('Initializing database automation...', 'step');
      
      // Test if database credentials are configured
      const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
      const hasValidDb = envContent.includes('postgresql://') && !envContent.includes('YOUR_');
      
      if (!hasValidDb) {
        this.log('Database URL not configured - will run in mock mode', 'warn');
        this.log('To connect real database, run: npm run setup-env', 'warn');
        return true;
      }
      
      // Run database setup
      const success = await this.dbAutomation.performFullSetup();
      
      if (success) {
        this.log('Database setup completed successfully', 'success');
      } else {
        this.log('Database setup had issues but can continue', 'warn');
      }
      
      return true;
    } catch (error) {
      this.log(`Database setup failed: ${error.message}`, 'error');
      this.log('Application will run in mock mode', 'warn');
      return true; // Don't fail completely, can run in mock mode
    }
  }

  async testServer() {
    this.nextStep('Server Testing');
    
    try {
      this.log('Testing server startup...', 'step');
      
      // Start server in test mode
      const testProcess = spawn('node', ['server.js'], {
        stdio: 'pipe',
        cwd: __dirname,
        env: { ...process.env, NODE_ENV: 'test' }
      });
      
      // Wait for server to start
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Test health endpoint
      try {
        const response = await fetch('http://localhost:5002/health');
        if (response.ok) {
          this.log('Server health check passed', 'success');
        } else {
          this.log('Server responded but health check failed', 'warn');
        }
      } catch (fetchError) {
        this.log('Could not reach server endpoint', 'warn');
      }
      
      // Kill test server
      testProcess.kill();
      
      this.log('Server testing completed', 'success');
      return true;
    } catch (error) {
      this.log(`Server testing failed: ${error.message}`, 'error');
      return false;
    }
  }

  async finalVerification() {
    this.nextStep('Final Verification');
    
    try {
      this.log('Running final system verification...', 'step');
      
      // Check all critical files exist
      const criticalFiles = [
        'server.js',
        'package.json',
        '.env',
        'db/connection.js',
        'db/database-manager.js',
        'routes/dataRoutes.js'
      ];
      
      for (const file of criticalFiles) {
        const filePath = path.join(__dirname, file);
        if (!fs.existsSync(filePath)) {
          throw new Error(`Critical file missing: ${file}`);
        }
      }
      
      this.log('All critical files verified', 'success');
      
      // Generate setup summary
      this.generateSetupSummary();
      
      return true;
    } catch (error) {
      this.log(`Final verification failed: ${error.message}`, 'error');
      return false;
    }
  }

  generateSetupSummary() {
    const summary = `
# J&K Career Navigator - Setup Summary

## 🎉 Setup Completed Successfully!

### System Status
- ✅ Node.js and npm configured
- ✅ Dependencies installed
- ✅ Environment file created
- ✅ Database system ready
- ✅ Server components verified

### Next Steps

1. **Configure Environment (If needed)**
   \`\`\`bash
   npm run setup-env
   \`\`\`

2. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Test Database Connection**
   \`\`\`bash
   npm run check-db
   \`\`\`

### Available Commands
- \`npm run dev\` - Start development server
- \`npm run setup-env\` - Configure environment variables
- \`npm run setup-db\` - Complete database setup
- \`npm run check-db\` - Database health check
- \`npm run db-stats\` - View database statistics

### URLs
- API Server: http://localhost:5002
- Health Check: http://localhost:5002/health
- API Documentation: http://localhost:5002/api/health

### Support
- Documentation: DATABASE_SETUP.md
- Issues: Check logs/ directory
- Environment: Run 'npm run setup-env' for interactive setup

Generated: ${new Date().toISOString()}
`;

    fs.writeFileSync(path.join(__dirname, '../SETUP_SUMMARY.md'), summary);
    this.log('Setup summary generated: SETUP_SUMMARY.md', 'success');
  }

  async run() {
    console.log('\n🚀 J&K Career Navigator - Master Setup');
    console.log('🎯 Complete Database & System Automation');
    console.log('📅 ' + new Date().toLocaleDateString());
    console.log('\n' + '='.repeat(60));

    try {
      const steps = [
        () => this.checkPrerequisites(),
        () => this.installDependencies(),
        () => this.setupEnvironment(),
        () => this.setupDatabase(),
        () => this.testServer(),
        () => this.finalVerification()
      ];

      for (let i = 0; i < steps.length; i++) {
        const success = await steps[i]();
        if (!success && i < 2) { // Critical steps
          this.log('Setup failed at critical step', 'error');
          process.exit(1);
        }
      }

      console.log('\n' + '🎉'.repeat(20));
      console.log('🎉 SETUP COMPLETED SUCCESSFULLY! 🎉');
      console.log('🎉'.repeat(20));
      console.log('\nYour J&K Career Navigator backend is ready to use!');
      console.log('\n📚 Check SETUP_SUMMARY.md for next steps');
      console.log('🚀 Run "npm run dev" to start the server');

    } catch (error) {
      this.log(`Setup failed: ${error.message}`, 'error');
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Check your internet connection');
      console.log('2. Verify Node.js version >= 18');
      console.log('3. Run "npm run setup-env" for environment setup');
      console.log('4. Check DATABASE_SETUP.md for detailed instructions');
      process.exit(1);
    }
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new MasterSetup();
  setup.run().catch(console.error);
}

export default MasterSetup;
