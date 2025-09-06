#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES6 module setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

class DatabaseManager {
  constructor() {
    this.sql = null;
    this.isConnected = false;
    this.initializeConnection();
  }

  initializeConnection() {
    try {
      if (!process.env.DATABASE_URL || 
          process.env.DATABASE_URL === 'mock_database' || 
          process.env.DATABASE_URL.includes('YOUR_')) {
        console.warn('⚠️ DATABASE_URL not properly configured. Please set up your Neon database connection.');
        return;
      }
      
      this.sql = neon(process.env.DATABASE_URL);
      console.log('✅ Database connection initialized');
    } catch (error) {
      console.error('❌ Database connection initialization error:', error);
    }
  }

  async testConnection() {
    try {
      if (!this.sql) {
        throw new Error('Database connection not initialized');
      }
      
      const result = await this.sql`SELECT NOW() as current_time, version() as version`;
      console.log('✅ Database connected successfully');
      console.log(`📅 Server time: ${result[0].current_time}`);
      console.log(`📊 Database: ${result[0].version.split(' ')[0]} ${result[0].version.split(' ')[1]}`);
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('❌ Database connection test failed:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  async createSchema() {
    if (!this.isConnected) {
      console.error('❌ Database not connected. Cannot create schema.');
      return false;
    }

    try {
      console.log('🏗️ Creating database schema...');
      
      // Read and execute schema file
      const schemaPath = path.join(__dirname, '../../database/schema.sql');
      const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
      
      // Split by semicolon and execute each statement
      const statements = schemaSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          await this.sql.unsafe(statement);
        }
      }
      
      console.log('✅ Database schema created successfully');
      return true;
    } catch (error) {
      console.error('❌ Schema creation failed:', error.message);
      return false;
    }
  }

  async seedData() {
    if (!this.isConnected) {
      console.error('❌ Database not connected. Cannot seed data.');
      return false;
    }

    try {
      console.log('🌱 Seeding database with sample data...');
      
      // Read and execute sample data file
      const sampleDataPath = path.join(__dirname, '../../database/sample_data.sql');
      const sampleDataSQL = fs.readFileSync(sampleDataPath, 'utf8');
      
      // Split by semicolon and execute each statement
      const statements = sampleDataSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          await this.sql.unsafe(statement);
        }
      }
      
      console.log('✅ Sample data seeded successfully');
      return true;
    } catch (error) {
      console.error('❌ Data seeding failed:', error.message);
      return false;
    }
  }

  async checkTables() {
    try {
      const tables = await this.sql`
        SELECT 
          table_name,
          (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
        FROM information_schema.tables t
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;
      
      console.log('📋 Database Tables:');
      tables.forEach(table => {
        console.log(`   📄 ${table.table_name} (${table.column_count} columns)`);
      });
      
      return tables;
    } catch (error) {
      console.error('❌ Error checking tables:', error.message);
      return [];
    }
  }

  async getTableStats() {
    try {
      const requiredTables = [
        'user_profiles', 'careers', 'colleges', 'quiz_questions', 
        'quiz_results', 'articles', 'testimonials', 'contact_messages', 'analytics'
      ];
      
      console.log('📊 Table Statistics:');
      
      for (const tableName of requiredTables) {
        try {
          const count = await this.sql`
            SELECT COUNT(*) as count 
            FROM ${this.sql(tableName)}
          `;
          console.log(`   📈 ${tableName}: ${count[0].count} records`);
        } catch (error) {
          console.log(`   ❌ ${tableName}: Table not found`);
        }
      }
    } catch (error) {
      console.error('❌ Error getting table stats:', error.message);
    }
  }

  async setupIndexes() {
    try {
      console.log('🔍 Setting up database indexes...');
      
      const indexes = [
        'CREATE INDEX IF NOT EXISTS idx_careers_category ON careers(category)',
        'CREATE INDEX IF NOT EXISTS idx_careers_location ON careers(location)',
        'CREATE INDEX IF NOT EXISTS idx_careers_education_level ON careers(education_level)',
        'CREATE INDEX IF NOT EXISTS idx_colleges_type ON colleges(college_type)',
        'CREATE INDEX IF NOT EXISTS idx_colleges_location ON colleges(location)',
        'CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category)',
        'CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published)',
        'CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured)',
        
        // Full text search indexes
        `CREATE INDEX IF NOT EXISTS idx_careers_search 
         ON careers USING gin(to_tsvector('english', title || ' ' || description))`,
        `CREATE INDEX IF NOT EXISTS idx_colleges_search 
         ON colleges USING gin(to_tsvector('english', name || ' ' || location))`,
        `CREATE INDEX IF NOT EXISTS idx_articles_search 
         ON articles USING gin(to_tsvector('english', title || ' ' || content))`
      ];
      
      for (const indexSQL of indexes) {
        await this.sql.unsafe(indexSQL);
      }
      
      console.log('✅ Database indexes created successfully');
      return true;
    } catch (error) {
      console.error('❌ Index creation failed:', error.message);
      return false;
    }
  }

  async runMigrations() {
    try {
      console.log('🔄 Running database migrations...');
      
      // Create migrations table if it doesn't exist
      await this.sql`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `;
      
      // Check for migrations directory
      const migrationsDir = path.join(__dirname, '../../database/migrations');
      
      if (!fs.existsSync(migrationsDir)) {
        console.log('📁 Creating migrations directory...');
        fs.mkdirSync(migrationsDir, { recursive: true });
        
        // Create initial migration
        const initialMigration = `-- Initial migration
-- This migration sets up the basic schema
-- Run: ${new Date().toISOString()}

-- Schema is already created via schema.sql
-- This is a placeholder for future migrations
`;
        fs.writeFileSync(
          path.join(migrationsDir, '001_initial_setup.sql'),
          initialMigration
        );
      }
      
      console.log('✅ Migrations system ready');
      return true;
    } catch (error) {
      console.error('❌ Migration setup failed:', error.message);
      return false;
    }
  }

  async fullSetup() {
    console.log('🚀 Starting complete database setup...');
    console.log('==========================================');
    
    // Step 1: Test connection
    const isConnected = await this.testConnection();
    if (!isConnected) {
      console.error('❌ Cannot proceed without database connection');
      return false;
    }
    
    // Step 2: Create schema
    await this.createSchema();
    
    // Step 3: Setup indexes
    await this.setupIndexes();
    
    // Step 4: Run migrations
    await this.runMigrations();
    
    // Step 5: Check if data exists, if not, seed it
    const tables = await this.checkTables();
    if (tables.length > 0) {
      const careersCount = await this.sql`SELECT COUNT(*) as count FROM careers`;
      if (careersCount[0].count === 0) {
        await this.seedData();
      } else {
        console.log('📊 Database already contains data, skipping seeding');
      }
    }
    
    // Step 6: Show final stats
    await this.getTableStats();
    
    console.log('');
    console.log('✅ Database setup completed successfully!');
    console.log('🎉 Your J&K Career Navigator database is ready to use');
    
    return true;
  }

  async reset() {
    if (!this.isConnected) {
      console.error('❌ Database not connected. Cannot reset.');
      return false;
    }

    try {
      console.log('⚠️ RESETTING DATABASE - This will delete all data!');
      
      // Drop all tables
      const tables = await this.sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      
      for (const table of tables) {
        await this.sql.unsafe(`DROP TABLE IF EXISTS ${table.table_name} CASCADE`);
      }
      
      console.log('🗑️ All tables dropped');
      
      // Recreate everything
      await this.fullSetup();
      
      return true;
    } catch (error) {
      console.error('❌ Database reset failed:', error.message);
      return false;
    }
  }

  async backup() {
    try {
      console.log('💾 Creating database backup...');
      
      const backupDir = path.join(__dirname, '../../database/backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(backupDir, `backup_${timestamp}.sql`);
      
      // Get all data from all tables
      const tables = await this.sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      
      let backupSQL = `-- Database Backup Created: ${new Date().toISOString()}\n\n`;
      
      for (const table of tables) {
        const data = await this.sql.unsafe(`SELECT * FROM ${table.table_name}`);
        if (data.length > 0) {
          backupSQL += `-- Data for table: ${table.table_name}\n`;
          backupSQL += `TRUNCATE TABLE ${table.table_name} CASCADE;\n`;
          
          for (const row of data) {
            const columns = Object.keys(row).join(', ');
            const values = Object.values(row)
              .map(val => val === null ? 'NULL' : `'${val.toString().replace(/'/g, "''")}'`)
              .join(', ');
            backupSQL += `INSERT INTO ${table.table_name} (${columns}) VALUES (${values});\n`;
          }
          backupSQL += '\n';
        }
      }
      
      fs.writeFileSync(backupFile, backupSQL);
      console.log(`✅ Backup created: ${backupFile}`);
      
      return backupFile;
    } catch (error) {
      console.error('❌ Backup failed:', error.message);
      return null;
    }
  }
}

export default DatabaseManager;

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const manager = new DatabaseManager();
  const command = process.argv[2];
  
  switch (command) {
    case 'setup':
      await manager.fullSetup();
      break;
    case 'test':
      await manager.testConnection();
      break;
    case 'reset':
      await manager.reset();
      break;
    case 'backup':
      await manager.backup();
      break;
    case 'stats':
      await manager.testConnection();
      await manager.getTableStats();
      break;
    default:
      console.log('🔧 Database Manager Commands:');
      console.log('  setup  - Complete database setup');
      console.log('  test   - Test database connection');
      console.log('  reset  - Reset database (WARNING: deletes all data)');
      console.log('  backup - Create database backup');
      console.log('  stats  - Show table statistics');
      console.log('');
      console.log('Usage: node database-manager.js <command>');
  }
  
  process.exit(0);
}
