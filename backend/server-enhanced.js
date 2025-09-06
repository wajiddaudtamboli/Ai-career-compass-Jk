// Enhanced Server for J&K Career Navigator
// Proper PostgreSQL connection + JWT Authentication (No Clerk)

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Import database connection
import { 
    initializeDatabase, 
    testConnection, 
    healthCheck, 
    createTables,
    isDBConnected 
} from './db/connection-pg.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import authRoutesMock from './routes/authRoutes-mock.js';
import dataRoutes from './routes/dataRoutes.js';
import enhancedDataRoutes from './routes/enhancedDataRoutes-simple.js';
import geminiRoutes from './routes/geminiRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Load environment variables first
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5002;

// Initialize Google Gemini AI
let genAI;
try {
    if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('YOUR_KEY')) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        console.log('✅ Google Gemini AI initialized');
    } else {
        console.warn('⚠️ Gemini API key not configured properly');
    }
} catch (error) {
    console.warn('⚠️ Gemini AI initialization failed:', error.message);
}

// Rate limiting configuration
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// CORS configuration
const corsOptions = {
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:3006',
        'http://localhost:5173', // Vite dev server
        'http://127.0.0.1:5173'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// =============================================================================
// MIDDLEWARE SETUP
// =============================================================================

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"]
        }
    }
}));

app.use(cors(corsOptions));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);

// =============================================================================
// DATABASE INITIALIZATION
// =============================================================================

async function initializeDatabaseConnection() {
    console.log('🔗 Initializing database connection...');
    
    try {
        // Initialize database pool
        const dbInitialized = initializeDatabase();
        
        if (!dbInitialized) {
            console.log('⚠️ Database running in mock mode');
            return false; // Continue without database
        }
        
        // Test the connection
        const connected = await testConnection();
        
        if (connected) {
            // Create tables if they don't exist
            await createTables();
            console.log('✅ Database initialization completed successfully');
            return true;
        } else {
            console.log('⚠️ Database connection failed - continuing in mock mode');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        console.log('⚠️ Continuing in mock mode');
        return false; // Continue without database instead of crashing
    }
}

// API Routes (will be set up after database initialization)
let authRoutesConfigured = false;

// =============================================================================
// ROUTES SETUP
// =============================================================================

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const dbHealth = await healthCheck();
        
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: dbHealth,
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            version: '3.0.0',
            features: {
                database: dbHealth.status === 'connected' ? 'connected' : 'mock',
                authentication: 'JWT enabled',
                gemini_api: genAI ? 'available' : 'disabled',
                ai_chat: 'enabled',
                enhanced_routes: 'enabled',
                analytics: 'enabled'
            },
            api_versions: {
                'v1': '/api/v1 (Enhanced dynamic system)',
                'auth': '/auth (JWT authentication)',
                'gemini': '/api/gemini (Cryptocurrency data)',
                'legacy': '/api (Backward compatibility)'
            }
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Setup routes based on database connectivity
function setupRoutes(dbConnected) {
    if (authRoutesConfigured) return;
    
    // Choose auth routes based on database connectivity
    const selectedAuthRoutes = dbConnected ? authRoutes : authRoutesMock;
    
    // API Routes
    app.use('/auth', selectedAuthRoutes);         // JWT Authentication routes (DB or Mock)
    app.use('/api/v1', enhancedDataRoutes);       // Enhanced dynamic content routes
    app.use('/api/gemini', geminiRoutes);         // Gemini cryptocurrency API routes
    app.use('/api', dataRoutes);                  // Legacy routes for backward compatibility
    app.use('/api', aiRoutes);                    // AI chat routes
    
    authRoutesConfigured = true;
    console.log(`🔧 Routes configured with ${dbConnected ? 'Database' : 'Mock'} authentication`);
}

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'J&K Career Navigator API - Enhanced Dynamic System with JWT Authentication',
        version: '3.0.0',
        status: 'running',
        features: [
            'JWT Authentication System',
            'Dynamic Content Management',
            'Comprehensive Career Database',
            'College Information System',
            'Interactive Quiz Engine',
            'AI-Powered Career Guidance',
            'Gemini Cryptocurrency API Integration',
            'Analytics & Reporting',
            'Real-time Health Monitoring'
        ],
        endpoints: {
            // Authentication endpoints
            'register': 'POST /auth/register',
            'login': 'POST /auth/login',
            'me': 'GET /auth/me',
            'profile': 'PUT /auth/profile',
            'logout': 'POST /auth/logout',
            
            // Enhanced V1 API endpoints
            'content_blocks': 'GET /api/v1/content-blocks/:pageRoute',
            'careers': 'GET /api/v1/careers',
            'colleges': 'GET /api/v1/colleges',
            'quiz': 'GET /api/v1/quiz/questions',
            'testimonials': 'GET /api/v1/testimonials',
            'articles': 'GET /api/v1/articles',
            'analytics': 'GET /api/v1/analytics',
            'dashboard': 'GET /api/v1/dashboard/stats',
            
            // Gemini cryptocurrency API
            'crypto_price': 'GET /api/gemini/price/:symbol',
            'crypto_prices': 'GET /api/gemini/prices',
            'crypto_symbols': 'GET /api/gemini/symbols',
            'crypto_book': 'GET /api/gemini/book/:symbol',
            'crypto_trades': 'GET /api/gemini/trades/:symbol',
            'gemini_stats': 'GET /api/gemini/stats',
            
            // Legacy endpoints (backward compatibility)
            'legacy_careers': 'GET /api/careers',
            'legacy_colleges': 'GET /api/colleges',
            'ai_chat': 'POST /api/chat',
            
            // Health checks
            'health': 'GET /health',
            'api_health': 'GET /api/v1/health',
            'gemini_health': 'GET /api/gemini/health'
        },
        documentation: 'https://github.com/your-repo/jk-career-navigator',
        admin_panel: '/admin',
        database: isDBConnected() ? 'PostgreSQL (Connected)' : 'PostgreSQL (Disconnected)',
        authentication: 'JWT (Custom Implementation)'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('🚨 Unhandled error:', err);
    
    res.status(err.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        availableEndpoints: [
            'GET /',
            'GET /health',
            'POST /auth/register',
            'POST /auth/login',
            'GET /auth/me',
            'GET /api/v1/careers',
            'GET /api/v1/colleges',
            'GET /api/gemini/symbols'
        ]
    });
});

// =============================================================================
// SERVER STARTUP
// =============================================================================

async function startServer() {
    try {
        console.log('🚀 Starting J&K Career Navigator API Server...');
        console.log('============================================================');
        
        // Initialize database first
        const dbConnected = await initializeDatabaseConnection();
        
        // Setup routes based on database connectivity
        setupRoutes(dbConnected);
        
        const authMode = dbConnected ? 'Database JWT' : 'Mock JWT';
        
        // Start the server
        const server = app.listen(PORT, () => {
            console.log('✅ Server started successfully!');
            console.log('============================================================');
            console.log(`📡 Server running on port ${PORT}`);
            console.log(`🌐 Base URL: http://localhost:${PORT}`);
            console.log(`🏥 Health check: http://localhost:${PORT}/health`);
            console.log(`🔐 Auth endpoints: http://localhost:${PORT}/auth/* (${authMode})`);
            console.log(`📚 API V1 (Enhanced): http://localhost:${PORT}/api/v1/health`);
            console.log(`💰 Gemini API: http://localhost:${PORT}/api/gemini/health`);
            console.log('============================================================');
            console.log('🎯 Key Features:');
            console.log(`   • ${authMode} Authentication System`);
            console.log(`   • PostgreSQL Database: ${dbConnected ? 'Connected' : 'Mock Mode'}`);
            console.log('   • Dynamic Content Management System');
            console.log('   • Real-time Cryptocurrency Data (Gemini API)');
            console.log('   • AI-Powered Career Guidance');
            console.log('   • Comprehensive Analytics & Reporting');
            console.log('============================================================');
            console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📝 Database: ${dbConnected ? 'Connected' : 'Mock Mode'}`);
            console.log(`🔄 Hot reload: ${process.env.NODE_ENV === 'development' ? 'Enabled' : 'Disabled'}`);
            console.log(`🔑 Authentication: ${authMode}`);
            console.log('✅ Server ready for connections');
            console.log('============================================================');
        });

        // Graceful shutdown handling
        process.on('SIGTERM', () => {
            console.log('🛑 SIGTERM received. Shutting down gracefully...');
            server.close(() => {
                console.log('✅ Server closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('🛑 SIGINT received. Shutting down gracefully...');
            server.close(() => {
                console.log('✅ Server closed');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}

// Start the server
startServer().catch((error) => {
    console.error('🚨 Critical startup error:', error);
    process.exit(1);
});
