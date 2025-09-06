// Enhanced Database Connection for J&K Career Navigator
// Uses pg library for PostgreSQL connection with Neon database

import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;

// Load environment variables
dotenv.config();

let pool;
let isConnected = false;

// Initialize PostgreSQL connection pool
export function initializeDatabase() {
    try {
        if (!process.env.DATABASE_URL || 
            process.env.DATABASE_URL === 'mock_database_for_development' ||
            process.env.DATABASE_URL.includes('YOUR_') ||
            process.env.MOCK_MODE === 'true') {
            
            console.log('⚠️ Running in mock database mode - database features disabled');
            pool = null;
            return false; // Indicate mock mode
        }

        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
        });

        // Handle pool errors
        pool.on('error', (err) => {
            console.error('❌ Unexpected error on idle client', err);
            isConnected = false;
        });

        console.log('✅ PostgreSQL connection pool initialized');
        return true;
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        console.log('⚠️ Falling back to mock mode');
        pool = null;
        return false;
    }
}

// Test database connection
export async function testConnection() {
    try {
        if (!pool) {
            console.log('⚠️ Database in mock mode - skipping connection test');
            isConnected = false;
            return false;
        }

        const client = await pool.connect();
        
        try {
            const result = await client.query('SELECT NOW() as current_time, version() as version');
            const { current_time, version } = result.rows[0];
            
            console.log('✅ Database connected successfully');
            console.log(`📊 Database version: ${version.split(' ')[0]} ${version.split(' ')[1]}`);
            console.log(`🕒 Current time: ${current_time}`);
            
            isConnected = true;
            return true;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('❌ Database connection test failed:', error.message);
        console.log('⚠️ Continuing in mock mode');
        isConnected = false;
        return false;
    }
}

// Health check function
export async function healthCheck() {
    try {
        if (!pool) {
            return { 
                status: 'disconnected', 
                error: 'Database pool not initialized',
                timestamp: new Date().toISOString()
            };
        }

        const start = Date.now();
        const client = await pool.connect();
        
        try {
            await client.query('SELECT 1');
            const responseTime = Date.now() - start;
            
            return {
                status: 'connected',
                responseTime: `${responseTime}ms`,
                timestamp: new Date().toISOString(),
                poolStatus: {
                    totalCount: pool.totalCount,
                    idleCount: pool.idleCount,
                    waitingCount: pool.waitingCount
                }
            };
        } finally {
            client.release();
        }
    } catch (error) {
        return {
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// Get database connection
export function getDB() {
    if (!pool) {
        throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return pool;
}

// Execute query with connection management
export async function query(text, params = []) {
    if (!pool) {
        throw new Error('Database not initialized');
    }

    const client = await pool.connect();
    try {
        const start = Date.now();
        const result = await client.query(text, params);
        const duration = Date.now() - start;
        
        if (process.env.NODE_ENV === 'development') {
            console.log(`🔍 Query executed in ${duration}ms:`, text.substring(0, 100));
        }
        
        return result;
    } finally {
        client.release();
    }
}

// Close database connection
export async function closeConnection() {
    if (pool) {
        try {
            await pool.end();
            console.log('✅ Database connection closed');
            isConnected = false;
        } catch (error) {
            console.error('❌ Error closing database connection:', error);
        }
    }
}

// Check if database is connected
export function isDBConnected() {
    return isConnected;
}

// Create initial tables if they don't exist
export async function createTables() {
    try {
        if (!pool) {
            console.log('⚠️ Database in mock mode - skipping table creation');
            return false;
        }

        console.log('🔧 Creating initial database tables...');
        
        // Users table for authentication
        await query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                role VARCHAR(50) DEFAULT 'user',
                email_verified BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // User profiles table
        await query(`
            CREATE TABLE IF NOT EXISTS user_profiles (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                avatar_url VARCHAR(500),
                bio TEXT,
                location VARCHAR(100),
                phone VARCHAR(20),
                date_of_birth DATE,
                education_level VARCHAR(50),
                interests TEXT[],
                career_goals TEXT,
                linkedin_url VARCHAR(300),
                github_url VARCHAR(300),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Careers table
        await query(`
            CREATE TABLE IF NOT EXISTS careers (
                id SERIAL PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                slug VARCHAR(250) UNIQUE NOT NULL,
                description TEXT,
                category VARCHAR(100),
                subcategory VARCHAR(100),
                avg_salary INTEGER,
                salary_range_min INTEGER,
                salary_range_max INTEGER,
                demand_score INTEGER DEFAULT 0,
                education_level VARCHAR(100),
                skills_required TEXT[],
                location TEXT[],
                featured BOOLEAN DEFAULT false,
                is_active BOOLEAN DEFAULT true,
                metadata JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Colleges table
        await query(`
            CREATE TABLE IF NOT EXISTS colleges (
                id SERIAL PRIMARY KEY,
                name VARCHAR(300) NOT NULL,
                slug VARCHAR(350) UNIQUE NOT NULL,
                location VARCHAR(100),
                type VARCHAR(100),
                affiliation VARCHAR(200),
                established INTEGER,
                rating DECIMAL(3,2),
                courses TEXT[],
                fees_range VARCHAR(100),
                website VARCHAR(300),
                featured BOOLEAN DEFAULT false,
                is_active BOOLEAN DEFAULT true,
                metadata JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Content blocks table
        await query(`
            CREATE TABLE IF NOT EXISTS content_blocks (
                id SERIAL PRIMARY KEY,
                page_route VARCHAR(100) NOT NULL,
                block_type VARCHAR(50) NOT NULL,
                title VARCHAR(300),
                subtitle VARCHAR(500),
                content TEXT,
                metadata JSONB,
                display_order INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                updated_by INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Testimonials table
        await query(`
            CREATE TABLE IF NOT EXISTS testimonials (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                name VARCHAR(200) NOT NULL,
                role VARCHAR(200),
                company VARCHAR(200),
                content TEXT NOT NULL,
                rating INTEGER DEFAULT 5,
                image_url VARCHAR(500),
                featured BOOLEAN DEFAULT false,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✅ Database tables created successfully');
        return true;
    } catch (error) {
        console.error('❌ Error creating tables:', error);
        throw error;
    }
}

export default {
    initializeDatabase,
    testConnection,
    healthCheck,
    getDB,
    query,
    closeConnection,
    isDBConnected,
    createTables
};
