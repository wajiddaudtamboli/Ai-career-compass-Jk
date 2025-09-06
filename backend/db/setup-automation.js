#!/usr/bin/env node

/**
 * Comprehensive Database Setup Script for J&K Career Navigator
 * This script handles complete database automation including:
 * - Connection testing
 * - Schema creation
 * - Data seeding
 * - Index optimization
 * - Backup/restore
 * - Health monitoring
 */

import DatabaseManager from './database-manager.js';
import { testConnection, healthCheck } from './connection.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES6 module setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

class DatabaseAutomation {
  constructor() {
    this.manager = new DatabaseManager();
    this.logFile = path.join(__dirname, '../../logs/database.log');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;
    
    console.log(message);
    fs.appendFileSync(this.logFile, logMessage);
  }

  async checkEnvironment() {
    this.log('🔍 Checking environment configuration...');
    
    const requiredVars = ['DATABASE_URL', 'GEMINI_API_KEY'];
    const missingVars = [];
    
    for (const varName of requiredVars) {
      if (!process.env[varName] || 
          process.env[varName].includes('YOUR_') || 
          process.env[varName] === 'mock_database') {
        missingVars.push(varName);
      }
    }
    
    if (missingVars.length > 0) {
      this.log(`❌ Missing environment variables: ${missingVars.join(', ')}`, 'ERROR');
      this.log('📝 Please update your .env file with proper values');
      return false;
    }
    
    this.log('✅ Environment configuration is valid');
    return true;
  }

  async validateConnection() {
    this.log('🔌 Validating database connection...');
    
    const health = await healthCheck();
    
    if (health.status === 'connected') {
      this.log(`✅ Database connected successfully (${health.responseTime})`);
      return true;
    } else {
      this.log(`❌ Database connection failed: ${health.error}`, 'ERROR');
      return false;
    }
  }

  async performFullSetup() {
    this.log('🚀 Starting complete database automation...');
    this.log('='.repeat(50));
    
    try {
      // Step 1: Environment check
      const envValid = await this.checkEnvironment();
      if (!envValid) {
        throw new Error('Environment validation failed');
      }
      
      // Step 2: Connection validation
      const connValid = await this.validateConnection();
      if (!connValid) {
        throw new Error('Database connection validation failed');
      }
      
      // Step 3: Full database setup
      this.log('🏗️ Running complete database setup...');
      const setupSuccess = await this.manager.fullSetup();
      
      if (!setupSuccess) {
        throw new Error('Database setup failed');
      }
      
      // Step 4: Performance optimization
      await this.optimizeDatabase();
      
      // Step 5: Create initial backup
      await this.createBackup();
      
      // Step 6: Health check and monitoring setup
      await this.setupMonitoring();
      
      this.log('🎉 Database automation completed successfully!');
      this.log('✅ Your J&K Career Navigator is now ready to use');
      
      return true;
      
    } catch (error) {
      this.log(`❌ Database automation failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async optimizeDatabase() {
    this.log('⚡ Optimizing database performance...');
    
    try {
      // Run ANALYZE to update statistics
      if (this.manager.sql) {
        await this.manager.sql`ANALYZE`;
        this.log('📊 Database statistics updated');
        
        // Check index usage
        const indexStats = await this.manager.sql`
          SELECT 
            schemaname,
            tablename,
            indexname,
            idx_scan as index_scans,
            idx_tup_read as tuples_read,
            idx_tup_fetch as tuples_fetched
          FROM pg_stat_user_indexes
          ORDER BY idx_scan DESC
        `;
        
        this.log(`📈 Found ${indexStats.length} indexes`);
        
        // Log slow queries (if any)
        this.log('🔍 Performance optimization completed');
      }
      
    } catch (error) {
      this.log(`⚠️ Database optimization warning: ${error.message}`, 'WARN');
    }
  }

  async createBackup() {
    this.log('💾 Creating initial database backup...');
    
    try {
      const backupFile = await this.manager.backup();
      if (backupFile) {
        this.log(`✅ Backup created: ${path.basename(backupFile)}`);
      }
    } catch (error) {
      this.log(`⚠️ Backup creation warning: ${error.message}`, 'WARN');
    }
  }

  async setupMonitoring() {
    this.log('📊 Setting up database monitoring...');
    
    try {
      // Create monitoring functions
      const monitoringScript = `
-- Database monitoring queries for J&K Career Navigator
-- Run these periodically to monitor database health

-- Table sizes
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size,
  pg_stat_get_tuples_returned(oid) as rows_read,
  pg_stat_get_tuples_inserted(oid) as rows_inserted
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;

-- Index usage
SELECT 
  indexname,
  idx_scan as scans,
  idx_tup_read as reads,
  idx_tup_fetch as fetches
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Connection status
SELECT 
  count(*) as total_connections,
  count(*) FILTER (WHERE state = 'active') as active_connections,
  count(*) FILTER (WHERE state = 'idle') as idle_connections
FROM pg_stat_activity;
`;

      const monitoringDir = path.join(__dirname, '../../database/monitoring');
      if (!fs.existsSync(monitoringDir)) {
        fs.mkdirSync(monitoringDir, { recursive: true });
      }
      
      fs.writeFileSync(
        path.join(monitoringDir, 'health_check.sql'),
        monitoringScript
      );
      
      this.log('✅ Monitoring scripts created');
      
    } catch (error) {
      this.log(`⚠️ Monitoring setup warning: ${error.message}`, 'WARN');
    }
  }

  async runHealthCheck() {
    this.log('🏥 Running comprehensive health check...');
    
    try {
      const health = await healthCheck();
      this.log(`📊 Connection Status: ${health.status}`);
      
      if (health.status === 'connected') {
        this.log(`⏱️ Response Time: ${health.responseTime}`);
        
        // Check table statistics
        await this.manager.getTableStats();
        
        // Check disk usage (if possible)
        if (this.manager.sql) {
          const dbSize = await this.manager.sql`
            SELECT pg_size_pretty(pg_database_size(current_database())) as database_size
          `;
          this.log(`💾 Database Size: ${dbSize[0].database_size}`);
        }
      }
      
      this.log('✅ Health check completed');
      return true;
      
    } catch (error) {
      this.log(`❌ Health check failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async scheduleMaintenanceTask() {
    this.log('🔧 Setting up automated maintenance...');
    
    const maintenanceScript = `#!/usr/bin/env node

// Automated maintenance script for J&K Career Navigator
import DatabaseManager from './db/database-manager.js';

const manager = new DatabaseManager();

async function runMaintenance() {
  console.log('🔧 Running scheduled database maintenance...');
  
  try {
    // Test connection
    await manager.testConnection();
    
    // Create backup
    await manager.backup();
    
    // Update statistics
    if (manager.sql) {
      await manager.sql\`ANALYZE\`;
    }
    
    console.log('✅ Maintenance completed successfully');
  } catch (error) {
    console.error('❌ Maintenance failed:', error.message);
  }
}

runMaintenance();
`;

    fs.writeFileSync(
      path.join(__dirname, '../maintenance.js'),
      maintenanceScript
    );
    
    this.log('✅ Maintenance script created');
    this.log('📅 Run with: node backend/maintenance.js');
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const automation = new DatabaseAutomation();
  const command = process.argv[2];
  
  switch (command) {
    case 'setup':
      await automation.performFullSetup();
      break;
      
    case 'health':
      await automation.runHealthCheck();
      break;
      
    case 'optimize':
      await automation.optimizeDatabase();
      break;
      
    case 'backup':
      await automation.createBackup();
      break;
      
    case 'maintenance':
      await automation.scheduleMaintenanceTask();
      break;
      
    default:
      console.log('🤖 J&K Career Navigator - Database Automation');
      console.log('='.repeat(45));
      console.log('Commands:');
      console.log('  setup       - Complete database setup and automation');
      console.log('  health      - Run comprehensive health check');
      console.log('  optimize    - Optimize database performance');
      console.log('  backup      - Create database backup');
      console.log('  maintenance - Setup automated maintenance');
      console.log('');
      console.log('Usage: node backend/db/setup-automation.js <command>');
      console.log('');
      console.log('🚀 For complete setup, run: node backend/db/setup-automation.js setup');
  }
  
  process.exit(0);
}

export default DatabaseAutomation;
