import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Import routes and database
import dataRoutes from './routes/dataRoutes.js';
import enhancedDataRoutes from './routes/enhancedDataRoutes-simple.js';
import geminiRoutes from './routes/geminiRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import enhancedAIRoutes from './routes/enhancedAIRoutes.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import { testConnection, healthCheck } from './db/connection.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5002;

// Initialize services
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Check if Clerk is properly configured
const clerkConfigured = process.env.CLERK_PUBLISHABLE_KEY && 
                       process.env.CLERK_SECRET_KEY && 
                       !process.env.CLERK_PUBLISHABLE_KEY.includes('placeholder') &&
                       !process.env.CLERK_SECRET_KEY.includes('placeholder');

// Import Clerk only if configured
let clerkMiddleware;
if (clerkConfigured) {
  try {
    const clerk = await import('@clerk/express');
    clerkMiddleware = clerk.clerkMiddleware;
    console.log('✅ Clerk authentication enabled');
  } catch (error) {
    console.warn('⚠️ Clerk not available, authentication disabled');
    clerkMiddleware = (req, res, next) => next(); // No-op middleware
  }
} else {
  console.warn('⚠️ Clerk not configured, authentication disabled');
  clerkMiddleware = (req, res, next) => next(); // No-op middleware
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
}));

app.use(cors({
  origin: [
    'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 
    'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005',
    'http://localhost:3006', 'http://localhost:5173', 'http://localhost:5174'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);

// Clerk middleware (conditional)
app.use(clerkMiddleware);

// Database connection test on startup
async function initializeDatabase() {
  console.log('🔗 Initializing database connection...');
  const isConnected = await testConnection();
  
  if (isConnected) {
    console.log('✅ Database initialized successfully');
    
    // Store database connection in app locals for routes
    try {
      const { db } = await import('./db/connection.js');
      app.locals.db = db;
      console.log('📦 Database instance stored in app locals');
    } catch (error) {
      console.warn('⚠️ Could not store database instance:', error.message);
    }
  } else {
    console.warn('⚠️ Database connection failed - running in mock mode');
  }
}

// Routes
app.use('/api/v1', enhancedDataRoutes); // Enhanced dynamic content routes
app.use('/api/gemini', geminiRoutes);   // Gemini cryptocurrency API routes
app.use('/api', dataRoutes);            // Legacy routes for backward compatibility
app.use('/api', aiRoutes);              // AI chat routes
app.use('/api/ai', enhancedAIRoutes);   // Enhanced AI-powered features
app.use('/api/auth', authRoutes);       // Authentication routes
app.use('/api', profileRoutes);         // User profile routes

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'J&K Career Navigator API - Enhanced Dynamic System',
    version: '3.0.0',
    status: 'running',
    features: [
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
      // Enhanced V1 API endpoints
      'content_blocks': '/api/v1/content-blocks',
      'careers': '/api/v1/careers',
      'colleges': '/api/v1/colleges',
      'quiz': '/api/v1/quiz/questions',
      'testimonials': '/api/v1/testimonials',
      'articles': '/api/v1/articles',
      'analytics': '/api/v1/analytics',
      'dashboard': '/api/v1/dashboard/stats',
      
      // Gemini cryptocurrency API
      'crypto_price': '/api/gemini/price/:symbol',
      'crypto_prices': '/api/gemini/prices',
      'crypto_symbols': '/api/gemini/symbols',
      'crypto_book': '/api/gemini/book/:symbol',
      'crypto_trades': '/api/gemini/trades/:symbol',
      'gemini_stats': '/api/gemini/stats',
      
      // Legacy endpoints (backward compatibility)
      'legacy_careers': '/api/careers',
      'legacy_colleges': '/api/colleges',
      'ai_chat': '/api/chat',
      
      // Health checks
      'health': '/health',
      'api_health': '/api/v1/health',
      'gemini_health': '/api/gemini/health'
    },
    documentation: 'https://github.com/your-repo/jk-career-navigator',
    admin_panel: '/admin',
    database: 'PostgreSQL (Neon)',
    authentication: clerkConfigured ? 'Clerk (Enabled)' : 'Disabled (Development)'
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  let health;
  try {
    health = await healthCheck();
  } catch (error) {
    health = { status: 'mock', error: 'Running in mock mode' };
  }
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: health,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '3.0.0',
    mode: app.locals.db ? 'production' : 'mock',
    features: {
      database: health && health.status === 'connected' ? 'connected' : 'mock/disconnected',
      authentication: clerkConfigured ? 'enabled' : 'disabled',
      gemini_api: 'available',
      ai_chat: 'enabled',
      enhanced_routes: 'enabled',
      analytics: 'enabled'
    },
    api_versions: {
      'v1': '/api/v1 (Enhanced dynamic system)',
      'legacy': '/api (Backward compatibility)',
      'gemini': '/api/gemini (Cryptocurrency data)'
    }
  });
});

// Legacy Gemini AI chat endpoint (kept for backward compatibility)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context = 'career guidance' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `You are a career guidance counselor for students in Jammu & Kashmir. 
    Context: ${context}
    User question: ${message}
    
    Please provide helpful, accurate, and encouraging advice about career opportunities, 
    education paths, and professional development specifically relevant to J&K region.
    Keep responses concise but informative.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ 
      response: text,
      timestamp: new Date().toISOString(),
      context: context
    });
  } catch (error) {
    console.error('Gemini AI Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate AI response',
      message: 'Please try again later'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  
  res.status(error.status || 500).json({
    status: 'error',
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
    suggestion: 'Check the API documentation for available routes',
    availableRoutes: {
      'Enhanced API (v1)': [
        'GET /api/v1/content-blocks',
        'GET /api/v1/careers',
        'GET /api/v1/colleges',
        'GET /api/v1/quiz/questions',
        'POST /api/v1/quiz/submit',
        'GET /api/v1/testimonials',
        'GET /api/v1/articles',
        'GET /api/v1/dashboard/stats'
      ],
      'Gemini Crypto API': [
        'GET /api/gemini/price/:symbol',
        'GET /api/gemini/prices',
        'GET /api/gemini/symbols',
        'GET /api/gemini/book/:symbol',
        'GET /api/gemini/trades/:symbol',
        'GET /api/gemini/health'
      ],
      'Legacy API': [
        'GET /api/careers',
        'GET /api/colleges',
        'POST /api/chat'
      ],
      'System': [
        'GET /',
        'GET /health'
      ]
    }
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Start listening
    app.listen(PORT, () => {
      console.log('🚀 J&K Career Navigator API Server - Enhanced Dynamic System');
      console.log('='.repeat(60));
      console.log(`📡 Server running on port ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API V1 (Enhanced): http://localhost:${PORT}/api/v1/health`);
      console.log(`💰 Gemini API: http://localhost:${PORT}/api/gemini/health`);
      console.log('='.repeat(60));
      console.log('🎯 Key Features:');
      console.log('   • Dynamic Content Management System');
      console.log('   • Real-time Cryptocurrency Data (Gemini API)');
      console.log('   • AI-Powered Career Guidance');
      console.log('   • Comprehensive Analytics & Reporting');
      console.log('   • Enhanced Database with Full CRUD Operations');
      console.log('='.repeat(60));
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development mode');
        console.log('📝 Logs are detailed');
        console.log('🔄 Auto-reload enabled');
        console.log(`🔑 Authentication: ${clerkConfigured ? 'Enabled' : 'Disabled'}`);
      }
      
      console.log('✅ Server ready for connections');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
