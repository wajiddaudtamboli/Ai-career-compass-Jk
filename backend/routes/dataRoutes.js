import express from 'express';
import { 
  getCareers, 
  getColleges, 
  getQuizQuestions, 
  saveQuizResult,
  getUserQuizHistory,
  getTestimonials,
  addContactMessage,
  logAnalytics,
  healthCheck
} from '../db/connection.js';

const router = express.Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const health = await healthCheck();
    res.json({
      status: 'success',
      database: health,
      timestamp: new Date().toISOString(),
      service: 'J&K Career Navigator API'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Careers endpoints
router.get('/careers', async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      location: req.query.location,
      education_level: req.query.education_level,
      search: req.query.search
    };
    
    const careers = await getCareers(filters);
    
    // Log analytics
    await logAnalytics({
      eventType: 'careers_search',
      data: { filters, resultCount: careers.length },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({
      status: 'success',
      data: careers,
      count: careers.length,
      filters: filters
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch careers',
      error: error.message
    });
  }
});

router.get('/careers/:id', async (req, res) => {
  try {
    const careers = await getCareers();
    const career = careers.find(c => c.id === req.params.id);
    
    if (!career) {
      return res.status(404).json({
        status: 'error',
        message: 'Career not found'
      });
    }
    
    // Log analytics
    await logAnalytics({
      eventType: 'career_view',
      data: { careerId: req.params.id, careerTitle: career.title },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({
      status: 'success',
      data: career
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch career details',
      error: error.message
    });
  }
});

// Colleges endpoints
router.get('/colleges', async (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      location: req.query.location,
      search: req.query.search
    };
    
    const colleges = await getColleges(filters);
    
    // Log analytics
    await logAnalytics({
      eventType: 'colleges_search',
      data: { filters, resultCount: colleges.length },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({
      status: 'success',
      data: colleges,
      count: colleges.length,
      filters: filters
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch colleges',
      error: error.message
    });
  }
});

router.get('/colleges/:id', async (req, res) => {
  try {
    const colleges = await getColleges();
    const college = colleges.find(c => c.id === req.params.id);
    
    if (!college) {
      return res.status(404).json({
        status: 'error',
        message: 'College not found'
      });
    }
    
    // Log analytics
    await logAnalytics({
      eventType: 'college_view',
      data: { collegeId: req.params.id, collegeName: college.name },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({
      status: 'success',
      data: college
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch college details',
      error: error.message
    });
  }
});

// Quiz endpoints
router.get('/quiz/questions', async (req, res) => {
  try {
    const questions = await getQuizQuestions();
    
    res.json({
      status: 'success',
      data: questions,
      count: questions.length
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch quiz questions',
      error: error.message
    });
  }
});

router.post('/quiz/submit', async (req, res) => {
  try {
    const { userId, answers } = req.body;
    
    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Quiz answers are required'
      });
    }
    
    // Generate recommendations based on answers
    const recommendations = generateCareerRecommendations(answers);
    
    // Save quiz result
    const result = await saveQuizResult(userId || 'anonymous', answers, recommendations);
    
    // Log analytics
    await logAnalytics({
      userId: userId,
      eventType: 'quiz_completed',
      data: { answersCount: Object.keys(answers).length, recommendations: recommendations.map(r => r.title) },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({
      status: 'success',
      data: {
        quizResultId: result.id,
        recommendations: recommendations,
        completedAt: result.completed_at
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit quiz',
      error: error.message
    });
  }
});

router.get('/quiz/history/:userId', async (req, res) => {
  try {
    const history = await getUserQuizHistory(req.params.userId);
    
    res.json({
      status: 'success',
      data: history,
      count: history.length
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch quiz history',
      error: error.message
    });
  }
});

// Testimonials endpoint
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await getTestimonials();
    
    res.json({
      status: 'success',
      data: testimonials,
      count: testimonials.length
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch testimonials',
      error: error.message
    });
  }
});

// Contact endpoints
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and message are required'
      });
    }
    
    const result = await addContactMessage({
      name,
      email,
      phone,
      subject,
      message
    });
    
    // Log analytics
    await logAnalytics({
      eventType: 'contact_message',
      data: { hasPhone: !!phone, hasSubject: !!subject },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({
      status: 'success',
      message: 'Contact message sent successfully',
      data: {
        messageId: result.id,
        submittedAt: result.created_at
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to send contact message',
      error: error.message
    });
  }
});

// Analytics endpoint (for admin)
router.post('/analytics', async (req, res) => {
  try {
    const { eventType, data, userId } = req.body;
    
    await logAnalytics({
      userId: userId,
      eventType: eventType,
      data: data,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({
      status: 'success',
      message: 'Analytics logged successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to log analytics',
      error: error.message
    });
  }
});

// Helper function to generate career recommendations
function generateCareerRecommendations(answers) {
  const recommendations = [];
  
  // Basic recommendation logic based on quiz answers
  const workEnvironment = answers['1']; // Question 1
  const interests = answers['2']; // Question 2
  const motivation = answers['3']; // Question 3
  
  // Technology careers
  if (interests?.includes('Computer Science') || interests?.includes('Mathematics and Physics')) {
    recommendations.push({
      title: 'Software Engineer',
      category: 'Technology',
      match_percentage: 85,
      reason: 'Based on your interest in computer science and problem-solving skills'
    });
  }
  
  // Healthcare careers
  if (interests?.includes('Biology and Chemistry') || motivation?.includes('Helping others')) {
    recommendations.push({
      title: 'Medical Doctor',
      category: 'Healthcare',
      match_percentage: 90,
      reason: 'Based on your science background and desire to help others'
    });
  }
  
  // Government careers
  if (motivation?.includes('Leadership') || workEnvironment?.includes('Office environment')) {
    recommendations.push({
      title: 'Administrative Officer',
      category: 'Government',
      match_percentage: 75,
      reason: 'Based on your leadership skills and preference for structured environment'
    });
  }
  
  // Education careers
  if (motivation?.includes('Helping others') && interests?.includes('Languages and Literature')) {
    recommendations.push({
      title: 'School Teacher',
      category: 'Education',
      match_percentage: 80,
      reason: 'Based on your communication skills and desire to educate others'
    });
  }
  
  // Tourism careers
  if (workEnvironment?.includes('Outdoor') || motivation?.includes('Adventure')) {
    recommendations.push({
      title: 'Tour Guide',
      category: 'Tourism & Hospitality',
      match_percentage: 70,
      reason: 'Based on your love for outdoor work and adventure'
    });
  }
  
  // Ensure we have at least 3 recommendations
  if (recommendations.length < 3) {
    recommendations.push(
      {
        title: 'Business Development Manager',
        category: 'Business',
        match_percentage: 65,
        reason: 'General recommendation based on your profile'
      },
      {
        title: 'Content Writer',
        category: 'Creative',
        match_percentage: 60,
        reason: 'Based on communication and creative potential'
      }
    );
  }
  
  return recommendations.slice(0, 5); // Return top 5 recommendations
}

export default router;
