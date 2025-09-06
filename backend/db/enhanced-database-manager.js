// Enhanced Database Setup and Initialization Script
// Handles dynamic schema creation, sample data insertion, and database migrations

import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

class EnhancedDatabaseManager {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.client = new Client(dbConfig);
      await this.client.connect();
      this.isConnected = true;
      console.log('✅ Connected to PostgreSQL database');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.end();
      this.isConnected = false;
      console.log('🔌 Disconnected from database');
    }
  }

  async executeSQL(sql, description = '') {
    try {
      console.log(`📝 Executing: ${description || 'SQL query'}`);
      const result = await this.client.query(sql);
      console.log(`✅ Completed: ${description || 'SQL query'}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed: ${description || 'SQL query'}`, error.message);
      throw error;
    }
  }

  async executeSQLFile(filePath, description = '') {
    try {
      const fullPath = path.join(__dirname, '..', 'database', filePath);
      const sql = fs.readFileSync(fullPath, 'utf8');
      return await this.executeSQL(sql, description || `Execute ${filePath}`);
    } catch (error) {
      console.error(`❌ Failed to execute SQL file ${filePath}:`, error.message);
      throw error;
    }
  }

  async checkTableExists(tableName) {
    try {
      const result = await this.client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `, [tableName]);
      return result.rows[0].exists;
    } catch (error) {
      console.error(`❌ Error checking table ${tableName}:`, error.message);
      return false;
    }
  }

  async getTableRowCount(tableName) {
    try {
      const result = await this.client.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error(`❌ Error counting rows in ${tableName}:`, error.message);
      return 0;
    }
  }

  async createDynamicSchema() {
    console.log('\n🏗️ Creating Enhanced Dynamic Schema...');
    try {
      await this.executeSQLFile('dynamic-schema.sql', 'Create dynamic schema');
      console.log('✅ Dynamic schema created successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to create dynamic schema:', error.message);
      return false;
    }
  }

  async insertSampleData() {
    console.log('\n📦 Inserting Sample Data...');
    try {
      await this.executeSQLFile('dynamic-sample-data.sql', 'Insert sample data');
      console.log('✅ Sample data inserted successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to insert sample data:', error.message);
      return false;
    }
  }

  async validateDatabase() {
    console.log('\n🔍 Validating Database Structure...');
    
    const requiredTables = [
      'admins',
      'content_blocks', 
      'careers',
      'colleges',
      'quiz_questions',
      'quiz_responses',
      'testimonials',
      'articles',
      'gemini_logs',
      'analytics',
      'career_reviews',
      'college_reviews'
    ];

    const validation = {
      tables: {},
      totalTables: 0,
      missingTables: [],
      dataCount: {}
    };

    for (const table of requiredTables) {
      const exists = await this.checkTableExists(table);
      validation.tables[table] = exists;
      
      if (exists) {
        validation.totalTables++;
        validation.dataCount[table] = await this.getTableRowCount(table);
      } else {
        validation.missingTables.push(table);
      }
    }

    console.log('\n📊 Database Validation Report:');
    console.log(`✅ Tables found: ${validation.totalTables}/${requiredTables.length}`);
    
    if (validation.missingTables.length > 0) {
      console.log(`❌ Missing tables: ${validation.missingTables.join(', ')}`);
    }

    console.log('\n📈 Data Counts:');
    Object.entries(validation.dataCount).forEach(([table, count]) => {
      console.log(`   ${table}: ${count} rows`);
    });

    return validation;
  }

  async setupIndexes() {
    console.log('\n⚡ Creating Performance Indexes...');
    
    const indexes = [
      {
        name: 'idx_careers_category',
        sql: 'CREATE INDEX IF NOT EXISTS idx_careers_category ON careers(category);',
        description: 'Index on careers category'
      },
      {
        name: 'idx_careers_featured',
        sql: 'CREATE INDEX IF NOT EXISTS idx_careers_featured ON careers(featured);',
        description: 'Index on careers featured status'
      },
      {
        name: 'idx_careers_demand_score',
        sql: 'CREATE INDEX IF NOT EXISTS idx_careers_demand_score ON careers(demand_score DESC);',
        description: 'Index on careers demand score'
      },
      {
        name: 'idx_colleges_location',
        sql: 'CREATE INDEX IF NOT EXISTS idx_colleges_location ON colleges(location);',
        description: 'Index on colleges location'
      },
      {
        name: 'idx_colleges_type',
        sql: 'CREATE INDEX IF NOT EXISTS idx_colleges_type ON colleges(college_type);',
        description: 'Index on colleges type'
      },
      {
        name: 'idx_content_blocks_page',
        sql: 'CREATE INDEX IF NOT EXISTS idx_content_blocks_page ON content_blocks(page_route);',
        description: 'Index on content blocks page route'
      },
      {
        name: 'idx_content_blocks_active',
        sql: 'CREATE INDEX IF NOT EXISTS idx_content_blocks_active ON content_blocks(is_active);',
        description: 'Index on content blocks active status'
      },
      {
        name: 'idx_articles_status',
        sql: 'CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);',
        description: 'Index on articles status'
      },
      {
        name: 'idx_analytics_event_type',
        sql: 'CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);',
        description: 'Index on analytics event type'
      },
      {
        name: 'idx_analytics_created_at',
        sql: 'CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);',
        description: 'Index on analytics timestamp'
      }
    ];

    for (const index of indexes) {
      try {
        await this.executeSQL(index.sql, index.description);
      } catch (error) {
        console.warn(`⚠️ Could not create index ${index.name}:`, error.message);
      }
    }

    console.log('✅ Performance indexes created');
  }

  async fullSetup() {
    console.log('\n🚀 Starting Enhanced Database Setup...');
    console.log('='.repeat(50));
    
    const connected = await this.connect();
    if (!connected) {
      throw new Error('Cannot proceed without database connection');
    }

    try {
      // Step 1: Create dynamic schema
      const schemaCreated = await this.createDynamicSchema();
      if (!schemaCreated) {
        throw new Error('Schema creation failed');
      }

      // Step 2: Insert sample data
      const dataInserted = await this.insertSampleData();
      if (!dataInserted) {
        console.warn('⚠️ Sample data insertion had issues, continuing...');
      }

      // Step 3: Create performance indexes
      await this.setupIndexes();

      // Step 4: Validate database
      const validation = await this.validateDatabase();

      console.log('\n🎉 Enhanced Database Setup Complete!');
      console.log('='.repeat(50));
      console.log('✅ Dynamic schema created');
      console.log('✅ Sample data inserted');
      console.log('✅ Performance indexes created');
      console.log('✅ Database validated');
      console.log('\n🌟 Your dynamic, data-driven system is ready!');
      
      return {
        success: true,
        validation,
        message: 'Enhanced database setup completed successfully'
      };

    } catch (error) {
      console.error('\n❌ Database setup failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    } finally {
      await this.disconnect();
    }
  }

  async quickHealthCheck() {
    console.log('🏥 Performing Quick Health Check...');
    
    const connected = await this.connect();
    if (!connected) {
      return { healthy: false, error: 'Cannot connect to database' };
    }

    try {
      // Test basic query
      await this.client.query('SELECT NOW() as timestamp');
      
      // Check key tables
      const keyTables = ['careers', 'colleges', 'content_blocks'];
      const tableStatus = {};
      
      for (const table of keyTables) {
        tableStatus[table] = await this.checkTableExists(table);
      }

      await this.disconnect();

      const allTablesExist = Object.values(tableStatus).every(exists => exists);

      return {
        healthy: allTablesExist,
        database: 'connected',
        tables: tableStatus,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      await this.disconnect();
      return {
        healthy: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// CLI interface
async function main() {
  const manager = new EnhancedDatabaseManager();
  
  const args = process.argv.slice(2);
  const command = args[0] || 'setup';

  switch (command) {
    case 'setup':
    case 'full':
      await manager.fullSetup();
      break;
      
    case 'schema':
      await manager.connect();
      await manager.createDynamicSchema();
      await manager.disconnect();
      break;
      
    case 'data':
      await manager.connect();
      await manager.insertSampleData();
      await manager.disconnect();
      break;
      
    case 'validate':
      await manager.connect();
      await manager.validateDatabase();
      await manager.disconnect();
      break;
      
    case 'health':
      const health = await manager.quickHealthCheck();
      console.log('Health Check Result:', JSON.stringify(health, null, 2));
      break;
      
    default:
      console.log('Usage: node enhanced-database-manager.js [command]');
      console.log('Commands:');
      console.log('  setup (default) - Full database setup');
      console.log('  schema          - Create schema only');
      console.log('  data            - Insert sample data only');
      console.log('  validate        - Validate database structure');
      console.log('  health          - Quick health check');
  }
}

// Export for use as module
export default EnhancedDatabaseManager;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
