#!/usr/bin/env node

import { sql, testConnection } from './db/connection.js';
import dotenv from 'dotenv';

dotenv.config();

async function setupDatabase() {
  console.log('🔗 AI Career Compass J&K - Database Setup');
  console.log('==========================================');
  
  // Check if DATABASE_URL is configured
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'mock_database' || process.env.DATABASE_URL.includes('YOUR_')) {
    console.error('❌ DATABASE_URL is not properly configured in .env file');
    console.log('📝 Please update your .env file with your Neon PostgreSQL connection string:');
    console.log('   DATABASE_URL=postgresql://user:password@host/database?sslmode=require');
    console.log('');
    console.log('🔗 Get your connection string from:');
    console.log('   1. Log into https://console.neon.tech');
    console.log('   2. Select your project');
    console.log('   3. Go to "Connection Details"');
    console.log('   4. Copy the connection string');
    process.exit(1);
  }

  // Test database connection
  console.log('🔍 Testing database connection...');
  const isConnected = await testConnection();
  
  if (!isConnected) {
    console.error('❌ Database connection failed');
    console.log('🔧 Troubleshooting steps:');
    console.log('   1. Verify your DATABASE_URL is correct');
    console.log('   2. Check if your Neon database is active');
    console.log('   3. Ensure your IP is allowed (Neon usually allows all IPs)');
    console.log('   4. Verify SSL mode is enabled (?sslmode=require)');
    process.exit(1);
  }

  // Check if tables exist
  console.log('📋 Checking database schema...');
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    const requiredTables = ['careers', 'colleges', 'quiz_questions', 'testimonials', 'user_profiles'];
    const existingTables = tables.map(t => t.table_name);
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    console.log(`✅ Found ${existingTables.length} tables:`, existingTables);
    
    if (missingTables.length > 0) {
      console.warn(`⚠️ Missing tables: ${missingTables.join(', ')}`);
      console.log('📄 Please run your schema.sql file to create missing tables:');
      console.log('   psql "your_database_url" < database/schema.sql');
    }
    
    // Check if data exists
    console.log('📊 Checking sample data...');
    for (const table of existingTables) {
      if (requiredTables.includes(table)) {
        const count = await sql`SELECT COUNT(*) as count FROM ${sql(table)}`;
        console.log(`   ${table}: ${count[0].count} records`);
      }
    }
    
    if (existingTables.includes('careers')) {
      const careersCount = await sql`SELECT COUNT(*) as count FROM careers`;
      if (careersCount[0].count === '0') {
        console.log('📄 To load sample data, run:');
        console.log('   psql "your_database_url" < database/sample_data.sql');
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking schema:', error.message);
  }

  console.log('');
  console.log('✅ Database setup check completed!');
  console.log('🚀 You can now start your server with: npm run dev');
}

setupDatabase().catch(console.error);
