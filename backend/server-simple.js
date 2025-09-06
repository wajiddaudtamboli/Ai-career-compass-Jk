import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import aiRoutes from './routes/aiRoutes.js';
import { testConnection, getCareers, getColleges, getQuizQuestions, getTestimonials } from './db/connection.js';

// Load environment variables
dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3002',  // Current frontend URL  
    'http://localhost:3001',  
    'http://localhost:3000',
    'http://localhost:3005',  
    'http://localhost:3006',
    process.env.FRONTEND_URL || 'http://localhost:3002'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =====================================================
// AI-POWERED ROUTES
// =====================================================
app.use('/api/ai', aiRoutes);

// =====================================================
// EXISTING ROUTES (Enhanced with AI Integration)
// =====================================================

// Mock data for demonstration
const mockCareers = [
  {
    id: '1',
    title: 'Software Engineer',
    description: 'Develop and maintain software applications, websites, and mobile apps. High demand in emerging IT sector of J&K.',
    category: 'Technology',
    education_level: 'Bachelor\'s Degree',
    skills_required: ['Programming', 'Problem Solving', 'Teamwork', 'Communication'],
    salary_range_min: 300000,
    salary_range_max: 1200000,
    location: 'Srinagar, Jammu',
    company_types: ['IT Companies', 'Startups', 'Government', 'E-commerce'],
    growth_prospects: 'Excellent growth with government push for IT sector in J&K. New IT parks coming up.',
    opportunities_in_jk: 'Growing IT sector with government initiatives, startup incubation centers in Srinagar and Jammu.',
    requirements: 'B.Tech/B.E in Computer Science, IT, or related field. Strong programming skills.',
    active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '2',
    title: 'Medical Doctor',
    description: 'Provide medical care and treatment to patients. Critical need in J&K healthcare system.',
    category: 'Healthcare',
    education_level: 'MBBS + MD/MS',
    skills_required: ['Medical Knowledge', 'Empathy', 'Communication', 'Problem Solving', 'Leadership'],
    salary_range_min: 600000,
    salary_range_max: 2500000,
    location: 'Srinagar, Jammu, Leh',
    company_types: ['Government Hospitals', 'Private Hospitals', 'Clinics', 'Medical Colleges'],
    growth_prospects: 'Excellent prospects with government healthcare expansion and medical tourism growth.',
    opportunities_in_jk: 'High demand due to shortage of doctors. New medical colleges being established.',
    requirements: 'MBBS degree, followed by MD/MS specialization. Clear NEET examination.',
    active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '3',
    title: 'Hotel Manager',
    description: 'Manage hotel operations, ensure guest satisfaction, and oversee staff. Crucial for J&K\'s tourism industry.',
    category: 'Tourism & Hospitality',
    education_level: 'Bachelor\'s Degree',
    skills_required: ['Management', 'Customer Service', 'Leadership', 'Communication', 'Problem Solving'],
    salary_range_min: 300000,
    salary_range_max: 1200000,
    location: 'Srinagar, Gulmarg, Pahalgam, Leh',
    company_types: ['Hotels', 'Resorts', 'Houseboats', 'Tourism Companies'],
    growth_prospects: 'Excellent growth with tourism revival and new hospitality projects.',
    opportunities_in_jk: 'Booming tourism industry offers great opportunities. Government focus on promoting tourism.',
    requirements: 'Bachelor\'s in Hotel Management, Tourism, or related field. Experience in hospitality industry preferred.',
    active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

const mockColleges = [
  {
    id: '1',
    name: 'National Institute of Technology (NIT) Srinagar',
    location: 'Srinagar, Kashmir',
    college_type: 'Engineering',
    courses: ['Computer Science Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'],
    facilities: ['Central Library', 'Computer Labs', 'Research Labs', 'Hostel Facilities', 'Sports Complex'],
    contact_info: {
      phone: '0194-2420475',
      email: 'registrar@nitsri.ac.in',
      address: 'Hazratbal, Srinagar-190006'
    },
    website: 'https://www.nitsri.ac.in',
    established_year: 1960,
    ranking: 1,
    fees_range: {
      tuition_fee_per_year: 165000,
      hostel_fee_per_year: 45000,
      total_approximate: 210000
    },
    admission_process: 'JEE Main followed by JoSAA counseling',
    eligibility: {
      jee_main_rank: 'Required',
      '12th_percentage': '75% minimum',
      subjects: 'Physics, Chemistry, Mathematics'
    },
    placements: {
      average_package: 800000,
      highest_package: 2500000,
      placement_percentage: 85,
      top_recruiters: ['TCS', 'Infosys', 'Microsoft', 'Google', 'Amazon']
    },
    active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '2',
    name: 'N.K. Orchid College of Engineering and Technology',
    location: 'Solapur',
    college_type: 'Engineering',
    courses: ['Computer Science Engineering', 'Information Technology', 'Electronics Engineering', 'Mechanical Engineering'],
    facilities: ['Modern Labs', 'Library', 'Workshops', 'Hostels', 'Sports Ground', 'Placement Cell'],
    contact_info: {
      phone: '9667033839',
      email: 'wajiddaudtamboli123@gmail.com',
      address: 'N.K. Orchid College of Engineering and Technology, Solapur'
    },
    website: 'https://www.nkorchid.edu.in',
    established_year: 2010,
    ranking: 3,
    fees_range: {
      tuition_fee_per_year: 75000,
      hostel_fee_per_year: 35000,
      total_approximate: 110000
    },
    admission_process: 'JEE Main, MHT-CET, or College Entrance Test',
    eligibility: {
      entrance_test: 'JEE Main/MHT-CET',
      '12th_percentage': '50% minimum',
      subjects: 'Physics, Chemistry, Mathematics'
    },
    placements: {
      average_package: 450000,
      highest_package: 1000000,
      placement_percentage: 75,
      industry_partnerships: 'Strong'
    },
    active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

// Gemini AI chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context = 'career guidance' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      // Fallback to mock responses if no API key
      const mockResponses = {
        'career': 'Based on the current trends in Jammu & Kashmir, I recommend exploring careers in Technology (especially software development), Healthcare (high demand for doctors), and Tourism & Hospitality (growing industry). The IT sector is expanding with government support, and there are excellent opportunities in Srinagar and Jammu.',
        'college': 'For engineering education in J&K, NIT Srinagar is the premier choice. For other options, consider Islamic University of Science & Technology or private colleges like N.K. Orchid College of Engineering and Technology which offers quality education with good placement records.',
        'default': 'Welcome to AI Career Compass J&K! I can help you with career guidance, college selection, and educational opportunities in Jammu & Kashmir. The region offers excellent opportunities in Technology, Healthcare, Tourism, Agriculture, and Government sectors. What specific area would you like to explore? (Note: Using mock responses - please configure GEMINI_API_KEY for real AI responses)'
      };

      let response = mockResponses.default;
      if (message.toLowerCase().includes('career') || message.toLowerCase().includes('job')) {
        response = mockResponses.career;
      } else if (message.toLowerCase().includes('college') || message.toLowerCase().includes('education')) {
        response = mockResponses.college;
      }

      return res.json({ 
        response: response,
        timestamp: new Date().toISOString(),
        context: context,
        source: 'mock'
      });
    }

    // Real Gemini AI integration
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const contextPrompt = `You are a career guidance counselor specializing in opportunities in Jammu & Kashmir, India. 
    Context: ${context}
    
    Provide helpful, accurate information about:
    - Career opportunities in J&K
    - Educational institutions in the region
    - Job market trends
    - Skills development
    - Government schemes and initiatives
    
    Keep responses concise, practical, and focused on J&K region.
    
    User question: ${message}`;

    const result = await model.generateContent(contextPrompt);
    const aiResponse = result.response.text();

    res.json({ 
      response: aiResponse,
      timestamp: new Date().toISOString(),
      context: context,
      source: 'gemini'
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    
    // Fallback response in case of API error
    res.json({ 
      response: 'I apologize, but I\'m experiencing technical difficulties. Please try again later, or contact our support team for immediate assistance.',
      timestamp: new Date().toISOString(),
      context: context,
      source: 'fallback',
      error: 'API temporarily unavailable'
    });
  }
});

// Careers data endpoint
app.get('/api/careers', async (req, res) => {
  try {
    const { category, level, location } = req.query;
    
    // Try to use database first, fallback to mock data
    try {
      const careers = await getCareers({ category, education_level: level, location });
      console.log(`✅ Fetched ${careers.length} careers from database`);
      res.json(careers);
      return;
    } catch (dbError) {
      console.warn('⚠️ Database unavailable, using mock data:', dbError.message);
    }
    
    // Fallback to mock data
    let filteredCareers = mockCareers;
    
    if (category) {
      filteredCareers = filteredCareers.filter(career => 
        career.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    if (level) {
      filteredCareers = filteredCareers.filter(career => 
        career.education_level.toLowerCase().includes(level.toLowerCase())
      );
    }
    
    if (location) {
      filteredCareers = filteredCareers.filter(career => 
        career.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    console.log(`📋 Using mock data: ${filteredCareers.length} careers`);
    res.json(filteredCareers);
  } catch (error) {
    console.error('Careers Error:', error);
    res.status(500).json({ error: 'Failed to fetch careers data' });
  }
});

// Colleges data endpoint
app.get('/api/colleges', async (req, res) => {
  try {
    const { type, location, course } = req.query;
    
    // Try to use database first, fallback to mock data
    try {
      const colleges = await getColleges({ type, location });
      console.log(`✅ Fetched ${colleges.length} colleges from database`);
      res.json(colleges);
      return;
    } catch (dbError) {
      console.warn('⚠️ Database unavailable, using mock data:', dbError.message);
    }
    
    // Fallback to mock data
    let filteredColleges = mockColleges;
    
    if (type) {
      filteredColleges = filteredColleges.filter(college => 
        college.college_type.toLowerCase().includes(type.toLowerCase())
      );
    }
    
    if (location) {
      filteredColleges = filteredColleges.filter(college => 
        college.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (course) {
      filteredColleges = filteredColleges.filter(college => 
        college.courses.some(c => c.toLowerCase().includes(course.toLowerCase()))
      );
    }
    
    console.log(`📋 Using mock data: ${filteredColleges.length} colleges`);
    res.json(filteredColleges);
  } catch (error) {
    console.error('Colleges Error:', error);
    res.status(500).json({ error: 'Failed to fetch colleges data' });
  }
});

// Quiz questions endpoint
app.get('/api/quiz/questions', async (req, res) => {
  try {
    const mockQuestions = [
      {
        id: '1',
        question: 'What type of work environment do you prefer?',
        question_type: 'multiple_choice',
        options: ['Office environment', 'Outdoor/Field work', 'Laboratory/Research', 'Home/Remote work', 'Hospital/Clinical setting'],
        category: 'work_environment',
        order_index: 1,
        active: true
      },
      {
        id: '2',
        question: 'Which subjects did you enjoy most in school?',
        question_type: 'multiple_choice',
        options: ['Mathematics and Physics', 'Biology and Chemistry', 'Languages and Literature', 'History and Social Studies', 'Arts and Crafts', 'Computer Science'],
        category: 'interests',
        order_index: 2,
        active: true
      },
      {
        id: '3',
        question: 'What motivates you the most in a career?',
        question_type: 'multiple_choice',
        options: ['High salary and financial security', 'Helping others and making a difference', 'Creative expression and innovation', 'Leadership and management', 'Research and discovery', 'Adventure and travel'],
        category: 'motivation',
        order_index: 3,
        active: true
      }
    ];
    
    res.json(mockQuestions);
  } catch (error) {
    console.error('Quiz Error:', error);
    res.status(500).json({ error: 'Failed to fetch quiz questions' });
  }
});

// Submit quiz results
app.post('/api/quiz/submit', async (req, res) => {
  try {
    const { answers } = req.body;
    
    // Mock career recommendations based on answers
    const recommendations = [
      {
        title: 'Software Engineer',
        description: 'Based on your interests in technology and problem-solving, software engineering would be an excellent career choice.',
        match_percentage: 85
      },
      {
        title: 'Data Scientist',
        description: 'Your analytical thinking and interest in mathematics make data science a great fit.',
        match_percentage: 78
      },
      {
        title: 'Product Manager',
        description: 'Your leadership qualities and communication skills align well with product management.',
        match_percentage: 72
      }
    ];
    
    res.json({
      quiz_result: { id: Date.now(), answers, completed_at: new Date() },
      recommendations: recommendations,
      message: 'Quiz completed successfully'
    });
  } catch (error) {
    console.error('Quiz Submit Error:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
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
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`📧 Contact: ${process.env.CONTACT_EMAIL || 'wajiddaudtamboli123@gmail.com'}`);
  console.log(`📞 Phone: ${process.env.CONTACT_PHONE || '9667033839'}`);
  console.log(`🏫 Address: ${process.env.CONTACT_ADDRESS || 'N.K. Orchid College of Engineering and Technology, Solapur'}`);
  
  // Test database connection
  console.log('🔗 Testing database connection...');
  const isConnected = await testConnection();
  if (isConnected) {
    console.log('✅ Database connected successfully');
  } else {
    console.log('⚠️ Database connection failed - using mock data');
  }
});

export default app;
