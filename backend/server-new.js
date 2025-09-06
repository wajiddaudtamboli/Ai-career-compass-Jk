import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { clerkMiddleware, requireAuth } from '@clerk/express';

// Import routes and database
import dataRoutes from './routes/dataRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { testConnection, healthCheck } from './db/connection.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5002;

// Initialize services
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

// Clerk middleware
app.use(clerkMiddleware());

// Database connection test on startup
async function initializeDatabase() {
  console.log('🔗 Initializing database connection...');
  const isConnected = await testConnection();
  
  if (isConnected) {
    console.log('✅ Database initialized successfully');
  } else {
    console.warn('⚠️ Database connection failed - running in mock mode');
  }
}

// Routes
app.use('/api', dataRoutes);
app.use('/api', aiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'J&K Career Navigator API',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      careers: '/api/careers',
      colleges: '/api/colleges',
      quiz: '/api/quiz/questions',
      testimonials: '/api/testimonials',
      contact: '/api/contact',
      chat: '/api/chat'
    },
    documentation: 'https://github.com/your-repo/jk-career-navigator'
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const health = await healthCheck();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: health,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '2.0.0'
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
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /api/health',
      'GET /api/careers',
      'GET /api/colleges',
      'GET /api/quiz/questions',
      'POST /api/quiz/submit',
      'GET /api/testimonials',
      'POST /api/contact',
      'POST /api/chat'
    ]
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
      console.log('🚀 J&K Career Navigator API Server Started');
      console.log('='.repeat(45));
      console.log(`📡 Server running on port ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API docs: http://localhost:${PORT}/api/health`);
      console.log('='.repeat(45));
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development mode');
        console.log('📝 Logs are detailed');
        console.log('🔄 Auto-reload enabled');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
