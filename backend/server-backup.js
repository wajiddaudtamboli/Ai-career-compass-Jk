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
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to fetch careers data' });
  }
});

// Colleges data endpoint
app.get('/api/colleges', async (req, res) => {
  try {
    const { type, location, course } = req.query;
    
    let query = 'SELECT * FROM colleges WHERE active = true';
    const params = [];
    
    if (type) {
      query += ' AND college_type = $' + (params.length + 1);
      params.push(type);
    }
    
    if (location) {
      query += ' AND location ILIKE $' + (params.length + 1);
      params.push(`%${location}%`);
    }
    
    if (course) {
      query += ' AND courses @> $' + (params.length + 1);
      params.push(JSON.stringify([course]));
    }
    
    query += ' ORDER BY ranking ASC, name ASC LIMIT 50';
    
    const colleges = await sql(query, params);
    res.json(colleges);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to fetch colleges data' });
  }
});

// Quiz questions endpoint
app.get('/api/quiz/questions', async (req, res) => {
  try {
    const questions = await sql('SELECT * FROM quiz_questions WHERE active = true ORDER BY order_index ASC');
    res.json(questions);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to fetch quiz questions' });
  }
});

// Submit quiz results
app.post('/api/quiz/submit', requireAuth(), async (req, res) => {
  try {
    const { answers, user_id } = req.body;
    const auth = req.auth;
    
    // Store quiz results
    const result = await sql(
      'INSERT INTO quiz_results (user_id, answers, completed_at) VALUES ($1, $2, NOW()) RETURNING *',
      [auth.userId || user_id, JSON.stringify(answers)]
    );

    // Generate career recommendations using Gemini AI
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Based on these career assessment answers: ${JSON.stringify(answers)}, 
    recommend 3-5 suitable career paths for a student in Jammu & Kashmir. 
    Consider local opportunities, growth potential, and educational requirements.
    Format as JSON with fields: title, description, education_required, skills_needed, opportunities_in_jk`;

    const aiResult = await model.generateContent(prompt);
    const recommendations = await aiResult.response;
    
    res.json({
      quiz_result: result[0],
      recommendations: recommendations.text(),
      message: 'Quiz completed successfully'
    });
  } catch (error) {
    console.error('Quiz Error:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// User profile endpoint (protected)
app.get('/api/profile', requireAuth(), async (req, res) => {
  try {
    const auth = req.auth;
    const profile = await sql(
      'SELECT * FROM user_profiles WHERE user_id = $1',
      [auth.userId]
    );
    
    if (profile.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(profile[0]);
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile (protected)
app.put('/api/profile', requireAuth(), async (req, res) => {
  try {
    const auth = req.auth;
    const { name, email, phone, education_level, interests, location } = req.body;
    
    const profile = await sql(
      `INSERT INTO user_profiles (user_id, name, email, phone, education_level, interests, location, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         name = $2, email = $3, phone = $4, education_level = $5, 
         interests = $6, location = $7, updated_at = NOW()
       RETURNING *`,
      [auth.userId, name, email, phone, education_level, JSON.stringify(interests), location]
    );
    
    res.json(profile[0]);
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
});

export default app;
